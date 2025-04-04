import { NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '~/context/UserContext';
import { FiMenu } from 'react-icons/fi';
import { FaRegAddressBook } from 'react-icons/fa';
import { IoLogOutOutline } from 'react-icons/io5';
import { IoMdKey } from 'react-icons/io';
import { axiosInstance } from '~/api/apiRequest';
import avatar from '../../assets/img/avatar.png';
import Logo from '~/components/Logo';
import { X } from 'lucide-react';

function Header() {
    const IMAGE_URL = 'http://localhost:9000/uploads';

    const { user, logout } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [isLogout, setIsLogout] = useState(false);

    // const handleLogout = () => {
    //     setIsDropdownOpen(false);
    //     logout();
    // };

    const handleLogout = () => {
        setIsLogout(true);
    };

    const onClose = () => {
        setIsLogout(false);
    };

    const onConfirm = () => {
        setIsDropdownOpen(false);
        setIsLogout(false);
        logout();
    };
    useEffect(() => {
        const fetchFullName = async () => {
            if (user.userId) {
                try {
                    const response = await axiosInstance.get(`/user/${user.userId}`);
                    if (response.status === 200) {
                        const imageUrl = response.data.image ? `${IMAGE_URL}/${response.data.image}` : avatar;
                        const img = new Image();
                        img.src = imageUrl;
                        img.onload = () => {
                            setUserInfo({ ...response.data, image: imageUrl });
                        };
                        img.onerror = () => {
                            setUserInfo({ ...response.data, image: avatar });
                        };
                    } else {
                        console.error('Failed to fetch data:', response.message);
                        setUserInfo([]);
                    }
                } catch (error) {
                    console.error('Error fetching appointments:', error);
                    setUserInfo([]);
                }
            }
        };
        fetchFullName();
    }, [user]);

    const today = new Date().toLocaleDateString('vi-VN');
    return (
        <header className="bg-white shadow fixed top-0 left-0 right-0 z-50">
            <div className="relative z-10 mx-auto px-8 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14">
                    {/* Logo */}
                    <NavLink
                        to="/"
                        onClick={(e) => {
                            if (window.location.pathname === '/') {
                                e.preventDefault();
                                window.scrollTo(0, 0);
                            }
                        }}
                        className="flex-shrink-0 flex items-center mr-auto"
                    >
                        <Logo />
                    </NavLink>

                    {/* Navigation */}
                    <nav className="hidden sm:ml-2 sm:flex sm:space-x-4 text-[#1B3250]">
                        <NavLink
                            to="/tat-ca-benh-vien"
                            className="inline-flex items-center px-1 text-base font-bold hover:opacity-80"
                        >
                            Bệnh viện
                        </NavLink>
                        <NavLink
                            to="/tat-ca-bac-si"
                            className="inline-flex items-center px-1 text-base font-bold hover:opacity-80"
                        >
                            Bác sĩ
                        </NavLink>
                        <NavLink
                            to="/tat-ca-dich-vu"
                            className="inline-flex items-center px-1 text-base font-bold hover:opacity-80"
                        >
                            Dịch vụ
                        </NavLink>
                        <NavLink
                            to="/tin-tuc"
                            className="inline-flex items-center px-1 text-base font-bold hover:opacity-80"
                        >
                            Tin tức
                        </NavLink>
                    </nav>

                    {/* Login Button */}
                    <div className="hidden sm:ml-10 sm:flex sm:items-center">
                        {user && !user.auth ? (
                            <>
                                <NavLink
                                    to="/login"
                                    className="ml-2 inline-flex items-center justify-center px-6 py-2 border-transparent rounded-md shadow-sm text-base bg-[#2D87F3] hover:bg-white border hover:border-[#2D87F3] hover:text-[#2D87F3] text-white font-bold"
                                >
                                    Đăng nhập
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="ml-2 inline-flex items-center justify-center px-6 py-2 border-transparent rounded-md shadow-sm text-base bg-[#2D87F3] hover:bg-white border hover:border-[#2D87F3] hover:text-[#2D87F3] text-white font-bold"
                                >
                                    Đăng kí
                                </NavLink>
                            </>
                        ) : (
                            <div
                                className="relative inline-block text-left"
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >
                                <div className="flex justify-center items-center cursor-pointer">
                                    <div>
                                        <img
                                            className="w-8 h-8 rounded-full"
                                            src={userInfo && userInfo.image ? userInfo.image : avatar}
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className="ml-1">
                                        <p className="text-lg font-bold">
                                            {userInfo && userInfo.fullname ? userInfo.fullname : 'Guest'}
                                        </p>
                                    </div>
                                </div>
                                {isDropdownOpen && (
                                    <div className="absolute top-8 left-0 right-0 h-3 bg-transparent"></div>
                                )}
                                {isDropdownOpen && (
                                    <div
                                        className="absolute -right-6  bg-white mt-3 w-60 text-left rounded-xl border border-gray-200 shadow-[0_0_1px_0_rgba(0,0,0,0.04),0_2px_6px_0_rgba(0,0,0,0.04),0_10px_20px_0_rgba(0,0,0,0.04)]"
                                        onMouseEnter={() => setIsDropdownOpen(true)}
                                        onMouseLeave={() => setIsDropdownOpen(false)}
                                    >
                                        <div className="px-4 py-2 border-b">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div>
                                                    <div className="text-sm text-gray-600">Xin chào,</div>
                                                    <div className="text-blue-500 font-medium">
                                                        {userInfo && userInfo.fullname ? userInfo.fullname : 'Guest'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="mt-2 border-b">
                                            <li className="group px-4 py-3 text-left text-base font-medium hover:bg-slate-100 cursor-pointer flex items-center">
                                                <NavLink
                                                    to="/user/profile"
                                                    className={({ isActive }) =>
                                                        isActive
                                                            ? 'text-blue-500 flex items-center w-full'
                                                            : 'flex items-center w-full'
                                                    }
                                                >
                                                    <img src="/user.png" alt={'profile'} className="h-5 w-5 mr-2" />
                                                    Hồ sơ cá nhân
                                                </NavLink>
                                            </li>
                                            <li className="group px-4 py-3 text-left text-base font-medium hover:bg-slate-100 cursor-pointer flex items-center">
                                                <NavLink
                                                    to="/user/appointments"
                                                    className={({ isActive }) =>
                                                        isActive
                                                            ? 'text-blue-500 flex items-center w-full'
                                                            : 'flex items-center w-full'
                                                    }
                                                >
                                                    <img
                                                        src="/schedule.png"
                                                        alt={'schedule'}
                                                        className="h-5 w-5 mr-2"
                                                    />
                                                    Lịch sử đặt khám
                                                </NavLink>
                                            </li>

                                            <li className="group px-4 py-3 text-left text-base font-medium hover:bg-slate-100 cursor-pointer flex items-center">
                                                <NavLink
                                                    to="/user/records"
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
                                                    to="/user/change-password"
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
                                            </li>
                                            <li className="group px-4 py-3 text-left text-base font-medium hover:bg-slate-100 cursor-pointer flex items-center">
                                                <NavLink
                                                    to="/user/help"
                                                    className={({ isActive }) =>
                                                        isActive
                                                            ? 'text-blue-500 flex items-center w-full'
                                                            : 'flex items-center w-full'
                                                    }
                                                >
                                                    <img
                                                        src="/question.png"
                                                        alt={'question'}
                                                        className="h-5 w-5 mr-2"
                                                    />
                                                    Trợ giúp
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
                                        <div className="px-4 py-2 text-sm text-gray-500">
                                            Cập nhật mới nhất: {today}
                                        </div>
                                    </div>
                                )}
                            </div>
                            // <NavLink
                            //     className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            //     onClick={handleLogout}
                            // >
                            //     Logout
                            // </NavLink>
                        )}
                    </div>
                    <div className="p-5 flex items-center sm:hidden" onClick={() => setIsOpen(!isOpen)}>
                        <FiMenu />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink
                            to="/tat-ca-benh-vien"
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        >
                            Bệnh viện
                        </NavLink>
                        <NavLink
                            to="/tat-ca-bac-si"
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        >
                            Bác sĩ
                        </NavLink>
                        <NavLink
                            to="/tat-ca-dich-vu"
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        >
                            Dịch vụ
                        </NavLink>
                    </div>
                    <div className="pb-3 border-t border-gray-200">
                        {user && !user.auth ? (
                            <>
                                <NavLink
                                    to="/login"
                                    className="block px-4 py-2 text-base font-medium text-center text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Đăng nhập
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="block px-4 py-2 mt-2 text-base font-medium text-center text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Đăng kí
                                </NavLink>
                            </>
                        ) : (
                            <NavLink
                                className="block px-4 py-2 text-base font-medium text-center text-white bg-blue-600 hover:bg-blue-700"
                                onClick={handleLogout}
                            >
                                Logout
                            </NavLink>
                        )}
                    </div>
                </div>
            )}
            {isLogout && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 bg-opacity-50 z-10">
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
        </header>
    );
}

export default Header;
