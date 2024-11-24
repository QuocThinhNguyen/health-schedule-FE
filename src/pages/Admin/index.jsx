import React, { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faGauge, faClock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';
import { UserContext } from '~/context/UserContext';
import Logo from '~/components/Logo';
const Dashboard = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { logout } = useContext(UserContext);
    const toggleAdminMenu = () => {
        setIsExpanded(!isExpanded);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef(null);
    const adminRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation(); // Lấy đường dẫn hiện tại

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        if (isMenuOpen && adminRef.current) {
            const rect = adminRef.current.getBoundingClientRect();
            // Set dropdown position to be below the Admin button
            setDropdownPosition({
                top: rect.bottom, // Position dropdown below the button
                left: rect.left, // Align dropdown with the left edge of Admin button
            });
        }
    }, [isMenuOpen]);

    // Close the menu if clicked outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !adminRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Dữ liệu các mục menu
    const menuItems = [
        { path: '/admin/dashboard', label: 'Bảng thống kê', icon: <FontAwesomeIcon icon={faGauge} /> },
        { path: '/admin/clinic', label: 'Quản lý bệnh viện', icon: <FontAwesomeIcon icon={faHospital} /> },
        { path: '/admin/doctor', label: 'Quản lý bác sĩ', icon: '👩‍⚕️' },
        { path: '/admin/user', label: 'Quản lý tài khoản người dùng', icon: '👤' },
        { path: '/admin/specialty', label: 'Quản lý chuyên khoa', icon: '🩺' },
        { path: '/admin/schedule', label: 'Quản lý lịch hẹn', icon: '📅' },
        { path: '/admin/worktime', label: 'Quản lý thời gian làm việc', icon: <FontAwesomeIcon icon={faClock} /> },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className={`bg-gray-100 border-r transition-all duration-300 mt-4 ${isExpanded ? 'w-100' : 'w-16'}`}>
                <div className="flex items-center justify-between px-4 py-2 bg-gray-300">
                    {isExpanded && <span className="font-bold">Admin Menu</span>}
                    <button onClick={toggleAdminMenu} className="p-2 text-gray-700 hover:bg-gray-200 rounded">
                        {isExpanded ? <IoMenu /> : <IoMenu />}
                    </button>
                </div>
                <ul className="space-y-2 mt-4">
                    {/* Menu items */}
                    {menuItems.map((item) => (
                        <li
                            key={item.path}
                            className={`cursor-pointer flex items-center px-4 py-2 rounded ${
                                location.pathname === item.path
                                    ? 'bg-pink-500 text-white' // Nền hồng cho mục hiện tại
                                    : 'hover:bg-gray-200' // Hover hiệu ứng cho mục khác
                            } ${isExpanded ? 'justify-start' : 'justify-center'}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {isExpanded && <span className="ml-4">{item.label}</span>}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4">
                <div className="bg-gray-200">
                    <div className="border-t border-gray-400"></div>
                    <div className="bg-gray-200 mx-auto">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4 ml-4">
                                {/* <img
                                    src={
                                        'https://phuongnamvina.com/img_data/images/logo-benh-vien.jpg' ||
                                        'https://via.placeholder.com/150'
                                    }
                                    alt="Logo"
                                    className="w-24 h-24 object-contain"
                                /> */}
                                <Logo/>
                            </div>
                            {/* Admin và Menu */}
                            <div
                                ref={adminRef}
                                className="flex items-center space-x-4 cursor-pointer"
                                onClick={toggleMenu}
                            >
                                <span className="font-bold">Admin</span>
                                <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={
                                            'https://s3.ap-southeast-1.amazonaws.com/cdn.vntre.vn/default/meme-meo-khoc-5-1725388333.jpg' ||
                                            'https://via.placeholder.com/150'
                                        }
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Menu thả xuống */}
                            {isMenuOpen && (
                                <div
                                    ref={menuRef}
                                    className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md w-40 z-20"
                                    style={{
                                        top: dropdownPosition.top + 8 + 'px', // Add a small offset
                                        left: dropdownPosition.left + 'px',
                                    }}
                                >
                                    <ul className="py-2">
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Hồ sơ cá nhân</li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Đăng xuất</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="border-t border-gray-400"></div>
                </div>

                {/* Dashboard cards */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <p className="text-lg font-bold">0 VNĐ</p>
                        <p>Doanh thu</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <p className="text-lg font-bold">0</p>
                        <p>Người dùng mới</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <p className="text-lg font-bold">0</p>
                        <p>Tổng số lịch hẹn tuần này</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="mt-6">
                    <div className="bg-gray-100 h-48 rounded shadow mb-4">
                        <p className="p-4">Biểu đồ doanh thu trong năm</p>
                    </div>
                    <div className="bg-gray-100 h-48 rounded shadow">
                        <p className="p-4">Biểu đồ doanh thu theo tháng của từng chuyên khoa</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
