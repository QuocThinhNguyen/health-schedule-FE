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
import AllDoctor from '~/pages/User/AllDoctor/AllDoctor';
import ChoosePatientRecord from '~/pages/User/ChoosePatientRecords';
import ConfirmInfomation from '~/pages/User/ConfirmInfomation';
import ClinicInfo from '~/pages/User/ClinicInfo';
import Specialties from '~/pages/User/Specialties';
import AllClinic from '~/pages/User/AllClinic';
import AllSpecialty from '~/pages/User/AllSpecialty';
import AllNews from '~/pages/User/News/AllNews';
import NewsDetail from '~/pages/User/News/NewsDetail';
import FilterLayoutDoctor from '~/pages/User/AllDoctor/FilterLayoutDoctor';
import MakeAnAppointment from '~/pages/User/MakeAnAppointment';
import MakeAServiceAppointment from '~/pages/User/MakeAServiceAppointment';
import DetailVideo from '~/components/Video/DetailVideo';
import Filter from '~/pages/User/Filter/Filter';
import ServiceDetail from '~/pages/User/ServiceDetail';
import ChatBot from '~/pages/User/ChatBot';
import ChatApp from '~/pages/Chat/ChatApp';

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
                    <Route path="/bac-si-filter" element={<FilterLayoutDoctor />} />
                    <Route path="/bac-si/get" element={<DoctorInfo />} />
                    <Route path="/bac-si/booking" element={<MakeAnAppointment />} />
                    <Route path="/dich-vu/booking" element={<MakeAServiceAppointment />} />
                    <Route path="/bac-si/get/record" element={<ChoosePatientRecord />} />
                    <Route path="/bac-si/get/record/confirm" element={<ConfirmInfomation />} />
                    <Route path="/benh-vien" element={<ClinicInfo />} />
                    <Route path="/benh-vien/chuyen-khoa" element={<Specialties />} />
                    <Route path="/chuyen-khoa" element={<AllSpecialty />} />
                    <Route path="/tin-tuc" element={<AllNews />} />
                    <Route path="/tin-tuc/:title" element={<NewsDetail />} />
                    <Route path="/tat-ca-benh-vien" element={<Filter />} />
                    <Route path="/tat-ca-bac-si" element={<Filter />} />
                    <Route path="/tat-ca-dich-vu" element={<Filter />} />
                    <Route path="/video" element={<DetailVideo />} />
                    <Route path="/dich-vu/:title" element={<ServiceDetail />} />
                    <Route path="/chatbot" element={<ChatBot />} />
                    <Route path="/chat" element={<ChatApp />} />
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
