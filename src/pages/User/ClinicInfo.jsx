import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    MapPin,
    Clock,
    ChevronRight,
    Mail,
    Info,
    Phone,
    Search,
    X,
    Star,
    DollarSign,
    Calendar,
    ChevronLeft,
    CreditCard,
    Banknote,
    Smartphone,
} from 'lucide-react';
import { FaMoneyBillWave } from 'react-icons/fa';
import { axiosInstance, axiosClient } from '~/api/apiRequest';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import parse from 'html-react-parser';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { set } from 'date-fns';
import { Input } from 'postcss';
import Pagination from '~/components/Pagination';
import { UserContext } from '~/context/UserContext';

function ClinicInfo() {
    const [clinicData, setClinicData] = useState([]); // Trạng thái lưu dữ liệu từ API
    const { state } = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [academicRanksAndDegreess, setAcademicRanksAndDegreess] = useState([]);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [showDepartments, setShowDepartments] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const [specialty, setSpecialty] = useState([]);
    const [specialyId, setSpecialtyId] = useState('');
    const [showDoctors, setShowDoctors] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 100, totalPages: 1 });
    const [isDoctorSelected, setIsDoctorSelected] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [schedule, setSchedule] = useState([]);
    const { user } = useContext(UserContext);

    console.log('STATE', state);
    console.log('clinicData:', clinicData);
    console.log('CHECK', academicRanksAndDegreess);
    console.log('tab', activeTab);

    console.log('CHECKK', selectedDoctor);

    useEffect(() => {
        const fetchClinicInfo = async () => {
            try {
                const response = await axiosInstance.get(`/clinic/${state.clinicId}`);
                console.log('response:', response);
                if (response.status === 200) {
                    setClinicData(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch clinic:', error.message);
            }
        };

        fetchClinicInfo();
    }, []);

    const handleGetSpecialty = (clinicId, clinicName) => {
        console.log('clinicId:', clinicId);
        navigate(`/benh-vien/chuyen-khoa`, {
            state: { clinicId: clinicId, clinicName: clinicName },
        });
    };

    const handleTabClick = (index) => {
        setActiveTab(index); // Cập nhật tab được chọn
    };

    const tabs = [
        { id: 'info', label: 'Thông tin chung' },
        { id: 'doctor', label: 'Bác sĩ', count: 12 },
        { id: 'review', label: 'Đánh giá', count: 50 },
    ];

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !inputRef.current.contains(event.target)
            ) {
                setShowDepartments(false);
                setShowDoctors(false);
                setSpecialtyId('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDepartmentSelect = (department) => {
        console.log('department:', department);
        setSelectedDepartment(department.specialtyId);
        setSpecialtyId(department.specialtyId.specialtyId);
        setShowDepartments(false);
    };

    console.log('selectedDepartment:', selectedDepartment);
    const handleClearSelection = (e) => {
        e.stopPropagation(); // Prevent dropdown from opening
        setSelectedDepartment(null);
    };
    const [doctors, setDoctors] = useState([]);
    const [price, setPrice] = useState('');
    console.log('doctorss:', doctors);

    const handleDoctorSelect = (doctor) => {
        console.log('doctorrrr:', doctor);
        setSelectedDoctor(doctor.doctorId);
        setPrice(doctor.price);
        setShowDoctors(false);
        setIsDoctorSelected(true);
    };

    const handleClearDoctorSelection = (e) => {
        e.stopPropagation(); // Prevent dropdown from opening
        setSelectedDoctor(null);
        setPrice(null);
        setIsDoctorSelected(false);
    };

    useEffect(() => {
        const fetchSpecialty = async () => {
            try {
                const response = await axiosInstance.get(`/specialty/clinicId/${state.clinicId}`);
                console.log('response specialty:', response);
                if (response.status === 200) {
                    setSpecialty(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch specialty:', error.message);
            }
        };
        fetchSpecialty();
    }, []);

    useEffect(() => {
        if (activeTab === 'doctor') {
            setSelectedDepartment(null);
        }
    }, [activeTab]); // Chỉ chạy lại khi activeTab thay đổi

    // useEffect(() => {
    //     const fetchDoctors = async () => {
    //         try {
    //             const specialtyId = specialty.specialtyId;
    //             console.log('specialtyId:', specialtyId);
    //             let response;
    //             if (!specialtyId) {
    //                 response = await axiosInstance.get(`/doctor`);
    //             } else {
    //                 response = await axiosInstance.get(`/doctor`);
    //             }
    //             // const response = await axiosInstance.get(
    //             //     `/doctor&clinicId=${state.clinicId}&specialtyId=${specialty.specialtyId}`,
    //             // );

    //             console.log('response doctors:', response);
    //             if (response.status === 200) {
    //                 setDoctors(response.data);
    //             }
    //         } catch (error) {
    //             console.error('Failed to fetch doctors:', error.message);
    //         }
    //     };

    //     fetchDoctors();
    // }, []);
    const handlePageChange = async (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
        }
    };
    //Đổi số lượng (limit)
    const handleLimitChange = async (e) => {
        const newLimit = parseInt(e.target.value, 10);
        setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    };

    // console.log('specialty thiss:', specialty);
    // let getSpecialtyId = '';
    // if (specialty) {
    //     getSpecialtyId = specialty.specialtyId;
    //}
    console.log('getSpecialtyId:', specialyId);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                console.log('getSpecialtyId:', specialyId);
                const response = await axiosInstance.get(
                    `/doctor?query=${searchQuery}&page=${pagination.page}&limit=${pagination.limit}&clinicId=${state.clinicId}&specialtyId=${specialyId}`,
                );

                console.log('response doctors this:', response);
                if (response.status === 200) {
                    setDoctors(response.data);
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
                console.error('Failed to fetch doctors:', error.message);
            }
        };

        fetchDoctors();
    }, [pagination, searchQuery, specialyId]);

    useEffect(() => {
        const getDropdownAcademicRanksAndDegrees = async () => {
            try {
                const response = await axiosClient.get(`/doctor/academic-ranks-and-degrees`);
                console.log('response check:', response);
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const starDistribution = [
        { stars: 5, percentage: 100 },
        { stars: 4, percentage: 80 },
        { stars: 3, percentage: 60 },
        { stars: 2, percentage: 40 },
        { stars: 1, percentage: 20 },
    ];

    const reviews = [
        {
            id: 1,
            author: 'Phạm thị thanh hải',
            timeAgo: '2 ngày trước',
            rating: 5,
            doctorName: 'TS.BS Tăng Hà Nam Anh',
            doctorInfo:
                'TS.BS Tăng Hà Nam Anh hiện đang đảm nhận vai trò Cố vấn chuyên môn tại Trung tâm Chấn thương chỉnh hình - Bệnh viện...',
        },
        {
            id: 2,
            author: 'Lê Hữu Nhơn',
            timeAgo: '2 ngày trước',
            rating: 5,
            doctorName: 'TS.BS Tăng Hà Nam Anh',
            doctorInfo:
                'TS.BS Tăng Hà Nam Anh hiện đang đảm nhận vai trò Cố vấn chuyên môn tại Trung tâm Chấn thương chỉnh hình - Bệnh viện...',
        },
    ];
    const [selectedDate, setSelectedDate] = useState('18');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('morning');

    const handleDateChange = (event) => {
        setCurrentDate(event.target.value);
    };

    // useEffect(() => {
    //     const today = new Date();
    //     const formattedDate = today.toISOString().split('T')[0];
    //     setCurrentDate(formattedDate);
    // }, []);

    const [morningSlots, setMorningSlots] = useState([]);
    const [afternoonSlots, setAfternoonSlots] = useState([]);

    console.log('morningSlots:', morningSlots);
    console.log('afternoonSlots:', afternoonSlots);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axiosInstance.get(`/schedule/${selectedDoctor.userId}?date=${currentDate}`);
                if (response.status === 200) {
                    const scheduleData = response.data;
                    console.log('scheduleData:', scheduleData);
                    setSchedule(scheduleData);

                    // Map timeTypes từ schedule sang labels
                    const availableTimeSlots = mapTimeTypeToLabel(scheduleData);
                    console.log('availableTimeSlots:', availableTimeSlots);

                    // Phân loại sáng và chiều
                    const morning = availableTimeSlots.filter((slot) =>
                        ['T1', 'T2', 'T3', 'T4'].includes(slot.timeTypes),
                    );
                    const afternoon = availableTimeSlots.filter((slot) =>
                        ['T5', 'T6', 'T7', 'T8'].includes(slot.timeTypes),
                    );

                    // Lưu vào state
                    setMorningSlots(morning);
                    setAfternoonSlots(afternoon);
                }
            } catch (error) {
                console.error('Failed to fetch schedule:', error.message);
            }
        };

        fetchSchedule();
    }, [currentDate]);

    const mapTimeTypeToLabel = (scheduleData) => {
        const { timeTypes, currentNumbers } = scheduleData;

        // Lọc các timeTypes dựa trên currentNumbers (bỏ qua nếu currentNumbers === 2)
        const availableTimeSlots = timeTypes.filter((_, index) => currentNumbers[index] !== 2);

        // Map timeTypes đã lọc sang label
        return availableTimeSlots.map((timeType) => {
            const slot = timeSlots.find((slot) => slot.value === timeType);
            return slot ? { value: timeType, label: slot.label } : { value: timeType, label: timeType };
        });
    };

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

    const doctorId = selectedDoctor?.userId || '';

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
    const handleBooking = (doctorId) => {
        console.log('Đã click vào nút Đặt khám ngay');

        // Điều hướng đến trang với ID bác sĩ
        navigate(`/bac-si/get?id=${doctorId}`);
    };
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
                        <div className="text-blue-600 cursor-pointer font-semibold">{clinicData.name}</div>
                    </div>
                </div>
            </div>
            {/* Header */}
            <div className="bg-white h-[300px] relative">
                {/* <img
                    src="https://cdn.bookingcare.vn/fo/2021/09/14/095119-benh-vien-cho-ray-h1.jpg"
                    alt="Clinic Banner"
                    className="mx-auto w-full max-w-7xl h-[300px] z-0 object-cover"
                /> */}

                <div className="relative rounded-xl overflow-hidden mt-5 flex justify-center items-center border-none outline-none">
                    <div
                        className="relative w-full max-w-6xl h-96 rounded-lg overflow-hidden bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://cdn.bookingcare.vn/fo/2021/09/14/095119-benh-vien-cho-ray-h1.jpg')`,
                        }}
                    />
                </div>

                {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-80 z-10 relative"></div> */}
                <div className="max-w-6xl mx-auto h-48 z-10 relative opacity-100">
                    <div className="flex items-center justify-between mt-[-40px]">
                        <div className="flex items-center gap-5">
                            <img
                                src={`http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/${clinicData.image}`}
                                alt="logo clinic"
                                className=" h-36 w-36 rounded-full border-4 border-white shadow-lg"
                            />

                            <div className="mt-8">
                                <h1 className="text-[22px] font-bold">{clinicData.name}</h1>
                                <div className="flex items-center mt-2">
                                    <MapPin className="mr-2" size={15} />
                                    <p className="text-[14px] font-semibold text-gray-500">{clinicData.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 mt-52 h-2"></div>

            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mt-2 mx-auto">
                <div className="flex-1">
                    <div className="border-b-2 mb-6">
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
                                    {/* {tab.count && ` (${tab.count})`} */}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    {activeTab === 'info' && (
                        <div className="mb-10">
                            <main className="max-w-6xl mx-auto">
                                {/* Information Sections */}
                                <div className="space-y-6">
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                        <p className="text-base">
                                            EasyMed là Nền tảng Y tế chăm sóc sức khỏe toàn diện hàng đầu Việt Nam kết
                                            nối người dùng với trên 200 bệnh viện - phòng khám uy tín, hơn 1,500 bác sĩ
                                            chuyên khoa giỏi và hàng nghìn dịch vụ, sản phẩm y tế chất lượng cao.
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                                        <p className="text-base mb-4">
                                            Từ nay, người bệnh có thể đặt lịch tại Khu khám bệnh theo yêu cầu thông qua
                                            hệ thống đặt khám EasyMed.
                                        </p>
                                        <ul className="space-y-2 text-base">
                                            <li className="flex items-center gap-2">
                                                <Info className="h-4 w-4 text-blue-500" />
                                                Được lựa chọn các giáo sư, tiến sĩ, bác sĩ chuyên khoa giàu kinh nghiệm
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Info className="h-4 w-4 text-blue-500" />
                                                Hỗ trợ đặt khám trực tuyến trước khi đi khám (miễn phí đặt lịch)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Info className="h-4 w-4 text-blue-500" />
                                                Giảm thời gian chờ đợi khi làm thủ tục khám và ưu tiên khám trước
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Info className="h-4 w-4 text-blue-500" />
                                                Nhận được hướng dẫn chi tiết sau khi đặt lịch
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-white rounded-lg text-xl">
                                        <div className="text-base font-semibold mb-2 border-l-4 border-blue-400 pl-4">
                                            Giới thiệu
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2 flex items-center text-base">
                                                    <MapPin className="mr-2" size={15} />
                                                    Địa chỉ:
                                                </h4>
                                                <p className="text-gray-600 text-base ">{clinicData.address}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2 flex items-center text-base">
                                                    <Clock className="mr-2" size={15} />
                                                    Thời gian làm việc:
                                                </h4>
                                                <p className="text-gray-600 text-base">Thứ 2 đến thứ 7</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2 flex items-center text-base">
                                                    <Phone className="mr-2" size={15} />
                                                    Hỗ trợ đặt khám:
                                                </h4>
                                                <p className="text-gray-600 text-base">{clinicData.phoneNumber}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2 flex items-center text-base">
                                                    <Mail className="mr-2" size={15} />
                                                    Email liên hệ:
                                                </h4>
                                                <p className="text-gray-600 text-base">{clinicData.email}</p>
                                            </div>
                                            <div className="text-base font-semibold mb-2 border-l-4 border-blue-400 pl-4">
                                                Thông tin bệnh viện
                                            </div>
                                            <div className="doctor-description">
                                                {clinicData.description
                                                    ? parse(clinicData.description)
                                                    : 'Mô tả không có sẵn'}
                                            </div>
                                            <div className="text-base font-semibold mb-2 border-l-4 border-blue-400 pl-4 mt-5">
                                                Hướng dẫn khám bệnh
                                            </div>
                                            <div className="space-y-2 text-base">
                                                <p>Quy trình đặt lịch thăm khám qua nền tảng EasyMed:</p>
                                                <ul className="list-none space-y-2 ml-4">
                                                    <li>
                                                        Bước 1: Quý bệnh nhân tiến hành chọn thời gian và đặt lịch trong
                                                        khung "Đặt lịch hẹn".
                                                    </li>
                                                    <li>
                                                        Bước 2: Sau khi hoàn tất đặt lịch, EasyMed sẽ gửi email xác nhận
                                                        thông tin lịch hẹn khám cho...
                                                    </li>
                                                    <li>
                                                        Bước 3: Bệnh nhân đến phòng khám theo lịch hẹn, đưa email xác
                                                        nhận cho đội ngũ lễ tân/y tá và tiến hành thăm khám.
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="text-base font-semibold mb-2 border-l-4 border-blue-400 pl-4 mt-5">
                                                Hình thức thanh toán
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 mt-5">
                                                <div className="border rounded-lg hover:border-blue-200 transition-colors cursor-pointer p-6 flex flex-col items-center justify-center">
                                                    <Banknote className="w-8 h-8 text-green-600 mb-2" />
                                                    <span className="text-sm font-medium">Tiền mặt</span>
                                                </div>

                                                <div className="border rounded-lg hover:border-blue-200 transition-colors cursor-pointer p-6 flex flex-col items-center justify-center">
                                                    <Smartphone className="w-8 h-8 text-blue-600 mb-2" />
                                                    <span className="text-sm font-medium">Thanh toán trực tuyến</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="max-w-6xl mx-8 py-2">
                        <button
                            className="text-xl w-full bg-blue-500 text-white py-2 rounded-lg font-medium border hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors fixed bottom-0 left-0 right-0"
                            onClick={() => handleGetSpecialty(clinicData.clinicId, clinicData.name)}
                        >
                            Chọn Đặt Khám
                        </button>
                    </div> */}
                                </div>
                            </main>
                        </div>
                    )}
                    {activeTab === 'doctor' && (
                        <div>
                            <div className="mb-8">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Tìm bác sĩ"
                                        className="w-full pl-16 pr-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {doctors.map((doctor) => (
                                    <div key={doctor.doctorId.userId} className="border rounded-lg p-4">
                                        <div className="flex gap-4">
                                            <img
                                                src={`http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/${
                                                    doctor.doctorId.image
                                                }`}
                                                alt={doctor.doctorId.fullname}
                                                className="w-20 h-20 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-bold">
                                                            {academicRanksAndDegreess.find(
                                                                (academicRanksAndDegrees) =>
                                                                    academicRanksAndDegrees.keyMap === doctor.position,
                                                            )?.valueVi || 'Chưa xác định'}{' '}
                                                            {doctor.doctorId.fullname}
                                                        </h3>
                                                        <p className="text-gray-600">{doctor.specialtyId.name}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-semibold">
                                                            {doctor.avgRating.toFixed(1)}/5
                                                        </span>
                                                        <span className="text-gray-500 text-sm underline font-medium">
                                                            {doctor.bookingCount} lượt đặt khám
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 my-2">
                                                    <div
                                                        size="sm"
                                                        className="rounded-full bg-blue-50 text-blue-600 border-blue-500 border px-2 "
                                                    >
                                                        Đặt lịch khám
                                                    </div>
                                                    {/* {doctor.patientTypes.map((type) => (
                                                        <span
                                                            key={type}
                                                            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                                        >
                                                            {type}
                                                        </span>
                                                    ))} */}
                                                </div>

                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <FaMoneyBillWave className="w-5 h-5 text-gray-500" />
                                                    <span>Giá từ</span>
                                                    <span className="font-bold text-green-600 text-lg">
                                                        {formatCurrency(doctor.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t flex items-center justify-between w-full">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={`http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/${
                                                        clinicData.image
                                                    }`}
                                                    alt={doctor.clinicId.name}
                                                    className="w-6 h-6"
                                                />
                                                <div>
                                                    <div className="font-semibold">{doctor.clinicId.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {doctor.clinicId.address}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="bg-blue-500 hover:bg-blue-600 text-white border px-5 py-2 rounded-lg font-semibold cursor-pointer"
                                                onClick={() => handleBooking(doctor.doctorId.userId)}
                                            >
                                                Đặt Lịch Hẹn
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* Điều hướng phân trang */}
                                <div className="flex justify-end items-center space-x-4 mt-4">
                                    <select
                                        className="border border-gray-400"
                                        name="number"
                                        value={pagination.limit}
                                        onChange={handleLimitChange}
                                    >
                                        <option value="6">6</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                    </select>
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
                    )}
                    {activeTab === 'review' && (
                        <div className="">
                            <div className="max-w-3xl mx-auto bg-white">
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
                                <div className="border-t">
                                    <div className="p-4 flex items-center justify-between text-sm">
                                        <div className="font-medium">65 Đánh Giá</div>
                                        <button className="text-gray-600 hover:text-gray-900">Đánh giá mới nhất</button>
                                    </div>

                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-t p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                    {review.author[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="font-medium">{review.author}</div>
                                                            <div className="text-gray-500 text-sm">
                                                                {review.timeAgo}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-0.5">
                                                            {[...Array(review.rating)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                                                <span className="font-medium">{review.doctorName}</span>
                                                            </div>
                                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                            {review.doctorInfo}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-96 shrink-0 mt-4">
                    <div className="bg-blue-100 rounded-lg p-4">
                        <div className="text-lg font-bold mb-2">Đặt lịch ngay</div>
                        <div className="text-sm text-gray-600 mb-6">
                            Lựa chọn bác sĩ phù hợp, dịch vụ y tế cần khám và tiến hành đặt lịch ngay.
                        </div>

                        <div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bệnh viện</label>
                                <div className="p-3 rounded-lg border bg-gray-50 cursor-not-allowed">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/${
                                                clinicData.image
                                            }`}
                                            alt="logo clinic"
                                            className=" h-8 w-8 rounded-full border-4 border-white"
                                        />
                                        <div className="text-base font-semibold">{clinicData.name}</div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="space-y-2">
                                <label className="text-sm font-medium">Chuyên khoa</label>
                                <div
                                    className="p-3 rounded-lg border bg-white cursor-pointer"
                                    onClick={() => setShowDepartments(true)}
                                >
                                    <div className="flex items-center gap-2 pl-2">
                                        <div className="flex items-center gap-2">
                                            <Search className=" w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Tìm chuyên khoa"
                                                className="text-base focus-outline-none"
                                                value={selectedDepartment?.name || ''}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <div className="space-y-2 mt-3">
                                <label className="block text-sm font-medium">Chuyên khoa</label>
                                <div
                                    ref={inputRef}
                                    className="relative cursor-pointer"
                                    onClick={() => setShowDepartments(true)}
                                >
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        {!selectedDepartment && <Search className="w-5 h-5 text-gray-400" />}
                                        {selectedDepartment && (
                                            <img
                                                src={`http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/${
                                                    selectedDepartment.image
                                                }`}
                                                alt="logo clinic"
                                                className="h-8 w-8 rounded-full border-4 border-white"
                                            />
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Tìm chuyên khoa"
                                        className={`w-full py-2.5 text-base font-semibold bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                                            selectedDepartment ? 'pl-14' : 'pl-12'
                                        }`}
                                        value={selectedDepartment?.name || ''}
                                        readOnly
                                    />

                                    {selectedDepartment && (
                                        <button
                                            onClick={handleClearSelection}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    )}
                                </div>

                                {/* Departments Dropdown */}
                                {showDepartments && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute z-10 mt-1 w-[355px] bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto"
                                    >
                                        {doctors.map((dept) => (
                                            <button
                                                key={dept.specialtyId.specialtyId}
                                                className="w-full p-2 text-left hover:bg-gray-50 flex items-center gap-2"
                                                onClick={() => handleDepartmentSelect(dept)}
                                            >
                                                <img
                                                    src={`http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/${
                                                        dept.specialtyId.image
                                                    }`}
                                                    alt="logo clinic"
                                                    className="h-8 w-8 rounded-full border-4 border-white"
                                                />
                                                <span className="text-base font-semibold">{dept.specialtyId.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 mt-3">
                                <label className="block text-sm font-medium">Bác sĩ</label>
                                <div
                                    ref={inputRef}
                                    className="relative cursor-pointer"
                                    onClick={() => setShowDoctors(true)}
                                >
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        {!selectedDoctor && <Search className="w-5 h-5 text-gray-400" />}
                                        {selectedDoctor && (
                                            <img
                                                src={`http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/${
                                                    selectedDoctor.image
                                                }`}
                                                alt="logo clinic"
                                                className="h-8 w-8 rounded-full border-4 border-white"
                                            />
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Tìm bác sĩ"
                                        className={`w-full py-2.5 text-base font-semibold bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                                            selectedDoctor ? 'pl-14' : 'pl-12'
                                        }`}
                                        // value={selectedDoctor?.fullname || ''}
                                        value={
                                            selectedDoctor
                                                ? `${selectedDoctor?.fullname} - Giá ${formatCurrency(price)}`
                                                : ''
                                        }
                                        readOnly
                                    />
                                    {selectedDoctor && (
                                        <button
                                            onClick={handleClearDoctorSelection}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    )}
                                </div>

                                {/* Departments Dropdown */}
                                {showDoctors && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute z-10 mt-1 w-[355px] bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto"
                                    >
                                        {doctors.map((doctor) => (
                                            <button
                                                key={doctor.doctorId.userId}
                                                className="w-full p-2 text-left hover:bg-gray-50 flex items-center gap-2"
                                                onClick={() => handleDoctorSelect(doctor)}
                                            >
                                                <img
                                                    src={`http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/${
                                                        doctor.doctorId.image
                                                    }`}
                                                    alt="logo clinic"
                                                    className="h-8 w-8 rounded-full border-4 border-white"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-base font-semibold">
                                                        {doctor.doctorId.fullname}
                                                    </span>
                                                    <span className="text-sm text-green-500 font-semibold">
                                                        Giá {formatCurrency(doctor.price)}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                {!isDoctorSelected ? (
                                    <div className="space-y-2 mt-3">
                                        <button
                                            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg cursor-not-allowed"
                                            // disabled={!selectedTime}
                                        >
                                            Đặt lịch hẹn
                                        </button>
                                    </div>
                                ) : (
                                    <div className="max-w-md mx-auto bg-gray-50">
                                        <div className="text-center border-b-2 border-blue-600">
                                            <h2 className="text-blue-600 font-semibold py-3">Tư vấn trực tiếp</h2>
                                        </div>

                                        <div className="p-4 space-y-4 mb-20">
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
                                                            className={`py-2 px-3 font-semibold text-xs border rounded-lg transition-colors ${
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
                                                                <rect
                                                                    x="3"
                                                                    y="4"
                                                                    width="18"
                                                                    height="18"
                                                                    rx="2"
                                                                    ry="2"
                                                                />
                                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                                <line x1="3" y1="10" x2="21" y2="10" />
                                                            </svg>
                                                        </div>
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                            Rất tiếc! Bác sĩ của chúng tôi hiện đang bận.
                                                        </h3>
                                                        <p className="text-gray-600">
                                                            Xin vui lòng quay lại vào ngày mai hoặc đặt lịch với bác sĩ
                                                            khác.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Nút đặt lịch */}
                                            <button
                                                className="w-full bg-blue-500 text-white py-2 rounded-lg cursor-pointer"
                                                onClick={() => handleTimeSlotClick(selectedTime)}
                                            >
                                                Đặt lịch hẹn
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClinicInfo;
