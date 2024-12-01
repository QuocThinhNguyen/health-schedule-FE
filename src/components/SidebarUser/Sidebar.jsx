import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaClipboardList, FaCalendarAlt, FaKey } from 'react-icons/fa';

const Sidebar = ({ selectedTab }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: 'Hồ sơ cá nhân', path: '/user/profile', icon: FaUser },
        { label: 'Quản lý Đặt lịch khám', path: '/user/appointments', icon: FaCalendarAlt },
        { label: 'Hồ sơ bệnh nhân', path: '/user/records', icon: FaClipboardList },
        { label: 'Đổi mật khẩu', path: '/user/change-password', icon: FaKey },
    ];

    return (
        <div className="w-fit h-screen bg-white text-black flex flex-col shadow-lg">
            <ul className="space-y-2 mt-4 px-4">
                {menuItems.map(({ label, path, icon: Icon }) => (
                    <li
                        key={path}
                        onClick={() => navigate(path)}
                        className={`p-3 cursor-pointer flex items-center rounded-md hover:bg-blue-100 ${
                            location.pathname === path ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                        }`}
                    >
                        <Icon className="mr-3" />
                        {label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
