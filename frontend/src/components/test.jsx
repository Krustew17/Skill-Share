import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./checkout-form";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
    "pk_test_51PHWiFIK3rKcTeQQZeLQQmN3QgdcxdIGV5rc8Xki77jOo40EJQ9BMyDd22Ip7BOTgzJJMJAynkTF1ktpjV3M1jJq002JKrzbst"
);

export default function Test() {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:3000/stripe/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((res) => console.log(res.json()))
            .then((data) => console.log(data));
    }, []);

    const appearance = {
        theme: "stripe",
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="App">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
}
