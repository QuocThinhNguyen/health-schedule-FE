import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { Building2, User2, Stethoscope } from 'lucide-react';
import { toast } from 'react-toastify';
import ConfirmationModal from '~/components/Confirm/ConfirmationModal';

const AppointmentManagement = () => {
    const [activeTab, setActiveTab] = useState('paid');
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);

    const tabs = [
        // chưa thanh toán
        { id: 'unpaid', label: 'Chưa thanh toán', keyMap: 'S1' },
        { id: 'paid', label: 'Đã thanh toán', keyMap: 'S2' },
        { id: 'examined', label: 'Đã khám', keyMap: 'S3' },
        { id: 'cancelled', label: 'Đã hủy', keyMap: 'S4' },
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

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axiosInstance.post('/booking/allbooking', {
                    userId: user.userId,
                });

                console.log('Response:::::', response);
                if (response.status === 'OK') {
                    setAppointments(response.data);
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
                status: 'S4',
            });

            console.log('Responsese:', response);

            if (response.status === 'OK') {
                toast.success('Hủy lịch hẹn thành công.');
                setAppointments((prev) => prev.filter((appointment) => appointment.bookingId !== selectedBookingId));
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
    return (
        <div className="w-full max-w mx-auto p-4">
            <h1 className="text-5xl font-bold mb-4 text-center">Danh sách phiếu khám bệnh</h1>

            {/* Tabs */}
            <div className="flex space-x-2 mt-12">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`flex-1 py-3 px-4 rounded-full text-2xl font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Nội dung tab */}
            <div className="mt-4">
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                        <div key={appointment._id} className="mb-4 p-4 border rounded-md shadow-md w-[600px]">
                            {/* <h3 className="text-2xl font-semibold">{appointment.patientRecordId.fullname}</h3>
                            <p>Ngày khám: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                            <p>Giờ khám: {appointment.timeType.valueVi}</p>
                            <p>Địa chỉ: {appointment.doctorInfo.clinic.address}</p>
                            <p>Chuyên khoa: {appointment.doctorInfo.specialty.name}</p>
                            <p>Lý do khám: {appointment.reason}</p>
                            <p>Trạng thái: {appointment.status.valueVi}</p> */}

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-3xl font-bold mt-1 uppercase">
                                        {appointment.patientRecordId.fullname}
                                    </h2>
                                </div>

                                <div className="flex">
                                    <span className="text-red-500 font-bold text-3xl">
                                        {appointment.status.valueVi}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h3 className="flex items-center text-3xl font-semibold text-blue-500 mb-4 uppercase">
                                    <Stethoscope className="mr-2" size={20} />
                                    BÁC SĨ {appointment.doctorId.fullname}
                                </h3>

                                <div className="flex gap-2 relative top-5">
                                    {/* Cột 1 */}
                                    <div className="flex flex-col gap-6">
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
                                <div className="mt-20 flex justify-end space-x-4">
                                    {/* {appointment.status.valueVi === 'Chưa thanh toán' && (
                                            <button
                                                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                                                onClick={() => handlePayment(appointment.bookingId)}
                                            >
                                                Thanh toán lại
                                            </button>
                                        )} */}
                                    {appointment.status.valueVi === 'Đã xác nhận' && (
                                        <button
                                            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                                            onClick={() =>
                                                openModal(appointment.bookingId, appointment.patientRecordId.fullname)
                                            }
                                        >
                                            Hủy lịch hẹn
                                        </button>
                                    )}
                                </div>
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
