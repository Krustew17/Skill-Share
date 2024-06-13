import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();

    const [authenticated, setAuthenticated] = useState(
        !!localStorage.getItem("token")
    );

    useEffect(() => {
        if (localStorage.getItem("token") === "undefined") {
            setAuthenticated(false);
        }
    });

    async function getUser() {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        const request = await fetch("http://127.0.0.1:3000/users/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const responseJson = await request.json();
        if (responseJson.user) {
            setCurrentUser(responseJson);
            Cookies.set("loggedUserId", responseJson.user.id);
        }

        if (
            responseJson.statusCode === 400 &&
            responseJson.message === "Invalid or expired token"
        ) {
            const refreshToken = Cookies.get("refreshToken");

            const refreshResponse = await fetch(
                "http://127.0.0.1:3000/auth/refresh-token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        refresh_token: refreshToken,
                    }),
                }
            );
            const refreshResponseJson = await refreshResponse.json();

            if (refreshResponseJson.access_token) {
                // const refreshData = await refreshResponse.json();
                localStorage.setItem("token", refreshResponseJson.access_token);
                const userResponse = await fetch(
                    "http://127.0.0.1:3000/users/me",
                    {
                        headers: {
                            Authorization: `Bearer ${refreshResponseJson.access_token}`,
                        },
                    }
                );
                console.log("refreshed");
                const user = await userResponse.json();
                setCurrentUser(user);
                Cookies.set("loggedUserId", user.user.id);
            } else {
                logout();
                console.error("Token refresh failed");
                return;
            }
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    const logout = async () => {
        setAuthenticated(false);
        const request = await fetch("http://127.0.0.1:3000/auth/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const res = await request.json();
        localStorage.removeItem("token");
        Cookies.remove("refreshToken");
        Cookies.remove("loggedUserId");
        Cookies.remove("talentUserId");
        window.location.reload();
        return res;
    };

    return (
        <AuthContext.Provider
            value={{ authenticated, setAuthenticated, logout, currentUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
