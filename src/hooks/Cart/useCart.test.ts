import { renderHook, act } from "@testing-library/react";
import { useQuery, useMutation } from "@apollo/client";

import { useCart } from "./useCart";

import { useCart as useCartContext } from "@/context/CartContext/CartContext";
import type { GetCheckoutResponse } from "@/types/cart.type";

jest.mock("@apollo/client");

jest.mock("@/context/CartContext/CartContext", () => ({
  useCart: jest.fn(),
}));

const mockUseQuery = useQuery as jest.Mock;
const mockUseMutation = useMutation as jest.Mock;
const mockUseCartContext = useCartContext as jest.Mock;

describe("useCart hook", () => {
  const refetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCartContext.mockReturnValue({ checkoutToken: "test-token" });

    mockUseQuery.mockReturnValue({
      data: { checkout: { id: "chk1", lines: [] } } as GetCheckoutResponse,
      loading: false,
      error: undefined,
      refetch,
    });

    mockUseMutation.mockReturnValue([jest.fn()]);
  });

  it("returns checkout data from query", () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.checkoutToken).toBe("test-token");
    expect(result.current.checkout).toEqual({ id: "chk1", lines: [] });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("skips query if no checkout token", () => {
    mockUseCartContext.mockReturnValueOnce({ checkoutToken: null });

    renderHook(() => useCart());

    expect(mockUseQuery).toHaveBeenCalledTimes(1);
    expect(mockUseQuery.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        variables: { token: null },
        skip: true,
        fetchPolicy: "cache-and-network",
      })
    );
  });

  it("updates quantity when valid newQty is passed", async () => {
    const updateCartLine = jest.fn();
    mockUseMutation
      .mockReturnValueOnce([updateCartLine])
      .mockReturnValueOnce([jest.fn()]);

    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.handleUpdateQuantity("var1", 3);
    });

    expect(updateCartLine).toHaveBeenCalledWith({
      variables: {
        token: "test-token",
        lines: [{ variantId: "var1", quantity: 3 }],
      },
    });
    expect(refetch).toHaveBeenCalled();
  });

  it("does not update quantity if newQty < 1", async () => {
    const updateCartLine = jest.fn();
    mockUseMutation
      .mockReturnValueOnce([updateCartLine])
      .mockReturnValueOnce([jest.fn()]);

    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.handleUpdateQuantity("var1", 0);
    });

    expect(updateCartLine).not.toHaveBeenCalled();
    expect(refetch).not.toHaveBeenCalled();
  });

  it("removes line from cart", async () => {
    const removeCartLine = jest.fn();
    mockUseMutation
      .mockReturnValueOnce([jest.fn()])
      .mockReturnValueOnce([removeCartLine]);

    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.handleRemove("line-123");
    });

    expect(removeCartLine).toHaveBeenCalledWith({
      variables: {
        token: "test-token",
        linesIds: ["line-123"],
      },
    });
    expect(refetch).toHaveBeenCalled();
  });
});
