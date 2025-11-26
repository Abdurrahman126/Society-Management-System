import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Register from '@/features/login/Register';

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

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

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
};

describe('Register Form Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show error when name field is empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Proceed/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Full Name is required.')).toBeInTheDocument();
    });
  });

  it('should show error when roll number is empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Proceed/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Roll number is required.')).toBeInTheDocument();
    });
  });

  it('should show error for invalid roll number format', async () => {
    const user = userEvent.setup();
    renderComponent();

    const rollInput = screen.getByPlaceholderText('22k-4297');
    await user.type(rollInput, 'invalid');

    const submitButton = screen.getByRole('button', { name: /Proceed/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Roll number must be in the format 22k-4297')).toBeInTheDocument();
    });
  });

  it('should accept valid roll number format', async () => {
    const user = userEvent.setup();
    renderComponent();

    const rollInput = screen.getByPlaceholderText('22k-4297');
    await user.type(rollInput, '22k-1234');

    expect(rollInput.value).toBe('22k-1234');
  });

  it('should show error when email is empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Proceed/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
    });
  });

  it('should show error for invalid email domain', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText('example@nu.edu.pk');
    await user.type(emailInput, 'user@gmail.com');

    const submitButton = screen.getByRole('button', { name: /Proceed/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email must end with @nu.edu.pk')).toBeInTheDocument();
    });
  });

  it('should accept valid nu.edu.pk email', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText('example@nu.edu.pk');
    await user.type(emailInput, 'student@nu.edu.pk');

    expect(emailInput.value).toBe('student@nu.edu.pk');
  });

  it('should show error when password is empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Proceed/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password is required.')).toBeInTheDocument();
    });
  });

  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderComponent();

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmInput = screen.getByPlaceholderText('Confirm Password');

    await user.type(passwordInput, 'Password123');
    await user.type(confirmInput, 'Password456');

    const submitButton = screen.getByRole('button', { name: /Proceed/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('should show error when batch is not selected', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Proceed/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Batch is required.')).toBeInTheDocument();
    });
  });

  it('should show error when team is not selected', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Proceed/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please select a team.')).toBeInTheDocument();
    });
  });

  it('should show error when department is empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Proceed/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Department is required.')).toBeInTheDocument();
    });
  });

  it('should show error when section is empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Proceed/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Section is required.')).toBeInTheDocument();
    });
  });
});
