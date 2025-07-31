import { render, screen, fireEvent } from "@testing-library/react";

import Header from "./Header";

jest.mock("next/image", () => {
  return function MockedImage(
    props: React.ImgHTMLAttributes<HTMLImageElement>
  ) {
    return <img {...props} alt={props.alt ?? "mocked-image"} />;
  };
});

jest.mock("next/link", () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
});

const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const logout = jest.fn();
jest.mock("@/context/AuthContext/AuthContext", () => ({
  useAuth: jest.fn(),
}));
import { useAuth } from "@/context/AuthContext/AuthContext";

type MockAuthReturn = {
  isLoggedIn: boolean;
  logout: jest.Mock;
};

const mockUseAuth = useAuth as unknown as jest.Mock<MockAuthReturn, []>;

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logo and home link", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false, logout });

    render(<Header />);
    expect(screen.getByAltText(/shop your jewel logo/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /shop your jewel logo/i })
    ).toHaveAttribute("href", "/");
  });

  it("does not render Cart and Logout when user is not logged in", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false, logout });

    render(<Header />);
    expect(screen.queryByText(/cart/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
  });

  it("renders Cart and Logout when user is logged in", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true, logout });

    render(<Header />);
    expect(screen.getByText(/cart/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it("calls router.push('/cart') when Cart is clicked", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true, logout });

    render(<Header />);
    fireEvent.click(screen.getByText(/cart/i));
    expect(push).toHaveBeenCalledWith("/cart");
  });

  it("calls logout when Logout is clicked", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true, logout });

    render(<Header />);
    fireEvent.click(screen.getByText(/logout/i));
    expect(logout).toHaveBeenCalled();
  });
});
