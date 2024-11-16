from flask import Flask, jsonify, Response
import pymysql
from pymysql.cursors import DictCursor
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allowing all origins for the /api/* routes

app.config['SECRET_KEY'] = 'k224150'
app.config['TEMPLATES_AUTO_RELOAD'] = True
import logging
logging.basicConfig(level=logging.DEBUG)

def get_connection():
    """Establishes a database connection."""
    try:
        connection = pymysql.connect(
            host='localhost',
            user='newuser',
            password='@Akhan25',
            database='Society_Management_System',
            cursorclass=DictCursor
        )
        return connection
    except pymysql.MySQLError as err:
        app.logger.error("Error connecting to the database: %s", str(err))
        return None

@app.errorhandler(Exception)  # This will catch all exceptions
def handle_exception(e):
    # Return JSON instead of HTML for any other exceptions
    response = json.dumps({'error': str(e)})
    return Response(response, mimetype='application/json', status=500)

@app.route('/', methods=['GET'])
def hello():
    """Root endpoint that returns a simple hello message."""
    return jsonify({'message': 'Hello, welcome to the Society Management Portal!'})

@app.route('/api/events', methods=['GET'])
def get_events():
    """API endpoint for fetching all events."""
    connection = get_connection()
    
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT event_id, event_title, about_event, event_date FROM society_events")
            events = cursor.fetchall()
            return jsonify(events)
    except Exception as e:
        app.logger.error("Failed to fetch events: %s", str(e))
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')
    finally:
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
