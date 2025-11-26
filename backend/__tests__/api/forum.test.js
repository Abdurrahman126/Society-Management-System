const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../../server');

jest.mock('mysql2/promise');

describe('Forum API', () => {
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

  describe('POST /api/add_post', () => {
    it('should add a forum post successfully', async () => {
      const postData = {
        email: 'user@example.com',
        content: 'This is a test post'
      };

      mockExecute.mockResolvedValue([{ insertId: 1 }]);

      const response = await request(app)
        .post('/api/add_post')
        .send(postData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Post added successfully');
      expect(response.body).toHaveProperty('feedback_id');
      expect(response.body.feedback_id).toBe(1);
      expect(mockExecute).toHaveBeenCalledWith(
        'INSERT INTO forum (content, email) VALUES (?, ?)',
        [postData.content, postData.email]
      );
    });

    it('should handle database errors', async () => {
      const postData = {
        email: 'user@example.com',
        content: 'This is a test post'
      };

      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/add_post')
        .send(postData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/like_post/:feedback_id', () => {
    it('should like a post successfully', async () => {
      const feedbackId = 1;

      mockExecute
        .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update likes
        .mockResolvedValueOnce([[{ likes: 5 }]]); // Get updated likes

      const response = await request(app)
        .post('/api/like_post/1')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Post liked successfully');
      expect(response.body).toHaveProperty('likes');
      expect(response.body.likes).toBe(5);
    });

    it('should return 404 if post not found', async () => {
      mockExecute.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const response = await request(app)
        .post('/api/like_post/999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Post not found');
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/like_post/1')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/delete_post/:feedback_id', () => {
    it('should delete a post successfully', async () => {
      mockExecute.mockResolvedValue([{ affectedRows: 1 }]);

      const response = await request(app)
        .delete('/api/delete_post/1')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Post deleted successfully');
      expect(mockExecute).toHaveBeenCalledWith(
        'DELETE FROM forum WHERE feedback_id = ?',
        [1]
      );
    });

    it('should return 404 if post not found', async () => {
      mockExecute.mockResolvedValue([{ affectedRows: 0 }]);

      const response = await request(app)
        .delete('/api/delete_post/999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Post not found');
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/delete_post/1')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/get_posts', () => {
    it('should return latest posts', async () => {
      const mockPosts = [
        {
          feedback_id: 1,
          content: 'Post 1',
          email: 'user1@example.com',
          likes: 5,
          timestamp: new Date('2024-01-01')
        },
        {
          feedback_id: 2,
          content: 'Post 2',
          email: 'user2@example.com',
          likes: 3,
          timestamp: new Date('2024-01-02')
        }
      ];

      mockExecute.mockResolvedValue([mockPosts]);

      const response = await request(app)
        .get('/api/get_posts')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('feedback_id');
      expect(response.body[0]).toHaveProperty('content');
      expect(response.body[0]).toHaveProperty('email');
      expect(response.body[0]).toHaveProperty('likes');
    });

    it('should format timestamp correctly', async () => {
      const mockPosts = [
        {
          feedback_id: 1,
          content: 'Post 1',
          email: 'user1@example.com',
          likes: 5,
          timestamp: new Date('2024-01-01T12:00:00Z')
        }
      ];

      mockExecute.mockResolvedValue([mockPosts]);

      const response = await request(app)
        .get('/api/get_posts')
        .expect(200);

      expect(response.body[0]).toHaveProperty('timestamp');
    });

    it('should handle null timestamp', async () => {
      const mockPosts = [
        {
          feedback_id: 1,
          content: 'Post 1',
          email: 'user1@example.com',
          likes: 5,
          timestamp: null
        }
      ];

      mockExecute.mockResolvedValue([mockPosts]);

      const response = await request(app)
        .get('/api/get_posts')
        .expect(200);

      expect(response.body[0].timestamp).toBeNull();
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/get_posts')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
});

