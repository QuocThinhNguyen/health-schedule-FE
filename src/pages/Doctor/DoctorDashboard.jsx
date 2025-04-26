import { useState, useEffect, useContext, useRef } from 'react';
import Sidebar from '~/components/SidebarDoctor/Sidebar'; // Import Sidebar component
import { UserContext } from '~/context/UserContext';
import { Outlet, NavLink } from 'react-router-dom';
import { axiosInstance } from '~/api/apiRequest';
import { X } from 'lucide-react';

import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';

const DoctorDashboard = () => {
    // State để lưu tab đang chọn
    const [selectedTab, setSelectedTab] = useState('overview'); // Mặc định là "patients"
    const [currentFunction, setCurrentFunction] = useState('Xin chào bác sĩ');
    const { user, logout } = useContext(UserContext);
    const profileMenuRef = useRef(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isLogout, setIsLogout] = useState(false);

    const getTitle = () => {
        if (currentFunction === 'Tổng quan') {
            return `Xin chào bác sĩ ${doctorInfo.fullname}`;
        } else if (currentFunction === 'Đánh giá') {
            return 'Đánh giá từ bệnh nhân';
        } else {
            return currentFunction;
        }
    };

    const [doctorInfo, setDoctorInfo] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${user.userId}`);
                if (response.status === 200) {
                    setDoctorInfo(response.data);
                }
            } catch (error) {
                console.log('Error fetching doctor data:', error);
            }
        };
        fetchData();
    }, []);

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileMenuRef]);

    const handleLogout = () => {
        setIsLogout(true);
    };

    const onClose = () => {
        setIsLogout(false);
    };

    const onConfirm = () => {
        setShowProfileMenu(false);
        setIsLogout(false);
        logout();
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc]">
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar
                    onSelectTab={setSelectedTab}
                    selectedTab={selectedTab}
                    setCurrentFunction={setCurrentFunction}
                />

                {/* Nội dung chính */}
                <div className="flex-1 flex flex-col bg-gradient-to-t from-[#f0f0f0] via-[#f3f3f3] to-[#f0f0f0] h-full">
                    {/* Header cố định */}
                    <header className="w-full px-8 py-2 border-gray-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">EasyMed</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{currentFunction}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative" ref={profileMenuRef}>
                                    <button className="flex items-center gap-2 text-sm" onClick={handleProfileClick}>
                                        <img
                                            src={doctorInfo.image}
                                            alt="Doctor Avatar"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <div className="font-medium">{doctorInfo.fullname}</div>
                                                <div className="text-sm text-gray-500">{doctorInfo.email}</div>
                                            </div>
                                            {showProfileMenu ? (
                                                <ChevronUp className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                    </button>
                                    {showProfileMenu && (
                                        <div className="absolute top-8 left-0 right-0 h-3 bg-transparent"></div>
                                    )}
                                    {showProfileMenu && (
                                        <div
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                                            onMouseEnter={() => setShowProfileMenu(true)}
                                            onMouseLeave={() => setShowProfileMenu(false)}
                                        >
                                            <ul className="">
                                                {/* <li className="group px-4 py-3 text-left text-base font-medium hover:bg-slate-100 cursor-pointer flex items-center">
                                                    <NavLink
                                                        to="/doctor/overview"
                                                        className={({ isActive }) =>
                                                            isActive
                                                                ? 'text-blue-500 flex items-center w-full'
                                                                : 'flex items-center w-full'
                                                        }
                                                    >
                                                        <img
                                                            src="/research.png"
                                                            alt={'research'}
                                                            className="h-5 w-5 mr-2"
                                                        />
                                                        Tổng quan
                                                    </NavLink>
                                                </li>
                                                <li className="group px-4 py-3 text-left text-base font-medium hover:bg-slate-100 cursor-pointer flex items-center">
                                                    <NavLink
                                                        to="/doctor/schedule"
                                                        className={({ isActive }) =>
                                                            isActive
                                                                ? 'text-blue-500 flex items-center w-full'
                                                                : 'flex items-center w-full'
                                                        }
                                                    >
                                                        <img src="/track.png" alt={'track'} className="h-5 w-5 mr-2" />
                                                        Lịch làm việc
                                                    </NavLink>
                                                </li>
                                                <li className="group px-4 py-3 text-left text-base font-medium hover:bg-slate-100 cursor-pointer flex items-center">
                                                    <NavLink
                                                        to="/doctor/health-report"
                                                        className={({ isActive }) =>
                                                            isActive
                                                                ? 'text-blue-500 flex items-center w-full'
                                                                : 'flex items-center w-full'
                                                        }
                                                    >
                                                        <img
                                                            src="/health-report.png"
                                                            alt={'health-report'}
                                                            className="h-5 w-5 mr-2"
                                                        />
                                                        Hồ sơ bệnh nhân
                                                    </NavLink>
                                                </li>

                                                <li className="group px-4 py-3 text-left text-base font-medium hover:bg-slate-100 cursor-pointer flex items-center">
                                                    <NavLink
                                                        to="/doctor/review"
                                                        className={({ isActive }) =>
                                                            isActive
                                                                ? 'text-blue-500 flex items-center w-full'
                                                                : 'flex items-center w-full'
                                                        }
                                                    >
                                                        <img
                                                            src="/reviews.png"
                                                            alt={'reviews'}
                                                            className="h-5 w-5 mr-2"
                                                        />
                                                        Đánh giá
                                                    </NavLink>
                                                </li>
                                                <li className="group px-4 py-3 text-left text-base font-medium hover:bg-slate-100 cursor-pointer flex items-center">
                                                    <NavLink
                                                        to="/doctor/reset-password"
                                                        className={({ isActive }) =>
                                                            isActive
                                                                ? 'text-blue-500 flex items-center w-full'
                                                                : 'flex items-center w-full'
                                                        }
                                                    >
                                                        <img
                                                            src="/reset-password.png"
                                                            alt={'change-password'}
                                                            className="h-5 w-5 mr-2"
                                                        />
                                                        Đổi mật khẩu
                                                    </NavLink>
                                                </li> */}
                                                <li className="group px-4 py-3 text-left text-base font-medium hover:bg-slate-100 cursor-pointer flex items-center">
                                                    <NavLink
                                                        to="/doctor/profile"
                                                        className={({ isActive }) =>
                                                            isActive
                                                                ? 'text-blue-500 flex items-center w-full'
                                                                : 'flex items-center w-full'
                                                        }
                                                    >
                                                        <img src="/user.png" alt={'user'} className="h-5 w-5 mr-2" />
                                                        Hồ sơ cá nhân
                                                    </NavLink>
                                                </li>
                                                <li
                                                    className="group px-4 py-3 text-left text-base text-[#e74c3c] font-medium hover:bg-slate-100 cursor-pointer flex items-center"
                                                    onClick={handleLogout}
                                                >
                                                    <img src="/logout.png" alt={'logout'} className="h-5 w-5 mr-2" />
                                                    Đăng xuất
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Outlet có thể cuộn */}
                    <div className="flex-1 overflow-y-auto px-6 py-5">
                        <Outlet />
                    </div>
                </div>
            </div>
            {isLogout && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 bg-opacity-50 z-50">
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

export default DoctorDashboard;
