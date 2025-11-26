const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../../server');

jest.mock('mysql2/promise');

describe('Admin Management API', () => {
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

  describe('GET /api/fetch_excom', () => {
    it('should return all excom members', async () => {
      const mockExcom = [
        { roll_number: 'K224150', name: 'John Doe', position: 'President' },
        { roll_number: 'K224151', name: 'Jane Doe', position: 'Vice President' }
      ];

      mockExecute.mockResolvedValue([mockExcom]);

      const response = await request(app)
        .get('/api/fetch_excom')
        .expect(200);

      expect(response.body).toEqual(mockExcom);
      expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM excom');
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/fetch_excom')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/fetch_admin', () => {
    it('should return all admins', async () => {
      const mockAdmins = [
        { roll_number: 'K224150', email: 'admin1@example.com' },
        { roll_number: 'K224151', email: 'admin2@example.com' }
      ];

      mockExecute.mockResolvedValue([mockAdmins]);

      const response = await request(app)
        .get('/api/fetch_admin')
        .expect(200);

      expect(response.body).toEqual(mockAdmins);
      expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM admin');
    });
  });

  describe('POST /api/add_admin', () => {
    it('should add an admin successfully', async () => {
      const adminData = {
        rollno: 'K224150',
        password: 'admin123'
      };

      const mockExcom = [{
        roll_number: 'K224150',
        email: 'excom@example.com'
      }];

      mockExecute
        .mockResolvedValueOnce([mockExcom]) // Find excom
        .mockResolvedValueOnce([{ insertId: 1 }]); // Insert admin

      const response = await request(app)
        .post('/api/add_admin')
        .send(adminData)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Successfully appointed as Admin.');
    });

    it('should return 404 if excom member not found', async () => {
      const adminData = {
        rollno: 'K999999',
        password: 'admin123'
      };

      mockExecute.mockResolvedValueOnce([[]]); // Excom not found

      const response = await request(app)
        .post('/api/add_admin')
        .send(adminData)
        .expect(404);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No such Excom found.');
    });
  });

  describe('DELETE /api/remove_admin', () => {
    it('should remove an admin successfully', async () => {
      const adminData = {
        rollno: 'K224150'
      };

      const mockAdmin = [{ roll_number: 'K224150' }];

      mockExecute
        .mockResolvedValueOnce([mockAdmin]) // Find admin
        .mockResolvedValueOnce([{ affectedRows: 1 }]); // Delete admin

      const response = await request(app)
        .delete('/api/remove_admin')
        .send(adminData)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
    });

    it('should return 404 if admin not found', async () => {
      const adminData = {
        rollno: 'K999999'
      };

      mockExecute.mockResolvedValueOnce([[]]); // Admin not found

      const response = await request(app)
        .delete('/api/remove_admin')
        .send(adminData)
        .expect(404);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/change_password', () => {
    it('should change password successfully', async () => {
      const passwordData = {
        roll_number: 'K224150',
        current_password: 'oldpass123',
        new_password: 'newpass123'
      };

      mockExecute
        .mockResolvedValueOnce([[{ admin_password: 'oldpass123' }]]) // Verify current password
        .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update password

      const response = await request(app)
        .post('/api/change_password')
        .send(passwordData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Password updated successfully.');
    });

    it('should return 400 if fields are missing', async () => {
      const incompleteData = {
        roll_number: 'K224150'
        // Missing passwords
      };

      const response = await request(app)
        .post('/api/change_password')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 if admin not found', async () => {
      const passwordData = {
        roll_number: 'K999999',
        current_password: 'oldpass123',
        new_password: 'newpass123'
      };

      mockExecute.mockResolvedValueOnce([[]]); // Admin not found

      const response = await request(app)
        .post('/api/change_password')
        .send(passwordData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Admin not found.');
    });

    it('should return 401 if current password is incorrect', async () => {
      const passwordData = {
        roll_number: 'K224150',
        current_password: 'wrongpassword',
        new_password: 'newpass123'
      };

      mockExecute.mockResolvedValueOnce([[{ admin_password: 'correctpassword' }]]);

      const response = await request(app)
        .post('/api/change_password')
        .send(passwordData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Current password is incorrect.');
    });
  });
});

