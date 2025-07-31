import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { GET_PRODUCT } from "@/graphql/queries/products";
import {
  ADD_TO_CART,
  REMOVE_CART_LINE,
  UPDATE_CART_LINE,
} from "@/graphql/mutations/cart";
import type {
  GetProductResponse,
  ProductVariant,
} from "@/types/productDetails.type";
import type { CartState } from "@/types/cart.type";
import { useCart } from "@/context/CartContext/CartContext";
import { useAuth } from "@/context/AuthContext/AuthContext";

export function useProductDetails() {
  const { id } = useParams();
  const { email } = useAuth();
  const { cart, checkoutToken, updateCart, updateCheckoutToken } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  const { data, loading, error } = useQuery<GetProductResponse>(GET_PRODUCT, {
    variables: { id: decodeURIComponent(id as string), channel: "online-inr" },
  });

  const [addToCart] = useMutation(ADD_TO_CART);
  const [updateCartLine] = useMutation(UPDATE_CART_LINE);
  const [removeCartLine] = useMutation(REMOVE_CART_LINE);

  const handleIncrement = useCallback(async () => {
    if (!selectedVariant) {
      return;
    }

    const existing = cart[selectedVariant.id];
    const newQty = (existing?.quantity ?? 0) + 1;

    if (!checkoutToken) {
      const res = await addToCart({
        variables: {
          input: {
            channel: "online-inr",
            lines: [{ quantity: 1, variantId: selectedVariant.id }],
            email,
          },
        },
      });

      const checkout = res.data?.checkoutCreate?.checkout;
      if (checkout?.token) {
        updateCheckoutToken(checkout.token);

        const line = checkout.lines.find(
          (l: { variant: { id: string } }) =>
            l.variant.id === selectedVariant.id
        );

        if (line) {
          const updated: CartState = {
            ...cart,
            [selectedVariant.id]: {
              quantity: line.quantity,
              lineId: line.id,
            },
          };
          updateCart(updated);
        }
      }
    } else {
      const res = await updateCartLine({
        variables: {
          token: checkoutToken,
          lines: [{ quantity: newQty, variantId: selectedVariant.id }],
        },
      });

      const checkout = res.data?.checkoutLinesUpdate?.checkout;

      if (checkout) {
        const line = checkout.lines.find(
          (l: { variant: { id: string } }) =>
            l.variant.id === selectedVariant.id
        );
        if (line) {
          const updated: CartState = {
            ...cart,
            [selectedVariant.id]: {
              quantity: line.quantity,
              lineId: line.id,
            },
          };
          updateCart(updated);
        }
      }
    }
  }, [
    checkoutToken,
    selectedVariant,
    addToCart,
    updateCheckoutToken,
    updateCart,
    updateCartLine,
  ]);

  const handleDecrement = useCallback(async () => {
    if (!selectedVariant || !checkoutToken) {
      return;
    }

    const existing = cart[selectedVariant.id];

    if (!existing) {
      return;
    }

    const newQty = Math.max(existing.quantity - 1, 0);

    if (newQty === 0) {
      // Delete checkout line
      await removeCartLine({
        variables: { token: checkoutToken, linesIds: [existing.lineId] },
      });

      const updated = { ...cart };
      delete updated[selectedVariant.id];
      updateCart(updated);
    } else {
      const res = await updateCartLine({
        variables: {
          token: checkoutToken,
          lines: [{ quantity: newQty, variantId: selectedVariant.id }],
        },
      });

      const checkout = res.data?.checkoutLinesUpdate?.checkout;
      if (checkout) {
        const line = checkout.lines.find(
          (l: { variant: { id: string } }) =>
            l.variant.id === selectedVariant.id
        );
        if (line) {
          const updated: CartState = {
            ...cart,
            [selectedVariant.id]: {
              quantity: line.quantity,
              lineId: line.id,
            },
          };
          updateCart(updated);
        }
      }
    }
  }, [
    checkoutToken,
    selectedVariant,
    removeCartLine,
    updateCart,
    updateCartLine,
  ]);

  const updateSelectedVariant = useCallback(
    (value: ProductVariant) => setSelectedVariant(value),
    []
  );

  useEffect(() => {
    if (!selectedVariant && data?.product?.defaultVariant) {
      setSelectedVariant(data.product.defaultVariant);
    }
  }, [data?.product?.defaultVariant]);

  return {
    data,
    cart,
    loading,
    error,
    selectedVariant,
    handleIncrement,
    handleDecrement,
    updateSelectedVariant,
  };
}
