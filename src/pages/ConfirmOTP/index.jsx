import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosClient } from '~/api/apiRequest';
import { useOtpToken } from '~/context/OTPContext';

function ConfirmOTP() {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const inputRefs = useRef([]);

    const { emailRegister, otpToken } = useOtpToken();

    const navigate = useNavigate();
    // Handle input change
    const handleChange = (index, value) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Handle paste
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((value, index) => {
            if (index < 6) newOtp[index] = value;
        });
        setOtp(newOtp);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        try {
            const response = await axiosClient.post(`/verify-account/${otpToken}`, {
                otpCode: otpString,
            });

            if (response.status === 'OK') {
                toast.success('Đăng kí thành công');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else if (response.status === 'ERR') {
                toast.error('OTP không trùng khớp');
            } else {
                toast.error('OTP đã hết hạn');
            }
        } catch (error) {
            console.error(error);
            toast.error('Đăng kí không thành công');
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#e9ebee]">
            <div className="bg-white rounded-lg shadow-md w-[500px]">
                <div className="text-center">
                    <h1 className="text-4xl font-semibold px-7 py-5">Nhập mã OTP</h1>
                </div>

                <p className="text-xl mb-6 text-center">Mã OTP đã được gửi đến email: {emailRegister}</p>

                <form onSubmit={handleSubmit} className="pb-10 px-16">
                    <div className="flex justify-center gap-6 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                ref={(el) => (inputRefs.current[index] = el)}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-20 h-20 text-center border-2 border-gray-300 rounded-lg text-4xl font-medium focus:border-blue-500 focus:outline-none"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white  py-3 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Xác nhận
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ConfirmOTP;
