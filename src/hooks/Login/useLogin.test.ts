import { renderHook, act, waitFor } from "@testing-library/react";
import Cookies from "js-cookie";
import { useMutation } from "@apollo/client";

import { useLogin } from "./useLogin";

import type { LoginResponse } from "@/types/login.type";

jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useMutation: jest.fn(),
}));

jest.mock("js-cookie", () => ({
  set: jest.fn(),
  get: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/context/AuthContext/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockReqLogin = jest.fn();
const mockLogin = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();

describe("useLogin hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useMutation as jest.Mock).mockReturnValue([
      mockReqLogin,
      { loading: false },
    ]);

    const { useAuth } = jest.requireMock("@/context/AuthContext/AuthContext");
    useAuth.mockReturnValue({ login: mockLogin });

    const { useRouter } = jest.requireMock("next/navigation");
    useRouter.mockReturnValue({ push: mockPush, replace: mockReplace });

    (Cookies.get as jest.Mock).mockReturnValue(undefined);
  });

  it("initializes with empty errorMsg and formik values", () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.errorMsg).toBe("");
    expect(result.current.formik.values).toEqual({ email: "", password: "" });
  });

  it("handles successful login", () => {
    renderHook(() => useLogin());

    const fakeResponse: LoginResponse = {
      tokenCreate: {
        errors: [],
        token: "abc123",
        user: {
          email: "test@example.com",
          userPermissions: [{ code: "READ" }],
          isStaff: true,
        },
      },
    };

    act(() => {
      (useMutation as jest.Mock).mock.calls[0][1].onCompleted(fakeResponse);
    });

    expect(mockLogin).toHaveBeenCalledWith("abc123", "test@example.com", [
      "READ",
    ]);
    expect(Cookies.set).toHaveBeenCalledWith("token", "abc123");
    expect(Cookies.set).toHaveBeenCalledWith(
      "permissions",
      JSON.stringify(["READ"])
    );
    expect(mockPush).toHaveBeenCalledWith("/products");
  });

  it("handles login errors returned by API", async () => {
    const { result } = renderHook(() => useLogin());

    const fakeResponse: LoginResponse = {
      tokenCreate: {
        errors: [{ message: "Invalid credentials", field: "email" }],
        token: null,
        user: null,
      },
    };

    act(() => {
      (useMutation as jest.Mock).mock.calls[0][1].onCompleted(fakeResponse);
    });

    await waitFor(() => {
      expect(result.current.errorMsg).toBe("Invalid credentials");
    });
  });

  it("handles invalid token response", async () => {
    const { result } = renderHook(() => useLogin());

    const fakeResponse: LoginResponse = {
      tokenCreate: {
        errors: [],
        token: null,
        user: null,
      },
    };

    act(() => {
      (useMutation as jest.Mock).mock.calls[0][1].onCompleted(fakeResponse);
    });

    await waitFor(() => {
      expect(result.current.errorMsg).toBe("Login failed: Invalid token");
    });
  });

  it("handles mutation error", async () => {
    const { result } = renderHook(() => useLogin());

    const fakeError = new Error("Network error");

    act(() => {
      (useMutation as jest.Mock).mock.calls[0][1].onError(fakeError);
    });

    await waitFor(() => {
      expect(result.current.errorMsg).toBe("Login failed. Try again.");
    });
  });

  it("redirects immediately if token cookie exists", () => {
    (Cookies.get as jest.Mock).mockReturnValue("existing-token");

    renderHook(() => useLogin());

    expect(mockReplace).toHaveBeenCalledWith("/products");
  });

  it("calls reqLogin when form is submitted", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.formik.setValues({
        email: "user@test.com",
        password: "secret",
      });
    });

    await act(async () => {
      await result.current.formik.submitForm();
    });

    expect(mockReqLogin).toHaveBeenCalledWith({
      variables: { email: "user@test.com", password: "secret" },
    });
  });
});
