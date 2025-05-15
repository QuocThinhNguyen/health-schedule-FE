import { useEffect, useRef, useState, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { axiosClient } from '~/api/apiRequest';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import './CSS/button_facebook.css';
import './CSS/button_google.css';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useSocket } from '../Chat/useSocket';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const inputFocus = useRef(null);

    useEffect(() => {
        if (inputFocus.current) {
            inputFocus.current.focus();
        }
    }, []);

    const navigate = useNavigate();

    const { user, loginContext, loginContextGoogle } = useContext(UserContext);
    const socket = useMemo(() => {
        const decodeToken = user.auth ? jwtDecode(user.accessToken) : null;
        return decodeToken ? useSocket(decodeToken.userId) : null;
    }, [user]);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
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

    if (user.auth) {
        navigate('/', { replace: true });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post(`/sign-in`, {
                email,
                password,
            });
            console.log('login', res);

            if (res.status === 200) {
                loginContext(email, res.access_token);
                const decodeToken = jwtDecode(res.access_token);
                toast.success('Đăng nhập thành công');
                // useSocket(decodeToken.userId);
                if (decodeToken.roleId === 'R1') {
                    navigate('/admin/dashboard', { replace: true });
                } else if (decodeToken.roleId === 'R2') {
                    navigate('/doctor/', { replace: true });
                } else if (decodeToken.roleId === 'R3') {
                    navigate('/', { replace: true });
                } else if (decodeToken.roleId === 'R4') {
                    navigate('/clinic', { replace: true });
                }
            } else {
                toast.error('Đăng nhập thất bại');
            }
        } catch (error) {
            console.log('error', error);
            toast.error('Đăng nhập thất bại');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const handleSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            const result = await axiosClient.post(`/google-login`, { token });
            if (result.status === 200) {
                loginContext(result.data.email, result.access_token);
                // loginContextGoogle(result.data.email, result.data.userId, result.data.roleId, result.access_token);
                toast.success('Đăng nhập thành công');
                if (result.data.roleId === 'R1') {
                    navigate('/admin/clinic', { replace: true });
                } else if (result.data.roleId === 'R2') {
                    navigate('/doctor/', { replace: true });
                } else if (result.data.roleId === 'R3') {
                    navigate('/', { replace: true });
                }
            } else {
                toast.error('Đăng nhập thất bại');
            }
            console.log(token);
        } catch (error) {
            console.log('error', error);
        }
    };

    const handleError = () => {
        console.log('error');
        toast.error('Đăng nhập thất bại');
    };

    const login = useGoogleLogin({
        onSuccess: handleSuccess,
        onError: handleError,
    });

    const handlClickFacebook = (data) => {};

    const handleResponseFacebook = async (data) => {
        try {
            const accessToken = data.accessToken;
            const result = await axiosClient.post(`/facebook-login`, { accessToken });
            if (result.status === 200) {
                loginContext(result.data.email, result.access_token);
                // loginContextGoogle(result.data.email, result.data.userId, result.data.roleId, result.access_token);
                toast.success('Đăng nhập thành công');
                if (result.data.roleId === 'R1') {
                    navigate('/admin/dashboard', { replace: true });
                } else if (result.data.roleId === 'R2') {
                    navigate('/doctor/', { replace: true });
                } else if (result.data.roleId === 'R3') {
                    navigate('/', { replace: true });
                }
            } else {
                toast.error('Đăng nhập thất bại');
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#e9ebee]">
            <div className="w-full max-w-lg p-6 bg-white shadow-xl border rounded-lg">
                <div className="mb-6">
                    <h3 className="text-3xl font-bold text-black text-center">Đăng nhập</h3>
                </div>
                <div>
                    <div className="my-4">
                        <input
                            ref={inputFocus}
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
                    <div className="my-4 relative">
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
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 text-lg"
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? <IoEye /> : <IoEyeOff />}
                            </button>
                        </div>
                        {passwordError && <span className="text-red-500 text-xs">{passwordError}</span>}
                    </div>
                    <div className="text-right my-4">
                        <NavLink to="/forgot-password" className="text-blue-500 text-base font-semibold">
                            Quên mật khẩu?
                        </NavLink>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="w-full text-white font-semibold bg-blue-500 px-4 py-3 rounded-md hover:bg-blue-600"
                            onClick={handleSubmit}
                        >
                            Đăng nhập
                        </button>
                    </div>

                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-500">hoặc</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                        </div>

                        <div className="mt-[3px] w-[214px]">
                            <FacebookLogin
                                appId={import.meta.env.VITE_APP_FB_CLIENT_ID}
                                fields="name,email,picture"
                                callback={handleResponseFacebook}
                                cssClass="custom-facebook-button"
                                textButton={
                                    <div className="facebook-button-text">
                                        <span className="facebook-icon"></span>
                                        <span
                                            className="flex items-center justify-center h-full w-full font-semibold"
                                            style={{ fontFamily: '"Google Sans", arial, sans-serif' }}
                                        >
                                            Sign in with Facebook
                                        </span>
                                    </div>
                                }
                            />
                        </div>
                    </div>

                    {/* <button
                        onClick={() => login()}
                        className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-600"
                    >
                        Đăng nhập bằng Google
                    </button> */}

                    {/* <div>
                        <GoogleLogin
                            clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}
                            render={(renderProps) => (
                                <button
                                    className="custom-google-button"
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                >
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                                        alt="Google Icon"
                                        className="google-icon"
                                    />
                                    Đăng nhập bằng Google
                                </button>
                            )}
                            onSuccess={handleSuccess}
                            onFailure={handleFailure}
                            cookiePolicy="single_host_origin"
                        />
                    </div> */}

                    {/* <div>
                        <button onClick={() => login()}>Sign in with Google 🚀</button>;
                    </div> */}

                    <div className="text-center mt-4">
                        <span className="text-gray-500">Bạn chưa có tài khoản?</span>
                        <NavLink to="/register" className="text-blue-500 ml-1 font-medium">
                            Đăng ký
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
