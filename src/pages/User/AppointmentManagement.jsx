import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { Building2, User2, Stethoscope } from 'lucide-react';
import { toast } from 'react-toastify';
import ConfirmationModal from '~/components/Confirm/ConfirmationModal';
import { Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineCalendarToday } from 'react-icons/md';

const AppointmentManagement = () => {
    const [activeTab, setActiveTab] = useState('paid');
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { state } = useLocation();
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

    const openModal = (bookingId, patientName) => {
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

    // useEffect(() => {
    //     const fetchAppointments = async () => {
    //         try {
    //             const response = await axiosInstance.post('/booking/allbooking', {
    //                 userId: user.userId,
    //             });

    //             console.log('Response:::::', response);
    //             if (response.status === 200) {
    //                 setAppointments(response.data);
    //             } else {
    //                 setError('Không thể tải dữ liệu.');
    //             }
    //         } catch (err) {
    //             setError('Đã xảy ra lỗi khi tải dữ liệu.');
    //         }
    //     };

    //     fetchAppointments();
    // }, []);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axiosInstance.post('/booking/allbooking', {
                    userId: user.userId,
                });

                if (response.status === 200) {
                    const updatedAppointments = await Promise.all(
                        response.data.map(async (appointment) => {
                            const feedbackChecked = await checkFeedbackStatus(
                                appointment.patientRecordId.patientRecordId,
                                appointment.doctorId.userId,
                                appointment.appointmentDate,
                            );
                            return { ...appointment, feedbackChecked };

                            console.log('Feedback checked:', feedbackChecked);
                        }),
                    );
                    setAppointments(updatedAppointments);
                    console.log('Appointments:', updatedAppointments);
                } else {
                    setError('Không thể tải dữ liệu.');
                }
            } catch (err) {
                setError('Đã xảy ra lỗi khi tải dữ liệu.');
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

            console.log('Responsese:', response);

            if (response.status === 200) {
                toast.success('Hủy lịch hẹn thành công.');
                setAppointments((prev) => prev.filter((appointment) => appointment.bookingId !== selectedBookingId));
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.error('Hủy lịch hẹn thất bại.');
            }
        } catch (err) {
            console.error('Error canceling booking:', error);
            toast.error('Đã xảy ra lỗi khi hủy lịch hẹn!');
        } finally {
            closeModal();
        }
    };

    const handleReview = (patientRecordId, userId, doctorId, appointmentDate, nameDoctor) => {
        navigate(`/user/appointments/comment?doctor=${nameDoctor}`, {
            state: {
                patientRecordId: patientRecordId,
                userId: userId,
                doctorId: doctorId,
                appointmentDate: appointmentDate,
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
            <h1 className="text-2xl font-bold mb-4 text-start">Lịch sử đặt chỗ</h1>

            {/* Tabs */}
            <div className="border-b-2 mb-6 bg-white w-fit">
                <div className="flex">
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
            <div className="mt-4">
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                        <div key={appointment._id} className="mb-4 p-4 border rounded-md shadow-md max-w-xl h-fit">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="text-lg font-bold mt-1 uppercase">
                                        {appointment.patientRecordId.fullname}
                                    </div>
                                </div>

                                <div className="flex">
                                    <span className="text-red-500 font-bold text-lg">{appointment.status.valueVi}</span>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center text-xl font-semibold text-blue-500 mb-2 uppercase border-b border-black border-dashed p-1">
                                    <Stethoscope className="mr-2" size={20} />
                                    BÁC SĨ {appointment.doctorId.fullname}
                                </div>

                                <div className="flex gap-x-9 relative">
                                    {/* Cột 1 */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex">
                                            <span className="mr-2 font-medium">Ngày khám:</span>
                                            <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex">
                                            <span className="mr-2 font-medium">Giờ khám:</span>
                                            <span>{appointment.timeType.valueVi}</span>
                                        </div>

                                        <div className="flex">
                                            <span className="mr-2 font-medium">Chuyên khoa:</span>
                                            <span>{appointment.doctorInfo.specialty.name}</span>
                                        </div>
                                    </div>

                                    {/* Cột 2 */}
                                    <div className="flex-1">
                                        <div className="flex flex-col gap-[3px]">
                                            <div className="flex">
                                                <span className="mr-2 font-medium">Bệnh viện:</span>
                                                <span>{appointment.doctorInfo.clinic.name}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="mr-2 font-medium whitespace-nowrap">Địa chỉ:</span>
                                                <span>{appointment.doctorInfo.clinic.address}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="mr-2 font-medium">Lý do khám:</span>
                                                <span>{appointment.reason}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Nút hành động */}
                                <div className="mt-5 flex justify-end space-x-4">
                                    {(appointment.status.valueVi === 'Đã xác nhận' ||
                                        appointment.status.valueVi === 'Đã thanh toán') && (
                                        <button
                                            className="px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                                            onClick={() =>
                                                openModal(appointment.bookingId, appointment.patientRecordId.fullname)
                                            }
                                        >
                                            Hủy lịch hẹn
                                        </button>
                                    )}
                                </div>

                                {/* {activeTab === 'examined' && (
                                    <div className=" flex justify-end space-x-4">
                                        <button
                                            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                                            onClick={() =>
                                                handleReview(
                                                    appointment.patientRecordId.patientRecordId,
                                                    appointment.patientRecordId.patientId,
                                                    appointment.doctorId.userId,
                                                    new Date(appointment.appointmentDate).toLocaleDateString(),
                                                    appointment.doctorId.fullname,
                                                )
                                            }
                                        >
                                            Đánh giá
                                        </button>
                                    </div>
                                )} */}
                                {activeTab === 'examined' && (
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            className="px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                                            onClick={() => handleReschedule(appointment.doctorId.userId)}
                                        >
                                            Đặt khám lại
                                        </button>
                                        {appointment.feedbackChecked ? (
                                            <button
                                                className="px-4 py-3 bg-gray-500 text-white font-semibold rounded-lg"
                                                onClick={() => handleReviewDoctorInfo(appointment.doctorId.userId)}
                                            >
                                                Đã đánh giá
                                            </button>
                                        ) : (
                                            <button
                                                className="px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                                                onClick={() =>
                                                    handleReview(
                                                        appointment.patientRecordId.patientRecordId,
                                                        appointment.patientRecordId.patientId,
                                                        appointment.doctorId.userId,
                                                        appointment.appointmentDate,
                                                        appointment.doctorId.fullname,
                                                    )
                                                }
                                            >
                                                Đánh giá
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Không có dữ liệu</p>
                )}
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
