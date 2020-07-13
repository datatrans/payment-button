import React from "react";

import useAppleOrGooglePay from "./useAppleOrGooglePay";

const PaymentButtonWithHook = ({
  merchantId,
  merchantName,
  options,
  payment,
  production,
}) => {
  const [payButton] = useAppleOrGooglePay({
    merchantId,
    merchantName,
    options,
    payment,
    production,
  });
  return <div ref={payButton} style={{ maxWidth: "400px" }} />;
};

export default PaymentButtonWithHook;
