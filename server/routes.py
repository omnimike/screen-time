from flask import Flask, send_from_directory, render_template, request, jsonify
from schema import \
    engine, \
    reviews_table, \
    exposures_table, \
    outcomes_table, \
    moderators_table, \
    effect_sizes_table


app = Flask(__name__, static_url_path='')
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config['DEBUG'] = True


@app.route('/static/<path:path>')
def send_js(path):
    return send_from_directory('static', path)


@app.route('/reviews', methods=['POST'])
def reviews():
    review_id = None
    with engine.begin() as conn:
        review = request.get_json()
        review_id = save_review(conn, review)
    return jsonify({'review_id': review_id})


def save_review(conn, review):
    conn.execute(reviews_table.insert(), review)
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
    return review_id


def fill_review_id(review_id, models):
    for model in models:
        model['review_id'] = review_id


@app.route('/')
def index():
    return render_template('index.html')
