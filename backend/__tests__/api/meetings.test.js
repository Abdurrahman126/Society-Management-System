const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../../server');

jest.mock('mysql2/promise');

describe('Meetings API', () => {
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

  describe('POST /api/add_meeting', () => {
    it('should create a meeting successfully', async () => {
      const meetingData = {
        meeting_title: 'Monthly Meeting',
        purpose: 'Discuss agenda',
        venue: 'Main Hall',
        date: '2024-12-25'
      };

      mockExecute.mockResolvedValue([{ insertId: 1 }]);

      const response = await request(app)
        .post('/api/add_meeting')
        .send(meetingData)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Meeting created successfully.');
      expect(mockExecute).toHaveBeenCalledWith(
        'INSERT INTO meetings (title, purpose, venue, meeting_date) VALUES (?, ?, ?, ?)',
        [meetingData.meeting_title, meetingData.purpose, meetingData.venue, meetingData.date]
      );
    });

    it('should handle database errors', async () => {
      const meetingData = {
        meeting_title: 'Monthly Meeting',
        purpose: 'Discuss agenda',
        venue: 'Main Hall',
        date: '2024-12-25'
      };

      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/add_meeting')
        .send(meetingData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/get_meetings', () => {
    it('should return all meetings', async () => {
      const mockMeetings = [
        {
          meeting_id: 1,
          title: 'Meeting 1',
          purpose: 'Purpose 1',
          venue: 'Hall 1',
          meeting_date: '2024-01-01'
        },
        {
          meeting_id: 2,
          title: 'Meeting 2',
          purpose: 'Purpose 2',
          venue: 'Hall 2',
          meeting_date: '2024-02-01'
        }
      ];

      mockExecute.mockResolvedValue([mockMeetings]);

      const response = await request(app)
        .get('/api/get_meetings')
        .expect(200);

      expect(response.body).toEqual(mockMeetings);
      expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM meetings');
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/get_meetings')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/delete_meeting/:meeting_id', () => {
    it('should delete a meeting successfully', async () => {
      mockExecute.mockResolvedValue([{ affectedRows: 1 }]);

      const response = await request(app)
        .delete('/api/delete_meeting/1')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('meeting deleted successfully');
      expect(mockExecute).toHaveBeenCalledWith(
        'DELETE FROM meetings WHERE meeting_id = ?',
        [1]
      );
    });

    it('should return 404 if meeting not found', async () => {
      mockExecute.mockResolvedValue([{ affectedRows: 0 }]);

      const response = await request(app)
        .delete('/api/delete_meeting/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('meeting not found');
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/delete_meeting/1')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
});

