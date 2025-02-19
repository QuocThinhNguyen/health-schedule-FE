import React, { useState, useEffect, useContext } from 'react';
import { FaCamera } from 'react-icons/fa';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import { DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
function Overview() {
    const upcomingAppointments = [
        {
            patientName: 'Nguyễn Văn A',
            time: '09:00 - 09:30',
            date: 'Hôm nay',
            status: 'confirmed',
            type: 'Khám định kỳ',
            avatar: '/placeholder.svg?height=32&width=32',
        },
        {
            patientName: 'Trần Thị B',
            time: '10:00 - 10:30',
            date: 'Hôm nay',
            status: 'pending',
            type: 'Khám lần đầu',
            avatar: '/placeholder.svg?height=32&width=32',
        },
        {
            patientName: 'Lê Văn C',
            time: '11:00 - 11:30',
            date: 'Hôm nay',
            status: 'confirmed',
            type: 'Tái khám',
            avatar: '/placeholder.svg?height=32&width=32',
        },
    ];
    const { user } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [appointmentsYesterday, setAppointmentsYesterday] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    console.log('Lengh', appointments.length);
    // console.log('CHECK', `/booking/doctor/${user.userId}?date=${selectedDate}`);
    console.log('Appointments:', appointments);
    const [yesterdayDate, setYesterdayDate] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [statistical, setStatistical] = useState([]);
    const [bookings, setBookings] = useState([]);

    // useEffect(() => {
    //     // Đặt ngày mặc định là ngày hiện tại khi component được tải
    //     const today = new Date().toISOString().split('T')[0];
    //     setSelectedDate(today);

    //     const yesterday = new Date();
    //     yesterday.setDate(today.getDate() - 1);
    //     setYesterdayDate(yesterday.toISOString().split('T')[0]);
    // }, []);

    useEffect(() => {
        // Đặt ngày mặc định là ngày hiện tại và ngày hôm qua khi component được tải
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const formattedToday = today.toISOString().split('T')[0];
        const formattedYesterday = yesterday.toISOString().split('T')[0];

        setSelectedDate(formattedToday);
        setYesterdayDate(formattedYesterday);
    }, []);

    console.log('SelectedDate:', selectedDate);
    console.log('YesterdayDate:', yesterdayDate);
    useEffect(() => {
        // Hàm gọi API để lấy dữ liệu lịch hẹn
        const fetchAppointments = async () => {
            try {
                const response = await axiosInstance.get(`/booking/doctor/${user.userId}?date=${selectedDate}`);
                console.log('ResponseBooking:', response);
                const responseYesterday = await axiosInstance.get(
                    `/booking/doctor/${user.userId}?date=${yesterdayDate}`,
                );
                console.log('ResponseBookingYesterday:', responseYesterday);

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
        if (selectedDate !== '' && yesterdayDate !== '') {
            fetchAppointments();
        }
    }, [selectedDate, yesterdayDate]);

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

    return (
        <main className="flex-1">
            {/* Dashboard Content */}
            <div className="">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
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
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Lịch hẹn sắp tới</h2>
                        {/* <button className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả</button> */}
                    </div>

                    <div className="space-y-4">
                        {selectedDate !== 0 && appointments.length !== 0 ? (
                            appointments
                                .filter(
                                    (appointment) =>
                                        appointment.status.valueEn === 'Confirmed' ||
                                        appointment.status.valueEn === 'New' ||
                                        appointment.status.valueEn === 'Cancel' ||
                                        appointment.status.valueEn === 'Paid' ||
                                        appointment.status.valueEn === 'Done',
                                )
                                .map((appointment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                {appointment.patientRecordId.fullname[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{appointment.patientRecordId.fullname}</h3>
                                                {/* <p className="text-sm text-gray-500">{appointment.type}</p> */}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-medium">{appointment.timeType.valueVi}</p>
                                            <p className="text-sm text-gray-500">Hôm nay</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {appointment.status.valueEn === 'Confirmed' ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : appointment.status.valueEn === 'New' ? (
                                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                                            ) : appointment.status.valueEn === 'Paid' ? (
                                                <DollarSign className="w-5 h-5 text-blue-500" />
                                            ) : appointment.status.valueEn === 'Done' ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                            <span
                                                className={`text-sm ${
                                                    appointment.status.valueEn === 'Confirmed'
                                                        ? 'text-green-500'
                                                        : appointment.status.valueEn === 'New'
                                                        ? 'text-yellow-500'
                                                        : appointment.status.valueEn === 'Paid'
                                                        ? 'text-blue-500'
                                                        : appointment.status.valueEn === 'Done'
                                                        ? 'text-green-600'
                                                        : 'text-red-500'
                                                }`}
                                            >
                                                {appointment.status.valueEn === 'Confirmed'
                                                    ? 'Đã xác nhận'
                                                    : appointment.status.valueEn === 'New'
                                                    ? 'Chờ xác nhận'
                                                    : appointment.status.valueEn === 'Paid'
                                                    ? 'Đã thanh toán'
                                                    : appointment.status.valueEn === 'Done'
                                                    ? 'Đã khám xong'
                                                    : 'Đã hủy'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p className="text-center text-gray-500">Bạn không có lịch hẹn nào ngày hôm nay</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Overview;
