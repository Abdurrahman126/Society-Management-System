import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import BookingForm from '@/features/event/BookingForm';

// Mock fetch
global.fetch = jest.fn();

// Mock useToast
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockEventData = {
  event_id: 1,
  event_title: 'Test Event',
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BookingForm - Validation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.mockClear();
  });

  it('should render booking form with all inputs', () => {
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rollno/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/transaction code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/batch/i)).toBeInTheDocument();
  });

  // VALIDATION TESTS - Invalid Email Formats
  it('should reject email without @nu.edu.pk domain', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@gmail.com');
    await user.type(screen.getByLabelText(/rollno/i), '22k-4297');
    await user.type(screen.getByLabelText(/number/i), '03123456789');
    await user.type(screen.getByLabelText(/transaction code/i), 'TXN123');
    await user.selectOptions(screen.getByLabelText(/batch/i), 'Freshie');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email must end with @nu.edu.pk/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject invalid email format (no @ symbol)', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/email/i), 'invalidemail');
    await user.type(screen.getByLabelText(/name/i), 'Test');
    await user.selectOptions(screen.getByLabelText(/batch/i), 'Freshie');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject email with wrong domain (not @nu.edu.pk)', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@fast.com');
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email must end with @nu.edu.pk/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // VALIDATION TESTS - Invalid Roll Numbers
  it('should reject roll number in wrong format (missing k)', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@nu.edu.pk');
    await user.type(screen.getByLabelText(/rollno/i), '22-4297');
    await user.type(screen.getByLabelText(/number/i), '03123456789');
    await user.type(screen.getByLabelText(/transaction code/i), 'TXN123');
    await user.selectOptions(screen.getByLabelText(/batch/i), 'Freshie');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/roll number must be in the format 22k-4297/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject roll number with wrong year format', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/rollno/i), '2k-4297');
    await user.type(screen.getByLabelText(/name/i), 'Test');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/roll number must be in the format 22k-4297/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject roll number with wrong number format', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/rollno/i), '22k-42');
    await user.type(screen.getByLabelText(/name/i), 'Test');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/roll number must be in the format 22k-4297/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject roll number with lowercase k (should accept both)', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    // Actually, the regex accepts both k and K, so this should work
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@nu.edu.pk');
    await user.type(screen.getByLabelText(/rollno/i), '22K-4297');
    await user.type(screen.getByLabelText(/number/i), '03123456789');
    await user.type(screen.getByLabelText(/transaction code/i), 'TXN123');
    await user.selectOptions(screen.getByLabelText(/batch/i), 'Freshie');
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Booking successful' }),
    });
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // VALIDATION TESTS - Invalid Phone Numbers
  it('should reject phone number not starting with 03', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@nu.edu.pk');
    await user.type(screen.getByLabelText(/rollno/i), '22k-4297');
    await user.type(screen.getByLabelText(/number/i), '04123456789');
    await user.type(screen.getByLabelText(/transaction code/i), 'TXN123');
    await user.selectOptions(screen.getByLabelText(/batch/i), 'Freshie');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/phone number must be 11 digits starting with 03/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject phone number with wrong length (too short)', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/number/i), '0312345');
    await user.type(screen.getByLabelText(/name/i), 'Test');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/phone number must be 11 digits starting with 03/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject phone number with wrong length (too long)', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/number/i), '031234567890');
    await user.type(screen.getByLabelText(/name/i), 'Test');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/phone number must be 11 digits starting with 03/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // VALIDATION TESTS - Empty Fields
  it('should reject empty name field', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/email/i), 'john@nu.edu.pk');
    await user.type(screen.getByLabelText(/rollno/i), '22k-4297');
    await user.type(screen.getByLabelText(/number/i), '03123456789');
    await user.type(screen.getByLabelText(/transaction code/i), 'TXN123');
    await user.selectOptions(screen.getByLabelText(/batch/i), 'Freshie');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject empty email field', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/rollno/i), '22k-4297');
    await user.type(screen.getByLabelText(/number/i), '03123456789');
    await user.type(screen.getByLabelText(/transaction code/i), 'TXN123');
    await user.selectOptions(screen.getByLabelText(/batch/i), 'Freshie');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject empty transaction code', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@nu.edu.pk');
    await user.type(screen.getByLabelText(/rollno/i), '22k-4297');
    await user.type(screen.getByLabelText(/number/i), '03123456789');
    await user.selectOptions(screen.getByLabelText(/batch/i), 'Freshie');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/transaction code is required/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject when batch is not selected', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@nu.edu.pk');
    await user.type(screen.getByLabelText(/rollno/i), '22k-4297');
    await user.type(screen.getByLabelText(/number/i), '03123456789');
    await user.type(screen.getByLabelText(/transaction code/i), 'TXN123');
    // Don't select batch
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/batch is required/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // VALIDATION TESTS - Multiple Invalid Fields
  it('should show multiple validation errors at once', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    // Fill with all invalid data
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/rollno/i), 'wrong-format');
    await user.type(screen.getByLabelText(/number/i), '123');
    // Leave name and transaction code empty
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/roll number must be in the format 22k-4297/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number must be 11 digits starting with 03/i)).toBeInTheDocument();
      expect(screen.getByText(/transaction code is required/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // VALIDATION TESTS - Valid Submission
  it('should submit form with all valid inputs', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Booking successful' }),
    });

    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/name/i), 'Jane Smith');
    await user.type(screen.getByLabelText(/email/i), 'jane@nu.edu.pk');
    await user.type(screen.getByLabelText(/rollno/i), '22k-5000');
    await user.type(screen.getByLabelText(/number/i), '03111111111');
    await user.type(screen.getByLabelText(/transaction code/i), 'TXN456');
    
    const batchSelect = screen.getByLabelText(/batch/i);
    await user.selectOptions(batchSelect, 'Sophomore');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:5001/api/bookings',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('should accept valid email with @nu.edu.pk domain', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Booking successful' }),
    });

    renderWithRouter(<BookingForm eventData={mockEventData} />);
    
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test.user@nu.edu.pk');
    await user.type(screen.getByLabelText(/rollno/i), '21k-1234');
    await user.type(screen.getByLabelText(/number/i), '03000000000');
    await user.type(screen.getByLabelText(/transaction code/i), 'VALID123');
    await user.selectOptions(screen.getByLabelText(/batch/i), 'Junior');
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    
    // Should not show email validation error
    expect(screen.queryByText(/email must end with @nu.edu.pk/i)).not.toBeInTheDocument();
  });
});

