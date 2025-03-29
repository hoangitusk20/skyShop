import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const PaypalButton = ({ amount, onSuccess, onError }) => {
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  return (
    <PayPalScriptProvider
      options={{
        "client-id": paypalClientId,
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, action) => {
          return action.order.create({
            purchase_units: [
              { amount: { value: parseFloat(amount).toFixed(2) } },
            ],
          });
        }}
        onApprove={(data, action) => {
          return action.order.capture().then(onSuccess);
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
