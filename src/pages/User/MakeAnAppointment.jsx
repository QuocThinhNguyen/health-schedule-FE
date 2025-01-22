import React, { useState, useEffect, useContext } from 'react';
import {
    ChevronRight,
    X,
    MapPin,
    Clock,
    CreditCard,
    Banknote,
    Phone,
    Mail,
    Shield,
    Eye,
    Pencil,
    Trash2,
    Plus,
} from 'lucide-react';
import { BsCoin } from 'react-icons/bs';
import { axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmationModal from '~/components/Confirm/ConfirmationModal';

function MakeAnAppointment() {
    const [userType, setUserType] = useState('self');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isVisible, setIsVisible] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(1);
    const { state } = useLocation();
    const [doctorInfo, setDoctorInfo] = useState([]);
    const navigate = useNavigate();
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const [self, setSelf] = useState([]);
    const { user } = useContext(UserContext);
    const [patientData, setPatientData] = useState([]);
    // const [loading, setLoading] = useState(true);
    // if (loading) return <div>Loading...</div>;

    console.log('STATE', state);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);

        const availableSlots = 5 - files.length;

        if (availableSlots <= 0) {
            toast.info('Bạn chỉ được chọn tối đa 5 ảnh!');
            return;
        }

        const validFiles = selectedFiles.slice(0, availableSlots);

        if (validFiles.length < selectedFiles.length) {
            toast.info(`Chỉ thêm được ${validFiles.length} tệp. Đã đạt giới hạn.`);
        }

        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    };

    const handleRemoveImage = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleViewImage = (file) => {
        const imageUrl = URL.createObjectURL(file);
        window.open(imageUrl, '_blank');
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const patients = [
        {
            id: 1,
            name: 'Nguyễn Thị B',
            relation: 'Mẹ',
            gender: 'Nữ',
            dob: '4/1/1997',
            selected: true,
        },
        {
            id: 2,
            name: 'Nguyễn Văn A',
            relation: 'Bố',
            gender: 'Nam',
            dob: '3/1/1998',
            selected: false,
        },
    ];

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${state.doctorId}`);
                if (response.status === 200) {
                    setDoctorInfo(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch doctor info: ', error.message);
            }
        };
        fetchDoctorInfo();
    }, []);

    console.log('Doctor info: ', doctorInfo);

    const handleClickClinic = (clinicId, clinicName) => {
        navigate(`/benh-vien?name=${clinicName}`, {
            state: { clinicId: clinicId },
        });
    };

    const handleClickDoctor = (doctorId) => {
        navigate(`/bac-si/get?id=${doctorId}`);
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

    const selectedTimeSlot = timeSlots.find((slot) => slot.value === state.timeSlot);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/user/${user.userId}`);
                if (response.status === 200) {
                    setSelf(response.data);
                }
            } catch (error) {
                console.error('Error fetching doctor data:', error);
                setsetSelfoctorInfo({});
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axiosInstance.get(`/patientrecord/patient/${user.userId}`);
                console.log(response);
                if (response.status === 200) {
                    setPatientData(response.data); // Lưu toàn bộ mảng bệnh nhân vào state
                } else {
                    setError('Không thể lấy dữ liệu');
                }
            } catch (error) {
                setError('Đã xảy ra lỗi khi lấy dữ liệu');
            } finally {
                // setLoading(false);
            }
        };

        fetchPatientData();
    }, [user.userId]);

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
                        <div
                            className=" cursor-pointer font-semibold"
                            onClick={() => handleClickClinic(doctorInfo.clinicId, doctorInfo.clinicName)}
                        >
                            {doctorInfo.clinicName}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <div
                            className=" cursor-pointer font-semibold"
                            onClick={() => handleClickDoctor(doctorInfo.doctorId)}
                        >
                            {doctorInfo.position} {doctorInfo.fullname}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <div className="text-blue-600 cursor-pointer font-semibold">Đặt lịch hẹn</div>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto bg-white py-2">
                {/* Header */}
                {isVisible && (
                    <div className="p-2 border-b flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 rounded-md">
                                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <path d="M12 12V3M12 3L9 6M12 3L15 6" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <span>Vui lòng xác minh lại thông tin của bạn và xác nhận đặt lịch hẹn.</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-500" onClick={() => setIsVisible(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mt-2 mx-auto">
                    {/* Left Column */}
                    <div className="flex-1 lg:w-2/5 border rounded-xl px-6 py-6 h-fit mt-4">
                        {/* User Information */}
                        <div>
                            <div className="text-base font-bold flex items-center gap-2 text-blue-900">
                                <div className="w-1 h-6 bg-blue-600"></div>
                                Người sử dụng dịch vụ
                            </div>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <div className="text-lg">Bạn đang đặt lịch hẹn cho</div>
                                    <div className="mt-2 space-x-6 flex text-lg">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="self"
                                                checked={userType === 'self'}
                                                onChange={() => setUserType('self')}
                                                className="text-blue-600 transform scale-150"
                                            />
                                            Bản thân
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="other"
                                                checked={userType === 'other'}
                                                onChange={() => setUserType('other')}
                                                className="text-blue-600 transform scale-150"
                                            />
                                            Người khác
                                        </label>
                                    </div>
                                </div>

                                {userType === 'self' ? (
                                    <div className="space-y-2 mt-5 bg-blue-50 rounded-lg px-4">
                                        <div className="flex items-center gap-x-2 border-b py-2">
                                            <img
                                                src={`${IMAGE_URL}${self.image}`} // Thay thế URL này bằng link ảnh thực tế của bác sĩ
                                                alt="User profile"
                                                className="rounded-full w-12 h-12 object-cover border-4"
                                            />
                                            <div>
                                                <div className="font-medium">{self.fullname}</div>
                                                <div className="text-sm text-gray-500">
                                                    {self.gender === 'Male' ? 'Nam' : 'Nữ'} •{' '}
                                                    {new Date(self.birthDate).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pb-2">
                                            <div className="flex items-center gap-x-2">
                                                <Phone className="w-4 h-4 ml-2 text-gray-500" />
                                                <div className="text-gray-500">{self.phoneNumber}</div>
                                            </div>
                                            <div className="flex items-center gap-x-2">
                                                <Mail className="w-4 h-4 ml-2 text-gray-500" />
                                                <div className="text-gray-500">{self.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {patientData.map((patient) => (
                                            <div
                                                key={patient.patientRecordId}
                                                className={`cursor-pointer flex items-center gap-4 p-4 bg-white border rounded-lg ${
                                                    selectedPatientId === patient.patientRecordId
                                                        ? 'border-blue-600'
                                                        : 'border-gray-200'
                                                }`}
                                                onClick={() => setSelectedPatientId(patient.patientRecordId)} // Thay đổi ID được chọn khi click vào thẻ div
                                            >
                                                <input
                                                    type="radio"
                                                    name="patient"
                                                    checked={selectedPatientId === patient.patientRecordId}
                                                    onChange={() => setSelectedPatientId(patient.patientRecordId)}
                                                    onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click từ input lan ra ngoài
                                                    className="w-5 h-5 accent-blue-600"
                                                />

                                                {/* <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                                    <svg
                                                        width="32"
                                                        height="32"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="#2563eb"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                        <circle cx="12" cy="7" r="4" />
                                                    </svg>
                                                </div> */}

                                                <div className="flex-1">
                                                    <div className="font-medium text-base">{patient.fullname}</div>
                                                    {/* <div className="text-sm text-gray-500">{patient.relation}</div> */}
                                                    <div className="text-sm text-gray-500">
                                                        {patient.gender === 'Male' ? 'Nam' : 'Nữ'} •{' '}
                                                        {new Date(patient.birthDate).toLocaleDateString('vi-VN')}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                                                        <Pencil className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                    <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                                                        <Trash2 className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button className="w-full flex items-center justify-center gap-2 p-3 bg-white  rounded-lg text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors">
                                            <Plus className="w-4 h-4" />
                                            Thêm bệnh nhân mới
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 items-start p-3 rounded-lg max-w-sm">
                                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-900 mb-1">
                                        Thông tin khách hàng được bảo mật và dùng cho mục đích liên hệ hỗ trợ dịch vụ.
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        Cập nhật thông tin cá nhân trong{' '}
                                        <a href="#" className="text-blue-600 no-underline hover:underline">
                                            Hồ sơ người dùng
                                        </a>{' '}
                                        hoặc đăng ký tài khoản mới để đặt chỗ.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Medical Reason */}
                        <div>
                            <div className="flex items-center gap-2 text-base font-bold text-blue-900">
                                <div className="w-1 h-6 bg-blue-600"></div>
                                Lý do khám bệnh
                            </div>
                            <div className="mt-4">
                                <textarea
                                    placeholder="Vui lòng mô tả chi tiết triệu chứng của bạn..."
                                    className="w-full min-h-[100px] p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-base font-bold text-blue-900 mt-2">
                                <div className="w-1 h-6 bg-blue-600"></div>
                                Tệp đính kèm ({files.length}/5)
                            </div>
                            <div
                                className={`border-2 rounded-lg p-4 cursor-pointer mt-4 hover:border-blue-300 ${
                                    isDragging ? 'border-blue-500 bg-blue-100' : 'border-dashed'
                                }`}
                                onClick={() => document.getElementById('file-upload').click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="text-center py-2">
                                    <div className="flex items-center justify-center">
                                        <div className="text-blue-600 hover:text-blue-700 text-base mr-1">
                                            Chọn tập tin
                                        </div>

                                        <span className="text-base text-gray-500"> hoặc kéo thả vào đây</span>
                                    </div>
                                    <p className="text-base text-gray-400 mt-1">.PNG, .JPG tối đa 15MB</p>
                                </div>
                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    accept=".png,.jpg,.jpeg"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                            {/* Hiển thị danh sách ảnh */}
                            <div className="mt-2 flex flex-wrap gap-4">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative group w-24 h-24 border rounded-lg overflow-hidden"
                                    >
                                        {/* Image */}
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Eye Icon (Zoom) */}
                                        <div
                                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            onClick={() => handleViewImage(file)}
                                        >
                                            <Eye className="mr-2 text-white" />
                                        </div>

                                        {/* Remove Icon (X) */}
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity "
                                        >
                                            <X className="mr-2 text-red-600 font-bold  hover:text-red-800" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6 lg:w-3/5 mt-4 border rounded-xl px-6 py-6 h-fit">
                        {/* Appointment Details */}
                        <div className="border rounded-xl px-6 py-6 h-fit">
                            <div className="flex items-center gap-2 text-base font-bold text-blue-900">
                                <div className="w-1 h-6 bg-blue-600"></div>
                                Thông tin lịch hẹn
                            </div>

                            <div className="mt-4 p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <img
                                        src={`${IMAGE_URL}${doctorInfo.image}`} // Thay thế URL này bằng link ảnh thực tế của bác sĩ
                                        alt="Doctor profile"
                                        className="rounded-full w-16 h-16 object-cover border-4 border-white shadow-lg"
                                    />
                                    <div>
                                        <h3 className="font-semibold">
                                            {doctorInfo.position} {doctorInfo.fullname}
                                        </h3>
                                        <p className="text-sm text-gray-500">{doctorInfo.specialtyName}</p>
                                    </div>
                                </div>

                                <div className="text-gray-500 font-semibold text-sm">THÔNG TIN LỊCH HẸN</div>

                                <div className="space-y-3 bg-blue-50 rounded-md p-4">
                                    <div className="flex items-center gap-2 ">
                                        <Clock className="w-5 h-5" />
                                        <div>
                                            <div className="font-semibold">
                                                Lịch hẹn:{' '}
                                                {selectedTimeSlot
                                                    ? selectedTimeSlot.label
                                                    : 'Không có thời gian phù hợp'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {' '}
                                                {new Date(state.currentDate).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-5 h-5 mt-1" />
                                        <div>
                                            <div className="font-semibold">{doctorInfo.clinicName}</div>
                                            <div className="text-sm text-gray-500">{doctorInfo.addressClinic}</div>
                                            {/* <button className="text-blue-600 text-sm hover:underline">Chỉ đường</button> */}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <BsCoin className="w-5 h-5 mt-1" />
                                        <div>
                                            <div className="text-sm font-semibold ">Mức phí</div>
                                            <div className="text-red-600 font-medium text-lg">
                                                {' '}
                                                {formatCurrency(doctorInfo.price)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="border rounded-xl px-6 py-6 h-fit">
                            <div className="text-base font-bold text-blue-900 flex items-center gap-2">
                                <div className="w-1 h-6 bg-blue-600"></div>
                                Phương thức thanh toán
                            </div>

                            <div className="mt-4 space-y-3">
                                <div
                                    className={`border rounded-md p-4 flex items-center gap-3 cursor-pointer transition-colors
                  ${paymentMethod === 'cash' ? 'border-2 border-blue-600' : 'border-gray-200'}`}
                                    onClick={() => setPaymentMethod('cash')}
                                >
                                    <div className="w-10 h-10 bg-green-50 rounded-md flex items-center justify-center">
                                        <Banknote className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">Thanh toán trực tiếp</div>
                                        <div className="text-sm text-gray-500">Thanh toán tại bệnh viện</div>
                                    </div>
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${paymentMethod === 'cash' ? 'border-blue-600' : 'border-gray-300'}`}
                                    >
                                        {paymentMethod === 'cash' && (
                                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                        )}
                                    </div>
                                </div>

                                <div
                                    className={`border rounded-md p-4 flex items-center gap-3 cursor-pointer transition-colors
                  ${paymentMethod === 'online' ? 'border-2 border-blue-600' : 'border-gray-200'}`}
                                    onClick={() => setPaymentMethod('online')}
                                >
                                    <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">Thanh toán trực tuyến</div>
                                        <div className="text-sm text-gray-500">Thanh toán qua thẻ ngân hàng</div>
                                    </div>
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${paymentMethod === 'online' ? 'border-blue-600' : 'border-gray-300'}`}
                                    >
                                        {paymentMethod === 'online' && (
                                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                            Xác nhận đặt lịch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MakeAnAppointment;
