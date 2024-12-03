import { Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminLayout from '~/layouts/AdminLayout';
import { useContext } from 'react';
import { UserContext } from '~/context/UserContext';
import { Fragment } from 'react';
import Admin from '~/pages/Admin';
import ClinicManagement from '~/pages/Admin/ClinicManagement';
import DoctorManagement from '~/pages/Admin/DoctorManagement';
import UserManagement from '~/pages/Admin/UserManagement';
import SpecialtyManagement from '~/pages/Admin/SpecialtyManagement';
import ScheduleManagement from '~/pages/Admin/ScheduleManagement';
import WorktimeManagement from '~/pages/Admin/WorktimeManagement';
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
                <Route path="dashboard" element={<Admin />} />
                <Route path="clinic" element={<ClinicManagement />} />
                <Route path="doctor" element={<DoctorManagement />} />
                <Route path="user" element={<UserManagement />} />
                <Route path="specialty" element={<SpecialtyManagement />} />
                <Route path="schedule" element={<ScheduleManagement />} />
                <Route path="worktime" element={<WorktimeManagement />} />
                <Route path="comment" element={<CommentManagement />} />
            </Route>
        </Fragment>
    );
}

export default AdminRoutes;
