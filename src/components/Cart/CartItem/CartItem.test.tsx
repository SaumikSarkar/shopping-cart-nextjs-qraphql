import { render, screen, fireEvent } from "@testing-library/react";

import { CartItem } from "./CartItem";

import type { CheckoutLine } from "@/types/cart.type";

describe("CartItem", () => {
  const mockHandleUpdateQuantity = jest.fn();
  const mockHandleRemove = jest.fn();

  const line: CheckoutLine = {
    id: "line1",
    quantity: 2,
    variant: {
      id: "v1",
      name: "Gold",
      product: { id: "ring", name: "Ring" },
      pricing: { price: { gross: { amount: 1000, currency: "INR" } } },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product details", () => {
    render(
      <CartItem
        line={line}
        handleUpdateQuantity={mockHandleUpdateQuantity}
        handleRemove={mockHandleRemove}
      />
    );

    expect(screen.getByText("Ring")).toBeInTheDocument();
    expect(screen.getByText("Gold")).toBeInTheDocument();
    expect(screen.getByText("₹1,000")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("calls handleUpdateQuantity with decremented quantity (not below 1)", () => {
    render(
      <CartItem
        line={line}
        handleUpdateQuantity={mockHandleUpdateQuantity}
        handleRemove={mockHandleRemove}
      />
    );

    const decrementBtn = screen.getAllByRole("button")[0];
    fireEvent.click(decrementBtn);

    expect(mockHandleUpdateQuantity).toHaveBeenCalledWith("v1", 1);

    render(
      <CartItem
        line={{ ...line, quantity: 1 }}
        handleUpdateQuantity={mockHandleUpdateQuantity}
        handleRemove={mockHandleRemove}
      />
    );
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(mockHandleUpdateQuantity).toHaveBeenCalledWith("v1", 1);
  });

  it("calls handleUpdateQuantity with incremented quantity", () => {
    render(
      <CartItem
        line={line}
        handleUpdateQuantity={mockHandleUpdateQuantity}
        handleRemove={mockHandleRemove}
      />
    );

    const incrementBtn = screen.getAllByRole("button")[1];
    fireEvent.click(incrementBtn);

    expect(mockHandleUpdateQuantity).toHaveBeenCalledWith("v1", 3);
  });

  it("calls handleRemove when trash is clicked", () => {
    render(
      <CartItem
        line={line}
        handleUpdateQuantity={mockHandleUpdateQuantity}
        handleRemove={mockHandleRemove}
      />
    );

    const removeBtn = screen.getAllByRole("button")[2];
    fireEvent.click(removeBtn);

    expect(mockHandleRemove).toHaveBeenCalledWith("line1");
  });
});
