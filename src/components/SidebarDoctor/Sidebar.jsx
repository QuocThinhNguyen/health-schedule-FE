import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaUser, FaCalendarAlt, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import pngegg from '../../assets/img/avatar.png';
import { UserContext } from '~/context/UserContext';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../Logo';

const Sidebar = ({ onSelectTab, selectedTab, setCurrentFunction }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [doctorInfo, setDoctorInfo] = useState({ name: '', image: '', userId: '' });
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const [showPassword_1, setShowPassword_1] = useState(false);
    const toggleShowPassword_1 = () => {
        setShowPassword_1(!showPassword_1);
    };

    const [showPassword_2, setShowPassword_2] = useState(false);
    const toggleShowPassword_2 = () => {
        setShowPassword_2(!showPassword_2);
    };

    const { logout } = useContext(UserContext);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${user.userId}`);
                if (response.status === 200) {
                    setDoctorInfo({
                        name: response.data.fullname,
                        image: response.data.image,
                        userId: response.data.doctorId,
                    });
                }
            } catch (error) {
                console.log('Error fetching doctor data:', error);
            }
        };
        fetchData();
    }, []);

    const handleProfileClick = () => {
        setShowMenu(!showMenu);
    };

    const handleLogout = () => {
        logout();
    };

    console.log('Doctor Info:', doctorInfo);

    const handleChangePassword = async () => {
        if (newPassword === confirmPassword) {
            // Gửi yêu cầu PUT tới API để thay đổi mật khẩu
            const response = await axiosInstance.post('/user/update-password', {
                userId: doctorInfo.userId,
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            });
            // console.log('Response::', response);
            if (response.status === 200) {
                toast.success('Mật khẩu đã được thay đổi thành công');
                setShowChangePasswordModal(false);
            } else {
                toast.error(response.message);
            }
        } else {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
        }
    };

    const IMAGE_URL = 'http://localhost:9000/uploads/';

    useEffect(() => {
        onSelectTab('overview');
    }, []);

    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: 'Tổng quan', image: 'research.png', path: '/doctor/overview' },
        { label: 'Lịch làm việc', image: 'track.png', path: '/doctor/schedule' },
        { label: 'Quản lý lịch hẹn', image: 'meeting.png', path: '/doctor/manage' },
        { label: 'Hồ sơ bệnh nhân', image: 'health-report.png', path: '/doctor/health-report' },
        { label: 'Đánh giá', image: 'reviews.png', path: '/doctor/review' },
        { label: 'Hồ sơ cá nhân', image: 'user.png', path: '/doctor/profile' },
    ];

    return (
        <div className="w-fit h-screen bg-white text-black flex flex-col">
            <div className="flex items-center justify-start p-2 gap-1 max-h-64">
                <div className="">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        id="Layer_1"
                        x="0px"
                        y="0px"
                        width="45px"
                        height="45px"
                        viewBox="0 0 55 55"
                        enable-background="new 0 0 55 55"
                        xml:space="preserve"
                    >
                        {' '}
                        <image
                            id="image0"
                            width="55"
                            height="55"
                            x="0"
                            y="0"
                            href="data:image/png;base64,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"
                        />
                    </svg>
                </div>

                <span className="text-2xl font-bold">
                    <span className="text-green-500">Easy</span>
                    <span className="text-blue-500">Med</span>
                </span>
            </div>
            <div className="space-y-2 pt-2 pb-4 px-4 mt-2">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => {
                            if (item.onClick) {
                                item.onClick();
                            } else {
                                setCurrentFunction(item.label);
                                navigate(item.path);
                            }
                        }}
                        className={`gap-2 p-3 cursor-pointer flex items-center rounded-2xl  ${
                            location.pathname === item.path ? 'bg-[#3686ff] text-white' : 'text-gray-700'
                        }`}
                    >
                        <img src={`/${item.image}`} alt={item.label} className="h-6 w-6" />
                        <span className="text-base">{item.label}</span>
                    </li>
                ))}
            </div>

            {/* <div className="absolute bottom-0  px-4 py-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={handleProfileClick}>
                    <img
                        // src={doctorInfo.image ? `${IMAGE_URL}${doctorInfo.image}` : pngegg}
                        src={`${IMAGE_URL}${doctorInfo.image}`}
                        alt="Doctor Avatar"
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <p>{doctorInfo.name}</p>
                        <small className="text-gray-500">Doctor</small>
                    </div>
                </div>
                {showMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                        <ul>
                            <li
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => setShowChangePasswordModal(true)}
                            >
                                Đổi mật khẩu
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>
                                Đăng Xuất
                            </li>
                        </ul>
                    </div>
                )}
            </div> */}

            {/* Modal Đổi Mật Khẩu */}
            {showChangePasswordModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-[385px]">
                        {' '}
                        {/* Thay w-96 thành w-128 để modal rộng hơn */}
                        <h3 className="text-3xl font-semibold mb-4">Đổi Mật Khẩu</h3>
                        <div className="mb-4 relative">
                            <label htmlFor="oldPassword" className="block text-2xl">
                                Mật khẩu cũ
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="oldPassword"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute top-[70%] right-3 transform -translate-y-1/2 text-gray-500 "
                                onClick={toggleShowPassword}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <div className="mb-4 relative">
                            <label htmlFor="newPassword" className="block text-2xl">
                                Mật khẩu mới
                            </label>
                            <input
                                type={showPassword_1 ? 'text' : 'password'}
                                id="newPassword"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute top-[70%] right-3 transform -translate-y-1/2 text-gray-500 "
                                onClick={toggleShowPassword_1}
                            >
                                <FontAwesomeIcon icon={showPassword_1 ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <div className="mb-4 relative">
                            <label htmlFor="confirmPassword" className="block text-2xl">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type={showPassword_2 ? 'text' : 'password'}
                                id="confirmPassword"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute top-[70%] right-3 transform -translate-y-1/2 text-gray-500 "
                                onClick={toggleShowPassword_2}
                            >
                                <FontAwesomeIcon icon={showPassword_2 ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="px-10 py-5 bg-blue-500 text-white rounded mt-6"
                                onClick={handleChangePassword}
                            >
                                Lưu
                            </button>
                            <button
                                className="px-10 py-5 bg-gray-300 text-black rounded mt-6"
                                onClick={() => setShowChangePasswordModal(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
