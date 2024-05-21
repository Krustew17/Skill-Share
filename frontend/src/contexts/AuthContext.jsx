import React, {
    createContext,
    useState,
    useEffect,
    useLayoutEffect,
} from "react";

const AuthContext = createContext();
let amount = 0;
const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(
        !!localStorage.getItem("token")
    );
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
        <AuthContext.Provider value={{ authenticated, logout, currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
