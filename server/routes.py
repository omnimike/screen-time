from flask import \
    Flask, \
    send_from_directory, \
    render_template, \
    request, \
    jsonify, \
    Response
from sqlalchemy import select
from schema import \
    engine, \
    reviews_table, \
    exposures_table, \
    outcomes_table, \
    moderators_table, \
    effect_sizes_table
from io import StringIO
from csv import DictWriter


app = Flask(__name__, static_url_path='')
app.config['PROPAGATE_EXCEPTIONS'] = False
app.config['DEBUG'] = False


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/static/<path:path>')
def send_js(path):
    return send_from_directory('static', path)


@app.route('/reviews', methods=['GET'])
def reviews():
    if request.method == 'GET':
        conn = engine.connect()
        return jsonify(list_reviews(conn))
    else:
        return 'error'


@app.route('/reviews/<review_id>', methods=['GET', 'PUT'])
def review(review_id):
    if request.method == 'GET':
        conn = engine.connect()
        return jsonify(get_review(conn, review_id))
    elif request.method == 'PUT':
        review = request.get_json()
        with engine.begin() as conn:
            save_review(conn, review_id, review)
        return jsonify(review['id'])
    else:
        return 'error'


def query_json(conn, query):
    result = conn.execute(query)
    rows = [dict(row) for row in result]
    result.close()
    return rows


def list_reviews(conn):
    return query_json(conn, select([
        reviews_table.c.id,
        reviews_table.c.extractor_name,
        reviews_table.c.extraction_date,
        reviews_table.c.first_author,
        reviews_table.c.year_of_publication
    ]))


def get_review(conn, review_id):
    reviews = query_json(
        conn,
        select([reviews_table]).
        where(reviews_table.c.id == review_id)
    )
    if len(reviews) == 0:
        raise Exception('Review not found')

    review = reviews[0]
    review['effect_sizes'] = query_json(
        conn,
        select([effect_sizes_table]).
        where(effect_sizes_table.c.review_id == review_id)
    )
    review['exposures'] = query_json(
        conn,
        select([exposures_table]).
        where(exposures_table.c.review_id == review_id)
    )
    review['outcomes'] = query_json(
        conn,
        select([outcomes_table]).
        where(outcomes_table.c.review_id == review_id)
    )
    review['moderators'] = query_json(
        conn,
        select([moderators_table]).
        where(moderators_table.c.review_id == review_id)
    )

    return review


def save_review(conn, review_id, review):
    existing = query_json(
        conn,
        select([reviews_table.c.id]).
        where(reviews_table.c.id == review_id)
    )
    if len(existing):
        update_review(conn, review_id, review)
    else:
        create_review(conn, review)


def update_review(conn, review_id, review):
    conn.execute(
        reviews_table.update().
        where(reviews_table.c.id == review_id),
        review
    )
    conn.execute(
        effect_sizes_table.delete().
        where(effect_sizes_table.c.review_id == review_id)
    )
    conn.execute(
        exposures_table.delete().
        where(exposures_table.c.review_id == review_id)
    )
    conn.execute(
        outcomes_table.delete().
        where(outcomes_table.c.review_id == review_id)
    )
    conn.execute(
        moderators_table.delete().
        where(moderators_table.c.review_id == review_id)
    )
    create_children(conn, review)


def create_review(conn, review):
    conn.execute(reviews_table.insert(), review)
    create_children(conn, review)


def create_children(conn, review):
    review_id = review['id']
    if len(review['exposures']):
        fill_review_id(review_id, review['exposures'])
        conn.execute(exposures_table.insert(), review['exposures'])
    if len(review['outcomes']):
        fill_review_id(review_id, review['outcomes'])
        conn.execute(outcomes_table.insert(), review['outcomes'])
    if len(review['moderators']):
        fill_review_id(review_id, review['moderators'])
        conn.execute(moderators_table.insert(), review['moderators'])
    if len(review['effect_sizes']):
        fill_review_id(review_id, review['effect_sizes'])
        conn.execute(effect_sizes_table.insert(), review['effect_sizes'])


def fill_review_id(review_id, models):
    for model in models:
        model['review_id'] = review_id


@app.route('/reports/reviews')
def review_report():
    def generate():
        field_mappings = reviews_report_mappings()
        columns = [field[0].label(field[1]) for field in field_mappings]
        conn = engine.connect()
        result = conn.execute(select(columns))
        rows = (dict(row) for row in result)
        for blob in write_report(rows, field_mappings):
            yield blob
        result.close()
    return Response(generate(), mimetype='text/csv')


@app.route('/reports/effect_sizes')
def effect_sizes_report():
    def generate():
        field_mappings = effect_sizes_report_mappings()
        columns = [field[0].label(field[1]) for field in field_mappings]
        conn = engine.connect()
        query = select(columns).where(
            (exposures_table.c.id == effect_sizes_table.c.exposure_id) &
            (outcomes_table.c.id == effect_sizes_table.c.outcome_id) &
            (moderators_table.c.id == effect_sizes_table.c.moderator_id)
        )
        result = conn.execute(query)
        rows = (dict(row) for row in result)
        for blob in write_report(rows, field_mappings):
            yield blob
        result.close()
    return Response(generate(), mimetype='text/csv')


def write_report(rows, field_mappings, batch_size=1000):
    fieldnames = [field[1] for field in field_mappings]
    si = StringIO()
    csv_writer = DictWriter(si, fieldnames=fieldnames)
    csv_writer.writeheader()
    counter = 0
    for row in rows:
        csv_writer.writerow(row)
        counter += 1
        if counter >= batch_size:
            yield si.getvalue()
            si.close()
            si = StringIO()
            csv_writer = DictWriter(si, fieldnames=fieldnames)
            counter = 0
    if counter > 0:
        yield si.getvalue()
        si.close()


def reviews_report_mappings():
    return [
        (reviews_table.c.id, 'Review Id'),
        (reviews_table.c.extractor_name, 'Extractor Name'),
        (reviews_table.c.extraction_date, 'Extraction Date'),
        (reviews_table.c.first_author, 'First Author'),
        (reviews_table.c.year_of_publication, 'Year of Publication'),
        (reviews_table.c.search_strategy_desc, 'Search strategy description'),
        (reviews_table.c.sample_age_desc, 'Sample age - description (use quote where possible)'),
        (reviews_table.c.sample_age_lowest_mean, 'Sample age - lowest study mean'),
        (reviews_table.c.sample_age_highest_mean, 'Sample age - highest study mean'),
        (reviews_table.c.are_you_sure, 'Are you SURE the review meets all inclusion criteria and none of the exclusion criteria?'),
        (reviews_table.c.inclusion_exclusion_concerns, 'Inclusion/exclusion concerns'),
        (reviews_table.c.earliest_publication_year, 'Earliest study publication year'),
        (reviews_table.c.latest_publication_year, 'Latest study publication year'),
        (reviews_table.c.number_of_studies, 'k (number of studies)'),
        (reviews_table.c.number_of_samples, 'N (combined sample across studies)'),
        (reviews_table.c.rating_of_low_risk_bias, 'Authors\' rating of % low risk risk of bias studies'),
        (reviews_table.c.rating_of_moderate_risk_bias, 'Authors\' rating of % moderate risk of bias studies'),
        (reviews_table.c.rating_of_high_risk_bias, 'Authors\' rating of % high risk of bias studies'),
        (reviews_table.c.bias_rating_system, 'Authors\' system for rating risk of bias'),
        (reviews_table.c.bias_rating_system_reference, 'Reference for authors\' system for rating risk of bias'),
        (reviews_table.c.level_of_evidence_judgement_1, 'Level of Evidence Judgement 1'),
        (reviews_table.c.level_of_evidence_judgement_2, 'Level of Evidence Judgement 2'),
        (reviews_table.c.level_of_evidence_judgement_3, 'Level of Evidence Judgement 3'),
        (reviews_table.c.notes, 'Notes'),
    ]


def effect_sizes_report_mappings():
    return [
        (effect_sizes_table.c.review_id, 'Review Id'),

        (exposures_table.c.content_specifics, 'Exposure content specifics'),
        (exposures_table.c.content_category, 'Exposure content category'),
        (exposures_table.c.measure, 'Exposure measure'),
        (exposures_table.c.measure_type, 'Exposure measure type'),
        (exposures_table.c.device_type, 'Exposure specific device type'),
        (exposures_table.c.device_category, 'Exposure device catgeory'),
        (exposures_table.c.device_portability, 'Exposure device portability'),
        (exposures_table.c.setting, 'Exposure specific setting'),
        (exposures_table.c.setting_category, 'Exposure setting category'),
        (exposures_table.c.social_environment_specific, 'Specific social environment'),
        (exposures_table.c.social_environment_general, 'General social environment'),

        (outcomes_table.c.measure, 'Measure'),
        (outcomes_table.c.measure_type, 'Measure type'),
        (outcomes_table.c.specific_variable, 'Specific variable'),
        (outcomes_table.c.higher_order_variable, 'Higher-order variable'),
        (outcomes_table.c.category, 'Outcome category'),

        (moderators_table.c.level, 'Moderator Level'),
        (moderators_table.c.category, 'Moderator Category'),

        (effect_sizes_table.c.team_narrative_summary, 'Team\'s Narrative Summary'),
        (effect_sizes_table.c.value, 'Value'),
        (effect_sizes_table.c.value_lower_bound, 'Value - CI lower bound'),
        (effect_sizes_table.c.value_upper_bound, 'Value - CI upper bound'),
        (effect_sizes_table.c.p_value, 'p-value'),
        (effect_sizes_table.c.statistical_test, 'Statistical Test'),
        (effect_sizes_table.c.comments, 'Comments'),
   ]
