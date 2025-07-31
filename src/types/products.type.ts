type ProductMedia = {
  id: string;
  url: string;
  alt: string;
};

type ProductVariant = {
  id: string;
  name: string;
};

type ProductNode = {
  id: string;
  name: string;
  media?: ProductMedia[];
  variants?: ProductVariant[];
};

export type ProductEdge = {
  node: ProductNode;
};

type PageInfo = {
  endCursor: string | null;
  hasNextPage: boolean;
};

export type ProductsResponse = {
  products: {
    edges: ProductEdge[];
    pageInfo: PageInfo;
  };
};
