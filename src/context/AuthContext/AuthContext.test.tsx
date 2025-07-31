import React from "react";
import { renderHook, act } from "@testing-library/react";
import Cookies from "js-cookie";

import { useAuth, AuthProvider } from "./AuthContext";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/",
}));

describe("AuthProvider / useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it("throws error if useAuth used outside provider", () => {
    const renderOutsideProvider = () => {
      renderHook(() => useAuth()); // will throw here
    };

    expect(renderOutsideProvider).toThrow(
      "Component is not wrapped in AuthProvider"
    );
  });

  it("initializes with token from cookies", () => {
    (Cookies.get as jest.Mock).mockReturnValueOnce("cookie-token");

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.token).toBe("cookie-token");
    expect(result.current.isLoggedIn).toBe(true);
  });

  it("login sets token, email, and cookies", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login("abc123", "user@test.com", ["READ", "WRITE"]);
    });

    expect(result.current.token).toBe("abc123");
    expect(result.current.email).toBe("user@test.com");
    expect(Cookies.set).toHaveBeenCalledWith("token", "abc123", { expires: 1 });
    expect(Cookies.set).toHaveBeenCalledWith("userEmail", "user@test.com", {
      expires: 1,
    });
    expect(Cookies.set).toHaveBeenCalledWith(
      "permissions",
      JSON.stringify(["READ", "WRITE"]),
      { expires: 1 }
    );
  });

  it("logout removes cookies and navigates to /login", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(Cookies.remove).toHaveBeenCalledWith("token");
    expect(Cookies.remove).toHaveBeenCalledWith("permissions");
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("isLoggedIn is false when no token", () => {
    (Cookies.get as jest.Mock).mockReturnValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.token).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
  });
});
