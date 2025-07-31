import {
  Box,
  Button,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import parse from "html-react-parser";
import { useCallback } from "react";

import type { ProductVariant } from "@/types/productDetails.type";

type ProductInfoProps = Readonly<{
  loading: boolean;
  name: string;
  description: string;
  selectedVariant: ProductVariant;
  quantity: number;
  variants: ProductVariant[];
  price: number;
  handleIncrement: () => void;
  handleDecrement: () => void;
  updateSelectedVariant: (value: ProductVariant) => void;
}>;

export function ProductInfo({
  loading,
  name,
  description,
  selectedVariant,
  quantity,
  variants,
  price,
  handleIncrement,
  handleDecrement,
  updateSelectedVariant,
}: ProductInfoProps) {
  const handleVariantChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = variants.find((v) => v.id === e.target.value);
      updateSelectedVariant(selected ?? null);
    },
    [updateSelectedVariant]
  );

  return (
    <Box flex={1} display="flex" flexDirection="column" gap={2}>
      {loading ? (
        <>
          <Skeleton width="60%" height={40} />
          <Skeleton variant="rectangular" height={100} />
          <Skeleton height={40} width="100%" />
          <Skeleton width="40%" height={40} />
          <Skeleton width="30%" height={50} />
        </>
      ) : (
        <>
          <Typography variant="h6">{name}</Typography>
          {description ? (
            <Box>{parse(description)}</Box>
          ) : (
            <Typography color="text.secondary">No description.</Typography>
          )}

          <Select
            fullWidth
            value={selectedVariant?.id ?? ""}
            onChange={handleVariantChange}
            sx={{ mt: 2 }}
            size="small"
          >
            {variants.map((v) => (
              <MenuItem key={v.id} value={v.id}>
                {v.name}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="h6" mt={2}>
            ₹{price?.toLocaleString("en-IN") ?? "N/A"}
          </Typography>

          {quantity === 0 ? (
            <Button variant="contained" size="large" onClick={handleIncrement}>
              Add to Cart
            </Button>
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              <Button variant="outlined" onClick={handleDecrement}>
                –
              </Button>
              <Typography>{quantity}</Typography>
              <Button variant="outlined" onClick={handleIncrement}>
                +
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
