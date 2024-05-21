import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            setError(error.message);
        } else {
            // Call your backend to create a PaymentIntent
            const response = await fetch("/payments/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 1000 }), // Amount in cents
            });
            const paymentIntent = await response.json();

            const {
                error: confirmError,
                paymentIntent: confirmedPaymentIntent,
            } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
                payment_method: paymentMethod.id,
            });
            if (confirmError) {
                setError(confirmError.message);
            } else {
                setSuccess(true);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
            {error && <div>{error}</div>}
            {success && <div>Payment successful!</div>}
        </form>
    );
};

export default CheckoutForm;
