const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../../server');

jest.mock('mysql2/promise');

describe('Inductions API', () => {
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

  describe('GET /api/applicants', () => {
    it('should return all applicants', async () => {
      const mockApplicants = [
        {
          roll_number: 'K224150',
          name: 'John Doe',
          position: 'President',
          email: 'john@example.com'
        }
      ];

      mockExecute.mockResolvedValue([mockApplicants]);

      const response = await request(app)
        .get('/api/applicants')
        .expect(200);

      expect(response.body).toEqual(mockApplicants);
      expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM inductions');
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/applicants')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/register_induction', () => {
    it('should register for induction successfully', async () => {
      const inductionData = {
        rollno: 'K224150',
        name: 'John Doe',
        batch: '2024',
        department: 'CS',
        email: 'john@example.com',
        position: 'President',
        past_experience: 'Some experience',
        motivation: 'I want to contribute'
      };

      mockExecute.mockResolvedValue([{ insertId: 1 }]);

      const response = await request(app)
        .post('/api/register_induction')
        .send(inductionData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Successfully registered for induction!');
      expect(response.body.success).toBe(true);
    });

    it('should handle rollno with spaces', async () => {
      const inductionData = {
        rollno: 'K 224 150', // With spaces
        name: 'John Doe',
        batch: '2024',
        department: 'CS',
        email: 'john@example.com',
        position: 'President',
        past_experience: 'Some experience',
        motivation: 'I want to contribute'
      };

      mockExecute.mockResolvedValue([{ insertId: 1 }]);

      const response = await request(app)
        .post('/api/register_induction')
        .send(inductionData)
        .expect(200);

      // Verify rollno spaces were removed
      expect(mockExecute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO inductions'),
        expect.arrayContaining(['K224150'])
      );
    });

    it('should handle database errors', async () => {
      const inductionData = {
        rollno: 'K224150',
        name: 'John Doe',
        batch: '2024',
        department: 'CS',
        email: 'john@example.com',
        position: 'President',
        past_experience: 'Some experience',
        motivation: 'I want to contribute'
      };

      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/register_induction')
        .send(inductionData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/toggle_induction', () => {
    it('should toggle induction status successfully', async () => {
      const toggleData = {
        new_status: 1
      };

      mockExecute.mockResolvedValue([{ affectedRows: 1 }]);

      const response = await request(app)
        .post('/api/toggle_induction')
        .send(toggleData)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Induction status updated');
      expect(mockExecute).toHaveBeenCalledWith(
        'UPDATE induction_toggle SET islive = ?',
        [toggleData.new_status]
      );
    });

    it('should handle database errors', async () => {
      const toggleData = {
        new_status: 1
      };

      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/toggle_induction')
        .send(toggleData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/toggle_status', () => {
    it('should return toggle status', async () => {
      const mockStatus = {
        islive: 1
      };

      mockExecute.mockResolvedValue([[mockStatus]]);

      const response = await request(app)
        .get('/api/toggle_status')
        .expect(200);

      expect(response.body).toEqual(mockStatus);
      expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM induction_toggle');
    });

    it('should return empty object if no status found', async () => {
      mockExecute.mockResolvedValue([[]]);

      const response = await request(app)
        .get('/api/toggle_status')
        .expect(200);

      expect(response.body).toEqual({});
    });
  });

  describe('POST /api/appoint_excom', () => {
    it('should appoint excom member successfully', async () => {
      const appointmentData = {
        email: 'john@example.com'
      };

      const mockInduction = [{
        roll_number: 'K224150',
        name: 'John Doe',
        batch: '2024',
        department: 'CS',
        email: 'john@example.com',
        position: 'President'
      }];

      mockExecute
        .mockResolvedValueOnce([mockInduction]) // Find induction
        .mockResolvedValueOnce([[]]) // Position not occupied
        .mockResolvedValueOnce([{ insertId: 1 }]); // Insert excom

      const response = await request(app)
        .post('/api/appoint_excom')
        .send(appointmentData)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Successfully appointed to excom.');
    });

    it('should return 400 if email is missing', async () => {
      const incompleteData = {};

      const response = await request(app)
        .post('/api/appoint_excom')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email is required');
    });

    it('should return 404 if member not found', async () => {
      const appointmentData = {
        email: 'nonexistent@example.com'
      };

      mockExecute.mockResolvedValueOnce([[]]); // Member not found

      const response = await request(app)
        .post('/api/appoint_excom')
        .send(appointmentData)
        .expect(404);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No such member found.');
    });

    it('should return 400 if position is already occupied', async () => {
      const appointmentData = {
        email: 'john@example.com'
      };

      const mockInduction = [{
        roll_number: 'K224150',
        name: 'John Doe',
        position: 'President'
      }];

      const mockExisting = [{
        roll_number: 'K224151',
        position: 'President'
      }];

      mockExecute
        .mockResolvedValueOnce([mockInduction]) // Find induction
        .mockResolvedValueOnce([mockExisting]); // Position occupied

      const response = await request(app)
        .post('/api/appoint_excom')
        .send(appointmentData)
        .expect(400);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already occupied');
    });
  });
});

