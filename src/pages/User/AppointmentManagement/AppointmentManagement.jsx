import { useState, useEffect, useContext } from 'react';
import { axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import ConfirmationModal from '~/components/Confirm/ConfirmationModal';
import { useNavigate, useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import AppointmentCard from './AppointmentCard';

const AppointmentManagement = () => {
    const [activeTab, setActiveTab] = useState('paid');
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { state } = useLocation();
    // const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const tabs = [
        // chưa thanh toán
        // chưa xác nhận
        { id: 'NotConfirmed', label: 'Chưa xác nhận', keyMap: 'S1' },
        { id: 'Confirmed', label: 'Đã xác nhận', keyMap: 'S2' },
        { id: 'paid', label: 'Đã thanh toán', keyMap: 'S3' },
        { id: 'examined', label: 'Đã khám', keyMap: 'S4' },
        { id: 'cancelled', label: 'Đã hủy', keyMap: 'S5' },
    ];
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [patientName, setPatientName] = useState('');
    const [name, setName] = useState('');
    console.log('User:', user);
    const openModal = (bookingId, patientName, appointmentDate) => {
        // Kiểm tra xem lịch hẹn đã qua chưa
        const currentDate = new Date();
        const appointmentDateObj = new Date(appointmentDate);
        // console.log('Current Date:', currentDate);
        // console.log('Appointment Date:', appointmentDateObj);
        // console.log('Difference:', appointmentDateObj - currentDate);

        // if (appointmentDateObj - currentDate < 24 * 60 * 60 * 1000) {
        //     toast.error(
        //         'Lịch khám không thể hủy trong vòng 24 giờ trước giờ hẹn. Vui lòng liên hệ hỗ trợ để được xử lý.',
        //     );
        //     return;
        // }

        setSelectedBookingId(bookingId);
        setPatientName(patientName);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedBookingId(null);
    };

    const checkFeedbackStatus = async (patientId, doctorId, date) => {
        try {
            const response = await axiosInstance.post('/feedback/check', {
                patientId,
                doctorId,
                date,
            });
            if (response.status === 200 && response.data?.data === true) {
                return true; // Đã đánh giá
            }
            return false; // Chưa đánh giá
        } catch (error) {
            console.error('Lỗi khi kiểm tra trạng thái đánh giá:', error);
            return false;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/user/${user.userId}`);
                if (response.status === 200) {
                    setName(response.data.fullname);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);



    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axiosInstance.post('/booking/allbooking', {
                    userId: user.userId,
                });
                console.log('Response data:', response.data);
                if (response.status === 200) {
                    const updatedAppointments = await Promise.all(
                        response.data.map(async (appointment) => {
                            const feedbackChecked = await checkFeedbackStatus(
                                appointment.patientRecordId?.patientRecordId,
                                appointment.doctorId?.userId,
                                appointment.appointmentDate,
                            );
                            return { ...appointment, feedbackChecked };
                        }),
                    );
                    setAppointments(updatedAppointments);
                    console.log('Appointments:', updatedAppointments);
                } else {
                    console.log('Không có dữ liệu');
                }
            } catch (e) {
                console.log('Đã xảy ra lỗi khi tải dữ liệu.', e);
            }
        };

        fetchAppointments();
    }, []);

    // Lọc dữ liệu theo tab đang chọn
    const filteredAppointments = appointments.filter(
        (appointment) => appointment.status.keyMap === tabs.find((tab) => tab.id === activeTab)?.keyMap,
    );

    // Xử lý hủy lịch hẹn
    const handleCancel = async () => {
        try {
            const response = await axiosInstance.put(`/booking/${selectedBookingId}`, {
                status: 'S5',
            });

            if (response.status === 200) {
                toast.success('Hủy lịch hẹn thành công.');
                // setAppointments((prev) => prev.filter((appointment) => appointment.bookingId !== selectedBookingId));
                // setTimeout(() => {
                //     window.location.reload();
                // }, 2000);

                // Gửi email thông báo hủy lịch hẹn
                const selectAppointment = appointments.find((a) => a.bookingId === selectedBookingId);
                const templateParams = {
                    email: user.email,
                    name: name,
                    patientName: selectAppointment.patientRecordId.fullname,
                    doctorName: selectAppointment.doctorId.fullname,
                    appointmentDate: new Date(selectAppointment.appointmentDate).toLocaleDateString('vi-VN'),
                    appointmentTime: selectAppointment.timeType.valueVi,
                };
                emailjs.send(
                    import.meta.env.VITE_EMAIL_SERVICE_ID,
                    import.meta.env.VITE_EMAIL_TEMPLATE_ID,
                    templateParams,
                    import.meta.env.VITE_EMAIL_PUBLIC_KEY,
                );

                setAppointments((prev) =>
                    prev.map((appointment) =>
                        appointment.bookingId === selectedBookingId
                            ? { ...appointment, status: { keyMap: 'S5', valueVi: 'Đã hủy' } }
                            : appointment,
                    ),
                );
            } else {
                toast.error('Hủy lịch hẹn thất bại.');
            }
        } catch (e) {
            console.error('Error canceling booking:', e);
            toast.error('Đã xảy ra lỗi khi hủy lịch hẹn!');
        } finally {
            closeModal();
        }
    };

    const handleReview = (patientRecordId, userId, doctorId, appointmentDate, nameDoctor, clinicId) => {
        navigate(`/user/appointments/comment?doctor=${nameDoctor}`, {
            state: {
                patientRecordId: patientRecordId,
                userId: userId,
                doctorId: doctorId,
                appointmentDate: appointmentDate,
                clinicId: clinicId,
            },
        });
    };

    const handleReschedule = (doctorId) => {
        navigate(`/bac-si/get?id=${doctorId}`);
    };

    const handleReviewDoctorInfo = (doctorId) => {
        navigate(`/bac-si/get?id=${doctorId}`);
    };
    return (
        <div className="w-full max-w mx-auto p-4 mt-20">
            <h1 className="text-2xl text-black font-bold mb-4 text-start">Lịch sử đặt chỗ</h1>

            <div className="max-w-xl">
                {/* Tabs */}
                <div className="border-b-2 mb-3 bg-white w-full">
                    <div className="flex items-stretch">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-base text-[#737373] font-semibold px-4 py-2 relative ${
                                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                                }`}
                            >
                                {tab.label}
                                {/* Thêm dòng gạch dưới khi tab đang active */}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Nội dung tab */}
                <div className="mt-3">
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                            //         <div className="mt-5 flex justify-end space-x-4">
                            //             {(appointment.status.valueVi === 'Đã xác nhận' ||
                            //                 appointment.status.valueVi === 'Đã thanh toán') && (
                            //                 <button
                            //                     className="px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                            //                     onClick={() =>
                            //                         openModal(
                            //                             appointment.bookingId,
                            //                             appointment.patientRecordId.fullname,
                            //                             appointment.appointmentDate,
                            //                         )
                            //                     }
                            //                 >
                            //                     Hủy lịch hẹn
                            //                 </button>
                            //             )}
                            //         </div>
                            //         {activeTab === 'examined' && (
                            //             <div className=" flex justify-end space-x-4">
                            //                 <button
                            //                     className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                            //                     onClick={() =>
                            //                         handleReview(
                            //                             appointment.patientRecordId.patientRecordId,
                            //                             appointment.patientRecordId.patientId,
                            //                             appointment.doctorId.userId,
                            //                             new Date(appointment.appointmentDate).toLocaleDateString(),
                            //                             appointment.doctorId.fullname,
                            //                         )
                            //                     }
                            //                 >
                            //                     Đánh giá
                            //                 </button>
                            //             </div>
                            //         )}{' '}
                            //         *
                            //         {activeTab === 'examined' && (
                            //             <div className="flex justify-end space-x-4">
                            //                 <button
                            //                     className="px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                            //                     onClick={() => handleReschedule(appointment.doctorId.userId)}
                            //                 >
                            //                     Đặt khám lại
                            //                 </button>
                            //                 {appointment.feedbackChecked ? (
                            //                     <button
                            //                         className="px-4 py-3 bg-gray-500 text-white font-semibold rounded-lg"
                            //                         onClick={() => handleReviewDoctorInfo(appointment.doctorId.userId)}
                            //                     >
                            //                         Đã đánh giá
                            //                     </button>
                            //                 ) : (
                            //                     <button
                            //                         className="px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                            //                         onClick={() =>
                            //                             handleReview(
                            //                                 appointment.patientRecordId.patientRecordId,
                            //                                 appointment.patientRecordId.patientId,
                            //                                 appointment.doctorId.userId,
                            //                                 appointment.appointmentDate,
                            //                                 appointment.doctorId.fullname,
                            //                                 appointment.doctorInfo.clinic.clinicId,
                            //                             )
                            //                         }
                            //                     >
                            //                         Đánh giá
                            //                     </button>
                            //                 )}
                            //             </div>
                            //         )}
                            //     </div>
                            // </div>

                            <AppointmentCard
                                key={appointment._id}
                                data={appointment}
                                onCancel={() =>
                                    openModal(
                                        appointment.bookingId,
                                        appointment.patientRecordId?.fullname,
                                        appointment.appointmentDate,
                                    )
                                }
                                onReview={() =>
                                    handleReview(
                                        appointment.patientRecordId?.patientRecordId,
                                        appointment.patientRecordId?.patientId,
                                        appointment.doctorId?.userId,
                                        // new Date(appointment.appointmentDate).toLocaleDateString(),
                                        appointment.appointmentDate,
                                        appointment.doctorId?.fullname,
                                        appointment.doctorInfo?.clinic?.clinicId,
                                    )
                                }
                                onReviewed={() => handleReviewDoctorInfo(appointment.doctorId.userId)}
                                onReschedule={() => handleReschedule(appointment?.doctorId?.userId)}
                            />
                        ))
                    ) : (
                        <div>
                            <p>Không có dữ liệu</p>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleCancel}
                message={`Bạn có chắc chắn muốn hủy lịch hẹn của ${patientName} không?`}
            />
        </div>
    );
};

export default AppointmentManagement;
