import { Box, Button, Container, Divider, Typography } from "@mui/material";

import { CartSkeleton } from "../CartSkeleton/CartSkeleton";
import { CartItem } from "../CartItem/CartItem";

import { useCart } from "@/hooks/Cart/useCart";

type CartLayoutProps = Readonly<{
  onCheckout: () => void;
}>;

export function CartLayout({ onCheckout }: CartLayoutProps) {
  const {
    checkoutToken,
    checkout,
    loading,
    error,
    handleUpdateQuantity,
    handleRemove,
  } = useCart();

  if (!checkoutToken) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h6" textAlign="center">
          Your cart is empty.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return <CartSkeleton />;
  }

  if (error || !checkout) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Failed to load cart.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {checkout.lines.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          {checkout.lines.map((line) => (
            <CartItem
              line={line}
              handleUpdateQuantity={handleUpdateQuantity}
              handleRemove={handleRemove}
            />
          ))}

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Subtotal:</Typography>
            <Typography>
              ₹{checkout.subtotalPrice.gross.amount.toLocaleString("en-IN")}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Shipping:</Typography>
            <Typography>
              ₹{checkout.shippingPrice.gross.amount.toLocaleString("en-IN")}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" fontWeight="bold">
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">
              ₹{checkout.totalPrice.gross.amount.toLocaleString("en-IN")}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
            onClick={onCheckout}
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </Container>
  );
}
