# Backend Test Suite

This directory contains automated tests for all backend API endpoints using Jest and Supertest.

## Test Coverage

The test suite covers all API endpoints:

- **Events API** (`events.test.js`)
  - GET /api/events
  - GET /api/events/:event_id
  - POST /api/add_event
  - DELETE /api/delete_event/:event_id

- **Authentication API** (`auth.test.js`)
  - POST /api/login
  - POST /api/register
  - POST /api/signin_admin
  - POST /api/abbu_admin

- **Announcements API** (`announcements.test.js`)
  - GET /api/announcements
  - POST /api/add_announcements
  - DELETE /api/delete_announcement/:announcement_id

- **Bookings API** (`bookings.test.js`)
  - POST /api/bookings
  - GET /api/bookings/:event_id

- **Admin Management API** (`admin.test.js`)
  - GET /api/fetch_excom
  - GET /api/fetch_admin
  - POST /api/add_admin
  - DELETE /api/remove_admin
  - POST /api/change_password

- **Meetings API** (`meetings.test.js`)
  - POST /api/add_meeting
  - GET /api/get_meetings
  - DELETE /api/delete_meeting/:meeting_id

- **Attendance API** (`attendance.test.js`)
  - GET /api/fetch_members
  - POST /api/add_attendance
  - GET /api/fetch_attendance/:meeting_id
  - GET /api/track_attendance/:roll_number

- **Inductions API** (`inductions.test.js`)
  - GET /api/applicants
  - POST /api/register_induction
  - POST /api/toggle_induction
  - GET /api/toggle_status
  - POST /api/appoint_excom

- **Forum API** (`forum.test.js`)
  - POST /api/add_post
  - POST /api/like_post/:feedback_id
  - DELETE /api/delete_post/:feedback_id
  - GET /api/get_posts

## Installation

First, install the required dependencies:

```bash
cd backend
npm install
```

This will install:
- `jest` - Testing framework
- `supertest` - HTTP assertion library for testing API endpoints
- `@jest/globals` - Jest global functions

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes):
```bash
npm run test:watch
```

### Run tests with coverage report:
```bash
npm run test:coverage
```

### Run a specific test file:
```bash
npm test events.test.js
```

### Run tests matching a pattern:
```bash
npm test -- --testNamePattern="should return all events"
```

## How Automation Works

### 1. **Test Automation Explained**

Automated testing means that tests run automatically without manual intervention. Here's how it works:

#### **Mocking Database Connections**
- Tests use **mocked database connections** instead of real database
- This means tests run **fast** and **don't require a database setup**
- Each test mocks the MySQL connection and simulates database responses

#### **Automated Test Execution**
- Jest automatically discovers all test files (files ending in `.test.js`)
- Tests run in isolation (each test is independent)
- Tests verify both **success cases** and **error cases**

#### **What Gets Tested Automatically:**
1. **HTTP Status Codes** - Verifies correct status codes (200, 400, 404, 500, etc.)
2. **Response Bodies** - Checks that responses contain expected data
3. **Database Queries** - Ensures correct SQL queries are executed
4. **Error Handling** - Verifies proper error messages and status codes
5. **Input Validation** - Tests missing fields, invalid data, etc.

### 2. **Example Test Flow**

Here's what happens when you run a test:

```javascript
// 1. Test sets up mock database
mockExecute.mockResolvedValue([mockEvents]);

// 2. Test makes HTTP request to API
const response = await request(app)
  .get('/api/events')
  .expect(200);

// 3. Test automatically verifies:
//    - Status code is 200
//    - Response body matches expected data
//    - Database query was called correctly
expect(response.body).toEqual(mockEvents);
```

### 3. **Benefits of Automation**

✅ **Fast Execution** - All tests run in seconds  
✅ **No Manual Testing** - No need to manually test each endpoint  
✅ **Catch Bugs Early** - Tests catch issues before deployment  
✅ **Regression Testing** - Ensures new changes don't break existing features  
✅ **Documentation** - Tests serve as living documentation of API behavior  
✅ **CI/CD Integration** - Can be integrated into deployment pipelines  

### 4. **Continuous Integration (CI) Setup**

You can integrate these tests into CI/CD pipelines (GitHub Actions, GitLab CI, etc.):

```yaml
# Example GitHub Actions workflow
name: Backend Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## Test Structure

Each test file follows this structure:

```javascript
describe('API Endpoint Group', () => {
  beforeEach(() => {
    // Setup mocks before each test
  });

  describe('GET /api/endpoint', () => {
    it('should return success response', async () => {
      // Test implementation
    });

    it('should handle errors', async () => {
      // Error test implementation
    });
  });
});
```

## Understanding Test Output

When you run `npm test`, you'll see:

```
PASS  __tests__/api/events.test.js
  Events API
    GET /api/events
      ✓ should return all events successfully (15ms)
      ✓ should handle database errors (5ms)
    POST /api/add_event
      ✓ should create a new event successfully (8ms)
      ✓ should return 400 if required fields are missing (3ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Time:        2.5s
```

- ✅ Green checkmarks = Tests passed
- ❌ Red X = Tests failed (with error details)
- Test execution time shown for each test

## Coverage Report

Running `npm run test:coverage` generates a coverage report showing:
- Which lines of code are tested
- Percentage of code coverage
- Uncovered lines

Coverage report is saved in `coverage/` directory.

## Troubleshooting

### Tests failing?
1. Make sure dependencies are installed: `npm install`
2. Check that `server.js` exports the app (should have `module.exports = app`)
3. Verify Jest configuration in `jest.config.js`

### Mock issues?
- Ensure `mysql2/promise` is properly mocked
- Check that mock functions return expected data structure

## Next Steps

1. **Run the tests** to verify everything works
2. **Add more test cases** for edge cases
3. **Set up CI/CD** to run tests automatically on push
4. **Add integration tests** that use a test database (optional)

