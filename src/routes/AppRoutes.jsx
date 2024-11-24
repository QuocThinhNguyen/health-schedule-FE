import { Routes, Route } from 'react-router-dom';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import Page404 from '~/pages/Page404';
import AdminRoutes from '~/routes/AdminRoutes';
import DoctorRoutes from '~/routes/DoctorRoutes';
import HomeLayout from '~/layouts/HomeLayout';
import DoctorInfo from '~/pages/User/DoctorInfo';
import UserRoutes from './UserRoutes';
import ForgotPassword from '~/pages/ForgotPassword';
import ConfirmOTP from '~/pages/ConfirmOTP';
import AllDoctor from '~/pages/User/AllDoctor';
import ChoosePatientRecord from '~/pages/User/ChoosePatientRecords';
import ConfirmInfomation from '~/pages/User/ConfirmInfomation';
import ClinicInfo from '~/pages/User/ClinicInfo';
import Specialties from '~/pages/User/Specialties';
import AllClinic from '~/pages/User/AllClinic';
import AllSpecialty from '~/pages/User/AllSpecialty';

function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/confirm-otp" element={<ConfirmOTP />} />
                    <Route path="/benh-vien-all" element={<AllClinic />} />
                    <Route path="/bac-si" element={<AllDoctor />} />
                    <Route path="/bac-si/get" element={<DoctorInfo />} />
                    <Route path="/bac-si/get/record" element={<ChoosePatientRecord />} />
                    <Route path="/bac-si/get/record/confirm" element={<ConfirmInfomation />} />
                    <Route path="/benh-vien" element={<ClinicInfo />} />
                    <Route path="/benh-vien/chuyen-khoa" element={<Specialties />} />
                    <Route path="/chuyen-khoa" element={<AllSpecialty />} />
                </Route>
                {AdminRoutes()}
                {DoctorRoutes()}
                {UserRoutes()}
                <Route path="*" element={<Page404 />} />
            </Routes>
        </>
    );
}

export default AppRoutes;
