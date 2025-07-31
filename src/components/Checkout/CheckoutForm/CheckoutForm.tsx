import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { CheckoutSkeleton } from "../CheckoutSkeleton/CheckoutSkeleton";

import { useCheckout } from "@/hooks/Checkout/useCheckout";

export function CheckoutForm() {
  const {
    checkoutToken,
    loading,
    error,
    formik,
    checkout,
    shippingMethodId,
    handleShippingMethod,
    handlePayment,
    handleComplete,
    handleShippingMethodIdChange,
  } = useCheckout();

  if (!checkoutToken) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography>No checkout found.</Typography>
      </Container>
    );
  }

  if (loading && !checkout) {
    return <CheckoutSkeleton />;
  }

  if (error || !checkout) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography color="error">Failed to load checkout.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Box mb={4} component="form" onSubmit={formik.handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Shipping & Billing Address
        </Typography>
        <Box display="grid" gap={2} gridTemplateColumns="1fr 1fr">
          <TextField
            label="First Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Box>
        <TextField
          fullWidth
          label="Street Address"
          name="streetAddress1"
          value={formik.values.streetAddress1}
          onChange={formik.handleChange}
          error={
            formik.touched.streetAddress1 &&
            Boolean(formik.errors.streetAddress1)
          }
          helperText={
            formik.touched.streetAddress1 && formik.errors.streetAddress1
          }
          sx={{ mt: 2 }}
        />
        <Box display="grid" gap={2} gridTemplateColumns="1fr 1fr" mt={2}>
          <TextField
            label="City"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
          />
          <TextField
            label="State"
            name="countryArea"
            value={formik.values.countryArea}
            onChange={formik.handleChange}
            error={
              formik.touched.countryArea && Boolean(formik.errors.countryArea)
            }
            helperText={formik.touched.countryArea && formik.errors.countryArea}
          />
        </Box>
        <TextField
          label="Postal Code"
          name="postalCode"
          value={formik.values.postalCode}
          onChange={formik.handleChange}
          error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
          helperText={formik.touched.postalCode && formik.errors.postalCode}
          sx={{ mt: 2 }}
        />
        <Button variant="outlined" sx={{ mt: 2 }} type="submit">
          Save Address
        </Button>
      </Box>

      {/* Shipping */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Shipping Method
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Select Method</InputLabel>
          <Select
            value={shippingMethodId}
            label="Shipping Method"
            onChange={handleShippingMethodIdChange}
          >
            {checkout.availableShippingMethods.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name} – ₹{m.price.amount}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={handleShippingMethod}
        >
          Set Shipping Method
        </Button>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        {checkout.lines.map((line) => (
          <Box
            key={line.id}
            display="flex"
            justifyContent="space-between"
            mb={1}
          >
            <Typography>
              {line.variant.product.name} ({line.variant.name}) ×{" "}
              {line.quantity}
            </Typography>
            <Typography>
              ₹{line.variant.pricing.price.gross.amount.toLocaleString("en-IN")}
            </Typography>
          </Box>
        ))}
        <Typography>
          Subtotal: ₹{checkout.subtotalPrice.gross.amount}
        </Typography>
        <Typography>
          Shipping: ₹{checkout.shippingPrice.gross.amount}
        </Typography>
        <Typography variant="h6">
          Total: ₹{checkout.totalPrice.gross.amount}
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Payment
        </Typography>
        <Button variant="outlined" onClick={handlePayment}>
          Add Dummy Payment
        </Button>
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleComplete}
      >
        Place Order
      </Button>
    </Container>
  );
}
