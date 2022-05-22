import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

interface AuthGuardProps {
    children: JSX.Element;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const [user] = React.useContext(AuthContext);
    const location = useLocation();
    if (!user) {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }
    return children;
}
export default AuthGuard