import { render, screen } from "@testing-library/react";

import { ProductCarousal } from "./ProductCarousal";

jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/navigation", () => ({}));

jest.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="slide">{children}</div>
  ),
}));

jest.mock("swiper/modules", () => ({
  Navigation: {},
}));

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Skeleton: () => <div>Skeleton</div>,
}));

describe("ProductCarousal", () => {
  const baseProps = {
    name: "Test Product",
    loading: false,
  };

  it("renders skeleton when loading", () => {
    render(<ProductCarousal {...baseProps} loading={true} media={[]} />);

    expect(screen.getByText(/Skeleton/)).toBeInTheDocument();
    expect(screen.queryByTestId("swiper")).not.toBeInTheDocument();
  });

  it("renders images when media is provided", () => {
    const media = [
      { id: "1", url: "img1.jpg", alt: "First" },
      { id: "2", url: "img2.jpg", alt: "Second" },
    ];

    render(<ProductCarousal {...baseProps} media={media} />);

    const slides = screen.getAllByTestId("slide");
    expect(slides).toHaveLength(2);
    expect(screen.getByAltText("First")).toBeInTheDocument();
    expect(screen.getByAltText("Second")).toBeInTheDocument();
  });

  it("renders fallback when no media is provided", () => {
    render(<ProductCarousal {...baseProps} media={[]} />);

    expect(screen.getByText(/no images/i)).toBeInTheDocument();
  });

  it("renders navigation buttons when not loading", () => {
    render(<ProductCarousal {...baseProps} media={[]} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });
});
