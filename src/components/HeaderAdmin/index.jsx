import { useContext, useEffect, useState } from 'react';
import { UserContext } from '~/context/UserContext';
import { FiMenu } from 'react-icons/fi';
import { IoLogOutOutline, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { axiosInstance } from '~/api/apiRequest';
import avatar from '../../assets/img/avatar.png';
import { ThemeContext } from '~/context/ThemeProvider';
import { ClinicContext } from '~/context/ClinicContext';
function Header() {
    const { user, logout } = useContext(UserContext);
    const {clearClinicId}  = useContext(ClinicContext);
    const { isDark, toggleTheme } = useContext(ThemeContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
        clearClinicId();
    };

    useEffect(() => {
        const fetchFullName = async () => {
            if (user.userId) {
                try {
                    const response = await axiosInstance.get(`/user/${user.userId}`);
                    console.log("resonse", response);
                    
                    if (response.status === 200) {
                        const imageUrl = response.data.image ? response.data.image : avatar;
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
        <header className="fixed top-0 right-0 left-60  z-50  bg-[var(--bg-primary)]">
            <div className="flex justify-between items-stretch border-b border-[var(--border-primary)] h-[68px] px-3">
                <div className="mx-1 my-auto">
                    <div className="w-[34px] h-[34px]  p-2">
                        <FiMenu className="text-lg" />
                    </div>
                </div>
                <ul className="my-auto flex items-stretch">
                    <li onClick={toggleTheme} className="mx-1 my-auto cursor-pointer">
                        <div className="w-[34px] h-[34px]  p-2">
                            {isDark ? <IoMoonOutline className="text-lg" /> : <IoSunnyOutline className="text-lg" />}
                        </div>
                    </li>
                    <li
                        className="flex justify-center items-center"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <div className="flex justify-center items-center cursor-pointer">
                            <div>
                                <img
                                    className="w-7 h-7 rounded-full"
                                    src={userInfo && userInfo.image ? userInfo.image : avatar}
                                    alt="Avatar"
                                />
                            </div>
                            <div className="ml-2">
                                <p className="font-medium">
                                    {userInfo && userInfo.fullname ? userInfo.fullname : 'Guest'}
                                </p>
                            </div>
                        </div>
                        {isDropdownOpen && (
                            <div
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                className="absolute top-12  right-0 h-3 min-w-44 bg-transparent"
                            ></div>
                        )}
                        {isDropdownOpen && (
                            <div
                                className="absolute right-0 top-12  bg-[var(--bg-primary)] mt-3 py-1 min-w-44 rounded-md border border-gray-200 shadow-[0_0_1px_0_rgba(0,0,0,0.04),0_2px_6px_0_rgba(0,0,0,0.04),0_10px_20px_0_rgba(0,0,0,0.04)]"
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >
                                <ul>
                                    {user && user.auth && (
                                        <li
                                            className="group px-4 py-2  text-[#e74c3c] font-medium hover:bg-[var(--bg-tertiary)] cursor-pointer flex items-center"
                                            onClick={handleLogout}
                                        >
                                            <IoLogOutOutline className="mr-2 transform group-hover:animate-rotate-fast" />
                                            Đăng xuất
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </li>
                </ul>
            </div>

            {/* Mobile Menu */}
            {/* {isOpen && (
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
            )} */}
        </header>
    );
}

export default Header;
