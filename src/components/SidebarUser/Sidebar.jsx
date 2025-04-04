import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaClipboardList, FaCalendarAlt, FaKey } from 'react-icons/fa';
import { UserContext } from '~/context/UserContext';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { X } from 'lucide-react';

const Sidebar = ({ selectedTab }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(UserContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        setIsOpen(true);
    };

    const onClose = () => {
        setIsOpen(false);
    };

    const onConfirm = () => {
        setIsDropdownOpen(false);
        logout();
    };

    const menuItems = [
        { label: 'Hồ sơ cá nhân', path: '/user/profile', image: 'user.png' },
        { label: 'Lịch sử đặt lịch khám', path: '/user/appointments', image: 'schedule.png' },
        { label: 'Hồ sơ bệnh nhân', path: '/user/records', image: 'health-report.png' },
        { label: 'Video đã lưu', path: '/user/video', image: 'video_icon.png' },
        { label: 'Đổi mật khẩu', path: '/user/change-password', image: 'reset-password.png' },
        { label: 'Trợ giúp', path: '/user/help', image: 'question.png' },
        { label: 'Đăng xuất', onClick: handleLogout, image: 'logout.png' },
    ];

    const [userProfile, setUserProfile] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/user/${user.userId}`);
                if (response.status === 200) {
                    setUserProfile(response.data);
                }
            } catch (error) {
                console.error('Error fetching doctor data:', error);
                setUserProfile({});
            }
        };
        fetchData();
    }, []);

    return (
        <div className="w-fit h-fit bg-white text-black flex flex-col rounded-md mt-20 mb-20">
            <div className="p-4 border-b">
                <div className="flex items-center gap-3 mb-2">
                    <img
                        src={`http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/${userProfile.image}`}
                        alt="logo clinic"
                        className="h-14 w-14 rounded-full"
                    />
                    <div className="flex items-center gap-2 ml-auto">
                        <div className="flex items-center px-3 py-0 bg-white rounded-full text-sm border border-blue-300 font-semibold">
                            <div className="mt-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                    version="1.1"
                                    id="Layer_1"
                                    x="0px"
                                    y="0px"
                                    width="25px"
                                    height="25px"
                                    viewBox="0 0 55 55"
                                    enable-background="new 0 0 55 55"
                                    xml:space="preserve"
                                >
                                    {' '}
                                    <image
                                        id="image0"
                                        width="40"
                                        height="40"
                                        x="0"
                                        y="0"
                                        href="data:image/png;base64,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"
                                    />
                                </svg>
                            </div>
                            <div>Thành viên</div>
                        </div>
                    </div>
                </div>

                <p className="text-base font-semibold mb-1">{userProfile.fullname}</p>
                <p className="text-xs font-normal text-blue-500">{userProfile.email}</p>
            </div>
            <div className="space-y-2 pt-2 pb-4 px-4">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        onClick={item.onClick ? item.onClick : () => navigate(item.path)}
                        className={`gap-2 p-3 cursor-pointer flex items-center rounded-md hover:bg-blue-100 ${
                            location.pathname === item.path ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                        }`}
                    >
                        <img src={`/${item.image}`} alt={item.label} className="h-6 w-6" />
                        <span>{item.label}</span>
                    </li>
                ))}
            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 bg-opacity-50 z-10">
                    <div className="bg-white rounded-lg w-full max-w-xs">
                        {/* Close button */}
                        <div className="flex justify-end p-2">
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 pb-6">
                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <img src="/logout.png" alt={'Thoát'} className="h-12 w-12" />
                            </div>

                            {/* Text */}
                            <h3 className="text-xl font-semibold text-center mb-2">Đăng xuất?</h3>
                            <p className="text-gray-600 text-center mb-6">Bạn có chắc chắn muốn đăng xuất?</p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="font-semibold flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="font-semibold flex-1 px-4 py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
