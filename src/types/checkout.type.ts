import type { CheckoutLine, Money, TaxedMoney } from "./cart.type";

export type Address = {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  city: string;
  countryArea: string;
  postalCode: string;
  country: string;
};

type ShippingMethod = { id: string; name: string; price: Money };

export type Checkout = {
  id: string;
  token: string;
  email: string | null;
  shippingAddress?: Address;
  billingAddress?: Address;
  availableShippingMethods: ShippingMethod[];
  shippingMethod?: ShippingMethod;
  lines: CheckoutLine[];
  subtotalPrice: TaxedMoney;
  shippingPrice: TaxedMoney;
  totalPrice: TaxedMoney;
};

export type GetCheckoutResponse = {
  checkout: Checkout | null;
};
