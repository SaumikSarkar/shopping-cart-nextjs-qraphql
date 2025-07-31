import { render, screen } from "@testing-library/react";

import LoginPage from "./page";

jest.mock("@/components/Login/LoginForm/LoginForm", () => ({
  LoginForm: () => <div data-testid="mock-login-form">Mock LoginForm</div>,
}));

describe("LoginPage", () => {
  it("renders the LoginForm component", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("mock-login-form")).toBeInTheDocument();
  });
});
