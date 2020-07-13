import { useEffect, useRef, useCallback } from "react";

import useScript from "./useScript";

const getUrl = (production) =>
  production
    ? "https://pay.datatrans.com/upp/payment/js/payment-button-1.0.0.min.js"
    : "https://pay.sandbox.datatrans.com/upp/payment/js/payment-button-1.0.0.js";

const DEFAULT_OPTIONS = {
  useGooglePay: false,
  useApplePay: false,
  auto: true,
  autoSettle: false,
  tokenOnly: false,
  allowedCardNetworks: ["AMEX", "DISCOVER", "MASTERCARD", "VISA"],
  googlePayConfiguration: {
    buttonType: "long",
    buttonStyle: "black",
    merchantId: "01234567890123456789",
  },
  applePayConfiguration: {
    buttonType: "plain",
    buttonStyle: "black",
  },
};

const useAppleOrGooglePay = ({
  merchantId,
  merchantName,
  options,
  payment,
  production,
}) => {
  const scriptSource = getUrl(production);
  const [isLoaded, hasError] = useScript({ src: scriptSource });
  const payButton = useRef(null);
  const paymentButton = window?.PaymentButton;

  const bindPaymentButtonEvents = useCallback(() => {
    paymentButton?.on("init", () => {
      paymentButton?.create(payButton?.current, payment);
    });
    // bind other events:
    // paymentButton?.on("authorization", () => {});
    // paymentButton?.on('abort', () => {})
    // paymentButton?.on("error", () => {});
    // paymentButton?.on('token', () => {})
    // paymentButton?.on('unsupported', () => {})
  }, [paymentButton, payButton?.current, payment]);

  const initPaymentButton = useCallback(() => {
    paymentButton?.init({
      ...DEFAULT_OPTIONS,
      ...options,
      merchantId,
      merchantName,
    });

    bindPaymentButtonEvents();
  }, [paymentButton, merchantId, merchantName]);

  useEffect(() => {
    if (isLoaded && !hasError) {
      initPaymentButton();
      //return () => paymentButton.destroy()
    }
    return () => {};
  }, [isLoaded, hasError, initPaymentButton]);

  return [payButton];
};

export default useAppleOrGooglePay;
