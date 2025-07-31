import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import debounce from "lodash.debounce";
import { useLazyQuery } from "@apollo/client";

import { GET_PRODUCTS } from "@/graphql/queries/products";
import type { ProductEdge, ProductsResponse } from "@/types/products.type";

export function useProductListing() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [products, setProducts] = useState<ProductEdge[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [fetchProducts, { loading }] = useLazyQuery<ProductsResponse>(
    GET_PRODUCTS,
    {
      onCompleted: (data) => {
        setProducts((prev) => [...prev, ...data.products.edges]);
        setCursor(data.products.pageInfo.endCursor);
        setHasNextPage(data.products.pageInfo.hasNextPage);
      },
    }
  );

  const normalizeFiltersToAttributes = useCallback(
    (selectedFilters: Record<string, string[]>) =>
      Object.entries(selectedFilters).flatMap(([key, values]) =>
        values.length
          ? [
              {
                slug: key.toLowerCase(),
                values: values.map((v) => v.toLowerCase()),
              },
            ]
          : []
      ),
    []
  );

  const loadProducts = useCallback(() => {
    if (hasNextPage && !loading) {
      fetchProducts({
        variables: {
          channel: "online-inr",
          attributes: normalizeFiltersToAttributes(selectedFilters),
          search: searchQuery,
          after: cursor,
        },
      });
    }
  }, [
    fetchProducts,
    selectedFilters,
    searchQuery,
    cursor,
    hasNextPage,
    loading,
  ]);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setProducts([]);
      setCursor(null);
      setHasNextPage(true);
      setSearchQuery(value);
    }, 300),
    []
  );

  const handleFilterChange = useCallback(
    (category: string, value: string) => {
      setProducts([]);
      setCursor(null);
      setHasNextPage(true);
      setSelectedFilters((prev) => {
        const current = prev[category] ?? [];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [category]: updated };
      });
      if (isMobile) setShowFilterDrawer(false);
    },
    [isMobile]
  );

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchTerm(e.target.value);
      handleSearch(e.target.value);
    },
    []
  );

  const displayFilterDrawer = useCallback(() => setShowFilterDrawer(true), []);
  const hideFilterDrawer = useCallback(() => setShowFilterDrawer(false), []);

  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedFilters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage) {
          loadProducts();
        }
      },
      { threshold: 1 }
    );
    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loadProducts, hasNextPage]);

  return {
    products,
    loaderRef,
    isMobile,
    searchTerm,
    selectedFilters,
    showFilterDrawer,
    loading,
    hasNextPage,
    onSearch,
    handleFilterChange,
    displayFilterDrawer,
    hideFilterDrawer,
    loadProducts,
  };
}
