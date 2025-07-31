import { renderHook, act } from "@testing-library/react";
import { useQuery, useMutation } from "@apollo/client";

import { useCheckout } from "./useCheckout";

import { useCart } from "@/context/CartContext/CartContext";

jest.mock("@apollo/client");
jest.mock("@/context/CartContext/CartContext", () => ({
  useCart: jest.fn(),
}));

const mockUseQuery = useQuery as jest.Mock;
const mockUseMutation = useMutation as jest.Mock;
const mockUseCart = useCart as jest.Mock;

describe("useCheckout hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCart.mockReturnValue({ checkoutToken: "token-123" });

    mockUseQuery.mockReturnValue({
      data: {
        checkout: {
          id: "chk1",
          totalPrice: { gross: { amount: 100 } },
          shippingAddress: { firstName: "" },
          billingAddress: { lastName: "" },
          shippingMethod: null,
        },
      },
      loading: false,
      error: undefined,
    });

    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: {} }),
    ]);
  });

  it("returns initial state from query", () => {
    const { result } = renderHook(() => useCheckout());
    expect(result.current.checkout?.id).toBe("chk1");
  });

  it("handles shippingMethodId change", () => {
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.handleShippingMethodIdChange({
        target: { value: "sm123" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.shippingMethodId).toBe("sm123");
  });
});
