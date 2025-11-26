import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Login from '@/features/login/Login';
import loginReducer from '@/features/login/loginSlice';

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

const createMockStore = () => {
  return configureStore({
    reducer: {
      loginAuth: loginReducer,
    },
  });
};

const renderWithRouter = (component) => {
  const store = createMockStore();
  return render(
    <BrowserRouter>
      <Provider store={store}>
        {component}
      </Provider>
    </BrowserRouter>
  );
};

describe('Login Form - Validation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.mockClear();
    mockNavigate.mockClear();
  });

  it('should render login form with all inputs', () => {
    renderWithRouter(<Login />);
    
    expect(screen.getByLabelText(/roll number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /proceed/i })).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up now/i)).toBeInTheDocument();
  });

  // VALIDATION TESTS - Invalid Roll Numbers
  it('should reject roll number in wrong format (missing k)', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);
    
    await user.type(screen.getByLabelText(/roll number/i), '22-4297');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /proceed/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/roll number must be in the format 22k-4297/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject roll number with wrong year format', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);
    
    await user.type(screen.getByLabelText(/roll number/i), '2k-4297');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /proceed/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/roll number must be in the format 22k-4297/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject roll number with wrong number format', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);
    
    await user.type(screen.getByLabelText(/roll number/i), '22k-42');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /proceed/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/roll number must be in the format 22k-4297/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should accept roll number with uppercase K', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Login successful' }),
    });

    renderWithRouter(<Login />);
    
    await user.type(screen.getByLabelText(/roll number/i), '22K-4297');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /proceed/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // VALIDATION TESTS - Empty Fields
  it('should reject empty rollno field', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);
    
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /proceed/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/roll number is required/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should reject empty password field', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);
    
    await user.type(screen.getByLabelText(/roll number/i), '22k-4297');
    
    const submitButton = screen.getByRole('button', { name: /proceed/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should show multiple validation errors at once', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);
    
    // Fill with invalid rollno and leave password empty
    await user.type(screen.getByLabelText(/roll number/i), 'invalid-format');
    
    const submitButton = screen.getByRole('button', { name: /proceed/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/roll number must be in the format 22k-4297/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // VALIDATION TESTS - Valid Submission
  it('should submit form with all valid inputs', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Login successful' }),
    });

    renderWithRouter(<Login />);
    
    await user.type(screen.getByLabelText(/roll number/i), '22k-4297');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /proceed/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:5001/api/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );
    });
  });

  it('should submit form with different valid credentials', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Login successful' }),
    });

    renderWithRouter(<Login />);
    
    await user.type(screen.getByLabelText(/roll number/i), '21k-5000');
    await user.type(screen.getByLabelText(/password/i), 'differentpass456');
    
    const submitButton = screen.getByRole('button', { name: /proceed/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should submit form with special characters in password', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Login successful' }),
    });

    renderWithRouter(<Login />);
    
    await user.type(screen.getByLabelText(/roll number/i), '22k-4297');
    await user.type(screen.getByLabelText(/password/i), 'P@ssw0rd!#$%');
    
    const submitButton = screen.getByRole('button', { name: /proceed/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should submit form with very long password', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Login successful' }),
    });

    renderWithRouter(<Login />);
    
    await user.type(screen.getByLabelText(/roll number/i), '22k-4297');
    const longPassword = 'a'.repeat(100);
    await user.type(screen.getByLabelText(/password/i), longPassword);
    
    const submitButton = screen.getByRole('button', { name: /proceed/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // VALIDATION TESTS - Backend Error Handling
  it('should display toast error when login fails', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid credentials.' }),
    });

    renderWithRouter(<Login />);
    
    await user.type(screen.getByLabelText(/roll number/i), '22k-4297');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    
    const submitButton = screen.getByRole('button', { name: /proceed/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Login Failed',
          description: 'Invalid credentials.',
          variant: 'destructive',
        })
      );
    });
  });

  // VALIDATION TESTS - Navigation
  it('should navigate to register page when "Sign up now!" is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);
    
    const signUpLink = screen.getByText(/sign up now/i);
    await user.click(signUpLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});
