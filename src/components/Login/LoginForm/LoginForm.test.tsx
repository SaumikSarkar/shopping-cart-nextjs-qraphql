import { render, screen, fireEvent } from "@testing-library/react";

import { LoginForm } from "./LoginForm";

import { useLogin } from "@/hooks/Login/useLogin";
jest.mock("@/hooks/Login/useLogin");

const mockUseLogin = useLogin as jest.Mock;

describe("LoginForm", () => {
  const baseFormik = {
    values: { email: "", password: "" },
    errors: {},
    touched: {},
    isValid: false,
    dirty: false,
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    handleSubmit: jest.fn((e?: unknown) => (e as Event)?.preventDefault?.()),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLogin.mockReturnValue({
      formik: baseFormik,
      errorMsg: null,
      loading: false,
    });
  });

  it("renders the form with fields and login button", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("displays form validation error", () => {
    mockUseLogin.mockReturnValue({
      formik: {
        ...baseFormik,
        errors: { email: "Email is required" },
        touched: { email: true },
      },
      errorMsg: null,
      loading: false,
    });

    render(<LoginForm />);
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("displays errorMsg from API", () => {
    mockUseLogin.mockReturnValue({
      formik: baseFormik,
      errorMsg: "Invalid credentials",
      loading: false,
    });

    render(<LoginForm />);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("disables submit button when loading", () => {
    mockUseLogin.mockReturnValue({
      formik: { ...baseFormik, isValid: true, dirty: true },
      errorMsg: null,
      loading: true,
    });

    render(<LoginForm />);
    expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled();
  });

  it("calls formik.handleSubmit on submit", () => {
    const handleSubmit = jest.fn((e?: unknown) =>
      (e as Event)?.preventDefault?.()
    );

    mockUseLogin.mockReturnValue({
      formik: { ...baseFormik, isValid: true, dirty: true, handleSubmit },
      errorMsg: null,
      loading: false,
    });

    render(<LoginForm />);
    fireEvent.submit(
      screen.getByRole("button", { name: /login/i }).closest("form")!
    );

    expect(handleSubmit).toHaveBeenCalled();
  });
});
