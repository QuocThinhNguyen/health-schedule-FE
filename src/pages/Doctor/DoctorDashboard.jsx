import React, { useState, useEffect } from 'react';
import Sidebar from '~/components/SidebarDoctor/Sidebar'; // Import Sidebar component
import DoctorInfo from './DoctorInfo'; // Import các component chức năng
import AppointmentManagement from './AppointmentManagement';
import WorkScheduleManagement from './WorkScheduleManagement';
import { Outlet } from 'react-router-dom';

const DoctorDashboard = () => {
    // State để lưu tab đang chọn
    const [selectedTab, setSelectedTab] = useState('overview'); // Mặc định là "patients"
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar onSelectTab={setSelectedTab} selectedTab={selectedTab} />

            {/* Nội dung chính */}
            <div className="flex-1 p-6 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default DoctorDashboard;
