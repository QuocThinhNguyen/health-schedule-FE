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

    return (
        <>
            {/* Main Content */}
            <div className="p-8">
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
        </>
    );
};

export default Dashboard;
