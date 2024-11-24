import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const UserContext = createContext({ email: '', userId: '', role: '', auth: false });

const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const initialUser = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodeToken = jwtDecode(token);
                return {
                    email: decodeToken.email || '',
                    userId: decodeToken.userId || '',
                    role: decodeToken.roleId || '',
                    auth: true,
                };
            } catch (error) {
                console.error('Invalid token:', error);
                return { email: '', userId: '', role: '', auth: false };
            }
        }
        return { email: '', userId: '', role: '', auth: false };
    };

    const [user, setUser] = useState(initialUser);

    const loginContext = (email, token) => {
        try {
            const decodeToken = jwtDecode(token);
            setUser({
                email: email,
                userId: decodeToken.userId,
                role: decodeToken.roleId,
                auth: true,
            });
            localStorage.setItem('email', email);
            localStorage.setItem('token', token);
        } catch (error) {
            console.error('Invalid token:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser({
            email: '',
            userId: '',
            role: '',
            auth: false,
        });
        navigate('/');
        toast.success('Đăng xuất thành công');
    };

    useEffect(() => {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodeToken = jwtDecode(token);
                setUser({
                    email: email,
                    userId: decodeToken.userId,
                    role: decodeToken.roleId,
                    auth: true,
                });
            } catch (error) {
                console.error('Invalid token:', error);
                logout();
            }
        }
    }, []);
    console.log('User:', user);

    return <UserContext.Provider value={{ user, loginContext, logout }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
