# Society Management System - Node.js/Express Backend

This is the Node.js/Express backend for the Society Management System, migrated from Flask.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Configuration**
   - Make sure MySQL is running
   - Update database credentials in `server.js` if needed (currently set to):
     - host: '127.0.0.1'
     - user: 'root'
     - database: 'Society_Management_System'

3. **Run the Server**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-reload)
   npm run dev
   ```

   The server will run on `http://0.0.0.0:5001` (same port as Flask backend)

## API Endpoints

All endpoints are prefixed with `/api/`:

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:event_id` - Get single event
- `POST /api/add_event` - Add new event
- `DELETE /api/delete_event/:event_id` - Delete event

### Bookings
- `POST /api/bookings` - Submit booking
- `GET /api/bookings/:event_id` - Get bookings for event

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/signin_admin` - Admin login
- `POST /api/abbu_admin` - Faculty admin login

### Admin Management
- `GET /api/fetch_excom` - Get excom members
- `GET /api/fetch_admin` - Get admins
- `POST /api/add_admin` - Add admin
- `DELETE /api/remove_admin` - Remove admin
- `POST /api/change_password` - Change admin password

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/add_announcements` - Add announcement
- `DELETE /api/delete_announcement/:announcement_id` - Delete announcement

### Inductions
- `GET /api/applicants` - Get all applicants
- `POST /api/register_induction` - Register for induction
- `POST /api/toggle_induction` - Toggle induction status
- `GET /api/toggle_status` - Get induction toggle status
- `POST /api/appoint_excom` - Appoint excom member

### Meetings
- `GET /api/get_meetings` - Get all meetings
- `POST /api/add_meeting` - Add meeting
- `DELETE /api/delete_meeting/:meeting_id` - Delete meeting

### Attendance
- `GET /api/fetch_members` - Get all members
- `POST /api/add_attendance` - Add attendance
- `GET /api/fetch_attendance/:meeting_id` - Get attendance for meeting
- `GET /api/track_attendance/:roll_number` - Track member attendance

### Forum
- `GET /api/get_posts` - Get latest posts
- `POST /api/add_post` - Add forum post
- `POST /api/like_post/:feedback_id` - Like post
- `DELETE /api/delete_post/:feedback_id` - Delete post

### Database
- `POST /api/reset_database` - Reset database (admin only)

## Notes

- All API endpoints maintain the same structure as the Flask backend
- The frontend should work without any changes
- Database schema remains unchanged
- CORS is enabled for all origins on `/api/*` routes

