const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../../server');

jest.mock('mysql2/promise');

describe('Bookings API', () => {
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

  describe('POST /api/bookings', () => {
    it('should submit a booking successfully', async () => {
      const bookingData = {
        rollno: 'K224150',
        name: 'Test User',
        batch: '2024',
        email: 'test@example.com',
        number: '1234567890',
        event_id: 1,
        transaction_id: 'TXN123456'
      };

      mockExecute.mockResolvedValue([{ insertId: 1 }]);

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Booking submitted successfully!');
      expect(mockExecute).toHaveBeenCalledWith(
        'INSERT INTO bookings (event_id, roll_number, s_name, batch, phone, transaction_id, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [bookingData.event_id, bookingData.rollno, bookingData.name, bookingData.batch, bookingData.number, bookingData.transaction_id, bookingData.email]
      );
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteData = {
        name: 'Test User',
        batch: '2024'
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('All fields are required.');
    });

    it('should handle database errors', async () => {
      const bookingData = {
        rollno: 'K224150',
        name: 'Test User',
        batch: '2024',
        email: 'test@example.com',
        number: '1234567890',
        event_id: 1,
        transaction_id: 'TXN123456'
      };

      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to submit booking.');
    });
  });

  describe('GET /api/bookings/:event_id', () => {
    it('should return bookings for an event', async () => {
      const mockBookings = [
        { name: 'User 1', email: 'user1@example.com' },
        { name: 'User 2', email: 'user2@example.com' }
      ];

      mockExecute.mockResolvedValue([mockBookings]);

      const response = await request(app)
        .get('/api/bookings/1')
        .expect(200);

      expect(response.body).toEqual(mockBookings);
      expect(mockExecute).toHaveBeenCalledWith(
        'SELECT s_name AS name, email FROM bookings WHERE event_id = ?',
        [1]
      );
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/bookings/1')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to fetch bookings');
    });
  });
});

