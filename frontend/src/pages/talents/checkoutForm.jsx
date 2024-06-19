import React, { useEffect, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm({ onClose }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage(
                        "Your payment was not successful, please try again."
                    );
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        console.log(import.meta.env.VITE_FRONTEND_URL);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: import.meta.env.VITE_FRONTEND_URL,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    return (
        <div className="checkout-form-container">
            <form
                id="payment-form"
                onSubmit={handleSubmit}
                className="checkoutForm"
            >
                <button
                    className="mb-5 hover:bg-red-500 rounded-md px-4 py-1 "
                    type="button"
                    onClick={onClose}
                >
                    Close
                </button>
                <PaymentElement
                    id="payment-element"
                    options={paymentElementOptions}
                />
                <button
                    disabled={isLoading || !stripe || !elements}
                    id="submit"
                    className="CheckoutButton"
                >
                    <span id="button-text">
                        {isLoading ? (
                            <div className="spinner" id="spinner"></div>
                        ) : (
                            "Pay now"
                        )}
                    </span>
                </button>
                {message && <div id="payment-message">{message}</div>}
            </form>
        </div>
    );
}
