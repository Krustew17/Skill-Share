import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedElementFromLoggedusers = ({ component: Component, ...rest }) => {
    const { authenticated } = useContext(AuthContext);

    return !authenticated ? <Component {...rest} /> : <Navigate to="/" />;
};

export default ProtectedElementFromLoggedusers;
