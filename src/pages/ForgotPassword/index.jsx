import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosClient } from '~/api/apiRequest';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const inputFocus = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (inputFocus.current) {
            inputFocus.current.focus();
        }
    }, []);

    const resetPassword = async () => {
        try {
            const response = await axiosClient.post('/reset-password', { email });
            console.log(response);

            if (response.status === 200) {
                toast.success(`${response.message}`);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                toast.error(`${response.message}`);
            }
        } catch (error) {
            toast.error('Lỗi khi gửi mail:', error);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError('');
    };

    const handleEmailBlur = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email không được để trống.');
        } else if (!emailPattern.test(email)) {
            setEmailError('Email không đúng định dạng.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        resetPassword();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#e9ebee]">
            <div className="bg-white rounded-lg shadow-md w-[500px]">
                <div>
                    <h2 className="text-4xl font-semibold px-7 py-5">Nhập email của bạn</h2>
                    <div className="h-[0.5px] bg-gray-300"></div>
                </div>
                <form onSubmit={handleSubmit} className="mx-7 my-5">
                    <div>
                        <p className="text-xl">Vui lòng nhập email của bạn, mật khẩu sẽ được gửi về qua email.</p>
                        <div className="my-4">
                            <input
                                ref={inputFocus}
                                type="text"
                                className="w-full !bg-white h-[44px] px-3 py-2  border border-gray-300 rounded-xl"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={handleEmailBlur}
                                onKeyDown={handleKeyDown}
                            />
                            {emailError && <span className="text-red-500 mt-1 text-xl">{emailError}</span>}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-8">
                        <NavLink
                            to="/login"
                            className="inline-flex items-center justify-center px-8 py-3 rounded-md shadow-sm text-2xl font-bold bg-gray-100  border hover:bg-gray-20 hover:bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Hủy
                        </NavLink>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="inline-flex items-center justify-center px-12 py-3 rounded-md shadow-sm text-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Gửi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
