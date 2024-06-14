import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import tryRefreshToken from "../utils/tryRefreshToken";

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
            credentials: "include",
        });

        const responseJson = await request.json();
        if (responseJson.user) {
            setCurrentUser(responseJson);
            Cookies.set("loggedUserId", responseJson.user.id);
        }

        tryRefreshToken(responseJson, setCurrentUser);
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
