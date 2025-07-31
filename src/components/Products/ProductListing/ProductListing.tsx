import {
  CircularProgress,
  Drawer,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import { MdFilterList, MdSearch } from "react-icons/md";

import { Filters } from "../Filters/Filters";
import { ProductCardSkeleton } from "../ProductCardSkeleton/ProductCardSkeleton";
import { NoResults } from "../../common/NoResults/NoResults";
import ProductCard from "../ProductCard/ProductCard";

import { useProductListing } from "@/hooks/Products/useProductListing";

type ProductListingProps = Readonly<{
  onProductView: (id: string) => void;
}>;

export function ProductListing({ onProductView }: ProductListingProps) {
  const {
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
  } = useProductListing();

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Let the shopping begin!
        </Typography>

        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1.5,
            mb: 3,
            border: "1px solid #ccc",
          }}
        >
          <MdSearch size={22} style={{ marginRight: 8 }} />
          <InputBase
            fullWidth
            placeholder="Search products..."
            value={searchTerm}
            onChange={onSearch}
          />
          {isMobile && (
            <IconButton onClick={displayFilterDrawer}>
              <MdFilterList size={24} />
            </IconButton>
          )}
        </Paper>

        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
          {!isMobile && (
            <Filters
              selectedFilters={selectedFilters}
              handleFilterChange={handleFilterChange}
            />
          )}

          <Drawer
            anchor="left"
            open={showFilterDrawer}
            onClose={hideFilterDrawer}
          >
            <Filters
              selectedFilters={selectedFilters}
              handleFilterChange={handleFilterChange}
            />
          </Drawer>

          <Box
            flex={1}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(auto-fill, minmax(200px, 1fr))",
              sm: "repeat(auto-fill, minmax(220px, 1fr))",
              md: "repeat(auto-fill, minmax(250px, 1fr))",
            }}
            gap={3}
          >
            {loading && products.length === 0 ? (
              Array.from({ length: 12 }).map((_, idx) => (
                <ProductCardSkeleton key={`skeleton-${idx}`} />
              ))
            ) : products.length === 0 ? (
              <NoResults />
            ) : (
              products.map(({ node }, idx) => (
                <ProductCard
                  key={`${node.id}-${idx}`}
                  id={node.id}
                  name={node.name}
                  imgUrl={node.media?.[0]?.url}
                  imgAlt={node.media?.[0]?.alt}
                  defaultVariant={node.variants?.[0]?.name}
                  onView={onProductView}
                />
              ))
            )}
          </Box>
        </Box>

        {hasNextPage && (
          <Box ref={loaderRef} mt={4} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Container>
  );
}
