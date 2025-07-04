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

    const loginContextGoogle = (email, userId, roleId, token) => {
        try {
            setUser({
                email: email,
                userId: userId,
                role: roleId,
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
        localStorage.removeItem('email');
        setUser({
            email: '',
            userId: '',
            role: '',
            auth: false,
        });
        if (window.location.pathname !== '/') {
            navigate('/');
        } else if (window.location.pathname === '/') {
            window.scrollTo(0, 0);
        }
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

    return (
        <UserContext.Provider value={{ user, loginContext, loginContextGoogle, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
