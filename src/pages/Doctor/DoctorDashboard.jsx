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
                {/* Render các component tương ứng theo tab đã chọn */}
                {/* {selectedTab === 'overview' && <DoctorInfo />}
                {selectedTab === 'appointments' && <AppointmentManagement />}
                {selectedTab === 'schedule' && <WorkScheduleManagement />} */}
            </div>
        </div>
    );
};

export default DoctorDashboard;

// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import Sidebar from '../../components/Layouts/components/SidebarDoctor/Sidebar';
// import DoctorInfo from './DoctorInfo';
// import AppointmentManagement from './AppointmentManagement';
// import WorkScheduleManagement from './WorkScheduleManagement';

// const DoctorDashboard = () => {
//   const [selectedTab, setSelectedTab] = useState('overview');
//   const navigate = useNavigate();

//   // Khi chọn tab, cập nhật URL và đặt tab hiện tại
//   const handleSelectTab = (tab) => {
//     setSelectedTab(tab);
//     if (tab === 'overview') navigate('/doctor/profile');
//     if (tab === 'appointments') navigate('/doctor/manage');
//     if (tab === 'schedule') navigate('/doctor/schedule');
//   };

//   return (
//     <div className="flex h-screen">
//       <Sidebar onSelectTab={handleSelectTab} selectedTab={selectedTab} />
//       <div className="flex-1 p-6 overflow-auto">
//         <Routes>
//           <Route path="/doctor/profile" element={<DoctorInfo />} />
//           <Route path="/doctor/manage" element={<AppointmentManagement />} />
//           <Route path="/doctor/schedule" element={<WorkScheduleManagement />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default DoctorDashboard;
