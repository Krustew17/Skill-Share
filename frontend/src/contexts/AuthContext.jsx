import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(
        !!localStorage.getItem("token")
    );
    const [currentUser, setCurrentUser] = useState("");

    if (authenticated) {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        setCurrentUser(decodedToken.user);
    }

    const logout = () => {
        setAuthenticated(false);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ authenticated, logout, currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
