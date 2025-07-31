import { Box, Container, Typography } from "@mui/material";

import { ProductCarousal } from "../ProductCarousal/ProductCarousal";
import { ProductInfo } from "../ProductInfo/ProductInfo";

import { useProductDetails } from "@/hooks/ProductDetails/useProductDetails";

export function Product() {
  const {
    data,
    cart,
    loading,
    error,
    selectedVariant,
    handleIncrement,
    handleDecrement,
    updateSelectedVariant,
  } = useProductDetails();

  if (error ?? (!data?.product && !loading)) {
    return (
      <Box mt={10} textAlign="center">
        <Typography variant="h6" color="error">
          Product not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={6}>
        <ProductCarousal
          loading={loading}
          media={data?.product?.media}
          name={data?.product?.name}
        />
        <ProductInfo
          loading={loading}
          name={data?.product?.name}
          description={data?.product?.description}
          selectedVariant={selectedVariant}
          variants={data?.product?.variants}
          quantity={
            selectedVariant ? cart[selectedVariant.id]?.quantity ?? 0 : 0
          }
          price={selectedVariant?.pricing?.price?.gross.amount}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          updateSelectedVariant={updateSelectedVariant}
        />
      </Box>
    </Container>
  );
}
