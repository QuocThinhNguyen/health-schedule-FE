import { Fragment, useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { UserContext } from '~/context/UserContext';
import PrivateRoute from './PrivateRoute';
import AdminLayout from '~/layouts/AdminLayout';
import DashboardManagement from '~/pages/Admin/DashboardManagement';
import ClinicManagement from '~/pages/Admin/ClinicManagement';
import CreateClinic from '~/pages/Admin/ClinicManagement/CreateClinic';
import UpdateClinic from '~/pages/Admin/ClinicManagement/UpdateClinic';
import DoctorManagement from '~/pages/Admin/DoctorManagement';
import UpdateDoctor from '~/pages/Admin/DoctorManagement/UpdateDoctor';
import UserManagement from '~/pages/Admin/UserManagement';
import CreateUser from '~/pages/Admin/UserManagement/CreateUser';
import UpdateUser from '~/pages/Admin/UserManagement/UpdateUser';
import SpecialtyManagement from '~/pages/Admin/SpecialtyManagement';
import CreateSpecialty from '~/pages/Admin/SpecialtyManagement/CreateSpecialty';
import UpdateSpecialty from '~/pages/Admin/SpecialtyManagement/UpdateSpecialty';
import BookingManagement from '~/pages/Admin/BookingManagement';
import UpdateBooking from '~/pages/Admin/BookingManagement/UpdateBooking';
import DoctorScheduleManagement from '~/pages/Admin/DoctorScheduleManagement';
import CreateDoctorSchedule from '~/pages/Admin/DoctorScheduleManagement/CreateDoctorSchedule';
import UpdateDoctorSchedule from '~/pages/Admin/DoctorScheduleManagement/UpdateDoctorSchedule';
import PostManagement from '~/pages/Admin/PostManagement';
import CreatePost from '~/pages/Admin/PostManagement/CreatePost';
import UpdatePost from '~/pages/Admin/PostManagement/UpdatePost';
import CommentManagement from '~/pages/Admin/CommentManagement';

function AdminRoutes() {
    const { user } = useContext(UserContext);
    return (
        <Fragment>
            <Route
                path="/admin"
                element={
                    <PrivateRoute isAllowed={!!user && user.role.includes('R1')} redirectPath="/404">
                        <AdminLayout />
                    </PrivateRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<DashboardManagement />} />
                <Route path="clinic" element={<ClinicManagement />} />
                <Route path="clinic/create-clinic" element={<CreateClinic />} />
                <Route path="clinic/update-clinic/:id" element={<UpdateClinic />} />
                <Route path="doctor" element={<DoctorManagement />} />
                <Route path="doctor/update-doctor/:id" element={<UpdateDoctor />} />
                <Route path="user" element={<UserManagement />} />
                <Route path="user/create-user" element={<CreateUser />} />
                <Route path="user/update-user/:id" element={<UpdateUser />} />
                <Route path="specialty" element={<SpecialtyManagement />} />
                <Route path="specialty/create-specialty" element={<CreateSpecialty />} />
                <Route path="specialty/update-specialty/:id" element={<UpdateSpecialty />} />
                <Route path="booking" element={<BookingManagement />} />
                <Route path="booking/update-booking/:id" element={<UpdateBooking />} />
                <Route path="doctor-schedule" element={<DoctorScheduleManagement />} />
                <Route path="doctor-schedule/create-doctor-schedule" element={<CreateDoctorSchedule />} />
                <Route
                    path="doctor-schedule/update-doctor-schedule/:doctorId/:scheduleDate"
                    element={<UpdateDoctorSchedule />}
                />
                <Route path="post" element={<PostManagement />} />
                <Route path="post/create-post" element={<CreatePost />} />
                <Route path="post/update-post/:id" element={<UpdatePost />} />
                <Route path="comment" element={<CommentManagement />} />
            </Route>
        </Fragment>
    );
}

export default AdminRoutes;
