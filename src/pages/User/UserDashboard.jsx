import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '~/components/SidebarUser/Sidebar'; // Adjust the path to your Sidebar component

const UserDashboard = () => {
    const [selectedTab, setSelectedTab] = useState('profile'); // Default to 'profile'

    const handleSelectTab = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc]">
            <div className='flex max-w-6xl mx-auto'>
                {/* Sidebar */}
                <Sidebar onSelectTab={handleSelectTab} selectedTab={selectedTab} />
    
                {/* Main content */}
                <div className="flex-1 px-11 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
