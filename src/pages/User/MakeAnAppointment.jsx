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
    Calendar,
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
    const [isLoading, setIsLoading] = useState(false);
    const [reason, setReason] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        birthDate: '',
        phoneNumber: '',
        gender: '',
        job: '',
        CCCD: '',
        email: '',
        address: '',
    });

    const [showAddModel, setShowAddModel] = useState(false);

    const [formAddData, setFormAddData] = useState({
        patientId: user.userId,
        fullname: '',
        birthDate: '',
        phoneNumber: '',
        gender: '',
        job: '',
        CCCD: '',
        email: '',
        address: '',
    });

    const [selectedReasons, setSelectedReasons] = useState([]);
    const reasons = [
        'Khám tổng quát',
        'Ho, sốt',
        'Đau bụng',
        'Đau đầu, chóng mặt',
        'Khó thở',
        'Đau nhức xương khớp',
        'Rối loạn tiêu hóa',
        'Bệnh da liễu',
        'Tư vấn sức khỏe',
    ];
    const handleReasonClick = (reason) => {
        setSelectedReasons((prev) => {
            if (prev.includes(reason)) {
                // Remove reason if already selected
                const newReasons = prev.filter((r) => r !== reason);
                setReason(newReasons.join(', '));
                return newReasons;
            } else {
                // Add new reason
                const newReasons = [...prev, reason];
                setReason(newReasons.join(', '));
                return newReasons;
            }
        });
    };

    const handleTextChange = (e) => {
        setValue(e.target.value);
    };
    console.log('FORM DATA', formData);
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

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            if (paymentMethod === 'cash') {
                await handlePaymentDirect();
            } else if (paymentMethod === 'online') {
                await handlePaymentOnline();
            }
        } catch (error) {
            console.error('Error during payment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentDirect = async () => {
        try {
            const formData = new FormData();
            formData.append('doctorId', state.doctorId);
            formData.append('patientRecordId', selectedPatientId);
            formData.append('appointmentDate', state.currentDate);
            formData.append('timeType', state.timeSlot);
            formData.append('price', doctorInfo.price);
            formData.append('reason', reason || '');

            files.forEach((file, index) => {
                formData.append('images', file);
            });

            console.log('Form data:', formData);
            const response = await axiosInstance.post('/booking/book-appointment-direct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                toast.success('Đặt lịch thành công!');
                navigate('/user/appointments');
            } else {
                toast.error(response.data.message || 'Đặt lịch thất bại!');
            }
        } catch (error) {
            console.error('Failed to confirm booking:', error.message);
            toast.error('Đã xảy ra lỗi khi đặt lịch!');
        }
    };

    const handlePaymentOnline = async () => {
        try {
            const formData = new FormData();
            formData.append('doctorId', state.doctorId);
            formData.append('patientRecordId', selectedPatientId);
            formData.append('appointmentDate', state.currentDate);
            formData.append('timeType', state.timeSlot);
            formData.append('price', doctorInfo.price);
            formData.append('reason', reason || '');

            files.forEach((file, index) => {
                formData.append('images', file);
            });

            const response = await axiosInstance.post('/booking/book-appointment-online', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success('Đặt lịch thành công! Chuyển đến trang thanh toán...');
                window.location.href = response.paymentUrl; // Chuyển đến URL thanh toán
            } else {
                toast.error(response.data.message || 'Đặt lịch thất bại!');
            }
        } catch (error) {
            console.error('Failed to confirm booking:', error.message);
            toast.error('Đã xảy ra lỗi khi đặt lịch!');
        }
    };

    const recordId = selectedPatientId;
    useEffect(() => {
        const fetchRecordData = async () => {
            try {
                const response = await axiosInstance.get(`/patientrecord/${recordId}`);
                // console.log('RESPONSE', response);
                // console.log('DATA', response.data);
                if (response.status === 200) {
                    const data = response.data;
                    setFormData({
                        fullname: response.data.fullname || '',
                        birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
                        phoneNumber: data.phoneNumber || '',
                        gender: data.gender,
                        job: data.job || '',
                        CCCD: data.CCCD || '',
                        email: data.email || '',
                        address: data.address || '',
                    });
                }
            } catch (error) {
                console.log('Error:', error);
            }
        };
        fetchRecordData();
    }, [recordId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAdd = (e) => {
        const { name, value } = e.target;
        setFormAddData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        try {
            const response = await axiosInstance.put(`/patientrecord/${recordId}`, formData);
            console.log('Response Update:', response);
            if (response.status === 200) {
                toast.success('Cập nhật thông tin thành công');
                setShowEditModal(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error('Cập nhật thông tin thất bại');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false); // Close the modal without deleting
    };
    const handleConfirmDelete = async () => {
        // console.log(`Xóa hồ sơ bệnh nhân có ID: ${patientIdToDelete}`);
        try {
            const response = await axiosInstance.delete(`/patientrecord/${recordId}`);
            // console.log('DELETE', response);
            if (response.status === 200) {
                // Remove the deleted patient from the state
                setPatientData((prevData) => prevData.filter((patient) => patient.patientRecordId !== recordId));
                toast.success('Đã xóa hồ sơ thành công');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error('Không thể xóa hồ sơ');
            }
        } catch (error) {
            console.error('Lỗi khi xóa hồ sơ:', error);
            toast.error('Đã xảy ra lỗi khi xóa hồ sơ');
        }
        setShowDeleteModal(false); // Close the modal after deletion
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();

        console.log('Form submitted:', formAddData);
        try {
            console.log('Form submitted:', formAddData);
            const response = await axiosInstance.post('/patientrecord', formAddData);
            console.log('API Response:', response);

            if (response.status === 200) {
                toast.success(response.message); // Thông báo thành công
                // navigate('/user/records');
                setShowAddModel(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error('Tạo mới thất bại: ' + response.message); // Thông báo lỗi
            }
        } catch (error) {
            console.error('Error creating record:', error);
            toast.error('Có lỗi xảy ra khi tạo bản ghi.');
        }
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
                            <div className="mt-2 space-y-4">
                                <div>
                                    <div className="text-base">Bạn đang đặt lịch hẹn cho</div>
                                    <div className="space-y-2 mt-2">
                                        {patientData.map((patient) => (
                                            <div
                                                key={patient.patientRecordId}
                                                className={`cursor-pointer flex items-center gap-4 py-2 px-4 bg-white border rounded-lg ${
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
                                                        <Pencil
                                                            className="w-4 h-4 text-gray-400"
                                                            onClick={() => setShowEditModal(true)}
                                                        />
                                                    </button>
                                                    <button
                                                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                                        onClick={() => setShowDeleteModal(true)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            className="w-full flex items-center justify-center gap-2 p-3 bg-white  rounded-lg text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors"
                                            onClick={() => setShowAddModel(true)}
                                        >
                                            <Plus className="w-4 h-4" />
                                            Thêm bệnh nhân mới
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start p-3 rounded-lg max-w-sm">
                                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-900 mb-1">
                                        Thông tin khách hàng được bảo mật và dùng cho mục đích liên hệ hỗ trợ dịch vụ.
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        Cập nhật thông tin cá nhân trong{' '}
                                        <a className="text-blue-600 no-underline">Hồ sơ người dùng</a> hoặc đăng ký tài
                                        khoản mới để đặt chỗ.
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
                            <div className="flex flex-wrap gap-2 mb-2 mt-2">
                                {reasons.map((reason) => (
                                    <button
                                        key={reason}
                                        onClick={() => handleReasonClick(reason)}
                                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                            selectedReasons.includes(reason)
                                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                                                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-2 ">
                                <textarea
                                    placeholder="Vui lòng mô tả chi tiết triệu chứng của bạn..."
                                    className="w-full min-h-10 p-2 border rounded-md  focus:border-blue-600 focus:outline-none hover:border-blue-600 text-base"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-base font-bold text-blue-900 mt-2">
                                <div className="w-1 h-6 bg-blue-600"></div>
                                Tệp đính kèm ({files.length}/5)
                            </div>
                            <div
                                className={`border-2 rounded-lg py-2 px-4 cursor-pointer mt-4 hover:border-blue-300 ${
                                    isDragging ? 'border-blue-500 bg-blue-100' : 'border-dashed'
                                }`}
                                onClick={() => document.getElementById('file-upload').click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="text-center py-1">
                                    <div className="flex items-center justify-center">
                                        <div className="text-blue-600 hover:text-blue-700 text-base mr-1">
                                            Chọn tập tin
                                        </div>

                                        <span className="text-base text-gray-500"> hoặc kéo thả vào đây</span>
                                    </div>
                                    <p className="text-base text-gray-400 mt-1"> tối đa 30MB</p>
                                </div>
                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    accept=".png,.jpg,.jpeg,video/*"
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
                                        {file.type.startsWith('image/') ? (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <video
                                                src={URL.createObjectURL(file)}
                                                className="w-full h-full object-cover"
                                                controls
                                            />
                                        )}

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
                    <div className="space-y-6 lg:w-3/5 mt-4">
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
                                            <div className="font-semibold text-base">
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
                                            <div className="font-semibold text-base">{doctorInfo.clinicName}</div>
                                            <div className="text-sm text-gray-500">{doctorInfo.addressClinic}</div>
                                            {/* <button className="text-blue-600 text-sm hover:underline">Chỉ đường</button> */}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <BsCoin className="w-5 h-5 mt-1" />
                                        <div>
                                            <div className="text-base font-semibold ">Mức phí</div>
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
                                    className={`border-2 rounded-md p-4 flex items-center gap-3 cursor-pointer transition-colors
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
                                    className={`border-2 rounded-md p-4 flex items-center gap-3 cursor-pointer transition-colors
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

                        <button
                            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                            onClick={handleConfirm}
                        >
                            Xác nhận đặt lịch
                        </button>
                        {isLoading && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                <img
                                    src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                                    alt="Loading..."
                                    className="w-24 h-24"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-10 pb-10">
                    <div className="bg-white rounded-lg w-full max-w-lg max-h-screen overflow-hidden p-3">
                        {/* Header cố định */}
                        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10 max-h-12">
                            <div className="text-base font-semibold">Chỉnh sửa hồ sơ</div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Nội dung cuộn */}
                        <div className="p-4 overflow-y-auto max-h-[calc(100vh-150px)]">
                            <div className="space-y-4">
                                {/* Form nội dung */}
                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Tên bệnh nhân <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Ngày sinh <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                            className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Số điện thoại bệnh nhân (Tham khảo)
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Vui lòng điền số điện thoại bệnh nhân"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">Giới tính</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Male"
                                                checked={formData.gender === 'Male'}
                                                className="w-5 h-5 accent-blue-600"
                                                onChange={handleChange}
                                            />
                                            <span>Nam</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Female"
                                                checked={formData.gender === 'Female'}
                                                className="w-5 h-5 accent-blue-600"
                                                onChange={handleChange}
                                            />
                                            <span>Nữ</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Nghề nghiệp
                                    </label>
                                    <input
                                        type="text"
                                        name="job"
                                        value={formData.job}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Số CCCD/Passport <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="CCCD"
                                        placeholder="Vui lòng nhập Số CCCD/Passport"
                                        value={formData.CCCD}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Địa chỉ Email{' '}
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Nhập địa chỉ email để nhận phiếu khám"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Địa chỉ hiện tại
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Nhập địa chỉ hiện tại"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer cố định */}
                        <div className="p-4 border-t sticky bottom-0 bg-white z-10">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        {/* Header */}
                        <div className="flex justify-end p-4">
                            <button
                                className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                onClick={handleCancelDelete}
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 pb-6 text-center">
                            {/* Avatar with X icon */}
                            <div className="relative inline-block mb-4">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-500" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z M12 20c-2.33 0-4.43-.93-6-2.43.67-1.95 2.68-3.57 6-3.57s5.33 1.62 6 3.57c-1.57 1.5-3.67 2.43-6 2.43z" />
                                    </svg>
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-2">
                                    <X className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold mb-4">Xóa thành viên</h2>

                            {/* Message */}
                            <p className="text-gray-600 mb-8">
                                Bạn có chắc chắn muốn xóa hồ sơ{' '}
                                <span className="font-bold text-gray-900">{formData.fullname}</span> khỏi gia đình của
                                bạn không?
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    // onClick={onConfirm}
                                    className="flex-1 px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                    onClick={handleConfirmDelete}
                                >
                                    Đồng ý, xóa
                                </button>
                                <button
                                    onClick={handleCancelDelete}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Không, giữ lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Add Patient Modal */}
            {showAddModel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-10 pb-10">
                    <div className="bg-white rounded-lg w-full max-w-lg max-h-screen overflow-hidden p-3">
                        {/* Header cố định */}
                        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10 max-h-12">
                            <div className="text-base font-semibold">Tạo hồ sơ mới</div>
                            <button
                                onClick={() => setShowAddModel(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Nội dung cuộn */}
                        <div className="p-4 overflow-y-auto max-h-[calc(100vh-150px)]">
                            <div className="space-y-4">
                                {/* Form nội dung */}
                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Tên bệnh nhân <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={formAddData.fullname}
                                        onChange={handleAdd}
                                        required
                                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Ngày sinh <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={formAddData.birthDate}
                                            onChange={handleAdd}
                                            className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Số điện thoại bệnh nhân (Tham khảo)
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Vui lòng điền số điện thoại bệnh nhân"
                                        name="phoneNumber"
                                        value={formAddData.phoneNumber}
                                        onChange={handleAdd}
                                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">Giới tính</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Male"
                                                checked={formAddData.gender === 'Male'}
                                                className="w-5 h-5 accent-blue-600"
                                                onChange={handleAdd}
                                            />
                                            <span>Nam</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Female"
                                                checked={formAddData.gender === 'Female'}
                                                className="w-5 h-5 accent-blue-600"
                                                onChange={handleAdd}
                                            />
                                            <span>Nữ</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Nghề nghiệp
                                    </label>
                                    <input
                                        type="text"
                                        name="job"
                                        value={formAddData.job}
                                        onChange={handleAdd}
                                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Số CCCD/Passport <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="CCCD"
                                        placeholder="Vui lòng nhập Số CCCD/Passport"
                                        value={formAddData.CCCD}
                                        onChange={handleAdd}
                                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Địa chỉ Email{' '}
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Nhập địa chỉ email để nhận phiếu khám"
                                        value={formAddData.email}
                                        onChange={handleAdd}
                                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-500">
                                        Địa chỉ hiện tại
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Nhập địa chỉ hiện tại"
                                        value={formAddData.address}
                                        onChange={handleAdd}
                                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer cố định */}
                        <div className="p-4 border-t sticky bottom-0 bg-white z-10">
                            <button
                                type="button"
                                onClick={handleAddPatient}
                                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Thêm bệnh nhân mới
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MakeAnAppointment;
