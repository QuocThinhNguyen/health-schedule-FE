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
function Header() {
    const IMAGE_URL = 'http://localhost:9000/uploads';

    const { user, logout } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const handleLogout = () => {
        setIsDropdownOpen(false);
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

    return (
        <header className="bg-white shadow fixed top-0 left-0 right-0 z-50">
            <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    {/* Logo */}
                    <NavLink
                        to="/admin/clinic"
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

                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div
                            className="relative inline-block text-left"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <div className="flex justify-center items-center cursor-pointer">
                                <div>
                                    <img
                                        className="w-14 h-14 rounded-full"
                                        src={userInfo && userInfo.image ? userInfo.image : avatar}
                                        alt="Avatar"
                                    />
                                </div>
                                <div className="ml-2">
                                    <p className="text-2xl font-bold">
                                        {userInfo && userInfo.fullname ? userInfo.fullname : 'Guest'}
                                    </p>
                                </div>
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute top-14 left-0 right-0 h-3 bg-transparent"></div>
                            )}
                            {isDropdownOpen && (
                                <div
                                    className="absolute left-0  bg-white mt-3 py-2 w-56 min-w-64 text-left rounded-xl border border-gray-200   shadow-[0_0_1px_0_rgba(0,0,0,0.04),0_2px_6px_0_rgba(0,0,0,0.04),0_10px_20px_0_rgba(0,0,0,0.04)]"
                                    onMouseEnter={() => setIsDropdownOpen(true)}
                                    onMouseLeave={() => setIsDropdownOpen(false)}
                                >
                                    <ul className="py-1">
                                        {user && user.auth && (
                                            <li
                                                className="group px-4 py-2 text-left text-2xl text-[#e74c3c] font-medium hover:bg-slate-100 cursor-pointer flex items-center"
                                                onClick={handleLogout}
                                            >
                                                <IoLogOutOutline className="mr-2 transform group-hover:animate-rotate-fast" />
                                                Đăng xuất
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-5 flex items-center sm:hidden" onClick={() => setIsOpen(!isOpen)}>
                        <FiMenu />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="pb-3 border-t border-gray-200">
                        {user && user.auth && (
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
        </header>
    );
}

export default Header;
