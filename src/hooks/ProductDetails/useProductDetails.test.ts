import { renderHook, act, waitFor } from "@testing-library/react";
import { useMutation, useQuery } from "@apollo/client";

import { useProductDetails } from "./useProductDetails";

import {
  ADD_TO_CART,
  UPDATE_CART_LINE,
  REMOVE_CART_LINE,
} from "@/graphql/mutations/cart";
import type { ProductVariant } from "@/types/productDetails.type";

jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

jest.mock("@/context/AuthContext/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/context/CartContext/CartContext", () => ({
  useCart: jest.fn(),
}));

const mockUseQuery = useQuery as jest.Mock;
const mockUseMutation = useMutation as jest.Mock;
const mockUseParams = jest.requireMock("next/navigation")
  .useParams as jest.Mock;
const mockUseAuth = jest.requireMock("@/context/AuthContext/AuthContext")
  .useAuth as jest.Mock;
const mockUseCart = jest.requireMock("@/context/CartContext/CartContext")
  .useCart as jest.Mock;

let mockAddToCart: jest.Mock;
let mockUpdateCartLine: jest.Mock;
let mockRemoveCartLine: jest.Mock;

const makeVariant = (id: string): ProductVariant =>
  ({
    id,
    name: `Variant ${id}`,
    sku: `sku-${id}`,
    pricing: null,
    attributes: [],
  } as ProductVariant);

describe("useProductDetails hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockAddToCart = jest.fn();
    mockUpdateCartLine = jest.fn();
    mockRemoveCartLine = jest.fn();

    mockUseMutation.mockImplementation((mutation) => {
      if (mutation === ADD_TO_CART) return [mockAddToCart];
      if (mutation === UPDATE_CART_LINE) return [mockUpdateCartLine];
      if (mutation === REMOVE_CART_LINE) return [mockRemoveCartLine];
      return [jest.fn()];
    });

    mockUseParams.mockReturnValue({ id: "prod-123" });
    mockUseAuth.mockReturnValue({ email: "test@example.com" });

    mockUseQuery.mockReturnValue({
      data: {
        product: {
          id: "prod-123",
          defaultVariant: makeVariant("var-1"),
        },
      },
      loading: false,
      error: undefined,
    });

    mockUseCart.mockReturnValue({
      cart: {},
      checkoutToken: null,
      updateCart: jest.fn(),
      updateCheckoutToken: jest.fn(),
    });
  });

  it("returns product data and default variant", () => {
    const { result } = renderHook(() => useProductDetails());
    expect(result.current.data?.product?.id).toBe("prod-123");
    expect(result.current.selectedVariant?.id).toBe("var-1");
  });

  it("adds to cart when no checkoutToken exists", async () => {
    const mockUpdateCart = jest.fn();
    const mockUpdateCheckoutToken = jest.fn();
    mockUseCart.mockReturnValue({
      cart: {},
      checkoutToken: null,
      updateCart: mockUpdateCart,
      updateCheckoutToken: mockUpdateCheckoutToken,
    });

    mockAddToCart.mockResolvedValue({
      data: {
        checkoutCreate: {
          checkout: {
            token: "chk-123",
            lines: [{ id: "line-1", quantity: 1, variant: { id: "var-1" } }],
          },
        },
      },
    });

    const { result } = renderHook(() => useProductDetails());

    await act(async () => {
      await result.current.handleIncrement();
    });

    await waitFor(() => {
      expect(mockUpdateCheckoutToken).toHaveBeenCalledWith("chk-123");
      expect(mockUpdateCart).toHaveBeenCalledWith({
        "var-1": { quantity: 1, lineId: "line-1" },
      });
    });
  });

  it("updates cart line when checkoutToken exists", async () => {
    const mockUpdateCart = jest.fn();
    mockUseCart.mockReturnValue({
      cart: { "var-1": { quantity: 1, lineId: "line-1" } },
      checkoutToken: "chk-123",
      updateCart: mockUpdateCart,
      updateCheckoutToken: jest.fn(),
    });

    mockUpdateCartLine.mockResolvedValue({
      data: {
        checkoutLinesUpdate: {
          checkout: {
            lines: [{ id: "line-1", quantity: 2, variant: { id: "var-1" } }],
          },
        },
      },
    });

    const { result } = renderHook(() => useProductDetails());

    await act(async () => {
      await result.current.handleIncrement();
    });

    await waitFor(() => {
      expect(mockUpdateCartLine).toHaveBeenCalledWith({
        variables: {
          token: "chk-123",
          lines: [{ quantity: 2, variantId: "var-1" }],
        },
      });
      expect(mockUpdateCart).toHaveBeenCalledWith({
        "var-1": { quantity: 2, lineId: "line-1" },
      });
    });
  });

  it("removes line if decrement goes to zero", async () => {
    const mockUpdateCart = jest.fn();
    mockUseCart.mockReturnValue({
      cart: { "var-1": { quantity: 1, lineId: "line-1" } },
      checkoutToken: "chk-123",
      updateCart: mockUpdateCart,
      updateCheckoutToken: jest.fn(),
    });

    const { result } = renderHook(() => useProductDetails());

    await act(async () => {
      await result.current.handleDecrement();
    });

    await waitFor(() => {
      expect(mockRemoveCartLine).toHaveBeenCalledWith({
        variables: { token: "chk-123", linesIds: ["line-1"] },
      });
      expect(mockUpdateCart).toHaveBeenCalledWith({});
    });
  });

  it("updates line if decrement but not zero", async () => {
    const mockUpdateCart = jest.fn();
    mockUseCart.mockReturnValue({
      cart: { "var-1": { quantity: 3, lineId: "line-1" } },
      checkoutToken: "chk-123",
      updateCart: mockUpdateCart,
      updateCheckoutToken: jest.fn(),
    });

    mockUpdateCartLine.mockResolvedValue({
      data: {
        checkoutLinesUpdate: {
          checkout: {
            lines: [{ id: "line-1", quantity: 2, variant: { id: "var-1" } }],
          },
        },
      },
    });

    const { result } = renderHook(() => useProductDetails());

    await act(async () => {
      await result.current.handleDecrement();
    });

    await waitFor(() => {
      expect(mockUpdateCartLine).toHaveBeenCalledWith({
        variables: {
          token: "chk-123",
          lines: [{ quantity: 2, variantId: "var-1" }],
        },
      });
      expect(mockUpdateCart).toHaveBeenCalledWith({
        "var-1": { quantity: 2, lineId: "line-1" },
      });
    });
  });

  it("updates selectedVariant manually", () => {
    const { result } = renderHook(() => useProductDetails());
    const variant = makeVariant("var-2");

    act(() => {
      result.current.updateSelectedVariant(variant);
    });

    expect(result.current.selectedVariant).toEqual(variant);
  });
});
