import { render, screen, fireEvent } from "@testing-library/react";

import ProductCard from "./ProductCard";

describe("ProductCard", () => {
  const mockOnView = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product details", () => {
    render(
      <ProductCard
        id="p1"
        name="Diamond Ring"
        imgUrl="/img/ring.jpg"
        imgAlt="Ring"
        defaultVariant="18K Gold"
        onView={mockOnView}
      />
    );

    expect(screen.getByText("Diamond Ring")).toBeInTheDocument();
    expect(screen.getByText("18K Gold")).toBeInTheDocument();

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img).toHaveAttribute("src", "/img/ring.jpg");
    expect(img).toHaveAttribute("alt", "Ring");
  });

  it("calls onView with correct id when View button is clicked", () => {
    render(<ProductCard id="p42" name="Necklace" onView={mockOnView} />);

    fireEvent.click(screen.getByRole("button", { name: /view/i }));
    expect(mockOnView).toHaveBeenCalledWith("p42");
  });

  it("falls back to default props when not provided", () => {
    render(<ProductCard id="p2" name="Bracelet" onView={mockOnView} />);

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img).toHaveAttribute("src", "/assets/fallback.png");
    expect(img).toHaveAttribute("alt", "Product");

    expect(screen.getByText("Bracelet")).toBeInTheDocument();
  });

  it("sets fallback image on error", () => {
    render(
      <ProductCard
        id="p3"
        name="Earrings"
        imgUrl="/broken.jpg"
        onView={mockOnView}
      />
    );

    const img = screen.getByRole("img") as HTMLImageElement;

    fireEvent.error(img);

    expect(img.src).toContain("/assets/fallback.png");
  });
});
