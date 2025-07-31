"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { ProductListing } from "@/components/Products/ProductListing/ProductListing";

export default function ProductsPage() {
  const router = useRouter();

  const onProductView = useCallback(
    (id: string) => router.push(`/products/${id}`),
    []
  );

  return <ProductListing onProductView={onProductView} />;
}
