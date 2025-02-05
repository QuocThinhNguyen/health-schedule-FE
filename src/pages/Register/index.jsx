import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useRef, useState } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosClient } from '~/api/apiRequest';
import { useOtpToken } from '~/context/OTPContext';
function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [fullnameError, setFullnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const inputFocus = useRef(null);
    const { setEmailRegister, setOtpToken } = useOtpToken();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (inputFocus.current) {
            inputFocus.current.focus();
        }
    }, []);
    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleFullNameChange = (e) => {
        setFullname(e.target.value);
        setFullnameError('');
    };

    const handleFullnameBlur = () => {
        if (!fullname) {
            setFullnameError('Họ và tên không được để trống.');
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

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError('');
    };

    const handlePasswordBlur = () => {
        if (!password) {
            setPasswordError('Password không được để trống.');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError('');
    };
    const handleConfirmPasswordBlur = () => {
        if (!confirmPassword) {
            setConfirmPasswordError('Xác nhận password không được để trống.');
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('Mật khẩu không khớp. Vui lòng thử lại.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axiosClient.post('/sign-up', {
                fullname,
                email,
                password,
            });
            console.log(response);

            if (response.status === 200) {
                setEmailRegister(email);
                setOtpToken(response.otp_token);
                toast.success('OTP đã được gửi về email');
                setTimeout(() => {
                    navigate('/confirm-otp');
                }, 2000);
            } else {
                toast.error(`${response.message}`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Đăng ký không thành công');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#e9ebee]">
            <div className="w-full max-w-lg p-6 bg-white shadow-xl border rounded-lg">
                <div className="mb-6">
                    <h3 className="text-3xl font-bold text-black text-center">Đăng ký</h3>
                </div>
                <div>
                    <div className="mb-4">
                        <input
                            ref={inputFocus}
                            type="text"
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-blue-500"
                            placeholder="Họ và tên"
                            value={fullname}
                            onChange={handleFullNameChange}
                            onBlur={handleFullnameBlur}
                            onKeyDown={handleKeyDown}
                        />
                        {fullnameError && <span className="text-red-500 text-xs">{fullnameError}</span>}
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-blue-500"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                            onKeyDown={handleKeyDown}
                        />
                        {emailError && <span className="text-red-500 text-xs">{emailError}</span>}
                    </div>
                    <div className="mb-4 relative">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-blue-500"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 "
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? <IoEye /> : <IoEyeOff />}
                            </button>
                        </div>
                        {passwordError && <span className="text-red-500 text-xs">{passwordError}</span>}
                    </div>
                    <div className="mb-4 relative">
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-blue-500"
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                onBlur={handleConfirmPasswordBlur}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 "
                                onClick={toggleShowConfirmPassword}
                            >
                                {setConfirmPassword ? <IoEye /> : <IoEyeOff />}
                            </button>
                        </div>
                        {confirmPasswordError && <span className="text-red-500 text-xs">{confirmPasswordError}</span>}
                    </div>
                    <div>
                        <button
                            type="button"
                            className="w-full text-white font-semibold bg-blue-500 px-4 py-3 rounded-md hover:bg-blue-600"
                            onClick={handleSubmit}
                        >
                            Đăng ký
                        </button>
                        {isLoading && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                <img
                                    src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                                    alt="Loading..."
                                    className="w-16 h-16"
                                />
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-4">
                        <span className="text-gray-500">Bạn đã có tài khoản?</span>
                        <NavLink to="/login" className="text-blue-500 ml-1 font-medium">
                            Đăng nhập
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
