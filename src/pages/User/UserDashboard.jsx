import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '~/components/SidebarUser/Sidebar'; // Adjust the path to your Sidebar component
import UserProfile from './UserProfile';
import AppointmentManagement from './AppointmentManagement';
import PatientRecords from './PatientRecords';
import ChangePassword from './ChangePassword';

const UserDashboard = () => {
    const [selectedTab, setSelectedTab] = useState('profile'); // Default to 'profile'

    const handleSelectTab = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="flex h-screen bg-neutral-50 ml-14">
            {/* Sidebar */}
            <Sidebar onSelectTab={handleSelectTab} selectedTab={selectedTab} />

            {/* Main content */}
            <div className="flex-1 px-11 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default UserDashboard;
