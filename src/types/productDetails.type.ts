type Money = {
  amount: number;
  currency: string;
};

type Price = {
  gross: Money;
};

type ProductPricing = {
  priceUndiscounted: Price;
  price: Price;
};

type VariantAttribute = {
  attribute: {
    id: string;
    name: string;
  };
  values: { id: string; name: string }[];
};

export type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  pricing?: { price: Price };
  attributes: VariantAttribute[];
};

export type ProductMedia = {
  id: string;
  url: string;
  alt?: string;
  type?: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  defaultVariant?: ProductVariant & { pricing?: ProductPricing };
  variants: ProductVariant[];
  media: ProductMedia[];
};

export type GetProductResponse = {
  product: Product;
};
