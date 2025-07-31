import React from "react";
import { renderHook, act } from "@testing-library/react";
import Cookies from "js-cookie";

import { CartProvider, useCart } from "./CartContext";

import type { CartState } from "@/types/cart.type";

// --- Mocks ---
jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

describe("CartContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <CartProvider>{children}</CartProvider>
  );

  it("throws error if used outside provider", () => {
    const { result } = renderHook(() => {
      try {
        return useCart();
      } catch (e) {
        return e;
      }
    });
    expect(result.current).toEqual(
      new Error("Component is not wrapped in CartProvider")
    );
  });

  it("initializes with empty cart and null checkoutToken if no cookies", () => {
    (Cookies.get as jest.Mock).mockReturnValueOnce(null); // for checkoutToken
    (Cookies.get as jest.Mock).mockReturnValueOnce(null); // for cart

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart).toEqual({});
    expect(result.current.checkoutToken).toBeNull();
  });

  it("loads cart and checkoutToken from cookies on mount", () => {
    (Cookies.get as jest.Mock).mockImplementation((key: string) => {
      if (key === "checkoutToken") return "chk-123";
      if (key === "cart") return JSON.stringify({ v1: { quantity: 2 } });
      return null;
    });

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.checkoutToken).toBe("chk-123");
    expect(result.current.cart).toEqual({ v1: { quantity: 2 } });
  });

  it("updates cart and persists to cookies", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const newCart: CartState = { v1: { quantity: 3, lineId: "l1" } };

    act(() => {
      result.current.updateCart(newCart);
    });

    expect(result.current.cart).toEqual(newCart);
    expect(Cookies.set).toHaveBeenCalledWith("cart", JSON.stringify(newCart));
  });

  it("updates checkoutToken and persists to cookies", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.updateCheckoutToken("chk-999");
    });

    expect(result.current.checkoutToken).toBe("chk-999");
    expect(Cookies.set).toHaveBeenCalledWith("checkoutToken", "chk-999");
  });
});
