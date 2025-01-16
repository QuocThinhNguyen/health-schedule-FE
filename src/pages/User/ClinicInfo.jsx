import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, ChevronRight, Mail, Info, Phone, Search, X } from 'lucide-react';
import { axiosInstance } from '~/api/apiRequest';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import parse from 'html-react-parser';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { set } from 'date-fns';

function ClinicInfo() {
    const [clinicData, setClinicData] = useState([]); // Trạng thái lưu dữ liệu từ API
    const { state } = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

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

    console.log('STATE', state);
    console.log('clinicData:', clinicData);

    console.log('tab', activeTab);
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

    console.log('doctorss:', doctors);

    const handleDoctorSelect = (doctor) => {
        console.log('doctorrrr:', doctor);
        setSelectedDoctor(doctor);
        setShowDoctors(false);
    };

    const handleClearDoctorSelection = (e) => {
        e.stopPropagation(); // Prevent dropdown from opening
        setSelectedDoctor(null);
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
                    {/* <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
                        <TabList className="flex border-b mb-4 text-base text-[#737373] font-semibold">
                            <Tab
                                className={`px-4 py-2 cursor-pointer border-b-2 focus:outline-none ${
                                    activeTab === 0
                                        ? 'text-blue-600 border-blue-600'
                                        : 'border-transparent hover:text-blue-600 hover:border-blue-600'
                                }`}
                            >
                                Thông tin chung
                            </Tab>
                            <Tab
                                className={`px-4 py-2 cursor-pointer border-b-2 focus:outline-none ${
                                    activeTab === 1
                                        ? 'text-blue-600 border-blue-600'
                                        : 'border-transparent hover:text-blue-600 hover:border-blue-600'
                                }`}
                            >
                                Bác sĩ
                            </Tab>
                            <Tab
                                className={`px-4 py-2 cursor-pointer border-b-2 focus:outline-none ${
                                    activeTab === 2
                                        ? 'text-blue-600 border-blue-600'
                                        : 'border-transparent hover:text-blue-600 hover:border-blue-600'
                                }`}
                            >
                                Đánh giá
                            </Tab>
                        </TabList>
                    </Tabs> */}
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
                                    {tab.count && ` (${tab.count})`}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    {activeTab === 'info' && (
                        <div className="">
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

                                    <div className="bg-white p-6 rounded-lg text-xl">
                                        <h3 className="text-base font-semibold mb-4">GIỚI THIỆU</h3>
                                        <div className="space-y-4 ">
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

                                            <div className="doctor-description text-base">
                                                {clinicData.description
                                                    ? parse(clinicData.description)
                                                    : 'Mô tả không có sẵn'}
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
                </div>

                <div className="w-96 shrink-0 mt-4">
                    <div className="bg-gray-50 rounded-lg p-4">
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
                                                    selectedDoctor.doctorId.image
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
                                        value={selectedDoctor?.fullname || ''}
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
                                                    <span className="text-sm text-green-500">
                                                        Giá {doctor.price.toLocaleString()}đ
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
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
