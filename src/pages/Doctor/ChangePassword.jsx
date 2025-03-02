import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { IoEye, IoEyeOff } from 'react-icons/io5';

function ChangePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const { user } = useContext(UserContext);

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

    const handleChangePassword = async () => {
        if (newPassword === confirmPassword) {
            // Gửi yêu cầu PUT tới API để thay đổi mật khẩu
            const response = await axiosInstance.post('/user/update-password', {
                userId: user.userId,
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            });
            // console.log('Response::', response);
            if (response.status === 200) {
                toast.success('Mật khẩu đã được thay đổi thành công');
            } else {
                toast.error(response.message);
            }
        } else {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
        }
    };
    return (
        <div className="h-full p-6 overflow-y-auto w-full border rounded-lg shadow-lg bg-white">
            <div className="text-2xl text-black font-bold text-left ">Đổi mật khẩu</div>
            <div className="flex flex-col gap-4 mt-5 pr-[450px]">
                <div>
                    <label htmlFor="oldPassword" className="block text-sm font-semibold mb-1">
                        Mật khẩu cũ
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="oldPassword"
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-blue-500"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 text-lg"
                            onClick={toggleShowPassword}
                        >
                            {showPassword ? <IoEye /> : <IoEyeOff />}
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold mb-1">
                        Mật khẩu mới
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword_1 ? 'text' : 'password'}
                            id="newPassword"
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-blue-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 text-lg"
                            onClick={toggleShowPassword_1}
                        >
                            {showPassword_1 ? <IoEye /> : <IoEyeOff />}
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1">
                        Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword_2 ? 'text' : 'password'}
                            id="confirmPassword"
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-blue-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 text-lg"
                            onClick={toggleShowPassword_2}
                        >
                            {showPassword_2 ? <IoEye /> : <IoEyeOff />}
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <button
                        type="submit"
                        onClick={handleChangePassword}
                        className="mt-2 font-bold w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                    >
                        Đổi mật khẩu
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
