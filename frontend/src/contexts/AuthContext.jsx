import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(
        !!localStorage.getItem("token")
    );

    useEffect(() => {
        if (localStorage.getItem("token") === "undefined") {
            setAuthenticated(false);
        }
    });

    const [currentUser, setCurrentUser] = useState(null);

    async function getUser() {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        const user = await fetch("http://127.0.0.1:3000/users/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await user.json();
        setCurrentUser(res);
        return res;
    }

    useEffect(() => {
        getUser();
    }, []);

    const logout = () => {
        setAuthenticated(false);
        localStorage.removeItem("token");
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
