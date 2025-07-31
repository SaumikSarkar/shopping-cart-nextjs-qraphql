import { renderHook, act, waitFor } from "@testing-library/react";
import { useLazyQuery } from "@apollo/client";

import { useProductListing } from "./useProductListing";

import type { ProductsResponse, ProductEdge } from "@/types/products.type";

beforeAll(() => {
  class MockIntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }
  (
    global as unknown as {
      IntersectionObserver: typeof MockIntersectionObserver;
    }
  ).IntersectionObserver = MockIntersectionObserver;
});

jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useLazyQuery: jest.fn(),
}));

jest.mock("@mui/material", () => ({
  useTheme: jest.fn().mockReturnValue({
    breakpoints: { down: jest.fn().mockReturnValue("md") },
  }),
  useMediaQuery: jest.fn().mockReturnValue(false), // default: not mobile
}));

jest.mock("lodash.debounce", () => (fn: (...args: unknown[]) => void) => fn);

const mockUseLazyQuery = useLazyQuery as jest.Mock;

describe("useProductListing hook", () => {
  let mockFetchProducts: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFetchProducts = jest.fn();

    mockUseLazyQuery.mockImplementation((_query: unknown) => [
      mockFetchProducts,
      { loading: false },
    ]);
  });

  it("initializes with default state", () => {
    const { result } = renderHook(() => useProductListing());

    expect(result.current.products).toEqual([]);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.selectedFilters).toEqual({});
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.showFilterDrawer).toBe(false);
  });

  it("triggers search and updates searchQuery (debounced)", () => {
    const { result } = renderHook(() => useProductListing());

    act(() => {
      result.current.onSearch({
        target: { value: "laptop" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.searchTerm).toBe("laptop");
  });

  it("toggles filters and closes drawer on mobile", () => {
    jest.requireMock("@mui/material").useMediaQuery.mockReturnValueOnce(true);

    const { result } = renderHook(() => useProductListing());

    act(() => {
      result.current.handleFilterChange("color", "red");
    });

    expect(result.current.selectedFilters.color).toContain("red");
    expect(result.current.showFilterDrawer).toBe(false);
  });

  it("toggles drawer open/close", () => {
    const { result } = renderHook(() => useProductListing());

    act(() => result.current.displayFilterDrawer());
    expect(result.current.showFilterDrawer).toBe(true);

    act(() => result.current.hideFilterDrawer());
    expect(result.current.showFilterDrawer).toBe(false);
  });

  it("calls fetchProducts on loadProducts when hasNextPage is true", () => {
    const { result } = renderHook(() => useProductListing());

    act(() => {
      result.current.loadProducts();
    });

    expect(mockFetchProducts).toHaveBeenCalled();
  });

  it("appends products on query completion", () => {
    const { result } = renderHook(() => useProductListing());

    const fakeProducts: ProductsResponse = {
      products: {
        edges: [
          {
            node: { id: "p1", name: "Product 1" },
            cursor: "c1",
          } as ProductEdge,
        ],
        pageInfo: { endCursor: "c1", hasNextPage: false },
      },
    };

    const onCompleted = mockUseLazyQuery.mock.calls[0][1].onCompleted as (
      data: ProductsResponse
    ) => void;

    act(() => {
      onCompleted(fakeProducts);
    });

    expect(result.current.products).toEqual(fakeProducts.products.edges);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("stops fetching when hasNextPage is false", async () => {
    const { result } = renderHook(() => useProductListing());

    await waitFor(() => {
      expect(mockFetchProducts).toHaveBeenCalled();
    });

    const onCompleted = mockUseLazyQuery.mock.calls[0][1].onCompleted as (
      data: ProductsResponse
    ) => void;

    act(() => {
      onCompleted({
        products: {
          edges: [],
          pageInfo: { endCursor: null, hasNextPage: false },
        },
      });
    });

    const baseline = mockFetchProducts.mock.calls.length;

    act(() => {
      result.current.loadProducts();
    });

    expect(mockFetchProducts.mock.calls.length).toBe(baseline);
  });
});
