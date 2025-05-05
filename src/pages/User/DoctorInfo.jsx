import { useState, useEffect, useContext } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { axiosInstance, axiosClient } from '~/api/apiRequest';
import { NavLink, useSearchParams, useNavigate, useLocation } from 'react-router-dom'; // Dùng để lấy `patientRecordId` từ URL
import parse from 'html-react-parser';
import './CSS/DoctorDescription.css';
import { GrLocation } from 'react-icons/gr';
import { CiHospital1 } from 'react-icons/ci';
import { UserContext } from '~/context/UserContext';
import Pagination from '~/components/Pagination';
import Modal from 'react-modal';
import VideoItem from '~/components/Video/VideoItem';
import { BsCoin } from 'react-icons/bs';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { useSocket } from '../Chat/useSocket';
import { toast } from 'react-toastify';

function DoctorInfo() {
    const [selectedTime, setSelectedTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState([]);
    const { state } = useLocation();
    const { user } = useContext(UserContext);
    const [videos, setVideos] = useState([]);
    const [rating, setRating] = useState(5);
    const [academicRanksAndDegreess, setAcademicRanksAndDegreess] = useState([]);
    const [searchParams] = useSearchParams();
    const doctorId = searchParams.get('id') || state.doctorId;
    const userId = user.userId;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });

    const keyPoints = [
        'Chuyên môn cao, tận tâm với bệnh nhân',
        'Giữ các vị trí quan trọng tại các bệnh viện lớn',
        'Luôn cập nhật những phương pháp điều trị tiên tiến nhất',
    ];
    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            page: page,
        }));
    };

    useEffect(() => {
        const handleClick = async () => {
            try {
                const formData = new FormData();
                formData.append('doctorId', doctorId);
                formData.append('userId', userId);
                const response = await axiosInstance.post('/doctor/clicked', formData);
                if (response.status === 200) {
                    toast.success('Cảm ơn bạn đã quan tâm đến bác sĩ của chúng tôi!');
                } else {
                    console.error('Failed to click:', response);
                    toast.error('Có lỗi xảy ra khi gửi thông tin!');
                }
            } catch (error) {
                console.error('Error:', error.message);
                toast.error('Có lỗi xảy ra khi gửi thông tin!!!!');
            }
        };
        if (user?.auth) {
            handleClick();
        }
    }, []);

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${doctorId}`);
                if (response.status === 200) {
                    setDoctorInfo(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch doctor info: ', error.message);
            }
        };
        fetchDoctorInfo();
    }, []);

    let checkdoctor = academicRanksAndDegreess.find(
        (academicRanksAndDegrees) => academicRanksAndDegrees.keyMap === doctorInfo.position,
    )?.valueVi;

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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Fetch lịch làm việc
    useEffect(() => {
        const fetchSchedule = async () => {
            if (!currentDate) return;
            try {
                const response = await axiosInstance.get(`/schedule/${doctorId}?date=${currentDate}`);
                console.log('Schedule response:', response.data);
                if (response.status === 200) {
                    setSchedule(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch schedule:', error.message);
            }
        };
        fetchSchedule();
    }, [currentDate, doctorId]);

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
        const availableTimeSlots = timeTypes.filter((_, index) => currentNumbers[index] !== 4);

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
        navigate(`/bac-si/booking/?doctorId=${doctorId}&currentDate=${currentDate}&timeSlot=${timeSlot}`);
    };

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
                const response = await axiosInstance.get(
                    `/feedback/${doctorId}?page=${pagination.page}&&limit=${pagination.limit}`,
                );
                if (response.status === 200) {
                    setFeedbacks(response);
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
                }
            } catch (error) {
                console.error('Failed to fetch feedbacks: ', error.message);
            }
        };
        fetchFeedbacks();
    }, [doctorId, pagination.page]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/video/${doctorId}`);
                if (response.status === 200) {
                    setVideos(response.data);
                }
            } catch (error) {
                console.error('Error fetching video data:', error);
            }
        };
        fetchData();
    }, []);

    const tabs = [
        { id: 'info', label: 'Thông tin cơ bản' },
        { id: 'review', label: 'Đánh giá', count: 50 },
        { id: 'share', label: 'Bác sĩ chia sẻ' },
    ];

    const starDistribution = [
        { stars: 5, percentage: 100 },
        { stars: 4, percentage: 80 },
        { stars: 3, percentage: 60 },
        { stars: 2, percentage: 40 },
        { stars: 1, percentage: 20 },
    ];

    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = (media) => {
        setSelectedMedia(media);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedMedia(null);
    };

    const handleClickButtonMessage = async () => {
        if (!user.auth) {
            return navigate('/login');
        }

        try {
            const formData = new FormData();
            formData.append('userId', user?.userId);
            formData.append('partnerId', doctorId);
            const response = await axiosInstance.post('/chat-room', formData);
            if (response.status === 200) {
                const socket = useSocket(user?.userId);
                socket.emit('join_room', response.data.chatRoomId);
            } else {
                console.error('Failed to create chat room:', response.message);
            }
        } catch (error) {
            console.error('Error creating chat room:', error);
        }

        navigate(`/chat`);
    };

    useEffect(() => {
        const getDropdownAcademicRanksAndDegrees = async () => {
            try {
                const response = await axiosClient.get(`/doctor/academic-ranks-and-degrees`);

                if (response.status === 200) {
                    setAcademicRanksAndDegreess(response.data);
                } else {
                    console.error('No academic ranks and degrees are found:', response.message);
                    setAcademicRanksAndDegreess([]);
                }
            } catch (error) {
                console.error('Error fetching academic ranks and degrees:', error);
                setAcademicRanksAndDegreess([]);
            }
        };
        getDropdownAcademicRanksAndDegrees();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <div className="w-full bg-blue-50">
                <div className="max-w-6xl py-3 mx-auto">
                    <div className="flex items-center gap-2 text-sm">
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
                        <div className="text-[#2D87F3] cursor-pointer font-semibold">
                            {checkdoctor} {''}
                            {doctorInfo.fullname}
                        </div>
                    </div>
                </div>
            </div>
            {/* Doctor Info Section */}
            <div className="flex items-center gap-6 mb-8 mt-8 max-w-6xl mx-auto px-4 border-b pb-4">
                <img
                    src={doctorInfo.image} // Thay thế URL này bằng link ảnh thực tế của bác sĩ
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
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {checkdoctor} {''}
                                {doctorInfo.fullname}
                            </h1>
                            <p className="text-gray-600 mt-1">{doctorInfo.specialtyName}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="font-semibold">{feedbacks.averageRating}/5</span>
                            <a className="text-gray-700 ml-1 underline">{feedbacks.totalFeedBacks} đánh giá</a>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <button className="px-3 py-1 bg-blue-50 text-blue-500 rounded-2xl text-sm font-medium border border-blue-500">
                            Đặt lịch khám
                        </button>
                        <button
                            onClick={handleClickButtonMessage}
                            className="flex justify-center items-center gap-2 px-4 py-2 h-10 hover:bg-[rgba(var(--bg-active-rgb),0.85)] bg-[var(--bg-active)] text-[var(--text-active)] rounded-md  border border-[var(--border-primary)]"
                        >
                            <span>Nhắn tin</span>
                            <span>
                                <IoChatboxEllipsesOutline className="text-lg mt-1" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mt-2 mx-auto">
                <div className="flex-1">
                    <div className="border-b-2 mb-2">
                        <div className="flex-row">
                            <div className="max-w-3xl mx-auto p-4 bg-blue-100 rounded-lg">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold">Đội ngũ bác sĩ hàng đầu trên EasyMed</h2>

                                    <p className="text-gray-600">
                                        EasyMed tự hào kết nối bạn với đội ngũ bác sĩ uy tín, giàu kinh nghiệm trong
                                        nhiều chuyên khoa khác nhau. Mỗi bác sĩ trên nền tảng đều là những chuyên gia
                                        trong lĩnh vực của mình, với nhiều năm kinh nghiệm làm việc tại các bệnh viện
                                        hàng đầu.
                                    </p>

                                    <div>
                                        <h3 className="font-semibold mb-4">Điểm nổi bật:</h3>
                                        <ul className="space-y-3">
                                            {keyPoints.map((point, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <div className="flex items-center justify-center">
                                                        <img src="/check.png" alt={'check'} className="h-5 w-5" />
                                                    </div>
                                                    <span className="text-gray-600">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <p className="text-gray-600">
                                        Với EasyMed, bạn có thể dễ dàng tìm kiếm, đặt lịch khám và kết nối trực tiếp với
                                        bác sĩ phù hợp, giúp quá trình chăm sóc sức khỏe trở nên thuận tiện và hiệu quả
                                        hơn.
                                    </p>
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
                                {/* <div className="p-4 flex items-start gap-8 max-w-sm bg-gray-50 mb-4">
                                    <div>
                                        <div className="text-4xl font-bold">
                                            5.0<span className="text-lg text-gray-500">/5</span>
                                        </div>
                                        <div className="flex gap-0.5 my-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <div className="text-gray-500 text-sm">{feedbacks.totalFeedBacks} đánh giá</div>
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
                                </div> */}

                                <div className="space-y-6 mt-2">
                                    {feedbacks?.data.length > 0 ? (
                                        feedbacks.data.map((feedback) => (
                                            <div key={feedback.id} className="border-b pb-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                            {feedback.patientId.fullname[0]}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <strong className="font-bold text-base">
                                                                {feedback.patientId.fullname}
                                                            </strong>
                                                            <span className="text-gray-400 text-sm">
                                                                {new Date(feedback.date).toLocaleDateString('vi-VN')}
                                                            </span>
                                                        </div>
                                                    </div>

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
                                                <p className="text-gray-700 text-base">{feedback.comment}</p>
                                                <div>
                                                    {/* Danh sách ảnh/video */}
                                                    <div className="mt-2 flex flex-wrap gap-4">
                                                        {feedback.mediaNames.map((mediaName, index) => (
                                                            <div
                                                                key={index}
                                                                className="relative group w-16 h-16 border rounded-lg overflow-hidden cursor-pointer"
                                                                onClick={() => openModal(mediaName)}
                                                            >
                                                                {mediaName.endsWith('.png') ||
                                                                mediaName.endsWith('.jpg') ||
                                                                mediaName.endsWith('.jpeg') ? (
                                                                    <img
                                                                        src={mediaName}
                                                                        alt="Preview"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <video
                                                                        src={mediaName}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Modal hiển thị ảnh/video */}
                                                    <Modal
                                                        isOpen={isOpen}
                                                        onRequestClose={closeModal}
                                                        contentLabel="Media Preview"
                                                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                                        overlayClassName="fixed inset-0 bg-opacity-50 z-50"
                                                    >
                                                        <div className="relative max-w-2xl h-fit mt-20 p-4 bg-white rounded-lg">
                                                            <button
                                                                onClick={closeModal}
                                                                className="absolute top-2 right-2 text-red-800 text-4xl font-bold"
                                                            >
                                                                &times;
                                                            </button>
                                                            {selectedMedia &&
                                                            (selectedMedia.endsWith('.png') ||
                                                                selectedMedia.endsWith('.jpg') ||
                                                                selectedMedia.endsWith('.jpeg')) ? (
                                                                <img
                                                                    src={selectedMedia}
                                                                    alt="Full View"
                                                                    className="w-full h-auto max-h-[80vh] object-contain"
                                                                />
                                                            ) : (
                                                                <video
                                                                    src={selectedMedia}
                                                                    controls
                                                                    className="w-full max-h-[80vh] object-contain"
                                                                />
                                                            )}
                                                        </div>
                                                    </Modal>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Không có phản hồi nào</p>
                                    )}
                                </div>
                            </div>
                            <div className="text-center">
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    )}
                    {activeTab === 'share' && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                            {videos.map((video) => (
                                <VideoItem key={video.videoId} data={video} />
                            ))}
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
                                    className="w-full px-4 h-10 border rounded-lg cursor-pointer mb-20"
                                />
                                <div
                                    className={`${
                                        schedule.length > 0
                                            ? 'grid grid-cols-2 md:grid-cols-3 gap-3'
                                            : 'flex flex-col items-center justify-center'
                                    } mt-16 h-full`}
                                >
                                    {schedule?.length > 0 ? (
                                        mapTimeTypeToLabel(schedule[0]).map(({ value, label }, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedTime(value)}
                                                className={`py-2 px-1 font-semibold text-xs border rounded-lg border-customBlue ${
                                                    selectedTime === value
                                                        ? ' text-white bg-customBlue'
                                                        : 'text-customBlue hover:bg-blue-100'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-6 text-center">
                                            <img src="/schedule.png" alt={'schedule'} className="h-20 w-20" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Rất tiếc! Bác sĩ của chúng tôi hiện đang bận.
                                            </h3>
                                            <p className="text-gray-600">
                                                Xin vui lòng quay lại vào ngày mai hoặc đặt lịch với bác sĩ khác.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <p className="flex items-center gap-x-2 mt-4">
                                    <BsCoin className="mt-[2px] " />
                                    <span className="text-customYellow text-lg font-medium">
                                        {formatCurrency(doctorInfo.price)}
                                    </span>
                                </p>

                                {/* Nút đặt lịch */}
                                <button
                                    className={`w-full py-2 rounded-lg  ${
                                        schedule.length > 0 && selectedTime
                                            ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                                            : 'bg-blue-500 text-white opacity-65'
                                    }`}
                                    onClick={() => handleTimeSlotClick(selectedTime)}
                                    disabled={schedule.length <= 0 || !selectedTime}
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
