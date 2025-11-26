const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection function
function getConnection() {
  return mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    // password: '@Akhan25',
    database: 'Society_Management_System'
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ==================== EVENT APIs ====================

// GET /api/events - Get all events
app.get('/api/events', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [events] = await connection.execute(
      'SELECT event_id, event_title, about_event, event_date FROM society_events'
    );
    res.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// GET /api/events/:event_id - Get single event
app.get('/api/events/:event_id', async (req, res) => {
  let connection;
  try {
    const eventId = parseInt(req.params.event_id);
    connection = await getConnection();
    const [events] = await connection.execute(
      'SELECT event_id, event_title, about_event, event_date, booking_price FROM society_events WHERE event_id = ?',
      [eventId]
    );
    
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(events[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// POST /api/add_event - Add event
app.post('/api/add_event', async (req, res) => {
  let connection;
  try {
    const { event_title, about_event, event_date, venue, booking_price } = req.body;
    
    if (!event_title || !about_event || !event_date || !venue) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    connection = await getConnection();
    
    // Check for duplicate event title
    const [existing] = await connection.execute(
      'SELECT event_id FROM society_events WHERE event_title = ?',
      [event_title]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Event title already exists' });
    }

    // Insert the new event
    await connection.execute(
      'INSERT INTO society_events (event_title, about_event, event_date, venue, booking_price) VALUES (?, ?, ?, ?, ?)',
      [event_title, about_event, event_date, venue, booking_price || null]
    );
    
    res.status(201).json({ message: 'Event added successfully' });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while creating event: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// DELETE /api/delete_event/:event_id - Delete event
app.delete('/api/delete_event/:event_id', async (req, res) => {
  let connection;
  try {
    const eventId = parseInt(req.params.event_id);
    connection = await getConnection();
    
    const [result] = await connection.execute(
      'DELETE FROM society_events WHERE event_id = ?',
      [eventId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while deleting event: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// ==================== BOOKING APIs ====================

// POST /api/bookings - Submit booking
app.post('/api/bookings', async (req, res) => {
  let connection;
  try {
    const { rollno, name, batch, email, number, event_id, transaction_id } = req.body;
    
    if (!name || !batch || !email || !number || !event_id || !transaction_id) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    connection = await getConnection();
    await connection.execute(
      'INSERT INTO bookings (event_id, roll_number, s_name, batch, phone, transaction_id, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [event_id, rollno, name, batch, number, transaction_id, email]
    );
    
    res.status(201).json({ message: 'Booking submitted successfully!' });
  } catch (error) {
    console.error('Error submitting booking:', error);
    res.status(500).json({ error: 'Failed to submit booking.' });
  } finally {
    if (connection) await connection.end();
  }
});

// GET /api/bookings/:event_id - Get bookings for event
app.get('/api/bookings/:event_id', async (req, res) => {
  let connection;
  try {
    const eventId = parseInt(req.params.event_id);
    connection = await getConnection();
    const [bookings] = await connection.execute(
      'SELECT s_name AS name, email FROM bookings WHERE event_id = ?',
      [eventId]
    );
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  } finally {
    if (connection) await connection.end();
  }
});

// ==================== AUTHENTICATION APIs ====================

// POST /api/login - User login
app.post('/api/login', async (req, res) => {
  let connection;
  try {
    const { rollno, password } = req.body;
    
    if (!rollno || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    connection = await getConnection();
    const [users] = await connection.execute(
      'SELECT pwd AS password FROM members WHERE roll_number = ? UNION SELECT password AS password FROM excom WHERE roll_number = ?',
      [rollno, rollno]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'Member not found.' });
    }
    
    const storedPassword = users[0].password;
    if (storedPassword !== password) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging user in:', error);
    res.status(500).json({ error: 'Failed to login' });
  } finally {
    if (connection) await connection.end();
  }
});

// POST /api/register - User registration
app.post('/api/register', async (req, res) => {
  let connection;
  try {
    const { rollno, name, batch, department, section, email, password, confirm, team } = req.body;
    
    if (!rollno || !name || !batch || !department || !section || !email || !password || !confirm || !team) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password !== confirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    connection = await getConnection();
    
    // Check if email already exists
    const [existing] = await connection.execute(
      'SELECT email FROM members WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    await connection.execute(
      'INSERT INTO members (roll_number, name, batch, department, section, email, pwd, team) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [rollno, name, batch, department, section, email, password, team]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) await connection.end();
  }
});

// POST /api/signin_admin - Admin login
app.post('/api/signin_admin', async (req, res) => {
  let connection;
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    connection = await getConnection();
    const [admins] = await connection.execute(
      'SELECT admin_password FROM admin WHERE email = ?',
      [email]
    );
    
    if (admins.length === 0) {
      return res.status(404).json({ error: 'admin not found.' });
    }
    
    const storedPassword = admins[0].admin_password;
    if (storedPassword !== password) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging user in:', error);
    res.status(500).json({ error: 'Failed to login' });
  } finally {
    if (connection) await connection.end();
  }
});

// POST /api/abbu_admin - Faculty admin login
app.post('/api/abbu_admin', async (req, res) => {
  const { email, password, secret_key } = req.body;
  
  if (!email || !password || !secret_key) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  
  if (email !== 'admin@fast.com' || password !== 'fast123' || secret_key !== 'k224150') {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  
  res.json({ message: 'Login successful' });
});

// ==================== ADMIN MANAGEMENT APIs ====================

// GET /api/fetch_excom - Fetch excom members
app.get('/api/fetch_excom', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [excom] = await connection.execute('SELECT * FROM excom');
    res.json(excom);
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while fetching excom: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// GET /api/fetch_admin - Fetch admins
app.get('/api/fetch_admin', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [admins] = await connection.execute('SELECT * FROM admin');
    res.json(admins);
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while fetching admins: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// POST /api/add_admin - Add admin
app.post('/api/add_admin', async (req, res) => {
  let connection;
  try {
    const { rollno, password } = req.body;
    connection = await getConnection();
    
    const [excom] = await connection.execute(
      'SELECT * FROM excom WHERE roll_number = ?',
      [rollno]
    );
    
    if (excom.length === 0) {
      return res.status(404).json({ success: false, message: 'No such Excom found.' });
    }
    
    await connection.execute(
      'INSERT INTO admin (roll_number, email, admin_password) VALUES (?, ?, ?)',
      [excom[0].roll_number, excom[0].email, password]
    );
    
    res.json({ success: true, message: 'Successfully appointed as Admin.' });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while appointing Admin: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// DELETE /api/remove_admin - Remove admin
app.delete('/api/remove_admin', async (req, res) => {
  let connection;
  try {
    const { rollno } = req.body;
    connection = await getConnection();
    
    const [admins] = await connection.execute(
      'SELECT * FROM admin WHERE roll_number = ?',
      [rollno]
    );
    
    if (admins.length === 0) {
      return res.status(404).json({ success: false, message: 'No such Admin found.' });
    }
    
    await connection.execute(
      'DELETE FROM admin WHERE roll_number = ?',
      [rollno]
    );
    
    res.json({ success: true, message: `Admin with Rollno: ${rollno} has been successfully deleted.` });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while deleting Admin: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// POST /api/change_password - Change password
app.post('/api/change_password', async (req, res) => {
  let connection;
  try {
    const rollNumber = req.body['Roll number'] || req.body.roll_number;
    const currentPassword = req.body['Current password'] || req.body.current_password;
    const newPassword = req.body['New password'] || req.body.new_password;
    
    if (!rollNumber || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    connection = await getConnection();
    const [admins] = await connection.execute(
      'SELECT admin_password FROM admin WHERE roll_number = ?',
      [rollNumber]
    );
    
    if (admins.length === 0) {
      return res.status(404).json({ error: 'Admin not found.' });
    }
    
    if (admins[0].admin_password !== currentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }
    
    await connection.execute(
      'UPDATE admin SET admin_password = ? WHERE roll_number = ?',
      [newPassword, rollNumber]
    );
    
    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'failed to change password' });
  } finally {
    if (connection) await connection.end();
  }
});

// ==================== ANNOUNCEMENT APIs ====================

// GET /api/announcements - Get all announcements
app.get('/api/announcements', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [announcements] = await connection.execute('SELECT * FROM announcements');
    res.json(announcements);
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while fetching announcements: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// POST /api/add_announcements - Add announcement
app.post('/api/add_announcements', async (req, res) => {
  let connection;
  try {
    const { title, content, link } = req.body;
    connection = await getConnection();
    
    await connection.execute(
      'INSERT INTO announcements (announcement_title, content, link) VALUES (?, ?, ?)',
      [title, content, link || null]
    );
    
    res.status(201).json({ message: 'Announcement added successfully' });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while adding announcement: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// DELETE /api/delete_announcement/:announcement_id - Delete announcement
app.delete('/api/delete_announcement/:announcement_id', async (req, res) => {
  let connection;
  try {
    const announcementId = parseInt(req.params.announcement_id);
    connection = await getConnection();
    
    const [result] = await connection.execute(
      'DELETE FROM announcements WHERE announcement_id = ?',
      [announcementId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'announcement not found' });
    }
    
    res.json({ message: 'announcement deleted successfully' });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while deleting announcement: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// ==================== INDUCTION APIs ====================

// POST /api/toggle_induction - Toggle induction status
app.post('/api/toggle_induction', async (req, res) => {
  let connection;
  try {
    const { new_status } = req.body;
    connection = await getConnection();
    
    await connection.execute(
      'UPDATE induction_toggle SET islive = ?',
      [new_status]
    );
    
    res.json({ success: true, message: 'Induction status updated' });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// GET /api/toggle_status - Get toggle status
app.get('/api/toggle_status', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [status] = await connection.execute('SELECT * FROM induction_toggle');
    res.json(status[0] || {});
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// GET /api/applicants - Get all applicants
app.get('/api/applicants', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [applicants] = await connection.execute('SELECT * FROM inductions');
    res.json(applicants);
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while fetching applicants: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// POST /api/register_induction - Register for induction
app.post('/api/register_induction', async (req, res) => {
  let connection;
  try {
    const rollno = req.body.rollno?.replace(/\s/g, '');
    const { name, batch, department, email, position, past_experience, motivation } = req.body;
    
    connection = await getConnection();
    await connection.execute(
      'INSERT INTO inductions (roll_number, name, batch, department, email, position, past_experience, motivation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [rollno, name, batch, department, email, position, past_experience, motivation]
    );
    
    res.json({ message: 'Successfully registered for induction!', success: true });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while registering applicant: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// POST /api/appoint_excom - Appoint excom member
app.post('/api/appoint_excom', async (req, res) => {
  let connection;
  try {
    const email = req.body.email?.trim();
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    connection = await getConnection();
    const [excomMembers] = await connection.execute(
      'SELECT * FROM inductions WHERE email = ?',
      [email]
    );
    
    if (excomMembers.length === 0) {
      return res.status(404).json({ success: false, message: 'No such member found.' });
    }
    
    const excomMember = excomMembers[0];
    
    // Check if position is already occupied
    const [existing] = await connection.execute(
      'SELECT * FROM excom WHERE position = ?',
      [excomMember.position]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The position '${excomMember.position}' is already occupied.`
      });
    }
    
    await connection.execute(
      'INSERT INTO excom (roll_number, name, batch, department, email, position, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [excomMember.roll_number, excomMember.name, excomMember.batch, excomMember.department, excomMember.email, excomMember.position, 'fast1234']
    );
    
    res.json({ success: true, message: 'Successfully appointed to excom.' });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while appointing member: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// ==================== MEETING APIs ====================

// POST /api/add_meeting - Add meeting
app.post('/api/add_meeting', async (req, res) => {
  let connection;
  try {
    const { meeting_title, purpose, venue, date } = req.body;
    connection = await getConnection();
    
    await connection.execute(
      'INSERT INTO meetings (title, purpose, venue, meeting_date) VALUES (?, ?, ?, ?)',
      [meeting_title, purpose, venue, date]
    );
    
    res.json({ success: true, message: 'Meeting created successfully.' });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while creating meeting: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// GET /api/get_meetings - Get all meetings
app.get('/api/get_meetings', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [meetings] = await connection.execute('SELECT * FROM meetings');
    res.json(meetings);
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while fetching meetings: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// DELETE /api/delete_meeting/:meeting_id - Delete meeting
app.delete('/api/delete_meeting/:meeting_id', async (req, res) => {
  let connection;
  try {
    const meetingId = parseInt(req.params.meeting_id);
    connection = await getConnection();
    
    const [result] = await connection.execute(
      'DELETE FROM meetings WHERE meeting_id = ?',
      [meetingId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'meeting not found' });
    }
    
    res.json({ message: 'meeting deleted successfully' });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while deleting meeting: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// ==================== ATTENDANCE APIs ====================

// GET /api/fetch_members - Get all members
app.get('/api/fetch_members', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [members] = await connection.execute('SELECT roll_number, name FROM members');
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  } finally {
    if (connection) await connection.end();
  }
});

// POST /api/add_attendance - Add attendance
app.post('/api/add_attendance', async (req, res) => {
  let connection;
  try {
    const { meeting_id, attendance } = req.body;
    
    if (!meeting_id || !attendance) {
      return res.status(400).json({ error: 'Missing meeting_id or attendance data' });
    }

    connection = await getConnection();
    
    for (const member of attendance) {
      const memberId = member.roll_number;
      const status = member.attended;
      
      await connection.execute(
        'INSERT INTO attendance (meeting_id, member_id, attendance) VALUES (?, ?, ?)',
        [meeting_id, memberId, status]
      );
    }
    
    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error in adding/updating attendance:', error);
    res.status(500).json({ error: 'Failed to add/update attendance' });
  } finally {
    if (connection) await connection.end();
  }
});

// GET /api/fetch_attendance/:meeting_id - Fetch attendance for meeting
app.get('/api/fetch_attendance/:meeting_id', async (req, res) => {
  let connection;
  try {
    const meetingId = parseInt(req.params.meeting_id);
    connection = await getConnection();
    
    const [records] = await connection.execute(
      `SELECT a.member_id, m.name, a.attendance
       FROM attendance a
       JOIN members m ON m.roll_number = a.member_id 
       WHERE a.meeting_id = ?`,
      [meetingId]
    );
    
    if (records.length === 0) {
      return res.status(404).json({ error: 'No attendance records found for the specified meeting' });
    }
    
    res.json({ meeting_id: meetingId, attendance_records: records });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  } finally {
    if (connection) await connection.end();
  }
});

// GET /api/track_attendance/:roll_number - Track attendance for member
app.get('/api/track_attendance/:roll_number', async (req, res) => {
  let connection;
  try {
    const rollNumber = req.params.roll_number;
    connection = await getConnection();
    
    const [rows] = await connection.execute(
      `SELECT m.meeting_id, m.title AS meeting_title, m.purpose, m.venue, m.meeting_date, a.attendance
       FROM meetings m
       LEFT JOIN attendance a ON m.meeting_id = a.meeting_id AND a.member_id = ?`,
      [rollNumber]
    );
    
    const attendanceData = [];
    let totalMeetings = 0;
    let attendedMeetings = 0;
    
    for (const row of rows) {
      attendanceData.push({
        meeting_id: row.meeting_id,
        meeting_title: row.meeting_title,
        attendance_status: row.attendance ? 'Present' : 'Absent',
        meeting_date: row.meeting_date
      });
      
      totalMeetings++;
      if (row.attendance) {
        attendedMeetings++;
      }
    }
    
    const attendancePercentage = totalMeetings > 0 
      ? `${(attendedMeetings / totalMeetings * 100).toFixed(2)}%`
      : '0.00%';
    
    res.json({
      attendance_data: attendanceData,
      attendance_percentage: attendancePercentage
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error while calculating attendance.' });
  } finally {
    if (connection) await connection.end();
  }
});

// ==================== FORUM APIs ====================

// POST /api/add_post - Add forum post
app.post('/api/add_post', async (req, res) => {
  let connection;
  try {
    const { email, content } = req.body;
    connection = await getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO forum (content, email) VALUES (?, ?)',
      [content, email]
    );
    
    res.status(201).json({ 
      message: 'Post added successfully', 
      feedback_id: result.insertId 
    });
  } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// POST /api/like_post/:feedback_id - Like post
app.post('/api/like_post/:feedback_id', async (req, res) => {
  let connection;
  try {
    const feedbackId = parseInt(req.params.feedback_id);
    connection = await getConnection();
    
    const [result] = await connection.execute(
      'UPDATE forum SET likes = likes + 1 WHERE feedback_id = ?',
      [feedbackId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const [post] = await connection.execute(
      'SELECT likes FROM forum WHERE feedback_id = ?',
      [feedbackId]
    );
    
    res.json({ message: 'Post liked successfully', likes: post[0].likes });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while liking post: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// DELETE /api/delete_post/:feedback_id - Delete post
app.delete('/api/delete_post/:feedback_id', async (req, res) => {
  let connection;
  try {
    const feedbackId = parseInt(req.params.feedback_id);
    connection = await getConnection();
    
    const [result] = await connection.execute(
      'DELETE FROM forum WHERE feedback_id = ?',
      [feedbackId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// GET /api/get_posts - Get latest posts
app.get('/api/get_posts', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(
      'SELECT feedback_id, content, email, likes, timestamp FROM forum ORDER BY feedback_id DESC LIMIT 10'
    );
    
    const formattedResult = result.map(row => ({
      feedback_id: row.feedback_id,
      content: row.content,
      email: row.email,
      likes: row.likes,
      timestamp: row.timestamp ? new Date(row.timestamp).toISOString() : null
    }));
    
    res.json(formattedResult);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// ==================== DATABASE RESET API ====================

// POST /api/reset_database - Reset database
app.post('/api/reset_database', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    // Get all table names
    const [tables] = await connection.execute(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'Society_Management_System' AND table_type = 'BASE TABLE'"
    );
    
    await connection.execute('SET FOREIGN_KEY_CHECKS=0');
    
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      if (tableName === 'induction_toggle') {
        await connection.execute(`DELETE FROM ${tableName}`);
        await connection.execute(`INSERT INTO ${tableName} VALUES (0)`);
      } else {
        await connection.execute(`TRUNCATE TABLE ${tableName}`);
      }
    }
    
    await connection.execute('SET FOREIGN_KEY_CHECKS=1');
    
    res.json({ success: true, message: 'Database has been reset successfully.' });
  } catch (error) {
    console.error('MySQL Error:', error);
    res.status(500).json({ error: `Error while resetting database: ${error.message}` });
  } finally {
    if (connection) await connection.end();
  }
});

// Start server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

// Export app for testing
module.exports = app;

