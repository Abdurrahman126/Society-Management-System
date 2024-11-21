from flask import Flask, jsonify, request,Response
import pymysql
from werkzeug.security import check_password_hash
from pymysql.cursors import DictCursor
from flask_cors import CORS
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'k224150'
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
            # change to _decs
            database='society_management_system_decs',
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

#checked
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

#checked
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

#checked
@app.route('/api/bookings', methods=['POST'])
def submit_booking():
    connection = get_connection()
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    try:
        rollno = request.form.get('rollno')
        name = request.form.get('name')
        batch = request.form.get('batch')
        email = request.form.get('email')
        phone = request.form.get('number')
        event_id = request.form.get('event_id')  
        transaction_id = request.form.get('transaction_id')
  
        
        if not all([name, batch, email, phone, event_id]):
            return jsonify({'error': 'All fields are required.'}), 400

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO bookings (event_id,roll_number, s_name, batch, phone,transaction_id,email)
                VALUES (%s, %s, %s, %s, %s,%s,%s)
            """, (event_id,rollno, name, batch,phone, transaction_id,email))
            connection.commit()

        return jsonify({'message': 'Booking submitted successfully!'}), 201

    except Exception as e:
        print(f"Error submitting booking: {e}")
        return jsonify({'error': 'Failed to submit booking.'}), 500

    finally:
        if connection:
            connection.close()

# updated check
@app.route('/api/login', methods=['POST'])
def login_user():
    connection = get_connection()

    try:
        Rollno = request.form.get('rollno')
        password = request.form.get('password')

        if not all([Rollno, password]):
            return jsonify({'error': 'All fields are required.'}), 400

        with connection.cursor() as cursor:
            cursor.execute("SELECT pwd AS password FROM members WHERE roll_number = %s UNION SELECT password FROM excom WHERE roll_number = %s", (Rollno, Rollno))
            user = cursor.fetchone()

            if user is None:
                return jsonify({'error': 'Member not found.'}), 404

            stored_password = user['password']
            if stored_password != password:
                return jsonify({'error': 'Invalid credentials.'}), 401

            return jsonify({'message': 'Login successful'}), 200

    except Exception as e:
        print(f"Error logging user in: {type(e).__name__}, {e}")
        return jsonify({'error': 'Failed to login'}), 500

    finally:
        if connection:
            connection.close()


#checked-integrated(need to check)
@app.route('/api/register', methods=['POST'])
def register():
    Rollno = request.form.get('rollno')
    name = request.form.get('name')
    batch = request.form.get('batch')
    department = request.form.get('department')
    section = request.form.get('section')
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm')
    team = request.form.get('team')

    if not all([Rollno, name, batch, department, section, email, password, confirm_password, team]):
        return jsonify({"error": "All fields are required"}), 400

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT email FROM members WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already registered"}), 400

        cursor.execute("""
        INSERT INTO members (roll_number, name, batch, department, section, email, pwd, team)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (Rollno, name, batch, department, section, email, password, team))
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
#checked-integrated
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
    
#checked
@app.route('/api/delete_event/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    connection = get_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                # Check if the event exists
               cursor.execute("DELETE FROM society_events WHERE event_id = %s", (event_id,))
               affected_rows = cursor.rowcount
               connection.commit()

            if affected_rows == 0:
                return jsonify({"error": "Event not found"}), 404
            else:
                    return jsonify({"message": "Event deleted successfully"}), 200

        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while deleting event: {str(err)}"}), 500

        finally:
            if connection:
                connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500

#checked
@app.route('/api/signin_admin',methods= ['GET'])
def login_admin():
    connection = get_connection()
    
    try:
      
        email = request.form.get('email')
        password = request.form.get('password')

        if not all([email, password]):
            return jsonify({'error': 'All fields are required.'}), 400

        with connection.cursor() as cursor:
            cursor.execute("SELECT admin_password FROM admin  WHERE email = %s ", (email,))
            user = cursor.fetchone()

            if user is None:
                return jsonify({'error': 'admin not found.'}), 404

            stored_password = user['admin_password']
            if stored_password != password:
                return jsonify({'error': 'Invalid credentials.'}), 401

            return jsonify({'message': 'Login successful'}), 200

    except Exception as e:
        print(f"Error logging user in: {type(e).__name__}, {e}")
        return jsonify({'error': 'Failed to login'}), 500

    finally:
        if connection:
            connection.close()

#checked
@app.route('/api/abbu_admin', methods=['POST'])
def faculty_admin():
    connection = get_connection()
    secret_key = request.form.get('Secret Key')
    email = request.form.get('email')
    password = request.form.get('password')

    if not all([email, password]):
            return jsonify({'error': 'All fields are required.'}), 400
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT admin_password FROM admin  WHERE email = %s ", (email,))
            user = cursor.fetchone()

            if user is None:
                return jsonify({'error': 'admin not found.'}), 404

            stored_password = user['admin_password']
            
            if stored_password != password or app.config['SECRET_KEY']==secret_key :
                return jsonify({'error': 'Invalid credentials.'}), 401

            return jsonify({'message': 'Login successful'}), 200

    except Exception as e:
        print(f"Error logging user in: {type(e).__name__}, {e}")
        return jsonify({'error': 'Failed to login'}), 500

    finally:
        if connection:
            connection.close()

#checked-integrated
@app.route('/api/fetch_excom',methods =["GET"])
def fetch_excom():
    connection = get_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM excom")
                excom = cursor.fetchall()
            return jsonify(excom)
        
        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while fetching applicants: {str(err)}"}), 500
        finally:
            if connection:
                connection.close()
        
    else:
        return jsonify({"error": "Database connection error"}), 500

#checked-integrated
@app.route('/api/add_admin', methods=['POST'])
def add_admin():
    data = request.get_json()  # This is how you get JSON data from the body
    rollno = data.get('rollno')
    password = data.get('password')

    connection = get_connection()

    if connection:
        try:
            with connection.cursor() as cursor:
                print(f"Checking existence for Rollno: {rollno}")  # Debug log
                cursor.execute("SELECT * FROM excom WHERE roll_number = %s", (rollno,))
                admin = cursor.fetchone()

                if admin:
                    print(f"Found Excom: {admin}")  # Debug log
                    cursor.execute("INSERT INTO admin (roll_number, email, admin_password) VALUES (%s, %s, %s)",
                                   (admin['roll_number'], admin['email'], password))
                    connection.commit()
                    return jsonify({"success": True, "message": "Successfully appointed as Admin."})
                else:
                    print(f"No Excom found for Rollno: {rollno}")  # Debug log
                    return jsonify({"success": False, "message": "No such Excom found."}), 404
        except pymysql.MySQLError as err:
                print("MySQL Error:", err)
                return jsonify({"error": f"Error while appointing Admin: {str(err)}"}), 500
        finally:
                connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500

@app.route('/api/change_password', methods=['POST'])
def change_password():
    connection = get_connection()
    if not connection:
        return jsonify({"error": "database connection error"}), 500

    try:
        roll_number = request.form.get('Roll number')
        current_password = request.form.get('Current password')
        new_password = request.form.get('New password')

        if not all([roll_number, current_password, new_password]):
            return jsonify({'error': 'All fields are required.'}), 400

        with connection.cursor() as cursor:
           
            cursor.execute("select admin_password from admin where roll_number = %s", (roll_number,))
            admin = cursor.fetchone()

            if admin is None:
                return jsonify({'error': 'Admin not found.'}), 404

            if admin['admin_password']!=current_password:
                return jsonify({'error': 'Current password is incorrect.'}), 401

            
            cursor.execute("update admin set admin_password = %s where roll_number = %s", (new_password, roll_number))
            connection.commit()

            return jsonify({'message': 'Password updated successfully.'}), 200

    except Exception as e:
        print(f"Error changing password: {type(e).__name__}, {e}")
        return jsonify({'error': 'failed to change password'}), 500

    finally:
        if connection:
            connection.close()

#checked-integrated but not to ui
@app.route('/api/announcements',methods = ['GET'])
def view_announcments():
    connection = get_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM announcements")
                announcements = cursor.fetchall()
            return jsonify(announcements)
        
        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while fetching announcements: {str(err)}"}), 500
        finally:
            if connection:
                connection.close()
        
    else:
        return jsonify({"error": "Database connection error"}), 500
#checked-integrated
@app.route('/api/add_announcements', methods=['POST'])
def add_announcements():
    title = request.form.get('title')
    content = request.form.get('content')
    link = request.form.get('link')

    connection = get_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO announcements (announcement_title, content,link) VALUES (%s, %s,%s)", 
                    (title, content,link)
                )
            connection.commit()
            return jsonify({"message": "Announcement added successfully"}), 201
     
        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while adding announcement: {str(err)}"}), 500
        finally:
            connection.close()
    
    else:
        return jsonify({"error": "Database connection error"}), 500
    
#checked
@app.route('/api/delete_announcement/<int:announcement_id>', methods=['DELETE'])
def delete_announcement(announcement_id):
    connection = get_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                # Check if the event exists
                 cursor.execute("DELETE FROM announcements WHERE announcement_id = %s", (announcement_id,))
                 affected_rows = cursor.rowcount
                 connection.commit()

            if affected_rows == 0:
                return jsonify({"error": "announcement not found"}), 404
            else:
                    return jsonify({"message": "announcement deleted successfully"}), 200

        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while deleting announcement: {str(err)}"}), 500

        finally:
            if connection:
                connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500
#checked
@app.route('/api/toggle_induction', methods=['POST'])
def toggle_induction():
    new_status = request.form.get('new_status') 

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE induction_toggle SET islive = %s" ,(new_status))
    conn.commit()
    return jsonify({"success": True, "message": "Induction status updated"})


@app.route('/api/toggle_status',methods = ["GET"])
def fetch_toggle_status():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("select * from induction_toggle ")
    status = cursor.fetchone()
    return jsonify(status)

#checked-integrated
@app.route('/api/applicants',methods = ['GET'])
def fetch_applicants():
    connection = get_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM inductions")
                applicants = cursor.fetchall()
            return jsonify(applicants)
        
        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while fetching applicants: {str(err)}"}), 500
        finally:
            if connection:
                connection.close()
        
    else:
        return jsonify({"error": "Database connection error"}), 500

#checked-integrated
@app.route('/api/register_induction', methods=['POST'])
def register_induction():
        Rollno = request.form.get('rollno').replace(" ", "")
        name = request.form.get('name')
        batch = request.form.get('batch')
        department = request.form.get('department')
        email = request.form.get('email').replace(" ", "")
        position = request.form.get('position')
        past_experience = request.form.get('past_experience')
        motivation=request.form.get('motivation')

        connection = get_connection()
        if connection:
            try:
                with connection.cursor() as cursor:
                    cursor.execute("INSERT INTO inductions (roll_number,name,batch,department,email,position,past_experience,motivation) VALUES (%s, %s,%s,%s,%s,%s,%s,%s)", 
                                   (Rollno,name,batch,department,email,position,past_experience,motivation))
                connection.commit()
                return jsonify({"message": "Successfully registered for induction!", "success": True})
          
            except pymysql.MySQLError as err:
                print("MySQL Error:", err)
                return jsonify({"error": f"Error while registering applicant: {str(err)}"}), 500
            finally:
                connection.close()
        else:
            return jsonify({"error": "Database connection error"}), 500

#checked-integrated

@app.route('/api/appoint_excom', methods=['POST'])
def appoint_excom():
    data = request.get_json()  # Parse JSON from the request body
    email = data.get('email', '').strip()  # Extract and clean the email
    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    connection = get_connection()

    if connection:
        try:
            with connection.cursor() as cursor:
                # Check if the member exists in the `inductions` table
                cursor.execute("SELECT * FROM inductions WHERE email = %s", (email,))
                excom_member = cursor.fetchone()

                if excom_member:
                    # Insert the member into the `excom` table
                    cursor.execute(
                        "INSERT INTO excom (roll_number, name, batch, department, email, position,password) "
                        "VALUES (%s, %s, %s, %s, %s, %s,%s)",
                        (
                            excom_member['roll_number'],
                            excom_member['name'],
                            excom_member['batch'],
                            excom_member['department'],
                            excom_member['email'],
                            excom_member['position'],
                            'fast1234'
                        ),
                    )
                    connection.commit()
                    return jsonify({"success": True, "message": "Successfully appointed to excom."})
                else:
                    return jsonify({"success": False, "message": "No such member found."}), 404

        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while appointing member: {str(err)}"}), 500
        finally:
            connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
    
