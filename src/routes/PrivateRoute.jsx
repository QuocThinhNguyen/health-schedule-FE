import { useContext } from 'react';
import { Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';

function PrivateRoute({ isAllowed, redirectPath = '/login', children }) {

    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />;
    }
    return children;
}

export default PrivateRoute;
