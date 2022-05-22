import React from 'react';
import { useRoutes, RouteObject } from "react-router-dom";
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AuthGuard from '../guards/AuthGuard';
const routesObject: RouteObject[] = [
    { path: '/', element: <AuthGuard children={<HomePage />} />, },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> }
];

const Routes: React.FC = () => {
    return useRoutes(routesObject);
};
export default Routes;