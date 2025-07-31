import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { LOGIN_MUTATION } from "@/graphql/mutations/login";
import { LoginResponse } from "@/types/login.type";
import { useAuth } from "@/context/AuthContext/AuthContext";

type LoginFormValues = {
  email: string;
  password: string;
};

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();

  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleCompleted = useCallback((data: LoginResponse) => {
    const { tokenCreate } = data;

    if (tokenCreate.errors.length > 0) {
      setErrorMsg(tokenCreate.errors[0].message);
      return;
    }

    const token = tokenCreate?.token;
    const userPermissions = data?.tokenCreate?.user?.userPermissions?.map(
      (p) => p.code
    );

    if (token && userPermissions) {
      login(token, tokenCreate?.user?.email, userPermissions);
      Cookies.set("token", token);
      Cookies.set("permissions", JSON.stringify(userPermissions));
      router.push("/products");
    } else {
      setErrorMsg("Login failed: Invalid token");
      console.error("Login failed: Invalid token");
    }
  }, []);

  const handleError = useCallback((error: Error) => {
    setErrorMsg("Login failed. Try again.");
    console.error(error);
  }, []);

  const [reqLogin, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: handleCompleted,
    onError: handleError,
  });

  const handleSubmit = useCallback(
    (values: LoginFormValues) => {
      setErrorMsg("");
      reqLogin({ variables: values });
    },
    [reqLogin]
  );

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.replace("/products");
    }
  }, []);

  return {
    formik,
    errorMsg,
    loading,
  };
}
