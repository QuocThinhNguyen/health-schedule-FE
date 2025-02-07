import React, { useState, useEffect, useContext, useRef } from 'react';
import Sidebar from '~/components/SidebarDoctor/Sidebar'; // Import Sidebar component
import { UserContext } from '~/context/UserContext';
import { Outlet } from 'react-router-dom';
import { axiosClient, axiosInstance } from '~/api/apiRequest';

import { UserCircle, Settings, Bell, ChevronDown, ChevronUp, LogOut, ChevronRight } from 'lucide-react';

const DoctorDashboard = () => {
    // State để lưu tab đang chọn
    const [selectedTab, setSelectedTab] = useState('overview'); // Mặc định là "patients"
    const [currentFunction, setCurrentFunction] = useState('Xin chào bác sĩ');
    const { user } = useContext(UserContext);
    const IMAGE_URL = 'http://localhost:9000/uploads/';
    const profileMenuRef = useRef(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

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
    console.log(doctorInfo);
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
                <div className="flex-1 overflow-auto p-4">
                    <div className="bg-white border border-gray-300 rounded-lg p-2 shadow-sm">
                        <header className="w-full">
                            <div className="flex items-center justify-between px-8 py-4 max-h-64">
                                {/* <h1 className="text-2xl font-semibold">{getTitle()}</h1> */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">EasyMed</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium">{currentFunction}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {/* <button className="relative p-2 text-gray-400 hover:text-gray-500">
                                    <Bell className="w-6 h-6" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button> */}

                                    <div className="relative" ref={profileMenuRef}>
                                        <button
                                            className="flex items-center gap-2 text-sm"
                                            onClick={handleProfileClick}
                                        >
                                            <img
                                                src={`${IMAGE_URL}${doctorInfo.image}`}
                                                alt="Doctor Avatar"
                                                className="w-8 h-8 rounded-full"
                                            />

                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <div className="font-medium">Admindecare</div>
                                                    <div className="text-sm text-gray-500">decaresmg@gmail.com</div>
                                                </div>
                                                {showProfileMenu ? (
                                                    <ChevronUp className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                                                )}
                                            </div>
                                        </button>
                                        {showProfileMenu && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                                <a
                                                    href="/doctor/profile"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <UserCircle className="inline-block w-4 h-4 mr-2" />
                                                    Xem hồ sơ
                                                </a>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <Settings className="inline-block w-4 h-4 mr-2" />
                                                    Cài đặt
                                                </a>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <LogOut className="inline-block w-4 h-4 mr-2" />
                                                    Đăng xuất
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div className="overflow-y-auto h-svh">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
