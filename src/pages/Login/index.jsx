import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
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
    const location = useLocation();

    const { user, loginContext, loginContextGoogle } = useContext(UserContext);

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

            if (res.status === 200) {
                loginContext(email, res.access_token);
                toast.success('Đăng nhập thành công');
                const decodeToken = jwtDecode(res.access_token);
                console.log(decodeToken.roleId);

                if (decodeToken.roleId === 'R1') {
                    navigate('/admin/clinic', { replace: true });
                } else if (decodeToken.roleId === 'R2') {
                    navigate('/doctor/', { replace: true });
                } else if (decodeToken.roleId === 'R3') {
                    navigate('/', { replace: true });
                }
            } else {
                toast.error('Đăng nhập thất bại');
            }
        } catch (error) {
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
            console.log('RESULT: ', result);
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
            // console.log('TOKEN: ', accessToken);
            const result = await axiosClient.post(`/facebook-login`, { accessToken });
            // console.log('RESULT: ', result);
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
        } catch (error) {
            console.log('error', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#e9ebee]">
            <div className="w-full max-w-xl p-8 bg-white shadow-xl border rounded-2xl">
                <div className="mb-6">
                    <h3 className="text-4xl font-bold text-gray-800 text-center">Đăng nhập</h3>
                </div>
                <div>
                    <div className="mb-4">
                        <input
                            ref={inputFocus}
                            type="text"
                            className="w-full !bg-white h-[44px] mt-4 px-3 py-2  border border-gray-300 rounded-xl"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                            onKeyDown={handleKeyDown}
                        />
                        {emailError && <span className="text-red-500 mt-1 text-xl">{emailError}</span>}
                    </div>
                    <div className="mb-4 relative">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full !bg-white h-[44px] mt-4 pl-3 pr-12 py-2 border  border-gray-300 rounded-xl"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                type="button"
                                className="absolute top-[63%] right-3 transform -translate-y-1/2 text-gray-500 "
                                onClick={toggleShowPassword}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {passwordError && <span className="text-red-500 mt-1 text-xl">{passwordError}</span>}
                    </div>
                    <div className="text-right my-6 text-xl ">
                        <NavLink to="/forgot-password" className="text-blue-500 text-2xl">
                            Quên mật khẩu?
                        </NavLink>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="w-full text-white font-semibold bg-blue-500 py-3 px-6 rounded-lg hover:bg-blue-600"
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

                    <div>
                        <div className="mt-4 w-full h-[44px] flex items-center justify-center bg-white rounded-lg border-none">
                            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                        </div>

                        <div className="mt-4">
                            <FacebookLogin
                                appId={import.meta.env.VITE_APP_FB_CLIENT_ID}
                                fields="name,email,picture"
                                callback={handleResponseFacebook}
                                cssClass="custom-facebook-button"

                                // textButton="Đăng nhập với Facebook"
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

                    <div className="text-center mt-6">
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
