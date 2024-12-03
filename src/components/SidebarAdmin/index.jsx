import { faClock, faHospital } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { IoMenu, IoTimeOutline } from 'react-icons/io5';
import Logo from '../Logo';
import { useNavigate } from 'react-router-dom';
import { CiHospital1 } from 'react-icons/ci';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaRegUser } from 'react-icons/fa';
import { LiaStethoscopeSolid } from 'react-icons/lia';
import { SlCalender } from 'react-icons/sl';
import { MdOutlineAccessTime, MdOutlineComment } from 'react-icons/md';

function SidebarAdmin() {
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate();
    const toggleAdminMenu = () => {
        setIsExpanded(!isExpanded);
    };
    const menuItems = [
        //{ path: '/admin/dashboard', label: 'Bảng thống kê', icon: <FontAwesomeIcon icon={faGauge} /> },
        { path: '/admin/clinic', label: 'Quản lý bệnh viện', icon: <CiHospital1 /> },
        { path: '/admin/doctor', label: 'Quản lý bác sĩ', icon: <FaUserDoctor /> },
        { path: '/admin/user', label: 'Quản lý tài khoản người dùng', icon: <FaRegUser /> },
        { path: '/admin/specialty', label: 'Quản lý chuyên khoa', icon: <LiaStethoscopeSolid /> },
        { path: '/admin/schedule', label: 'Quản lý lịch hẹn', icon: <SlCalender /> },
        { path: '/admin/worktime', label: 'Quản lý thời gian làm việc', icon: <MdOutlineAccessTime /> },
        { path: '/admin/comment', label: 'Quản lý bình luận', icon: <MdOutlineComment /> },
    ];

    return (
        <div className={`bg-white border-r transition-all duration-300 ${isExpanded ? 'w-[320px]' : 'w-[16px]'}`}>
            <ul className="space-y-2 mt-4">
                {/* Menu items */}
                {menuItems.map((item) => (
                    <li
                        key={item.path}
                        className={`cursor-pointer flex items-center px-4 py-2 rounded ${
                            location.pathname === item.path
                                ? 'bg-pink-500 text-white' // Nền hồng cho mục hiện tại
                                : 'hover:bg-gray-200' // Hover hiệu ứng cho mục khác
                        } ${isExpanded ? 'justify-start' : 'justify-center'}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="text-2xl">{item.icon}</span>
                        {isExpanded && <span className="ml-4">{item.label}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SidebarAdmin;
