import { render, screen, fireEvent } from "@testing-library/react";

import { CheckoutForm } from "./CheckoutForm";

jest.mock("../CheckoutSkeleton/CheckoutSkeleton", () => ({
  CheckoutSkeleton: () => <div data-testid="checkout-skeleton" />,
}));

jest.mock("@/hooks/Checkout/useCheckout", () => ({
  useCheckout: jest.fn(),
}));

import { useCheckout } from "@/hooks/Checkout/useCheckout";

const mockUseCheckout = useCheckout as jest.Mock;

describe("CheckoutForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders message when no checkout token", () => {
    mockUseCheckout.mockReturnValue({
      checkoutToken: null,
    });

    render(<CheckoutForm />);
    expect(screen.getByText(/no checkout found/i)).toBeInTheDocument();
  });

  it("renders CheckoutSkeleton when loading and no checkout", () => {
    mockUseCheckout.mockReturnValue({
      checkoutToken: "chk123",
      loading: true,
      checkout: null,
    });

    render(<CheckoutForm />);
    expect(screen.getByTestId("checkout-skeleton")).toBeInTheDocument();
  });

  it("renders error message when error or no checkout", () => {
    mockUseCheckout.mockReturnValue({
      checkoutToken: "chk123",
      loading: false,
      error: new Error("failed"),
      checkout: null,
    });

    render(<CheckoutForm />);
    expect(screen.getByText(/failed to load checkout/i)).toBeInTheDocument();
  });

  it("renders checkout form and order summary", () => {
    const handleShippingMethod = jest.fn();
    const handlePayment = jest.fn();
    const handleComplete = jest.fn();
    const handleShippingMethodIdChange = jest.fn();

    const formik = {
      values: {
        firstName: "",
        lastName: "",
        streetAddress1: "",
        city: "",
        countryArea: "",
        postalCode: "",
      },
      touched: {},
      errors: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn((e) => e.preventDefault()),
    };

    mockUseCheckout.mockReturnValue({
      checkoutToken: "chk123",
      loading: false,
      error: null,
      formik,
      shippingMethodId: "sm1",
      handleShippingMethod,
      handlePayment,
      handleComplete,
      handleShippingMethodIdChange,
      checkout: {
        availableShippingMethods: [
          { id: "sm1", name: "Fast", price: { amount: 50 } },
        ],
        lines: [
          {
            id: "line1",
            quantity: 2,
            variant: {
              id: "v1",
              name: "Small",
              product: { name: "Ring" },
              pricing: { price: { gross: { amount: 1000 } } },
            },
          },
        ],
        subtotalPrice: { gross: { amount: 2000 } },
        shippingPrice: { gross: { amount: 50 } },
        totalPrice: { gross: { amount: 2050 } },
      },
    });

    render(<CheckoutForm />);

    expect(
      screen.getByRole("heading", { name: /checkout/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /shipping & billing address/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/ring/i)).toBeInTheDocument();
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /total/i })).toBeInTheDocument();

    fireEvent.click(screen.getByText(/set shipping method/i));
    expect(handleShippingMethod).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/add dummy payment/i));
    expect(handlePayment).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /place order/i }));
    expect(handleComplete).toHaveBeenCalled();
  });
});
