const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../../server');

// Mock mysql2 before tests run
jest.mock('mysql2/promise');

describe('Events API', () => {
  let mockConnection;
  let mockExecute;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Create mock connection object
    mockExecute = jest.fn();
    mockConnection = {
      execute: mockExecute,
      end: jest.fn().mockResolvedValue()
    };
    
    // Mock createConnection to return our mock connection
    mysql.createConnection.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/events', () => {
    it('should return all events successfully', async () => {
      const mockEvents = [
        {
          event_id: 1,
          event_title: 'Test Event 1',
          about_event: 'Test Description 1',
          event_date: '2024-01-01'
        },
        {
          event_id: 2,
          event_title: 'Test Event 2',
          about_event: 'Test Description 2',
          event_date: '2024-02-01'
        }
      ];

      mockExecute.mockResolvedValue([mockEvents]);

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body).toEqual(mockEvents);
      expect(mockExecute).toHaveBeenCalledWith(
        'SELECT event_id, event_title, about_event, event_date FROM society_events'
      );
      expect(mockConnection.end).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      mockExecute.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/events')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Database connection failed');
    });
  });

  describe('GET /api/events/:event_id', () => {
    it('should return a single event by ID', async () => {
      const mockEvent = {
        event_id: 1,
        event_title: 'Test Event',
        about_event: 'Test Description',
        event_date: '2024-01-01',
        booking_price: 100
      };

      mockExecute.mockResolvedValue([[mockEvent]]);

      const response = await request(app)
        .get('/api/events/1')
        .expect(200);

      expect(response.body).toEqual(mockEvent);
      expect(mockExecute).toHaveBeenCalledWith(
        'SELECT event_id, event_title, about_event, event_date, booking_price FROM society_events WHERE event_id = ?',
        [1]
      );
    });

    it('should return 404 if event not found', async () => {
      mockExecute.mockResolvedValue([[]]);

      const response = await request(app)
        .get('/api/events/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Event not found');
    });

    it('should handle invalid event ID', async () => {
      mockExecute.mockResolvedValue([[]]);

      const response = await request(app)
        .get('/api/events/invalid')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/add_event', () => {
    it('should create a new event successfully', async () => {
      const newEvent = {
        event_title: 'New Event',
        about_event: 'Event Description',
        event_date: '2024-12-25',
        venue: 'Main Hall',
        booking_price: 50
      };

      // Mock: first call checks for duplicates, second call inserts
      mockExecute
        .mockResolvedValueOnce([[]]) // No duplicate found
        .mockResolvedValueOnce([{ insertId: 1 }]); // Insert successful

      const response = await request(app)
        .post('/api/add_event')
        .send(newEvent)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Event added successfully');
      expect(mockExecute).toHaveBeenCalledTimes(2);
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteEvent = {
        event_title: 'New Event'
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/add_event')
        .send(incompleteEvent)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('All required fields must be provided');
    });

    it('should return 400 if event title already exists', async () => {
      const newEvent = {
        event_title: 'Existing Event',
        about_event: 'Event Description',
        event_date: '2024-12-25',
        venue: 'Main Hall'
      };

      // Mock: duplicate found (MySQL2 returns [rows, fields], so we need double array)
      mockExecute.mockResolvedValueOnce([[{ event_id: 1 }]]);

      const response = await request(app)
        .post('/api/add_event')
        .send(newEvent)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Event title already exists');
    });

    it('should handle database errors during creation', async () => {
      const newEvent = {
        event_title: 'New Event',
        about_event: 'Event Description',
        event_date: '2024-12-25',
        venue: 'Main Hall'
      };

      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/add_event')
        .send(newEvent)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/delete_event/:event_id', () => {
    it('should delete an event successfully', async () => {
      mockExecute.mockResolvedValue([{ affectedRows: 1 }]);

      const response = await request(app)
        .delete('/api/delete_event/1')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Event deleted successfully');
      expect(mockExecute).toHaveBeenCalledWith(
        'DELETE FROM society_events WHERE event_id = ?',
        [1]
      );
    });

    it('should return 404 if event not found', async () => {
      mockExecute.mockResolvedValue([{ affectedRows: 0 }]);

      const response = await request(app)
        .delete('/api/delete_event/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Event not found');
    });

    it('should handle database errors during deletion', async () => {
      mockExecute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/delete_event/1')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
});

