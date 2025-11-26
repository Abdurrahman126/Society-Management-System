const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../../server');

jest.mock('mysql2/promise');

describe('Announcements API', () => {
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

  describe('GET /api/announcements', () => {
    it('should return all announcements successfully', async () => {
      const mockAnnouncements = [
        {
          announcement_id: 1,
          announcement_title: 'Test Announcement 1',
          content: 'Content 1',
          link: 'https://example.com'
        },
        {
          announcement_id: 2,
          announcement_title: 'Test Announcement 2',
          content: 'Content 2',
          link: null
        }
      ];

      mockExecute.mockResolvedValue([mockAnnouncements]);

      const response = await request(app)
        .get('/api/announcements')
        .expect(200);

      expect(response.body).toEqual(mockAnnouncements);
      expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM announcements');
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/announcements')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/add_announcements', () => {
    it('should create a new announcement successfully', async () => {
      const announcementData = {
        title: 'New Announcement',
        content: 'This is a test announcement',
        link: 'https://example.com'
      };

      mockExecute.mockResolvedValue([{ insertId: 1 }]);

      const response = await request(app)
        .post('/api/add_announcements')
        .send(announcementData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Announcement added successfully');
      expect(mockExecute).toHaveBeenCalledWith(
        'INSERT INTO announcements (announcement_title, content, link) VALUES (?, ?, ?)',
        [announcementData.title, announcementData.content, announcementData.link]
      );
    });

    it('should create announcement without link', async () => {
      const announcementData = {
        title: 'New Announcement',
        content: 'This is a test announcement'
        // No link provided
      };

      mockExecute.mockResolvedValue([{ insertId: 1 }]);

      const response = await request(app)
        .post('/api/add_announcements')
        .send(announcementData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(mockExecute).toHaveBeenCalledWith(
        'INSERT INTO announcements (announcement_title, content, link) VALUES (?, ?, ?)',
        [announcementData.title, announcementData.content, null]
      );
    });

    it('should handle database errors', async () => {
      const announcementData = {
        title: 'New Announcement',
        content: 'This is a test announcement'
      };

      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/add_announcements')
        .send(announcementData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/delete_announcement/:announcement_id', () => {
    it('should delete an announcement successfully', async () => {
      mockExecute.mockResolvedValue([{ affectedRows: 1 }]);

      const response = await request(app)
        .delete('/api/delete_announcement/1')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('announcement deleted successfully');
      expect(mockExecute).toHaveBeenCalledWith(
        'DELETE FROM announcements WHERE announcement_id = ?',
        [1]
      );
    });

    it('should return 404 if announcement not found', async () => {
      mockExecute.mockResolvedValue([{ affectedRows: 0 }]);

      const response = await request(app)
        .delete('/api/delete_announcement/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('announcement not found');
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/delete_announcement/1')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
});

