import { render, screen, fireEvent } from "@testing-library/react";

import { ProductListing } from "./ProductListing";

jest.mock("@/hooks/Products/useProductListing", () => ({
  useProductListing: jest.fn(),
}));

jest.mock("../Filters/Filters", () => ({
  Filters: ({
    selectedFilters,
  }: {
    selectedFilters: Record<string, string[]>;
  }) => (
    <div data-testid="filters">
      Filters Component {JSON.stringify(selectedFilters)}
    </div>
  ),
}));

jest.mock("../ProductCardSkeleton/ProductCardSkeleton", () => ({
  ProductCardSkeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("../../common/NoResults/NoResults", () => ({
  NoResults: () => <div data-testid="no-results">No Results</div>,
}));

jest.mock("../ProductCard/ProductCard", () => ({
  __esModule: true,
  default: ({
    id,
    name,
    onView,
  }: {
    id: string;
    name: string;
    onView: (id: string) => void;
  }) => (
    <div data-testid={`product-${id}`} onClick={() => onView(id)}>
      {name}
    </div>
  ),
}));

import { useProductListing } from "@/hooks/Products/useProductListing";
const mockUseProductListing = useProductListing as jest.Mock;

describe("ProductListing", () => {
  const onProductView = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders skeletons when loading and no products", () => {
    mockUseProductListing.mockReturnValue({
      products: [],
      loaderRef: { current: null },
      isMobile: false,
      searchTerm: "",
      selectedFilters: {},
      showFilterDrawer: false,
      loading: true,
      hasNextPage: false,
      onSearch: jest.fn(),
      handleFilterChange: jest.fn(),
      displayFilterDrawer: jest.fn(),
      hideFilterDrawer: jest.fn(),
    });

    render(<ProductListing onProductView={onProductView} />);
    expect(screen.getAllByTestId("skeleton")).toHaveLength(12);
  });

  it("renders no results when products are empty", () => {
    mockUseProductListing.mockReturnValue({
      products: [],
      loaderRef: { current: null },
      isMobile: false,
      searchTerm: "",
      selectedFilters: {},
      showFilterDrawer: false,
      loading: false,
      hasNextPage: false,
      onSearch: jest.fn(),
      handleFilterChange: jest.fn(),
      displayFilterDrawer: jest.fn(),
      hideFilterDrawer: jest.fn(),
    });

    render(<ProductListing onProductView={onProductView} />);
    expect(screen.getByTestId("no-results")).toBeInTheDocument();
  });

  it("renders products when available", () => {
    mockUseProductListing.mockReturnValue({
      products: [{ node: { id: "p1", name: "Ring", media: [], variants: [] } }],
      loaderRef: { current: null },
      isMobile: false,
      searchTerm: "",
      selectedFilters: {},
      showFilterDrawer: false,
      loading: false,
      hasNextPage: false,
      onSearch: jest.fn(),
      handleFilterChange: jest.fn(),
      displayFilterDrawer: jest.fn(),
      hideFilterDrawer: jest.fn(),
    });

    render(<ProductListing onProductView={onProductView} />);
    expect(screen.getByTestId("product-p1")).toHaveTextContent("Ring");

    // simulate product click
    fireEvent.click(screen.getByTestId("product-p1"));
    expect(onProductView).toHaveBeenCalledWith("p1");
  });

  it("renders filters in sidebar when not mobile", () => {
    mockUseProductListing.mockReturnValue({
      products: [],
      loaderRef: { current: null },
      isMobile: false,
      searchTerm: "",
      selectedFilters: { color: ["red"] },
      showFilterDrawer: false,
      loading: false,
      hasNextPage: false,
      onSearch: jest.fn(),
      handleFilterChange: jest.fn(),
      displayFilterDrawer: jest.fn(),
      hideFilterDrawer: jest.fn(),
    });

    render(<ProductListing onProductView={onProductView} />);
    expect(screen.getByTestId("filters")).toHaveTextContent("color");
  });

  it("renders drawer with filters when mobile and open", () => {
    mockUseProductListing.mockReturnValue({
      products: [],
      loaderRef: { current: null },
      isMobile: true,
      searchTerm: "",
      selectedFilters: {},
      showFilterDrawer: true,
      loading: false,
      hasNextPage: false,
      onSearch: jest.fn(),
      handleFilterChange: jest.fn(),
      displayFilterDrawer: jest.fn(),
      hideFilterDrawer: jest.fn(),
    });

    render(<ProductListing onProductView={onProductView} />);
    expect(screen.getByTestId("filters")).toBeInTheDocument();
  });

  it("renders loader at bottom when hasNextPage is true", () => {
    mockUseProductListing.mockReturnValue({
      products: [{ node: { id: "p1", name: "Ring" } }],
      loaderRef: { current: null },
      isMobile: false,
      searchTerm: "",
      selectedFilters: {},
      showFilterDrawer: false,
      loading: false,
      hasNextPage: true,
      onSearch: jest.fn(),
      handleFilterChange: jest.fn(),
      displayFilterDrawer: jest.fn(),
      hideFilterDrawer: jest.fn(),
    });

    render(<ProductListing onProductView={onProductView} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
