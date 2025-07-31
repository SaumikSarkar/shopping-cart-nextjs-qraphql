import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useCart } from "@/context/CartContext/CartContext";
import {
  ADD_PAYMENT_METHOD,
  COMPLETE_CHECKOUT,
  SET_BILLING_ADDRESS,
  SET_SHIPPING_ADDRESS,
  SET_SHIPPING_METHOD,
} from "@/graphql/mutations/checkout";
import { GET_CHECKOUT } from "@/graphql/queries/checkout";
import type { GetCheckoutResponse } from "@/types/checkout.type";
import type { Address, Checkout } from "@/types/checkout.type";

export function useCheckout() {
  const { checkoutToken } = useCart();

  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [shippingMethodId, setShippingMethodId] = useState<string>("");

  const { data, loading, error } = useQuery<GetCheckoutResponse>(GET_CHECKOUT, {
    variables: { token: checkoutToken },
    skip: !checkoutToken,
    fetchPolicy: "network-only",
  });

  const [setShippingAddress] = useMutation(SET_SHIPPING_ADDRESS);
  const [setBillingAddress] = useMutation(SET_BILLING_ADDRESS);
  const [setShippingMethod] = useMutation(SET_SHIPPING_METHOD);
  const [addPayment] = useMutation(ADD_PAYMENT_METHOD);
  const [completeCheckout] = useMutation(COMPLETE_CHECKOUT);

  useEffect(() => {
    if (data?.checkout) {
      setCheckout(data.checkout);
    }
  }, [data?.checkout]);

  const formik = useFormik<Address>({
    initialValues: {
      firstName: "",
      lastName: "",
      streetAddress1: "",
      city: "",
      countryArea: "",
      postalCode: "",
      country: "IN",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      streetAddress1: Yup.string().required("Street address is required"),
      city: Yup.string().required("City is required"),
      countryArea: Yup.string().required("State is required"),
      postalCode: Yup.string()
        .matches(/^\d{5,6}$/, "Enter a valid postal code")
        .required("Postal code is required"),
    }),
    onSubmit: async (values) => {
      if (!checkout) return;

      const shippingAddRes = await setShippingAddress({
        variables: { checkoutId: checkout.id, shippingAddress: values },
      });
      const billingAddRes = await setBillingAddress({
        variables: { checkoutId: checkout.id, billingAddress: values },
      });

      setCheckout({
        ...checkout,
        shippingAddress:
          shippingAddRes.data?.checkoutShippingAddressUpdate?.checkout
            ?.shippingAddress,
        billingAddress:
          billingAddRes.data?.checkoutBillingAddressUpdate?.checkout
            ?.billingAddress,
      });
    },
  });

  const handleShippingMethod = useCallback(async () => {
    const res = await setShippingMethod({
      variables: { checkoutId: checkout.id, shippingMethodId },
    });
    const updatedCheckout = res.data?.checkoutShippingMethodUpdate?.checkout;
    if (updatedCheckout) {
      setCheckout({
        ...checkout,
        shippingMethod: updatedCheckout.shippingMethod,
      });
    }
  }, [checkout, setShippingMethod]);

  const handlePayment = useCallback(async () => {
    const res = await addPayment({
      variables: {
        checkoutId: checkout.id,
        paymentMethod: {
          gateway: "mirumee.payments.dummy",
          token: "dummy-token",
          amount: checkout.totalPrice.gross.amount,
        },
      },
    });
    const updatedCheckout = res.data?.checkoutPaymentCreate?.checkout;
    if (updatedCheckout) {
      setCheckout({
        ...checkout,
        totalPrice: updatedCheckout.totalPrice,
      });
    }
  }, [checkout, addPayment]);

  const handleComplete = useCallback(async () => {
    const res = await completeCheckout({
      variables: { checkoutId: checkout.id },
    });
    console.log("Order result:", res.data?.checkoutComplete);
  }, [checkout, completeCheckout]);

  const handleShippingMethodIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setShippingMethodId(e.target.value),
    []
  );

  return {
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
  };
}
