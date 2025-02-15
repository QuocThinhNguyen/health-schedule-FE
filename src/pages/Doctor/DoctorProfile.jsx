import React, { useState, useEffect, useContext } from 'react';
import { FaCamera } from 'react-icons/fa';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import {
    User,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Stethoscope,
    Calendar,
    Edit2,
    Save,
    Briefcase,
    DollarSign,
    FileText,
    Menu,
    X,
    ChevronRight,
    Star,
    Clock,
} from 'lucide-react';
import { set } from 'date-fns';

function DoctorProfile() {
    const [activeSection, setActiveSection] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null); // Thêm trạng thái để lưu trữ URL tạm thời của ảnh
    const [selectedFile, setSelectedFile] = useState(null); // Thêm trạng thái để lưu trữ tệp ảnh
    const { user } = useContext(UserContext);
    const [doctorInfo, setDoctorInfo] = useState({
        name: '',
        address: '',
        gender: '',
        birthdate: '',
        specialty: '',
        phone: '',
        email: '',
        clinic: '',
        position: '',
        image: '',
        price: '',
    });

    console.log('check', doctorInfo);

    console.log(doctorInfo);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${user.userId}`);
                console.log('response', response);
                if (response.status === 200) {
                    setDoctorInfo({
                        name: response.data.fullname,
                        address: response.data.address,
                        gender: response.data.gender === 'Male' ? 'Nam' : 'Nữ',
                        birthdate: response.data.birthDate.split('T')[0],
                        specialty: response.data.specialtyName,
                        phone: response.data.phoneNumber,
                        email: response.data.email,
                        clinic: response.data.clinicName,
                        position: response.data.position,
                        image: response.data.image,
                        price: response.data.price,
                    });
                }
            } catch (error) {
                console.error('Error fetching doctor data:', error);
                setDoctorInfo({});
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDoctorInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        console.log('Saving updated info:', doctorInfo);
        setIsEditing(false);
        const formData = new FormData();
        formData.append('fullname', doctorInfo.name);
        formData.append('address', doctorInfo.address);
        const genderValue = doctorInfo.gender === 'Nam' ? 'Male' : doctorInfo.gender === 'Nữ' ? 'Female' : 'Other';
        formData.append('gender', genderValue);
        formData.append('birthDate', doctorInfo.birthdate);
        formData.append('phoneNumber', doctorInfo.phone);
        formData.append('email', doctorInfo.email);
        if (selectedFile) {
            formData.append('image', selectedFile); // Thêm tệp ảnh vào FormData
        }

        try {
            const response = await axiosInstance.put(`/doctor/${user.userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response);
            if (response.status === 200) {
                // Check a success code if the backend provides it
                toast.success('Cập nhật thông tin thành công');
                // setTimeout(() => {
                //     window.location.reload();
                // }, 2000);
            } else {
                toast.warn(response.data.message || 'Đã xảy ra vấn đề');
            }
        } catch (error) {
            // console.error('Error updating doctor data:', error);
            toast.error('Cập nhật thông tin thất bại');
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const IMAGE_URL = 'http://localhost:9000/uploads/';
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setSelectedFile(file); // Lưu trữ tệp ảnh trong trạng thái
            setPreviewImage(URL.createObjectURL(file)); // Tạo URL tạm thời cho ảnh và lưu trữ trong trạng thái
        } else {
            setDoctorInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const [feedbacks, setFeedbacks] = useState([]);
    console.log('Feedbacks:', feedbacks);
    const [comments, setComments] = useState([]);
    console.log('Comments:', comments);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axiosInstance.get(`/feedback/${user.userId}`);
                if (response.status === 200) {
                    setFeedbacks(response);
                    setComments(response.data[0]);
                }
            } catch (error) {
                console.error('Failed to fetch feedbacks: ', error.message);
            }
        };
        fetchFeedbacks();
    }, []);

    const [statistical, setStatistical] = useState([]);
    console.log('Statistical:', statistical);
    useEffect(() => {
        // Hàm gọi API để lấy dữ liệu lịch hẹn
        const fetchStatistical = async () => {
            try {
                const response = await axiosInstance.get(`/booking/doctor/${user.userId}`);
                console.log('Statistical check:', response);
                if (response.status === 200) {
                    setStatistical(response);
                } else {
                    console.error('Failed to fetch data:', response.message);
                    setStatistical([]);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setStatistical([]);
            }
        };
        fetchStatistical();
    }, []);
    return (
        <div className="max-w-7xl flex">
            {/* Sidebar */}
            <aside
                className={`w-72 bg-white shadow-md rounded-lg p-6 mr-8 transition-all duration-300 ease-in-out  ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 fixed lg:static top-0 left-0 h-full z-40 lg:h-auto overflow-y-auto`}
            >
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 lg:hidden text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>
                <div className="flex flex-col items-center mb-8 relative">
                    <img
                        src={previewImage || `${IMAGE_URL}${doctorInfo.image}`} // Thay thế URL này bằng link ảnh thực tế của bác sĩ
                        alt="Doctor Avatar"
                        className="w-28 h-28 rounded-full border-2 border-gray-300"
                    />
                    {isEditing && (
                        <label htmlFor="imageUpload" className="cursor-pointer absolute top-0 right-0">
                            <FaCamera className="w-6 h-6 text-gray-600" />
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                        </label>
                    )}
                    <h2 className="text-2xl font-semibold text-center">{doctorInfo.name}</h2>
                    <p className="text-xl text-gray-500">{doctorInfo.position}</p>
                </div>
                <nav>
                    <button
                        className={`w-full text-lg text-left py-2 px-2 rounded-md mb-2 flex items-center ${
                            activeSection === 'personal'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveSection('personal')}
                    >
                        <img src="/user.png" alt={'user'} className="h-5 w-5 mr-2" />
                        Thông tin cá nhân
                    </button>
                    <button
                        className={`w-full text-lg text-left py-2 px-2 rounded-md flex items-center ${
                            activeSection === 'professional'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveSection('professional')}
                    >
                        <img src="/briefcase.png" alt={'briefcase'} className="h-5 w-5 mr-2" />
                        Thông tin chuyên môn
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            {activeSection === 'personal' ? 'Thông tin cá nhân' : 'Thông tin chuyên môn'}
                        </h2>
                        {activeSection === 'personal' && (
                            <button
                                className={`px-4 py-2 rounded-md text-sm font-medium flex justify-start ${
                                    isEditing ? 'bg-green-500 text-white' : 'bg-blue-400 text-white'
                                }`}
                                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                            >
                                {isEditing ? (
                                    <>
                                        <img src="/save.png" alt={'save'} className="h-5 w-5 mr-2" />
                                        Lưu
                                    </>
                                ) : (
                                    <>
                                        <img src="/edit.png" alt={'user'} className="h-5 w-5 mr-2" />
                                        Chỉnh sửa
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                    {activeSection === 'personal' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-1">
                                    Họ và tên
                                </label>
                                <div className="flex items-center">
                                    <input
                                        id="name"
                                        name="name"
                                        value={doctorInfo.name}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border rounded-md outline-none ${
                                            !isEditing ? 'bg-gray-50' : ''
                                        }`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-lg font-medium text-gray-700 mb-1">
                                    Giới tính
                                </label>
                                {isEditing ? (
                                    <select
                                        name="gender"
                                        value={doctorInfo.gender}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded bg-white"
                                    >
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        name="gender"
                                        value={doctorInfo.gender}
                                        disabled={!isEditing}
                                        className="w-full p-2 border rounded bg-gray-50"
                                    />
                                )}
                            </div>
                            <div>
                                <label htmlFor="dateOfBirth" className="block text-lg font-medium text-gray-700 mb-1">
                                    Ngày sinh
                                </label>
                                <div className="flex items-center">
                                    <input
                                        id="dateOfBirth"
                                        name="birthdate"
                                        type="date"
                                        value={doctorInfo.birthdate}
                                        onChange={handleChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border rounded-md outline-none ${
                                            !isEditing ? 'bg-gray-50' : ''
                                        }`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-1">
                                    Số điện thoại
                                </label>
                                <div className="flex items-center">
                                    <input
                                        id="phone"
                                        name="phone"
                                        value={doctorInfo.phone}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border rounded-md outline-none ${
                                            !isEditing ? 'bg-gray-50' : ''
                                        }`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="flex items-center">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={doctorInfo.email}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border rounded-md outline-none ${
                                            !isEditing ? 'bg-gray-50' : ''
                                        }`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-lg font-medium text-gray-700 mb-1">
                                    Địa chỉ
                                </label>
                                <div className="flex items-center">
                                    <input
                                        id="address"
                                        name="address"
                                        value={doctorInfo.address}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border rounded-md outline-none ${
                                            !isEditing ? 'bg-gray-50' : ''
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-1">
                                        Chức danh
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            id="title"
                                            name="title"
                                            value={doctorInfo.position}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-md outline-none ${
                                                !isEditing ? 'bg-gray-50' : ''
                                            }`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="specialty" className="block text-lg font-medium text-gray-700 mb-1">
                                        Chuyên khoa
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            id="specialty"
                                            name="specialty"
                                            value={doctorInfo.specialty}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-md outline-none ${
                                                !isEditing ? 'bg-gray-50' : ''
                                            }`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="hospital" className="block text-lg font-medium text-gray-700 mb-1">
                                        Bệnh viện làm việc
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            id="hospital"
                                            name="hospital"
                                            value={doctorInfo.clinic}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-md outline-none ${
                                                !isEditing ? 'bg-gray-50' : ''
                                            }`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="consultationFee"
                                        className="block text-lg font-medium text-gray-700 mb-1"
                                    >
                                        Giá khám bệnh
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            id="consultationFee"
                                            name="consultationFee"
                                            value={formatCurrency(doctorInfo.price)}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-md outline-none ${
                                                !isEditing ? 'bg-gray-50' : ''
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <div>
                                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả kinh nghiệm
                                </label>
                                <textarea
                                    id="experience"
                                    name="experience"
                                    value={doctorInfo.experience}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className={`w-full px-3 py-2 border rounded-md ${!isEditing ? 'bg-gray-50' : ''}`}
                                    rows={4}
                                />
                            </div> */}
                        </div>
                    )}
                </div>

                {/* Additional Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Thống kê</h3>
                        <div className="flex justify-between items-center">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{statistical.totalPatients}</p>
                                <p className="text-sm text-gray-500">Bệnh nhân</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{statistical.totalBooking}</p>
                                <p className="text-sm text-gray-500">Lượt đặt khám</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{feedbacks.totalFeedBacks}</p>
                                <p className="text-sm text-gray-500">Đánh giá</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{feedbacks.averageRating}</p>
                                <p className="text-sm text-gray-500">Điểm trung bình</p>
                            </div>
                        </div>
                    </div>
                    {comments?.patientId?.fullname[0] && (
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Đánh giá gần đây</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3">
                                        {comments.patientId.fullname[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{comments.patientId.fullname}</p>
                                        <div className="flex items-center">
                                            {[...Array(comments.rating)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-base text-gray-600">{comments.comment}</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default DoctorProfile;
