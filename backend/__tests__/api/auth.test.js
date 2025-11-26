const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../../server');

jest.mock('mysql2/promise');

describe('Authentication API', () => {
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

  describe('POST /api/login', () => {
    it('should login user with valid credentials', async () => {
      const loginData = {
        rollno: 'K224150',
        password: 'password123'
      };

      mockExecute.mockResolvedValue([[{ password: 'password123' }]]);

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Login successful');
      expect(mockExecute).toHaveBeenCalledWith(
        'SELECT pwd AS password FROM members WHERE roll_number = ? UNION SELECT password AS password FROM excom WHERE roll_number = ?',
        [loginData.rollno, loginData.rollno]
      );
    });

    it('should return 400 if fields are missing', async () => {
      const incompleteData = {
        rollno: 'K224150'
        // Missing password
      };

      const response = await request(app)
        .post('/api/login')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('All fields are required.');
    });

    it('should return 404 if member not found', async () => {
      const loginData = {
        rollno: 'K999999',
        password: 'password123'
      };

      mockExecute.mockResolvedValue([[]]);

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Member not found.');
    });

    it('should return 401 if password is incorrect', async () => {
      const loginData = {
        rollno: 'K224150',
        password: 'wrongpassword'
      };

      mockExecute.mockResolvedValue([[{ password: 'correctpassword' }]]);

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid credentials.');
    });

    it('should handle database errors', async () => {
      const loginData = {
        rollno: 'K224150',
        password: 'password123'
      };

      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        rollno: 'K224150',
        name: 'Test User',
        batch: '2024',
        department: 'CS',
        section: 'A',
        email: 'test@example.com',
        password: 'password123',
        confirm: 'password123',
        team: 'Development'
      };

      // Mock: first call checks email, second call inserts
      mockExecute
        .mockResolvedValueOnce([[]]) // Email not found
        .mockResolvedValueOnce([{ insertId: 1 }]); // Insert successful

      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteData = {
        rollno: 'K224150',
        name: 'Test User'
        // Missing other fields
      };

      const response = await request(app)
        .post('/api/register')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('All fields are required');
    });

    it('should return 400 if passwords do not match', async () => {
      const userData = {
        rollno: 'K224150',
        name: 'Test User',
        batch: '2024',
        department: 'CS',
        section: 'A',
        email: 'test@example.com',
        password: 'password123',
        confirm: 'differentpassword',
        team: 'Development'
      };

      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Passwords do not match');
    });

    it('should return 400 if email already exists', async () => {
      const userData = {
        rollno: 'K224150',
        name: 'Test User',
        batch: '2024',
        department: 'CS',
        section: 'A',
        email: 'existing@example.com',
        password: 'password123',
        confirm: 'password123',
        team: 'Development'
      };

      // Mock: email exists (MySQL2 returns [rows, fields], so we need double array)
      mockExecute.mockResolvedValueOnce([[{ email: 'existing@example.com' }]]);

      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email already registered');
    });
  });

  describe('POST /api/signin_admin', () => {
    it('should login admin with valid credentials', async () => {
      const adminData = {
        email: 'admin@example.com',
        password: 'admin123'
      };

      mockExecute.mockResolvedValue([[{ admin_password: 'admin123' }]]);

      const response = await request(app)
        .post('/api/signin_admin')
        .send(adminData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Login successful');
    });

    it('should return 400 if fields are missing', async () => {
      const incompleteData = {
        email: 'admin@example.com'
        // Missing password
      };

      const response = await request(app)
        .post('/api/signin_admin')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 if admin not found', async () => {
      const adminData = {
        email: 'nonexistent@example.com',
        password: 'admin123'
      };

      mockExecute.mockResolvedValue([[]]);

      const response = await request(app)
        .post('/api/signin_admin')
        .send(adminData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('admin not found.');
    });

    it('should return 401 if password is incorrect', async () => {
      const adminData = {
        email: 'admin@example.com',
        password: 'wrongpassword'
      };

      mockExecute.mockResolvedValue([[{ admin_password: 'correctpassword' }]]);

      const response = await request(app)
        .post('/api/signin_admin')
        .send(adminData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid credentials.');
    });
  });

  describe('POST /api/abbu_admin', () => {
    it('should login faculty admin with correct credentials', async () => {
      const facultyData = {
        email: 'admin@fast.com',
        password: 'fast123',
        secret_key: 'k224150'
      };

      const response = await request(app)
        .post('/api/abbu_admin')
        .send(facultyData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Login successful');
    });

    it('should return 400 if fields are missing', async () => {
      const incompleteData = {
        email: 'admin@fast.com',
        password: 'fast123'
        // Missing secret_key
      };

      const response = await request(app)
        .post('/api/abbu_admin')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 if credentials are incorrect', async () => {
      const wrongData = {
        email: 'wrong@fast.com',
        password: 'wrong123',
        secret_key: 'wrongkey'
      };

      const response = await request(app)
        .post('/api/abbu_admin')
        .send(wrongData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid credentials.');
    });
  });
});

