"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { CartLayout } from "@/components/Cart/CartLayout/CartLayout";

export default function CartPage() {
  const router = useRouter();
  const onCheckout = useCallback(() => router.push("/checkout"), []);

  return <CartLayout onCheckout={onCheckout} />;
}
