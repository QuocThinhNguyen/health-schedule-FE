import ClinicLayout from '~/layouts/ClinicLayout';
import PrivateRoute from './PrivateRoute';
import { Fragment, useContext } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { UserContext } from '~/context/UserContext';
import DashboardManagement from '~/pages/Clinic/DashboardManagement';
import UpdateDoctorSchedule from '~/pages/Clinic/DoctorScheduleManagement/UpdateDoctorSchedule';
import DoctorManagement from '~/pages/Clinic/DoctorManagement';
import UpdateDoctor from '~/pages/Clinic/DoctorManagement/UpdateDoctor';
import BookingManagement from '~/pages/Clinic/BookingManagement';
import UpdateBooking from '~/pages/Clinic/BookingManagement/UpdateBooking';
import DoctorScheduleManagement from '~/pages/Clinic/DoctorScheduleManagement';
import CreateDoctorSchedule from '~/pages/Clinic/DoctorScheduleManagement/CreateDoctorSchedule';
import CommentManagement from '~/pages/Clinic/CommentManagement';
import UpdatePost from '~/pages/Clinic/PostManagement/UpdatePost';
import CreatePost from '~/pages/Clinic/PostManagement/CreatePost';
import PostManagement from '~/pages/Clinic/PostManagement';
import ChatApp from '~/pages/Chat/ChatApp';
import ServiceScheduleManagement from '~/pages/Clinic/ServiceScheduleManagement';
import CreateServiceSchedule from '~/pages/Clinic/ServiceScheduleManagement/CreateServiceSchedule';
import UpdateServiceSchedule from '~/pages/Clinic/ServiceScheduleManagement/UpdateServiceSchedule';

function ClinicRoutes() {
    const { user } = useContext(UserContext);

    return (
        <Fragment>
            <Route
                path="/clinic"
                element={
                    <PrivateRoute isAllowed={!!user && user.role.includes('R4')} redirectPath="/404">
                        <ClinicLayout />
                    </PrivateRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<DashboardManagement />} />
                <Route path="doctor" element={<DoctorManagement />} />
                <Route path="doctor/update-doctor/:id" element={<UpdateDoctor />} />
                <Route path="booking" element={<BookingManagement />} />
                <Route path="booking/update-booking/:id" element={<UpdateBooking />} />
                <Route path="doctor-schedule" element={<DoctorScheduleManagement />} />
                <Route path="doctor-schedule/create-doctor-schedule" element={<CreateDoctorSchedule />} />
                <Route
                    path="doctor-schedule/update-doctor-schedule/:doctorId/:scheduleDate"
                    element={<UpdateDoctorSchedule />}
                />
                <Route path="service" element={<BookingManagement />} />
                <Route path="service-schedule" element={<ServiceScheduleManagement />} />
                <Route path="service-schedule/create-service-schedule" element={<CreateServiceSchedule />} />
                <Route
                    path="service-schedule/update-service-schedule/:serviceId/:scheduleDate"
                    element={<UpdateServiceSchedule />}
                />
                <Route path="post" element={<PostManagement />} />
                <Route path="post/create-post" element={<CreatePost />} />
                <Route path="post/update-post/:id" element={<UpdatePost />} />
                <Route path="comment" element={<CommentManagement />} />
                <Route path="chat" element={<ChatApp />} />
            </Route>
        </Fragment>
    );
}
export default ClinicRoutes;
