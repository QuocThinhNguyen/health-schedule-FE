import React, { useState, useEffect, useContext } from 'react';
import { MapPin, Clock, CreditCard, ChevronRight, CheckCircle2, Star } from 'lucide-react';
import { axiosInstance } from '~/api/apiRequest';
import { NavLink, useSearchParams, useNavigate, useLocation } from 'react-router-dom'; // Dùng để lấy `patientRecordId` từ URL
import parse from 'html-react-parser';
import './CSS/DoctorDescription.css';
import { GrLocation } from 'react-icons/gr';
import { CiHospital1 } from 'react-icons/ci';
import { UserContext } from '~/context/UserContext';

function DoctorInfo() {
    const [selectedTime, setSelectedTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState([]);
    const { state } = useLocation();
    const { user } = useContext(UserContext);

    const [rating, setRating] = useState(5);

    const [searchParams] = useSearchParams();
    const doctorId = searchParams.get('id') || state.doctorId;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [doctors, setDoctors] = useState([]);

    console.log('CHECK', doctorInfo);
    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${doctorId}`);
                console.log('2');
                console.log('Doctor info000: ', response);
                if (response.status === 200) {
                    setDoctorInfo(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch doctor info: ', error.message);
            }
        };
        fetchDoctorInfo();
    }, []);

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setCurrentDate(formattedDate);
    }, []);

    const timeSlots = [
        { label: '8:00 - 9:00', value: 'T1' },
        { label: '9:00 - 10:00', value: 'T2' },
        { label: '10:00 - 11:00', value: 'T3' },
        { label: '11:00 - 12:00', value: 'T4' },
        { label: '13:00 - 14:00', value: 'T5' },
        { label: '14:00 - 15:00', value: 'T6' },
        { label: '15:00 - 16:00', value: 'T7' },
        { label: '16:00 - 17:00', value: 'T8' },
    ];

    const handleDateChange = (event) => {
        setCurrentDate(event.target.value);
    };

    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Fetch lịch làm việc
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axiosInstance.get(`/schedule/${doctorId}?date=${currentDate}`);
                if (response.status === 200) {
                    setSchedule(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch schedule:', error.message);
            }
        };
        fetchSchedule();
        console.log('currentDay:', currentDate);
        console.log('schedule:', schedule);
    }, [currentDate]);

    // Map timeTypes sang label
    // const mapTimeTypeToLabel = (timeTypes) => {
    //     return timeTypes.map((timeType) => {
    //         const slot = timeSlots.find((slot) => slot.value === timeType);
    //         return slot ? { value: timeType, label: slot.label } : { value: timeType, label: timeType };
    //     });
    // };

    const mapTimeTypeToLabel = (scheduleData) => {
        // Lấy danh sách timeTypes và currentNumbers từ dữ liệu lịch
        const { timeTypes, currentNumbers } = scheduleData;

        // Lọc các timeTypes dựa trên currentNumbers (bỏ qua nếu currentNumbers === 2)
        const availableTimeSlots = timeTypes.filter((_, index) => currentNumbers[index] !== 2);

        // Map timeTypes đã lọc sang label
        return availableTimeSlots.map((timeType) => {
            const slot = timeSlots.find((slot) => slot.value === timeType);
            return slot ? { value: timeType, label: slot.label } : { value: timeType, label: timeType };
        });
    };
    const getCityFromAddress = (address) => {
        const parts = address.split(', ');
        return parts[parts.length - 1];
    };

    const handleTimeSlotClick = (timeSlot) => {
        if (!user.auth) {
            return navigate('/login');
        }
        setSelectedTime(timeSlot);
        navigate('/bac-si/booking', {
            state: {
                doctorId,
                currentDate,
                timeSlot,
            },
        });
    };

    // const customDescription = doctorInfo.description;

    // console.log('customDescription:', customDescription);

    const reviews = [
        {
            id: 1,
            name: 'Nguyễn Hải Đông',
            verified: true,
            date: '08/06/2023',
            comment:
                'Chị thấy rất tốt dịch vụ rất hài lòng. Bác sỹ khám cho con chị rất có chuyên môn và thân tận tâm với người bệnh. Lương y như từ mẫu',
        },
        {
            id: 2,
            name: 'Phạm Văn Thuận',
            verified: true,
            date: '18/08/2022',
            comment: 'Tốt rồi.',
        },
        {
            id: 3,
            name: 'Đỗ Xuân Vinh',
            verified: true,
            date: '12/03/2022',
            comment: 'Mình rất hài lòng',
        },
        {
            id: 4,
            name: 'Lại Hữu Bền',
            verified: true,
            date: '19/02/2022',
            comment: 'Hướng dẫn khách hàng mới đến khai báo y tế nhanh hơn.',
        },
        {
            id: 5,
            name: 'Trần Thị Thương',
            verified: true,
            date: '01/11/2021',
            comment: 'Khá tốt',
        },
        {
            id: 6,
            name: 'Vũ Văn Thủy',
            verified: true,
            date: '20/07/2021',
            comment: 'Các bạn hỗ trợ rất tốt',
        },
    ];

    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axiosInstance.get(`/feedback/${doctorId}`);
                if (response.status === 200) {
                    setFeedbacks(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch feedbacks: ', error.message);
            }
        };
        fetchFeedbacks();
    }, [doctorId]);

    const tabs = [
        { id: 'info', label: 'Thông tin cơ bản' },
        { id: 'review', label: 'Đánh giá', count: 50 },
    ];

    const starDistribution = [
        { stars: 5, percentage: 100 },
        { stars: 4, percentage: 80 },
        { stars: 3, percentage: 60 },
        { stars: 2, percentage: 40 },
        { stars: 1, percentage: 20 },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="w-full bg-blue-50">
                <div className="max-w-6xl py-2">
                    <div className="flex items-center gap-2 text-sm ml-12">
                        <NavLink
                            to="/"
                            onClick={(e) => {
                                if (window.location.pathname === '/') {
                                    e.preventDefault();
                                    window.scrollTo(0, 0);
                                }
                            }}
                            className="flex-shrink-0 flex items-center font-semibold"
                        >
                            Trang chủ
                        </NavLink>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <div className="text-blue-600 cursor-pointer font-semibold">
                            {doctorInfo.position} {doctorInfo.fullname}
                        </div>
                    </div>
                </div>
            </div>
            {/* Doctor Info Section */}
            <div className="flex items-center gap-6 mb-8 mt-8 max-w-6xl mx-auto px-4 border-b pb-4">
                <img
                    src={`${IMAGE_URL}${doctorInfo.image}`} // Thay thế URL này bằng link ảnh thực tế của bác sĩ
                    alt="Doctor profile"
                    className="rounded-full w-28 h-28 object-cover border-4 border-white shadow-lg"
                />
                {/* <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">
                        {doctorInfo.position} {doctorInfo.fullname}
                    </h1>
                    <div className="flex items-start gap-2">
                        <GrLocation className="mt-1" />
                        {getCityFromAddress(doctorInfo.address || '')}
                    </div>
                </div> */}

                <div className="flex-1">
                    <div className="flex justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {doctorInfo.position} {doctorInfo.fullname}
                            </h1>
                            <p className="text-gray-600 mt-1">{doctorInfo.specialtyName}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="font-semibold">5.0/5</span>
                            <a href="#" className="text-blue-600 ml-1 underline">
                                82 lượt đặt khám
                            </a>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1 bg-blue-50 text-blue-500 rounded-2xl text-sm font-medium border border-blue-500">
                            Đặt lịch khám
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mt-2 mx-auto">
                <div className="flex-1">
                    <div className="border-b-2 mb-6">
                        <div className="flex-row">
                            <div className="bg-blue-100 p-6 rounded-lg mb-6">
                                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                    Điểm nổi bật nhất
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-bold">
                                            • Chuyên gia đầu ngành về Chấn thương chỉnh hình tại Việt Nam:
                                        </p>
                                        <p className="text-gray-600 mt-1 pl-3">
                                            TS.BS Tăng Hà Nam Anh là người đầu tiên mở đường cho ngành Phẫu thuật nội
                                            soi khớp tại Việt Nam.
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-bold">
                                            • Cố vấn chuyên môn tại Trung tâm Chấn thương chỉnh hình - Bệnh viện Sante:
                                        </p>
                                        <p className="text-gray-600 mt-1 pl-3">
                                            TS.BS Tăng Hà Nam Anh hiện đang đóng vai trò cố vấn chuyên môn các vấn đề về
                                            Chấn thương chỉnh hình tại Bệnh viện Sante.
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-bold">
                                            • Nguyên Giám đốc Trung tâm Chấn thương chỉnh hình tại Bệnh viện Đa khoa Tâm
                                            Anh TP.HCM:
                                        </p>
                                        <p className="text-gray-600 mt-1 pl-3">
                                            Bác sĩ từng giữ nhiều vai trò quan trọng, nguyên là Giám đốc Trung tâm Chấn
                                            thương chỉnh hình tại Bệnh viện Đa khoa Tâm Anh và Bệnh viện Nguyễn Tri
                                            Phương
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`text-base text-[#737373] font-semibold px-4 py-2 relative ${
                                        activeTab === tab.id ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                                    }`}
                                >
                                    {tab.label}
                                    {/* {tab.count && ` (${tab.count})`} */}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === 'info' && (
                        <div className="doctor-description w-full">
                            {doctorInfo.description ? parse(doctorInfo.description) : 'Mô tả không có sẵn'}
                        </div>
                    )}
                    {activeTab === 'review' && (
                        <div className="">
                            <div className=" bg-white">
                                {/* Rating Overview */}
                                <div className="p-4 flex items-start gap-8 max-w-sm bg-gray-50 mb-4">
                                    <div>
                                        <div className="text-4xl font-bold">
                                            5.0<span className="text-lg text-gray-500">/5</span>
                                        </div>
                                        <div className="flex gap-0.5 my-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <div className="text-gray-500 text-sm">65 đánh giá</div>
                                    </div>

                                    <div className="flex-1">
                                        {starDistribution.map(({ stars, percentage }) => (
                                            <div key={stars} className="flex items-center gap-2 mb-1">
                                                <div className="text-sm text-gray-600 w-12">{stars} sao</div>
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-yellow-400 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Reviews List */}
                                <div className="space-y-6 mt-10">
                                    {feedbacks.length > 0 ? (
                                        feedbacks.map((feedback) => (
                                            <div key={feedback.id} className="border-b pb-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <strong className="font-bold text-sm">
                                                            {feedback.patientId.fullname}
                                                        </strong>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => setRating(star)}
                                                                    className="focus:outline-none"
                                                                    disabled
                                                                >
                                                                    <Star
                                                                        className={`w-3 h-3 mt-2 ${
                                                                            star <= feedback.rating
                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                : 'text-gray-300'
                                                                        }`}
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <span className="text-cyan-500 text-sm">
                                                        Đã khám ngày{' '}
                                                        {new Date(feedback.date).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700">{feedback.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Không có phản hồi nào</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-96 shrink-0">
                    <div className="bg-blue-100 rounded-lg p-4">
                        <div className="font-bold">Đặt lịch hẹn</div>
                        <div className="flex items-start gap-2 mt-2 text-sm">
                            <CiHospital1 className="mt-1" />
                            <span>{doctorInfo.clinicName}</span>
                        </div>
                        <div className="flex items-start gap-2 mb-2 text-sm">
                            <GrLocation className="mt-1" />
                            {doctorInfo.addressClinic}
                        </div>

                        <div className="bg-white rounded-lg p-4">
                            <div className="font-bold text-lg flex justify-center items-center border-b">
                                Tư vấn trực tiếp
                            </div>
                            <div className="p-4 space-y-4">
                                <p className="text-gray-600 text-sm text-center">
                                    Vui lòng lựa chọn lịch khám bên dưới
                                </p>
                                <input
                                    type="date"
                                    value={currentDate}
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-1 border rounded-lg cursor-pointer mb-20"
                                />
                                <div
                                    className={`${
                                        schedule.length > 0
                                            ? 'grid grid-cols-2 md:grid-cols-3 gap-3'
                                            : 'flex flex-col items-center justify-center'
                                    } mt-16 h-full`}
                                >
                                    {schedule.length > 0 ? (
                                        mapTimeTypeToLabel(schedule[0]).map(({ value, label }, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedTime(value)}
                                                className={`py-2 px-1 font-semibold text-xs border rounded-lg transition-colors ${
                                                    selectedTime === value
                                                        ? 'bg-blue-500 border-blue-200 text-white'
                                                        : 'text-blue-500 hover:bg-blue-100'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-6 text-center">
                                            <div className="w-12 h-12 mb-4">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="w-full h-full text-blue-500"
                                                >
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Rất tiếc! Bác sĩ của chúng tôi hiện đang bận.
                                            </h3>
                                            <p className="text-gray-600">
                                                Xin vui lòng quay lại vào ngày mai hoặc đặt lịch với bác sĩ khác.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-gray-500" />
                                    <div className="font-semibold text-sm">Giá khám: </div>
                                    <div className="font-semibold text-lg text-[#009E5C]">
                                        {formatCurrency(doctorInfo.price)}
                                    </div>
                                    {/* {doctorInfo.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} */}
                                </div>

                                {/* Nút đặt lịch */}
                                <button
                                    className="w-full bg-blue-500 text-white py-2 rounded-lg cursor-pointer"
                                    onClick={() => handleTimeSlotClick(selectedTime)}
                                >
                                    TIẾP TỤC ĐẶT LỊCH
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorInfo;
