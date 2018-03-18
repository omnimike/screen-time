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
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config['DEBUG'] = True


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
        fieldnames = [c.name for c in reviews_table.columns]
        conn = engine.connect()
        result = conn.execute(select([reviews_table]))
        rows = (dict(row) for row in result)
        for blob in write_report(rows, fieldnames):
            yield blob
        result.close()
    return Response(generate(), mimetype='text/csv')


def write_report(rows, fieldnames, batch_size=1000):
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


@app.route('/')
def index():
    return render_template('index.html')
