import { useState } from 'react';
import { IoMenu, IoNewspaperOutline } from 'react-icons/io5';
import { useNavigate, NavLink } from 'react-router-dom';
import { LuLayoutDashboard } from 'react-icons/lu';
import { CiHospital1 } from 'react-icons/ci';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaRegUser } from 'react-icons/fa';
import { LiaStethoscopeSolid } from 'react-icons/lia';
import { SlCalender } from 'react-icons/sl';
import { MdOutlineAccessTime, MdOutlineComment } from 'react-icons/md';
import Logo from '../Logo';

function SidebarAdmin() {
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate();
    const toggleAdminMenu = () => {
        setIsExpanded(!isExpanded);
    };
    const menuItems = [
        { path: '/admin/dashboard', label: 'Bảng thống kê', icon: <LuLayoutDashboard /> },
        { path: '/admin/clinic', label: 'Quản lý bệnh viện', icon: <CiHospital1 /> },
        { path: '/admin/doctor', label: 'Quản lý bác sĩ', icon: <FaUserDoctor /> },
        { path: '/admin/user', label: 'Quản lý tài khoản người dùng', icon: <FaRegUser /> },
        { path: '/admin/specialty', label: 'Quản lý chuyên khoa', icon: <LiaStethoscopeSolid /> },
        { path: '/admin/booking', label: 'Quản lý lịch hẹn', icon: <SlCalender /> },
        { path: '/admin/doctor-schedule', label: 'Quản lý thời gian làm việc', icon: <MdOutlineAccessTime /> },
        { path: '/admin/post', label: 'Quản lý tin tức', icon: <IoNewspaperOutline /> },
        { path: '/admin/comment', label: 'Quản lý bình luận', icon: <MdOutlineComment /> },
    ];

    return (
        <div className="fixed top-0 bottom-0 w-60 border-r border-[var(--border-primary)] transition-all duration-300 z-50">
            <div className="px-4 py-3 w-full h-[68px] border-b border-[var(--border-primary)] flex justify-center items-center">
                <Logo />
            </div>
            <ul className="w-full py-2">
                {/* Menu items */}
                {menuItems.map((item) => (
                    <li key={item.path} className="px-4" onClick={() => navigate(item.path)}>
                        <NavLink
                            className={`my-1 px-3 py-[11px] rounded flex justify-start items-center border border-transparent ${
                                location.pathname === item.path
                                    ? 'text-[var(--text-active)]  bg-[var(--bg-active)]'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-active)] hover:bg-[rgba(var(--bg-active-rgb),0.9)]'
                            }`}
                        >
                            <span className="text-lg mr-3">{item.icon}</span>
                            <span className="text-sm leading-[14px]">{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SidebarAdmin;
