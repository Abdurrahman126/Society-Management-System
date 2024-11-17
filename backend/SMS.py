from flask import Flask, jsonify, request,Response
import pymysql
from werkzeug.security import check_password_hash
from pymysql.cursors import DictCursor
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

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

@app.errorhandler(Exception)  
def handle_exception(e):
   
    response = json.dumps({'error': str(e)})
    return Response(response, mimetype='application/json', status=500)

@app.route('/', methods=['GET'])
def hello():
    """Root endpoint that returns a simple hello message."""
    return jsonify({'message': 'Hello, welcome to the Society Management Portal!'})

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """Fetch a single event by event_id"""
    connection = get_connection()
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT event_id, event_title, about_event, event_date,booking_price
                FROM society_events WHERE event_id = %s
            """, (event_id,))
            event = cursor.fetchone()
            if not event:
                return jsonify({'error': 'Event not found'}), 404
            return jsonify(event)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection:
            connection.close()


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
@app.route('/api/bookings', methods=['POST'])
def submit_booking():
    connection = get_connection()
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    try:
   
        name = request.form.get('name')
        batch = request.form.get('batch')
        email = request.form.get('email')
        phone = request.form.get('number')
        event_id = request.form.get('event_id')  
  
        print(f"Received form data: name={name}, batch={batch}, email={email}, phone={phone}, event_id={event_id}")
        
        if not all([name, batch, email, phone, event_id]):
            return jsonify({'error': 'All fields are required.'}), 400

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO bookings (event_id, s_name, batch, email, phone)
                VALUES (%s, %s, %s, %s, %s)
            """, (event_id, name, batch, email, phone))
            connection.commit()

        return jsonify({'message': 'Booking submitted successfully!'}), 201

    except Exception as e:
        print(f"Error submitting booking: {e}")
        return jsonify({'error': 'Failed to submit booking.'}), 500

    finally:
        if connection:
            connection.close()

@app.route('/api/login', methods=['POST'])
def login_user():
    connection = get_connection()
    
    try:
      
        email = request.form.get('email')
        password = request.form.get('password')

        if not all([email, password]):
            return jsonify({'error': 'All fields are required.'}), 400

        with connection.cursor() as cursor:
            cursor.execute("SELECT pwd FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()

            if user is None:
                return jsonify({'error': 'User not found.'}), 404

            stored_password = user['pwd']
            if stored_password != password:
                return jsonify({'error': 'Invalid credentials.'}), 401

            return jsonify({'message': 'Login successful'}), 200

    except Exception as e:
        print(f"Error logging user in: {type(e).__name__}, {e}")
        return jsonify({'error': 'Failed to login'}), 500

    finally:
        if connection:
            connection.close()

@app.route('/api/register', methods=['POST'])
def register():
   
    name = request.form.get('name')
    batch = request.form.get('batch')
    department = request.form.get('department')
    section = request.form.get('section')
    email =request.form.get('email')
    password =request.form.get('password')
    confirm_password = request.form.get('confirm_password')
    team =request.form.get('team')

    if not all([name, batch, department, section, email, password, confirm_password, team]):
        return jsonify({"error": "All fields are required"}), 400
    
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400
    
    try:
       
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already registered"}), 400

        cursor.execute("""
        INSERT INTO users (name, batch, department, section, email, pwd, team)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,(name, batch, department, section, email, password, team))
        connection.commit()

        return jsonify({"message": "User registered successfully"}), 201

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({"error": "Database error"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
    
