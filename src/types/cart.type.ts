type CartLine = {
  quantity: number;
  lineId: string;
};

export type CartState = Record<string, CartLine>;

export type Money = {
  amount: number;
  currency: string;
};

export type TaxedMoney = {
  gross: Money;
};

type Product = {
  id: string;
  name: string;
};

type ProductVariant = {
  id: string;
  name: string;
  product: Product;
  pricing: { price: TaxedMoney };
};

export type CheckoutLine = {
  id: string;
  quantity: number;
  variant: ProductVariant;
};

type Checkout = {
  id: string;
  token: string;
  lines: CheckoutLine[];
  subtotalPrice: TaxedMoney;
  shippingPrice: TaxedMoney;
  totalPrice: TaxedMoney;
};

export type GetCheckoutResponse = {
  checkout: Checkout | null;
};
