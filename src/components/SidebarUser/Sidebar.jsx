// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { FaUser, FaClipboardList, FaCalendarAlt, FaSignOutAlt, FaKey } from 'react-icons/fa';

// const Sidebar = ({ onSelectTab, selectedTab }) => {
//     const [showMenu, setShowMenu] = useState(false);

//     const handleProfileClick = () => {
//         setShowMenu(!showMenu);
//     };

//     return (
//         <div className="w-fit h-screen bg-white text-black flex flex-col shadow-lg">
//             {/* Tab List */}
//             <div className="flex-1">
//                 <ul className="space-y-2 mt-4 px-4">
//                     <li
//                         onClick={() => onSelectTab('profile')}
//                         className={`p-3 cursor-pointer flex items-center rounded-md hover:bg-blue-100 ${
//                             selectedTab === 'profile' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
//                         }`}
//                     >
//                         <FaUser className="mr-3" />
//                         Hồ sơ cá nhân
//                     </li>
//                     <li
//                         onClick={() => onSelectTab('appointments')}
//                         className={`p-3 cursor-pointer flex items-center rounded-md hover:bg-blue-100 ${
//                             selectedTab === 'appointments' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
//                         }`}
//                     >
//                         <FaCalendarAlt className="mr-3" />
//                         Quản lý Đặt lịch khám
//                     </li>
//                     <li
//                         onClick={() => onSelectTab('patientRecords')}
//                         className={`p-3 cursor-pointer flex items-center rounded-md hover:bg-blue-100 ${
//                             selectedTab === 'patientRecords' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
//                         }`}
//                     >
//                         <FaClipboardList className="mr-3" />
//                         Hồ sơ bệnh nhân
//                     </li>
//                     <li
//                         onClick={() => onSelectTab('changePassWord')}
//                         className={`p-3 cursor-pointer flex items-center rounded-md hover:bg-blue-100 ${
//                             selectedTab === 'changePassWord' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
//                         }`}
//                     >
//                         <FaKey className="mr-3" />
//                         Đổi mật khẩu
//                     </li>
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;

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
