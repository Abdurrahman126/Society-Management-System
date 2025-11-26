const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../../server');

jest.mock('mysql2/promise');

describe('Attendance API', () => {
  let mockConnection;
  let mockExecute;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute = jest.fn();
    mockConnection = {
      execute: mockExecute,
      end: jest.fn().mockResolvedValue()
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/fetch_members', () => {
    it('should return all members', async () => {
      const mockMembers = [
        { roll_number: 'K224150', name: 'John Doe' },
        { roll_number: 'K224151', name: 'Jane Doe' }
      ];

      mockExecute.mockResolvedValue([mockMembers]);

      const response = await request(app)
        .get('/api/fetch_members')
        .expect(200);

      expect(response.body).toEqual(mockMembers);
      expect(mockExecute).toHaveBeenCalledWith('SELECT roll_number, name FROM members');
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/fetch_members')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/add_attendance', () => {
    it('should add attendance successfully', async () => {
      const attendanceData = {
        meeting_id: 1,
        attendance: [
          { roll_number: 'K224150', attended: 1 },
          { roll_number: 'K224151', attended: 0 }
        ]
      };

      // Mock multiple execute calls (one for each member)
      mockExecute
        .mockResolvedValueOnce([{ insertId: 1 }])
        .mockResolvedValueOnce([{ insertId: 2 }]);

      const response = await request(app)
        .post('/api/add_attendance')
        .send(attendanceData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Attendance updated successfully');
    });

    it('should return 400 if meeting_id or attendance is missing', async () => {
      const incompleteData = {
        meeting_id: 1
        // Missing attendance
      };

      const response = await request(app)
        .post('/api/add_attendance')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Missing meeting_id or attendance data');
    });

    it('should handle database errors', async () => {
      const attendanceData = {
        meeting_id: 1,
        attendance: [
          { roll_number: 'K224150', attended: 1 }
        ]
      };

      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/add_attendance')
        .send(attendanceData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/fetch_attendance/:meeting_id', () => {
    it('should return attendance records for a meeting', async () => {
      const mockRecords = [
        { member_id: 'K224150', name: 'John Doe', attendance: 1 },
        { member_id: 'K224151', name: 'Jane Doe', attendance: 0 }
      ];

      mockExecute.mockResolvedValue([mockRecords]);

      const response = await request(app)
        .get('/api/fetch_attendance/1')
        .expect(200);

      expect(response.body).toHaveProperty('meeting_id');
      expect(response.body.meeting_id).toBe(1);
      expect(response.body).toHaveProperty('attendance_records');
      expect(response.body.attendance_records).toEqual(mockRecords);
    });

    it('should return 404 if no attendance records found', async () => {
      mockExecute.mockResolvedValue([[]]);

      const response = await request(app)
        .get('/api/fetch_attendance/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('No attendance records found for the specified meeting');
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/fetch_attendance/1')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/track_attendance/:roll_number', () => {
    it('should return attendance tracking data for a member', async () => {
      const mockRows = [
        {
          meeting_id: 1,
          meeting_title: 'Meeting 1',
          purpose: 'Purpose 1',
          venue: 'Hall 1',
          meeting_date: '2024-01-01',
          attendance: 1
        },
        {
          meeting_id: 2,
          meeting_title: 'Meeting 2',
          purpose: 'Purpose 2',
          venue: 'Hall 2',
          meeting_date: '2024-02-01',
          attendance: 0
        }
      ];

      mockExecute.mockResolvedValue([mockRows]);

      const response = await request(app)
        .get('/api/track_attendance/K224150')
        .expect(200);

      expect(response.body).toHaveProperty('attendance_data');
      expect(response.body).toHaveProperty('attendance_percentage');
      expect(response.body.attendance_percentage).toBe('50.00%');
    });

    it('should calculate 0% attendance when no meetings attended', async () => {
      const mockRows = [
        {
          meeting_id: 1,
          meeting_title: 'Meeting 1',
          purpose: 'Purpose 1',
          venue: 'Hall 1',
          meeting_date: '2024-01-01',
          attendance: 0
        }
      ];

      mockExecute.mockResolvedValue([mockRows]);

      const response = await request(app)
        .get('/api/track_attendance/K224150')
        .expect(200);

      expect(response.body.attendance_percentage).toBe('0.00%');
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/track_attendance/K224150')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
});

