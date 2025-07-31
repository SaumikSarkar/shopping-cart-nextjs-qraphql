import { Box, IconButton, Typography } from "@mui/material";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useCallback } from "react";

import type { CheckoutLine } from "@/types/cart.type";

type CartItemProps = Readonly<{
  line: CheckoutLine;
  handleUpdateQuantity: (variantId: string, newQty: number) => Promise<void>;
  handleRemove: (lineId: string) => Promise<void>;
}>;

export function CartItem({
  line,
  handleUpdateQuantity,
  handleRemove,
}: CartItemProps) {
  const onDecrement = useCallback(
    () => handleUpdateQuantity(line.variant.id, Math.max(line.quantity - 1, 1)),
    [line]
  );

  const onIncrement = useCallback(
    () => handleUpdateQuantity(line.variant.id, line.quantity + 1),
    [line]
  );

  const onRemove = useCallback(() => handleRemove(line.id), [line]);

  return (
    <Box
      key={line.id}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      borderRadius={2}
      mb={2}
      sx={{ background: "#fafafa", boxShadow: 1 }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Box>
          <Typography variant="subtitle1">
            {line.variant.product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {line.variant.name}
          </Typography>
          <Typography variant="body1" mt={1}>
            ₹{line.variant.pricing.price.gross.amount.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={onDecrement}>
          <FaMinus />
        </IconButton>
        <Typography>{line.quantity}</Typography>
        <IconButton onClick={onIncrement}>
          <FaPlus />
        </IconButton>
        <IconButton color="error" onClick={onRemove}>
          <FaTrash />
        </IconButton>
      </Box>
    </Box>
  );
}
