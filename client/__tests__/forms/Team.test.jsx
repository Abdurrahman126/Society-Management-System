import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Team from '@/features/team/Team';

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
  useLoaderData: () => ({
    toggleStatus: { islive: 1 },
    excoms: [],
  }),
  useActionData: () => null,
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <Team />
    </BrowserRouter>
  );
};

describe('Team Form Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  it('should show error when name field is empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Full Name is required.')).toBeInTheDocument();
    });
  });

  it('should show error when roll number is empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Roll number must be in the format: 22k-XXXX')).toBeInTheDocument();
    });
  });

  it('should show error for invalid roll number format', async () => {
    const user = userEvent.setup();
    renderComponent();

    const rollInput = screen.getByPlaceholderText('22k-XXXX');
    await user.type(rollInput, 'invalid');

    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Roll number must be in the format: 22k-XXXX')).toBeInTheDocument();
    });
  });

  it('should accept valid roll number format', async () => {
    const user = userEvent.setup();
    renderComponent();

    const rollInput = screen.getByPlaceholderText('22k-XXXX');
    await user.type(rollInput, '22k-1234');

    expect(rollInput.value).toBe('22k-1234');
  });

  it('should show error when email is empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('should show error for invalid email domain', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText('example@nu.edu.pk');
    await user.type(emailInput, 'user@gmail.com');

    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
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

  it('should show error when department is not selected', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Department is required.')).toBeInTheDocument();
    });
  });

  it('should show error when batch is not selected', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Batch is required.')).toBeInTheDocument();
    });
  });

  it('should show error when position is not selected', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Position is required.')).toBeInTheDocument();
    });
  });

  it('should show error when past experience is empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Past Experience is required.')).toBeInTheDocument();
    });
  });

  it('should accept valid past experience', async () => {
    const user = userEvent.setup();
    renderComponent();

    const experienceTextarea = screen.getByPlaceholderText('Describe your past experience');
    await user.type(experienceTextarea, 'I have 2 years of experience in team management');

    expect(experienceTextarea.value).toBe('I have 2 years of experience in team management');
  });

  it('should show error when motivation is empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Motivation is required.')).toBeInTheDocument();
    });
  });

  it('should accept valid motivation', async () => {
    const user = userEvent.setup();
    renderComponent();

    const motivationTextarea = screen.getByPlaceholderText('Why do you want to join?');
    await user.type(motivationTextarea, 'I want to contribute to the team and grow my skills');

    expect(motivationTextarea.value).toBe('I want to contribute to the team and grow my skills');
  });

  it('should show all validation errors when form is submitted empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Full Name is required.')).toBeInTheDocument();
      expect(screen.getByText('Roll number must be in the format: 22k-XXXX')).toBeInTheDocument();
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Department is required.')).toBeInTheDocument();
      expect(screen.getByText('Batch is required.')).toBeInTheDocument();
      expect(screen.getByText('Position is required.')).toBeInTheDocument();
      expect(screen.getByText('Past Experience is required.')).toBeInTheDocument();
      expect(screen.getByText('Motivation is required.')).toBeInTheDocument();
    });
  });
});
