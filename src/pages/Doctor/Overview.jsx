import  { useState, useEffect, useContext } from 'react';
import {  axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import { Eye, Phone, Mail, MapPin } from 'lucide-react';
import ConfirmationModal from '~/components/Confirm/ConfirmationModal';
import Pagination from '~/components/Pagination';

function Overview() {
    const { user } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [appointmentsYesterday, setAppointmentsYesterday] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    // lấy ngày hiện tại
    const [today, setToday] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [yesterdayDate, setYesterdayDate] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [statistical, setStatistical] = useState([]);
    const [bookings, setBookings] = useState([]);
    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            page: page, // Cập nhật thuộc tính page
        }));
    };
    useEffect(() => {
        // Đặt ngày mặc định là ngày hiện tại và ngày hôm qua khi component được tải
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const formattedToday = today.toISOString().split('T')[0];
        const formattedYesterday = yesterday.toISOString().split('T')[0];

        setToday(formattedToday);
        setSelectedDate(formattedToday);
        setYesterdayDate(formattedYesterday);
    }, []);

    useEffect(() => {
        // Hàm gọi API để lấy dữ liệu lịch hẹn
        const fetchAppointments = async () => {
            try {
                const response = await axiosInstance.get(`/booking/doctor/${user.userId}?date=${today}`);
                const responseYesterday = await axiosInstance.get(
                    `/booking/doctor/${user.userId}?date=${yesterdayDate}`,
                );

                if (response.status === 200) {
                    setAppointments(response.data);
                    setStatistical(response);
                    setAppointmentsYesterday(responseYesterday.data);
                } else {
                    console.error('Failed to fetch data:', response.message);
                    setAppointments([]);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setAppointments([]);
            }
        };
        if (today !== '' && yesterdayDate !== '') {
            fetchAppointments();
        }
    }, [today, yesterdayDate]);

    const [getBooking, setGetBooking] = useState([]);

    useEffect(() => {
        // Hàm gọi API để lấy dữ liệu lịch hẹn
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.get(
                    `/booking/doctor/${user.userId}?date=${selectedDate}&page=${pagination.page}&&limit=${pagination.limit}`,
                );
                if (response.status === 200) {
                    setGetBooking(response.data);
                    if (response.totalPages === 0) {
                        response.totalPages = 1;
                    }
                    if (pagination.totalPages !== response.totalPages) {
                        setPagination((prev) => ({
                            ...prev,
                            page: 1,
                            totalPages: response.totalPages,
                        }));
                    }
                } else {
                    console.error('Failed to fetch data:', response.message);
                    setGetBooking([]);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setGetBooking([]);
            } finally {
                setLoading(false);
            }
        };

        // Gọi API mỗi khi selectedDate thay đổi
        if (selectedDate) {
            fetchAppointments();
        }
    }, [selectedDate, pagination.page]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axiosInstance.get(`/feedback/${user.userId}`);
                if (response.status === 200) {
                    setFeedbacks(response);
                }
            } catch (error) {
                console.error('Failed to fetch feedbacks: ', error.message);
            }
        };
        fetchFeedbacks();
    }, []);

    const calculateBookingChange = () => {
        if (statistical.totalBookingLastMonth === 0) return 'N/A';
        const change =
            ((statistical.totalBookingThisMonth - statistical.totalBookingLastMonth) /
                statistical.totalBookingLastMonth) *
            100;
        return `${change > 0 ? '+' : ''}${change.toFixed(1)}% so với tháng trước`;
    };

    const stats = [
        {
            title: 'Cuộc hẹn hôm nay',
            value: appointments.length,
            icon: 'meeting.png',
            change: `${appointments.length >= appointmentsYesterday.length ? '+' : '-'}${
                appointments.length >= appointmentsYesterday.length
                    ? appointments.length - appointmentsYesterday.length
                    : appointmentsYesterday.length - appointments.length
            } so với hôm qua`,
            status: appointments.length >= appointmentsYesterday.length ? 'increase' : 'decrease',
        },
        {
            title: 'Bệnh nhân tuần này',
            value: statistical.totalPatientsInWeek,
            icon: 'advice.png',
            change: `${statistical.totalPatientsInWeek >= statistical.totalPatientsLastWeek ? '+' : '-'}${
                statistical.totalPatientsInWeek >= statistical.totalPatientsLastWeek
                    ? statistical.totalPatientsInWeek - statistical.totalPatientsLastWeek
                    : statistical.totalPatientsLastWeek - statistical.totalPatientsInWeek
            } so với tuần trước`,
            status: 'increase',
        },
        {
            title: 'Lượt đặt khám',
            value: statistical.totalBookingThisMonth,
            icon: 'booking.png',
            change: calculateBookingChange(),
            status: 'increase',
        },
        {
            title: 'Đánh giá trung bình',
            value: feedbacks.averageRating,
            icon: 'star.png',
            change: `${feedbacks.totalFeedBacks} đánh giá`,
            status: 'neutral',
        },
    ];

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [patientName, setPatientName] = useState('');
    const [isDetail, setIsDetail] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    const closeModal = () => {
        setModalOpen(false);
        setSelectedBookingId(null);
    };

    const getDetail = async (bookingId) => {
        try {
            const response = await axiosInstance.get(`/booking/${bookingId}`);
            if (response.status === 200) {
                setIsDetail(response.data);
            } else {
                toast.error('Không thể xem.');
            }

            const response1 = await axiosInstance.get(`/bookingImage/${bookingId}`);

            if (response1.status === 200) {
                const images = response1.data.map((item) => item.name);
                // if (images.length === 0) {
                //     toast.info('Không có ảnh đính kèm.');
                //     return;
                // }
                setSelectedImages(images); // Lưu danh sách ảnh từ API
            } else {
                toast.error('Không thể tải ảnh.');
            }

            setSelectedPatient(bookingId);
        } catch (error) {
            console.error('Error fetching detail:', error);
            toast.error('Có lỗi xảy ra khi xem thông tin chi tiết.');
        }
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDifference = today.getMonth() - birthDateObj.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }

        return age;
    };

    const handleViewImage = (image) => {
        window.open(image, '_blank');
    };

    const closeModal1 = () => {
        setIsModalOpen1(false);
        setSelectedImages([]);
    };

    const updateStatus = async (appointmentId, statusKey) => {
        try {
            const response = await axiosInstance.put(`/booking/${appointmentId}`, { status: statusKey });

            if (response.status === 200) {
                // Cập nhật trạng thái trực tiếp trên danh sách appointments
                setGetBooking((prevAppointments) =>
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

    const openModal = (bookingId, patientName) => {
        setSelectedBookingId(bookingId);
        setPatientName(patientName);
        setModalOpen(true);
    };

    return (
        <main className="flex-1">
            {/* Dashboard Content */}
            <div className="">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">{stat.title}</p>
                                <img src={`/${stat.icon}`} alt={stat.title} className="h-6 w-6" />
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <span
                                    className={`text-sm ${
                                        stat.status === 'increase' ? 'text-green-500' : 'text-gray-500'
                                    }`}
                                >
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl shadow-sm px-6 pt-4 h-[360px] w-full">
                    <div className="min-h-60">
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
                                <thead className="bg-gray-200 text-sm">
                                    <tr className="bg-gray-100">
                                        <th className="px-2 py-2 font-bold tracking-wider">STT</th>
                                        <th className="px-2 py-1 font-bold tracking-wider">Tên bệnh nhân</th>
                                        <th className="px-2 py-1 font-bold tracking-wider">Thời gian khám</th>
                                        <th className="px-2 py-1 font-bold tracking-wider">Tình trạng bệnh</th>
                                        <th className="px-2 py-1 font-bold tracking-wider">Trạng thái</th>
                                        <th className="px-2 py-1 font-bold tracking-wider">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getBooking
                                        .filter((appointment) => appointment.status.keyMap !== 'S1')
                                        .map((appointment, index) => (
                                            <tr
                                                key={appointment._id}
                                                className="cursor-pointer hover:bg-blue-100 hover:text-blue-500"
                                                onClick={() => getDetail(appointment.bookingId)}
                                            >
                                                <td className="px-4 py-2 text-gray-900 text-center">{index + 1}</td>
                                                <td className="px-4 py-2 text-gray-900 text-center">
                                                    {appointment.patientRecordId.fullname}
                                                </td>
                                                <td className="px-4 py-2 text-gray-900 text-center">
                                                    {appointment.timeType.valueVi}
                                                </td>
                                                <td className="px-4 py-2 text-gray-900 text-center">
                                                    {appointment.reason}
                                                </td>
                                                <td className="px-4 py-2 text-gray-900 text-center">
                                                    {appointment.status.valueVi}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className={`p-2 rounded ${
                                                                appointment.status.keyMap === 'S4' ||
                                                                appointment.status.keyMap === 'S5'
                                                                    ? 'bg-blue-200 text-gray-500 cursor-not-allowed'
                                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                                            }`}
                                                            // onClick={() => updateStatus(appointment.bookingId, 'S4')}
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                updateStatus(appointment.bookingId, 'S4');
                                                            }}
                                                            disabled={
                                                                appointment.status.keyMap === 'S4' ||
                                                                appointment.status.keyMap === 'S5'
                                                            }
                                                        >
                                                            Hoàn thành
                                                        </button>
                                                        <button
                                                            className={`p-2 rounded ${
                                                                appointment.status.keyMap === 'S4' ||
                                                                appointment.status.keyMap === 'S5'
                                                                    ? 'bg-red-200 text-gray-500 cursor-not-allowed'
                                                                    : 'bg-red-500 text-white hover:bg-red-600'
                                                            }`}
                                                            // onClick={() => updateStatus(appointment.bookingId, 'S5')}
                                                            // onClick={() =>
                                                            //     openModal(
                                                            //         appointment.bookingId,
                                                            //         appointment.patientRecordId.fullname,
                                                            //     )
                                                            // }
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                openModal(
                                                                    appointment.bookingId,
                                                                    appointment.patientRecordId.fullname,
                                                                );
                                                            }}
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
                                    {getBooking.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {isModalOpen1 && selectedImages.length > 0 && (
                            <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-4 w-4/5 h-4/5">
                                    {/* Tiêu đề và nút đóng */}
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold">Ảnh đính kèm</h2>
                                        <button
                                            className="text-red-500 hover:text-red-700 font-bold"
                                            onClick={closeModal1}
                                        >
                                            Đóng
                                        </button>
                                    </div>

                                    {/* Danh sách ảnh */}
                                    <div className="flex flex-wrap gap-4 mt-4 overflow-auto h-full">
                                        {selectedImages.map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative group w-80 h-80 border rounded-lg overflow-hidden"
                                            >
                                                {/* Hiển thị ảnh */}
                                                <img
                                                    src={image}
                                                    alt={`Ảnh ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />

                                                {/* Eye Icon (Zoom) */}
                                                <div
                                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                    onClick={() => handleViewImage(image)}
                                                >
                                                    <Eye className="text-white w-8 h-8" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedPatient && isDetail && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-semibold">Chi tiết bệnh nhân</h2>
                                        <button
                                            onClick={() => setSelectedPatient(null)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-gray-500 mb-1">Họ và tên</p>
                                            <p className="font-medium">{isDetail.patientRecordId.fullname}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1">Tuổi</p>
                                            <p className="font-medium">
                                                {calculateAge(isDetail.patientRecordId.birthDate)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1">Giới tính</p>
                                            <p className="font-medium">
                                                {isDetail.patientRecordId.gender === 'Male' ? 'Nam' : 'Nữ'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1">Tình trạng</p>
                                            <p className="font-medium">{isDetail.reason}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 mb-1">Nghề nghiệp</p>
                                            <p className="font-medium">{isDetail.patientRecordId.job}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1">CCCD</p>
                                            <p className="font-medium">{isDetail.patientRecordId.CCCD}</p>
                                        </div>

                                        <div className="col-span-2">
                                            <p className="text-gray-500 mb-1">Thông tin liên hệ</p>
                                            <div className="flex items-center gap-12 mt-2">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-5 h-5 text-gray-400" />
                                                    <span>{isDetail.patientRecordId.phoneNumber}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-5 h-5 text-gray-400" />
                                                    <span>{isDetail.patientRecordId.address}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-5 h-5 text-gray-400" />
                                                    <span>{isDetail.patientRecordId.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Danh sách ảnh */}
                                    <div className="mt-6 text-gray-500"> Ảnh đính kèm</div>
                                    <div className="flex flex-wrap gap-4 mt-2 overflow-auto h-full">
                                        {selectedImages.map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative group w-20 h-20 border rounded-lg overflow-hidden"
                                            >
                                                {image.endsWith('.png') ||
                                                image.endsWith('.jpg') ||
                                                image.endsWith('.jpeg') ? (
                                                    <img
                                                        src={image}
                                                        alt={`Ảnh ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <video
                                                        src={image}
                                                        className="w-full h-full object-cover"
                                                        controls
                                                    />
                                                )}

                                                {/* Eye Icon (Zoom) */}
                                                <div
                                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                    onClick={() => handleViewImage(image)}
                                                >
                                                    <Eye className="text-white w-8 h-8" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <ConfirmationModal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            onConfirm={() => updateStatus(selectedBookingId, 'S5')}
                            message={`Bạn có chắc chắn muốn hủy lịch hẹn của ${patientName} không?`}
                        />
                    </div>
                    <div className="text-center">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Overview;
