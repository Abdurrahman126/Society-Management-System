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
    try:
        connection = pymysql.connect(
            host='localhost',
            user='newuser',
            password='@Akhan25',
            # change to _decs
            database='society_management_system',
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

#checked-integrated
@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """Fetch a single event by event_id"""
    connection = get_connection()
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                select event_id, event_title, about_event, event_date,booking_price
                from society_events where event_id = %s
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

#checked-integrated
@app.route('/api/events', methods=['GET'])
def get_events():
    """API endpoint for fetching all events."""
    connection = get_connection()
    
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    try:
        with connection.cursor() as cursor:
            cursor.execute("select event_id, event_title, about_event, event_date from society_events")
            events = cursor.fetchall()
            return jsonify(events)
    except Exception as e:
        app.logger.error("Failed to fetch events: %s", str(e))
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')
    finally:
        if connection:
            connection.close()
#checked-integrated
@app.route('/api/bookings', methods=['POST'])
def submit_booking():
    connection = get_connection()
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    try:
    
        data = request.get_json()

        rollno = data.get('rollno')
        name = data.get('name')
        batch = data.get('batch')
        email = data.get('email')
        phone = data.get('number')
        event_id = data.get('event_id')
        transaction_id = data.get('transaction_id')

        # Ensure that all required fields are provided
        if not all([name, batch, email, phone, event_id, transaction_id]):
            return jsonify({'error': 'All fields are required.'}), 400

        with connection.cursor() as cursor:
            # Insert the new booking into the database
            cursor.execute("""
                INSERT INTO bookings (event_id, roll_number, s_name, batch, phone, transaction_id, email)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (event_id, rollno, name, batch, phone, transaction_id, email))
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
            cursor.execute("SELECT pwd AS password FROM members WHERE roll_number = %s UNION SELECT password AS password FROM excom WHERE roll_number = %s", (Rollno, Rollno))

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
    
#checked-integrated
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

#checked-integrated
@app.route('/api/signin_admin',methods= ['POST'])
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

#checked-integrated
@app.route('/api/abbu_admin', methods=['POST'])
def faculty_admin():
    email = request.form.get('email')
    password = request.form.get('password')
    secret_key = request.form.get('secret_key')

    if not all([email, password, secret_key]):
        return jsonify({'error': 'All fields are required.'}), 400

    if email != "admin@fast.com" or password != "fast123" or secret_key != "k224150":
        return jsonify({'error': 'Invalid credentials.'}), 401

    return jsonify({'message': 'Login successful'}), 200

#checked-integrated
@app.route('/api/fetch_excom', methods=["GET"])
def fetch_excom():
    connection = get_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM excom")
                excom = cursor.fetchall()
                if not excom:
                    return jsonify([]), 200

            return jsonify(excom), 200
        
        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while fetching excom: {str(err)}"}), 500
        finally:
            if connection:
                connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500
#checked-integrated
@app.route('/api/fetch_admin', methods=["GET"])
def fetch_admin():
    connection = get_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM admin")
                admins = cursor.fetchall()
                
                if not admins:
                    return jsonify([]), 200

            return jsonify(admins), 200
        
        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while fetching admins: {str(err)}"}), 500
        finally:
            if connection:
                connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500



#checked-integrated
@app.route('/api/add_admin', methods=['POST'])
def add_admin():
    data = request.get_json()  
    rollno = data.get('rollno')
    password = data.get('password')

    connection = get_connection()

    if connection:
        try:
            with connection.cursor() as cursor:
                print(f"Checking existence for Rollno: {rollno}") 
                cursor.execute("SELECT * FROM excom WHERE roll_number = %s", (rollno,))
                admin = cursor.fetchone()

                if admin:
                    print(f"Found Excom: {admin}") 
                    cursor.execute("INSERT INTO admin (roll_number, email, admin_password) VALUES (%s, %s, %s)",
                                   (admin['roll_number'], admin['email'], password))
                    connection.commit()
                    return jsonify({"success": True, "message": "Successfully appointed as Admin."})
                else:
                    print(f"No Excom found for Rollno: {rollno}") 
                    return jsonify({"success": False, "message": "No such Excom found."}), 404
        except pymysql.MySQLError as err:
                print("MySQL Error:", err)
                return jsonify({"error": f"Error while appointing Admin: {str(err)}"}), 500
        finally:
                connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500

@app.route('/api/remove_admin', methods=['DELETE'])
def remove_admin():
    data = request.get_json()
    rollno = data.get('rollno')

    connection = get_connection()

    if connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM admin WHERE roll_number = %s", (rollno,))
                admin = cursor.fetchone()

                if admin:
                    cursor.execute("DELETE FROM admin WHERE roll_number = %s", (rollno,))
                    connection.commit()
                    print(f"Admin with Rollno: {rollno} has been deleted.")
                    return jsonify({"success": True, "message": f"Admin with Rollno: {rollno} has been successfully deleted."})
                else:
                    print(f"No Admin found for Rollno: {rollno}")
                    return jsonify({"success": False, "message": "No such Admin found."}), 404
        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while deleting Admin: {str(err)}"}), 500
        finally:
            connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500

#checked
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

#checked-integrated 
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
    
#checked-integrated
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
#checked-integrated
@app.route('/api/toggle_induction', methods=['POST'])
def toggle_induction():
    new_status = request.form.get('new_status') 

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE induction_toggle SET islive = %s" ,(new_status))
    conn.commit()
    return jsonify({"success": True, "message": "Induction status updated"})

#checked-integrated
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
        email = request.form.get('email')
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
@app.route('/api/track_attendance/<string:roll_number>', methods=['GET'])
def track_attendance(roll_number):
    attendance_data = [] 
    total_meetings = 0  
    attended_meetings = 0  
    connection = get_connection()

    if connection:
        try:
            with connection.cursor() as cursor:
                query = """
                    SELECT m.meeting_id, m.title AS meeting_title, m.purpose, m.venue, m.meeting_date, a.attendance
                    FROM meetings m
                    LEFT JOIN attendance a ON m.meeting_id = a.meeting_id AND a.member_id = %s
                """
                cursor.execute(query, (roll_number,))
                rows = cursor.fetchall()

                for row in rows:
                    meeting_date = row['meeting_date']
                    attendance_status = row['attendance']
                    attendance_data.append({
                        'meeting_id': row['meeting_id'],
                        'meeting_title': row['meeting_title'],  # Added meeting_title
                        'attendance_status': 'Present' if attendance_status else 'Absent',
                        'meeting_date': meeting_date
                    })

                    total_meetings += 1
                    if attendance_status:
                        attended_meetings += 1

            if total_meetings > 0:
                attendance_percentage = attended_meetings / total_meetings * 100
            else:
                attendance_percentage = 0

            return jsonify({
                "attendance_data": attendance_data,
                "attendance_percentage": f"{attendance_percentage:.2f}%"
            })

        except pymysql.MySQLError as err:
            print(f"Error: {err}")
            return jsonify({"error": "Error while calculating attendance."}), 500
        finally:
            connection.close()
    else:
        return jsonify({"error": "Database connection failed."}), 500

#checked-integrated
@app.route('/api/appoint_excom', methods=['POST'])
def appoint_excom():
    data = request.get_json()  
    email = data.get('email', '').strip()
    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    connection = get_connection()

    if connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM inductions WHERE email = %s", (email,))
                excom_member = cursor.fetchone()

                if excom_member:
                    cursor.execute("SELECT * FROM excom WHERE position = %s", (excom_member['position'],))
                    existing_position = cursor.fetchone()

                    if existing_position:
                        return jsonify({
                            "success": False,
                            "message": f"The position '{excom_member['position']}' is already occupied."
                        }), 400

                    cursor.execute(
                        "INSERT INTO excom (roll_number, name, batch, department, email, position, password) "
                        "VALUES (%s, %s, %s, %s, %s, %s, %s)",
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

#integrated
@app.route('/api/add_meeting',methods=['POST'])
def add_meeting():
    title = request.form.get('meeting_title')
    purpose = request.form.get('purpose')
    venue = request.form.get('venue')
    meeting_date = request.form.get('date')

    connection = get_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute("insert into meetings (title,purpose,venue,meeting_date) values (%s,%s,%s,%s)",(title,purpose,venue,meeting_date))
                connection.commit()
            return jsonify({"success": True, "message": "Meeting created successfully."})
        
        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while appointing member: {str(err)}"}), 500
        finally:
            connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500
#integrated
@app.route('/api/get_meetings', methods=['GET'])
def get_meetings():
    connection = get_connection()
    if not connection:
        return jsonify({"error": "Database connection error"}), 500

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM meetings")
            meetings = cursor.fetchall()
        return jsonify(meetings)
    except pymysql.MySQLError as err:
        print("MySQL Error:", err)
        return jsonify({"error": f"Error while fetching meetings: {str(err)}"}), 500
    finally:
        connection.close()


#integrated
@app.route('/api/delete_meeting/<int:meeting_id>',methods=['DELETE'])
def delete_meeting(meeting_id):
    connection = get_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
               cursor.execute("DELETE FROM meetings WHERE meeting_id = %s", (meeting_id,))
               affected_rows = cursor.rowcount
               connection.commit()

            if affected_rows == 0:
                return jsonify({"error": "meeting not found"}), 404
            else:
                    return jsonify({"message": "meeting deleted successfully"}), 200

        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            return jsonify({"error": f"Error while deleting meeting: {str(err)}"}), 500

        finally:
            if connection:
                connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500
#integrated    
@app.route('/api/fetch_members', methods=['GET'])
def fetch_members():
    connection = get_connection()
    if not connection:
        return jsonify({"error": "Database connection error"}), 500

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT roll_number, name FROM members")
            members = cursor.fetchall()
        return jsonify(members), 200

    except Exception as e:
        print(f"Error fetching members: {e}")
        return jsonify({"error": "Failed to fetch members"}), 500

    finally:
        if connection:
            connection.close()

#integrated
@app.route('/api/add_attendance', methods=['POST'])
def add_attendance():
    connection = get_connection()
    if not connection:
        return jsonify({"error": "Database connection error"}), 500

    data = request.get_json()
    meeting_id = data.get('meeting_id')
    attendance_data = data.get('attendance')
    print("Received Data:", data)  

    if not meeting_id or not attendance_data:
        return jsonify({"error": "Missing meeting_id or attendance data"}), 400
    try:
        with connection.cursor() as cursor:
            for member in attendance_data:
                member_id = member.get('roll_number')
                status = member.get('attended')

               
                print(f"Inserting attendance for Roll Number: {member_id}, Status: {status}")

                cursor.execute("""
                    INSERT INTO attendance (meeting_id, member_id, attendance)
                    VALUES (%s, %s, %s)
                """, (meeting_id, member_id, status))

            connection.commit()

        return jsonify({"message": "Attendance updated successfully"}), 200
    except Exception as e:
        print(f"Error in adding/updating attendance: {e}")
        return jsonify({"error": "Failed to add/update attendance"}), 500
    finally:
        if connection:
            connection.close()

@app.route('/api/fetch_attendance/<int:meeting_id>', methods=['GET'])
def fetch_attendance(meeting_id):
    connection = get_connection()
    if not connection:
        return jsonify({"error": "Database connection error"}), 500

    try:
        with connection.cursor() as cursor:
         
            cursor.execute("""
                SELECT a.member_id, m.name, a.attendance
                FROM attendance a
                JOIN members m ON m.roll_number = a.member_id 
                WHERE a.meeting_id = %s
            """, (meeting_id,))
            records = cursor.fetchall()

            if not records:
                return jsonify({"error": "No attendance records found for the specified meeting"}), 404

            return jsonify({"meeting_id": meeting_id, "attendance_records": records}), 200

    except Exception as e:
        print(f"Error fetching attendance records: {e}")
        return jsonify({"error": "Failed to fetch attendance records"}), 500

    finally:
        if connection:
            connection.close()


@app.route('/api/add_post', methods=['POST'])
def add_post():
    data = request.get_json()
    email = data['email']
    content = data['content']
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
           
            cursor.execute("INSERT INTO forum (content,email) VALUES (%s, %s)", (content,email))
            conn.commit()
            feedback_id = cursor.lastrowid
        return jsonify({"message": "Post added successfully", "feedback_id": feedback_id}), 201
    finally:
        conn.close()

@app.route('/api/like_post/<int:feedback_id>', methods=['POST'])
def like_post(feedback_id):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("UPDATE forum SET likes = likes + 1 WHERE feedback_id = %s", (feedback_id,))
            connection.commit()

            if cursor.rowcount == 0:
                return jsonify({"message": "Post not found"}), 404
            cursor.execute("SELECT likes FROM forum WHERE feedback_id = %s", (feedback_id,))
            result = cursor.fetchone()
        if result:
            return jsonify({"message": "Post liked successfully", "likes": result['likes']})
        else:
            return jsonify({"message": "Post not found"}), 404
    except pymysql.MySQLError as err:
        print("MySQL Error:", err)
        return jsonify({"error": f"Error while liking post: {str(err)}"}), 500

    finally:
        connection.close()


@app.route('/api/delete_post/<int:feedback_id>', methods=['DELETE'])
def delete_post(feedback_id):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute( "DELETE FROM forum WHERE feedback_id = %s", (feedback_id,))
            connection.commit()
        if cursor.rowcount == 0:
            return jsonify({"message": "Post not found"}), 404
        return jsonify({"message": "Post deleted successfully"})
    finally:
        connection.close()

from datetime import datetime

@app.route('/api/get_posts', methods=['GET'])
def get_latest_posts():
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT feedback_id, content, email, likes, timestamp FROM forum ORDER BY feedback_id DESC LIMIT 10"
            )
            result = cursor.fetchall()
            formatted_result = [
                {
                    "feedback_id": row["feedback_id"],
                    "content": row["content"],
                    "email": row["email"],
                    "likes": row["likes"],
                    "timestamp": row["timestamp"].isoformat() if row["timestamp"] else None
                }
                for row in result
            ]
            return jsonify(formatted_result), 200
    finally:
        conn.close()

@app.route('/api/reset_database', methods=['POST'])
def reset_database():
    connection = get_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                connection.begin()

                # Fetch all table names
                cursor.execute(
                    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'society_management_system' AND table_type = 'BASE TABLE'"
                )
                tables = cursor.fetchall()

                cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
                
                for table in tables:
                    table_name = table['TABLE_NAME']
                    if table_name == 'induction_toggle':
                        print(f"Resetting {table_name}")
                        cursor.execute(f"DELETE FROM {table_name};")  # Deletes all rows
                        cursor.execute(f"INSERT INTO {table_name} VALUES (0);")  # Inserts 0
                    else:
                        print(f"Truncating {table_name}")
                        cursor.execute(f"TRUNCATE TABLE {table_name};")  # Truncate other tables

                cursor.execute("SET FOREIGN_KEY_CHECKS=1;")
                connection.commit()
                return jsonify({"success": True, "message": "Database has been reset successfully."})
        except pymysql.MySQLError as err:
            print("MySQL Error:", err)
            connection.rollback()
            return jsonify({"error": f"Error while resetting database: {str(err)}"}), 500
        finally:
            connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
