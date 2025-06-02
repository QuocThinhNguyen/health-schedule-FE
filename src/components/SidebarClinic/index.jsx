import {IoNewspaperOutline } from 'react-icons/io5';
import { useNavigate, NavLink } from 'react-router-dom';
import { LuLayoutDashboard } from 'react-icons/lu';
import { FaUserDoctor } from 'react-icons/fa6';
import { SlCalender } from 'react-icons/sl';
import { MdOutlineAccessTime, MdOutlineComment } from 'react-icons/md';
import Logo from '../Logo';

function SidebarClinic() {
    const navigate = useNavigate();
    const menuItems = [
        { path: '/clinic/dashboard', label: 'Bảng thống kê', icon: <LuLayoutDashboard /> },
        { path: '/clinic/doctor', label: 'Quản lý bác sĩ', icon: <FaUserDoctor /> },
        { path: '/clinic/booking', label: 'Quản lý lịch hẹn', icon: <SlCalender /> },
        { path: '/clinic/doctor-schedule', label: 'Quản lý thời gian làm việc', icon: <MdOutlineAccessTime /> },
        { path: '/clinic/service-category', label: 'Quản lý loại dịch vụ', icon: <SlCalender /> },
        { path: '/clinic/service', label: 'Quản lý dịch vụ', icon: <SlCalender /> },
        { path: '/clinic/service-schedule', label: 'Quản lý thời gian dịch vụ', icon: <MdOutlineAccessTime /> },
        { path: '/clinic/post', label: 'Quản lý tin tức', icon: <IoNewspaperOutline /> },
        { path: '/clinic/comment', label: 'Quản lý bình luận', icon: <MdOutlineComment /> },
        // { path: '/clinic/chat', label: 'Chăm sóc khách hàng', icon: <IoChatboxEllipsesOutline  /> },
    ];

    return (
        <div className="fixed top-0 bottom-0 w-60 border-r border-[var(--border-primary)] transition-all duration-300 z-50">
            <div className="px-4 py-3 w-full h-[68px] border-b border-[var(--border-primary)] flex justify-center items-center">
                <Logo />
            </div>
            <ul className="w-full py-2">
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

export default SidebarClinic;
