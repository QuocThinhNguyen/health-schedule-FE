import { Route, Navigate } from 'react-router-dom';
import UserDashboard from '~/pages/User/UserDashboard';
import UserProfile from '~/pages/User/UserProfile';
import AppointmentManagement from '~/pages/User/AppointmentManagement';
import PatientRecords from '~/pages/User/PatientRecords';
import ChangePassword from '~/pages/User/ChangePassword';
import HomeLayout from '~/layouts/HomeLayout';
import { Fragment } from 'react';
import PrivateRoute from './PrivateRoute';
import { useContext } from 'react';
import { UserContext } from '~/context/UserContext';
import UserLayout from '~/layouts/UserLayout';
import UpdateRecord from '~/pages/User/UpdateRecord';
import AddRecord from '~/pages/User/AddRecord';
const UserRoutes = () => {
    const { user } = useContext(UserContext);

    return (
        <Fragment>
            <Route
                path="/user"
                element={
                    <PrivateRoute isAllowed={!!user && user.role.includes('R3')} redirectPath="/404">
                        <UserLayout />
                    </PrivateRoute>
                }
            >
                <Route index element={<Navigate to="profile" />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="appointments" element={<AppointmentManagement />} />
                <Route path="records" element={<PatientRecords />} />
                <Route path="records/addNew" element={<AddRecord />}></Route>
                <Route path="records/update" element={<UpdateRecord />}></Route>

                <Route path="change-password" element={<ChangePassword />} />
            </Route>
        </Fragment>
    );
};

export default UserRoutes;
