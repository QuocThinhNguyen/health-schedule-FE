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

const Sidebar = ({ onSelectTab, selectedTab }) => {
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
                if (response.errCode === 0) {
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
            if (response.status === 'OK') {
                toast.success('Mật khẩu đã được thay đổi thành công');
                setShowChangePasswordModal(false);
            } else {
                toast.error(response.message);
            }
            // .then((response) => {
            //     const { status, message } = response.data;
            //     if (status === 'OK') {
            //         alert('Mật khẩu đã được thay đổi thành công');
            //         setShowChangePasswordModal(false); // Đóng modal sau khi thành công
            //     } else {
            //         alert(message); // Hiển thị thông báo lỗi
            //     }
            // })
            // .catch((error) => {
            //     console.error('Error changing password:', error);
            //     alert('Đã có lỗi xảy ra khi thay đổi mật khẩu');
            // });
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
        { label: 'Thông tin cá nhân', icon: <FaUser />, path: '/doctor/profile' },
        { label: 'Quản lý lịch hẹn', icon: <FaCalendarAlt />, path: '/doctor/manage' },
        { label: 'Quản lý lịch làm việc', icon: <FaClipboardList />, path: '/doctor/schedule' },
    ];

    return (
        <div className="w-fit h-screen bg-white text-black flex flex-col shadow-lg">
            <div className="text-xl font-bold text-center py-6 border-b border-gray-200 flex items-center justify-center">
                {/* <img
                    src={pngegg}
                    alt="Logo"
                    className="mx-auto mb-2"
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
                <div className="ml-4 text-left">
                    <p>EasyMed</p>
                    <small>
                        Chăm sóc sức khỏe <br /> Bảo vệ cuộc sống
                    </small>
                </div> */}
                <Logo />
            </div>

            <div className="flex-1">
                <ul className="space-y-2 mt-4 px-4">
                    {menuItems.map((item) => (
                        <li
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`p-3 cursor-pointer flex items-center rounded-md hover:bg-blue-100 ${
                                location.pathname === item.path ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                            }`}
                        >
                            {item.icon} <span className="ml-3">{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="px-4 py-6 border-t border-gray-200 relative">
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
            </div>

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
