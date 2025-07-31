import { render, screen, fireEvent } from "@testing-library/react";

import UnauthorizedPage from "./page";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("react-icons/ai", () => ({
  AiOutlineWarning: () => <div data-testid="warning-icon" />,
}));

describe("UnauthorizedPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the unauthorized access warning", () => {
    render(<UnauthorizedPage />);

    expect(screen.getByText(/access denied/i)).toBeInTheDocument();

    expect(
      screen.getByText(/you do not have permission to view this page/i)
    ).toBeInTheDocument();

    expect(screen.getByTestId("warning-icon")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /go to login/i })
    ).toBeInTheDocument();
  });

  it("has an accessible alert role", () => {
    render(<UnauthorizedPage />);
    expect(
      screen.getByRole("alert", { name: /unauthorized access warning/i })
    ).toBeInTheDocument();
  });

  it("navigates to login when button is clicked", () => {
    render(<UnauthorizedPage />);

    fireEvent.click(screen.getByRole("button", { name: /go to login/i }));
    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});
