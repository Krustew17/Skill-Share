import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
export default function MagicLinkVerification() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(
                    import.meta.env.VITE_API_URL +
                        `/auth/verify-email?token=${token}`,
                    {
                        method: "GET",
                    }
                );

                if (!response.ok) {
                    throw new Error("Verification failed");
                }

                const data = await response.json();
                localStorage.setItem("token", data.access_token);
                setLoading(false);
                window.location.replace("/");
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return <div>Verification Successful! You are now logged in.</div>;
}
