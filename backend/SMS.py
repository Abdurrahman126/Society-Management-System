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
    confirm_password = request.form.get('confirm')
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

@app.route('/api/add_event', methods=['POST'])
def add_event():
    event_title = request.form.get('event_title')
    about_event = request.form.get('about_event')
    event_date = request.form.get('event_date')
    venue = request.form.get('venue')
    booking_price = request.form.get('booking_price')
    connection = get_connection()
    
    if connection:
        try:
            with connection.cursor() as cursor:
                # Check for duplicate event title
                cursor.execute("SELECT event_id FROM society_events WHERE event_title = %s", (event_title,))
                if cursor.fetchone():
                    return jsonify({"error": "Event title already exists"}), 400

                # Insert the new event
                cursor.execute(
                    "INSERT INTO society_events (event_title, about_event, event_date, venue,booking_price) VALUES (%s, %s, %s, %s,%s)",
                    (event_title, about_event, event_date, venue,booking_price)
                )
                connection.commit()

                return jsonify({"message": "Event added successfully"}), 201
        
        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"Error": f"Error while creating event: {str(err)}"}), 500

        finally:
            connection.close()
    else:
        return jsonify({"Error": "Database connection error"}), 500


@app.route('/api/signin_admin',methods= ['GET'])
def login_admin():
    connection = get_connection()
    
    try:
      
        email = request.form.get('email')
        password = request.form.get('password')

        if not all([email, password]):
            return jsonify({'error': 'All fields are required.'}), 400

        with connection.cursor() as cursor:
            cursor.execute("SELECT pwd FROM users WHERE email = %s AND is_admin = 1 AND role_as = 'admin'", (email,))
            user = cursor.fetchone()

            if user is None:
                return jsonify({'error': 'admin not found.'}), 404

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

@app.route('/api/faculty_admin',methods = ['POST'])
def faculty_admin():
    email =request.form.get('email')
    password =request.form.get('password')
    confirm_password = request.form.get('confirm_password')

    if not all([email, password, confirm_password]):
        return jsonify({"error": "All fields are required"}), 400
    
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400
    
    try:
       
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT user_id FROM users WHERE email = %s and is_admin = 1 and role_as = 'admin'", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already registered"}), 400

        cursor.execute("""
        INSERT INTO users (name, batch, department, section, email, pwd, team,role_as,is_admin)
        VALUES ('Faculty', 'Faculty', 'Faculty', 'Faculty', %s, %s, 'Faculty','admin',1)
        """,(email, password,))
        connection.commit()

        return jsonify({"message": "Admin added successfully"}), 201

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({"error": "Database error"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/manage_admin',methods = ['POST'])
def manage_admin():
   
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
        cursor.execute("SELECT user_id FROM users WHERE email = %s and is_admin = 1 and role_as = 'admin'", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already registered"}), 400

        cursor.execute("""
        INSERT INTO users (name, batch, department, section, email, pwd, team,role_as,is_admin)
        VALUES (%s, %s, %s, %s, %s, %s, %s,'admin',1)
        """,(name, batch, department, section, email, password, team))
        connection.commit()

        return jsonify({"message": "Admin added successfully"}), 201

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({"error": "Database error"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/delete_event/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    connection = get_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                # Check if the event exists
                cursor.execute("SELECT event_id FROM society_events WHERE event_id = %s", (event_id,))
                if not cursor.fetchone():
                    return jsonify({"error": "Event not found"}), 404

                # Delete the event
                cursor.execute("DELETE FROM society_events WHERE event_id = %s", (event_id,))
                connection.commit()
                return jsonify({"message": "Event deleted successfully"}), 200

        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while deleting event: {str(err)}"}), 500

        finally:
            if connection:
                connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
    
