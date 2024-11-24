import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '~/components/SidebarUser/Sidebar'; // Adjust the path to your Sidebar component
import UserProfile from './UserProfile';
import AppointmentManagement from './AppointmentManagement';
import PatientRecords from './PatientRecords';
import ChangePassword from './ChangePassword';

const UserDashboard = () => {
    // State to track the currently selected tab
    const [selectedTab, setSelectedTab] = useState('profile'); // Default to 'profile'
    // const navigate = useNavigate();

    // // Function to handle tab selection, updating both state and URL
    // const handleSelectTab = (tab) => {
    //     setSelectedTab(tab);
    //     if (tab === 'profile') navigate('/user/profile');
    //     if (tab === 'appointments') navigate('/user/appointments');
    //     if (tab === 'records') navigate('/user/records');
    // };
    const handleSelectTab = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="flex h-screen mt-20">
            {/* Sidebar */}
            <Sidebar onSelectTab={handleSelectTab} selectedTab={selectedTab} />

            {/* Main content */}
            <div className="flex-1 p-6 overflow-auto">
                <Outlet />
                {/* {selectedTab === 'profile' && <UserProfile />}
                {selectedTab === 'appointments' && <AppointmentManagement />}
                {selectedTab === 'patientRecords' && <PatientRecords />}
                {selectedTab === 'changePassWord' && <ChangePassword />} */}
                {/* <Routes>
                    <Route path="/user/profile" element={<UserProfile />} />
                    <Route path="/user/appointments" element={<AppointmentManagement />} />
                    <Route path="/user/records" element={<PatientRecords />} />
                </Routes> */}
            </div>
        </div>
    );
};

export default UserDashboard;
