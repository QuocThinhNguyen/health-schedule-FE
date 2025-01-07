import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '~/components/Confirm/ConfirmationModal';

function PatientManagement() {
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Thêm useNavigate

    const { user } = useContext(UserContext);

    useEffect(() => {
        // Đặt ngày mặc định là ngày hiện tại khi component được tải
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, []);

    useEffect(() => {
        // Hàm gọi API để lấy dữ liệu lịch hẹn
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.get(`/booking/doctor/${user.userId}?date=${selectedDate}`);
                console.log('ResponseBooking:', response);

                if (response.status === 200) {
                    setAppointments(response.data);
                } else {
                    console.error('Failed to fetch data:', response.message);
                    setAppointments([]);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };

        // Gọi API mỗi khi selectedDate thay đổi
        if (selectedDate) {
            fetchAppointments();
        }
    }, [selectedDate]);

    // Hàm xử lý khi người dùng chọn ngày mới
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const updateStatus = async (appointmentId, statusKey) => {
        try {
            const response = await axiosInstance.put(`/booking/${appointmentId}`, { status: statusKey });

            if (response.status === 200) {
                // Cập nhật trạng thái trực tiếp trên danh sách appointments
                setAppointments((prevAppointments) =>
                    prevAppointments.map((appointment) =>
                        appointment.bookingId === appointmentId
                            ? {
                                  ...appointment,
                                  status: {
                                      ...appointment.status,
                                      keyMap: statusKey,
                                      valueVi: statusKey === 'S4' ? 'Đã khám xong' : 'Đã hủy',
                                  },
                              }
                            : appointment,
                    ),
                );
                toast.success('Cập nhật trạng thái thành công!');
            } else {
                toast.error('Cập nhật trạng thái thất bại.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái.');
        } finally {
            closeModal();
        }
    };

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

    return (
        <div className="p-4 w-150 h-full border rounded-lg shadow-lg bg-white overflow-y-auto">
            {/* Chọn ngày khám */}
            <div className="flex items-center space-x-4 mb-4">
                <label htmlFor="date" className="font-semibold">
                    Chọn ngày khám
                </label>
                <input
                    type="date"
                    id="date"
                    className="border p-2 rounded"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </div>

            {/* Display loading or error message */}
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}

            {/* Bảng thông tin bệnh nhân */}
            <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200">
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 font-bold tracking-wider">STT</th>
                            <th className="px-4 py-2 font-bold tracking-wider">Thời gian khám</th>
                            <th className="px-4 py-2 font-bold tracking-wider">Tên bệnh nhân</th>
                            <th className="px-4 py-2 font-bold tracking-wider">Địa chỉ</th>
                            <th className="px-4 py-2 font-bold tracking-wider">Số điện thoại</th>
                            <th className="px-4 py-2 font-bold tracking-wider">Giới tính</th>
                            <th className="px-4 py-2 font-bold tracking-wider">Tình trạng bệnh</th>
                            <th className="px-4 py-2 font-bold tracking-wider">Trạng thái</th>
                            <th className="px-4 py-2 font-bold tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments
                            .filter((appointment) => appointment.status.keyMap !== 'S1')
                            .map((appointment, index) => (
                                <tr key={appointment._id}>
                                    <td className="px-4 py-2 text-gray-900 text-center">{index + 1}</td>
                                    <td className="px-4 py-2 text-gray-900 text-center">
                                        {appointment.timeType.valueVi}
                                    </td>
                                    <td className="px-4 py-2 text-gray-900 text-center">
                                        {appointment.patientRecordId.fullname}
                                    </td>
                                    <td className="px-4 py-2 text-gray-900 text-center">
                                        {appointment.patientRecordId.address}
                                    </td>
                                    <td className="px-4 py-2 text-gray-900 text-center">
                                        {appointment.patientRecordId.phoneNumber}
                                    </td>
                                    <td className="px-4 py-2 text-gray-900 text-center">
                                        {appointment.patientRecordId.gender === 'Male'
                                            ? 'Nam'
                                            : appointment.patientRecordId.gender === 'Female'
                                            ? 'Nữ'
                                            : 'Khác'}
                                    </td>
                                    <td className="px-4 py-2 text-gray-900 text-center">{appointment.reason}</td>
                                    <td className="px-4 py-2 text-gray-900 text-center">
                                        {appointment.status.valueVi}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                className={`p-1 rounded ${
                                                    appointment.status.keyMap === 'S4' ||
                                                    appointment.status.keyMap === 'S5'
                                                        ? 'bg-blue-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-blue-500 text-white'
                                                }`}
                                                onClick={() => updateStatus(appointment.bookingId, 'S4')}
                                                disabled={
                                                    appointment.status.keyMap === 'S4' ||
                                                    appointment.status.keyMap === 'S5'
                                                }
                                            >
                                                Hoàn thành
                                            </button>
                                            <button
                                                className={`p-1 rounded ${
                                                    appointment.status.keyMap === 'S4' ||
                                                    appointment.status.keyMap === 'S5'
                                                        ? 'bg-red-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-red-500 text-white'
                                                }`}
                                                // onClick={() => updateStatus(appointment.bookingId, 'S5')}
                                                onClick={() =>
                                                    openModal(
                                                        appointment.bookingId,
                                                        appointment.patientRecordId.fullname,
                                                    )
                                                }
                                                disabled={
                                                    appointment.status.keyMap === 'S4' ||
                                                    appointment.status.keyMap === 'S5'
                                                }
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={() => updateStatus(selectedBookingId, 'S5')}
                message={`Bạn có chắc chắn muốn hủy lịch hẹn của ${patientName} không?`}
            />
        </div>
    );
}

export default PatientManagement;
