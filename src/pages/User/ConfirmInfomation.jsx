import React, { useState, useEffect, useContext } from 'react';
import { Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User, Calendar, Phone, Users, MapPin, Briefcase, Mail, IdCard, Hospital, Eye, X } from 'lucide-react';
import { axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';

function ConfirmInfomation() {
    const [selectedService, setSelectedService] = useState('');
    const [agreeToShare, setAgreeToShare] = useState(false);
    const { state } = useLocation();
    console.log('STATEEE', state);
    const [reason, setReason] = useState('');
    const [patientData, setPatientData] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    console.log('FILES', files);

    // const handleFileChange = (e) => {
    //     const newFiles = Array.from(e.target.files);
    //     if (files.length + newFiles.length <= 5) {
    //         setFiles((prev) => [...prev, ...newFiles]);
    //     }
    // };
    const [isDragging, setIsDragging] = useState(false);

    // const handleFileChange = (event) => {
    //     const selectedFiles = Array.from(event.target.files);
    //     setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    //     if (files.length + selectedFiles.length > 5) {
    //         toast.info('Bạn chỉ được chọn tối đa 5 ảnh!');
    //         return;
    //     }
    // };

    // const handleFileChange = (event) => {
    //     const selectedFiles = Array.from(event.target.files);

    //     // Kiểm tra nếu tổng số file vượt quá 5
    //     if (files.length + selectedFiles.length > 5) {
    //         toast.info('Bạn chỉ được chọn tối đa 5 ảnh!');
    //         return;
    //     }

    //     // Cập nhật state nếu hợp lệ
    //     setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    // };
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

    const timeSlotLabel =
        timeSlots.find((slot) => slot.value === state.patientState.timeSlot)?.label || 'Không xác định';

    const [doctorInfo, setDoctorInfo] = useState([]);

    console.log('Doctor info: ', state.patientState.doctorId);
    useEffect(() => {
        console.log('1');
        const fetchDoctorInfo = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${state.patientState.doctorId}`);
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

    console.log('REASON', reason);

    const handlePaymentDirect = async () => {
        try {
            // const payload = {
            //     doctorId: state.patientState.doctorId,
            //     patientRecordId: state.patientId,
            //     appointmentDate: state.patientState.currentDate,
            //     timeType: state.patientState.timeSlot,
            //     price: doctorInfo.price,
            //     reason: reason || '',
            // };
            // console.log('Payloaddd', payload);
            // const response = await axiosInstance.post('/booking/book-appointment-direct', payload);

            // Tạo FormData để gửi ảnh và payload
            const formData = new FormData();

            // Thêm các thông tin vào FormData
            formData.append('doctorId', state.patientState.doctorId);
            formData.append('patientRecordId', state.patientId);
            formData.append('appointmentDate', state.patientState.currentDate);
            formData.append('timeType', state.patientState.timeSlot);
            formData.append('price', doctorInfo.price);
            formData.append('reason', reason || '');

            // Thêm ảnh vào FormData
            files.forEach((file, index) => {
                formData.append('images', file);
            });

            const response = await axiosInstance.post('/booking/book-appointment-direct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response', response);
            console.log('Form Data', formData);
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
            // const payload = {
            //     doctorId: state.patientState.doctorId,
            //     patientRecordId: state.patientId,
            //     appointmentDate: state.patientState.currentDate,
            //     timeType: state.patientState.timeSlot,
            //     price: doctorInfo.price,
            //     reason: reason || '',
            // };

            // const response = await axiosInstance.post('/booking/book-appointment-online', payload);

            const formData = new FormData();

            // Thêm các thông tin vào FormData
            formData.append('doctorId', state.patientState.doctorId);
            formData.append('patientRecordId', state.patientId);
            formData.append('appointmentDate', state.patientState.currentDate);
            formData.append('timeType', state.patientState.timeSlot);
            formData.append('price', doctorInfo.price);
            formData.append('reason', reason || '');

            // Thêm ảnh vào FormData
            files.forEach((file, index) => {
                formData.append('images', file);
            });

            const response = await axiosInstance.post('/booking/book-appointment-online', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response', response);

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

    // const handleConfirm = () => {
    //     if (paymentMethod === 'direct') {
    //         handlePaymentDirect();
    //     } else if (paymentMethod === 'online') {
    //         handlePaymentOnline();
    //     }
    // };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            if (paymentMethod === 'direct') {
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    console.log('ID', state.patientId);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axiosInstance.get(`/patientrecord/${state.patientId}`);
                console.log('Patient Record', response);
                if (response.status === 200) {
                    setPatientData(response.data); // Lưu toàn bộ mảng bệnh nhân vào state
                } else {
                    setError('Không thể lấy dữ liệu');
                }
            } catch (error) {
                setError('Đã xảy ra lỗi khi lấy dữ liệu');
            }
        };

        fetchPatientData();
    }, [state.patientId]);

    const [paymentMethod, setPaymentMethod] = useState('direct'); // Trạng thái lưu trữ phương thức thanh toán
    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    return (
        <div className="bg-[#f3f4f6] mt-20">
            <div className="max-w-fit mx-auto p-4 space-y-4">
                <h1 className="text-5xl font-bold text-blue-600 mb-2 text-center">Xác nhận thông tin</h1>
                <div className="grid grid-cols-[20%_60%] gap-x-9 justify-center">
                    {/* Hospital Information */}
                    <div className="bg-white rounded-lg shadow-md h-fit">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-300 text-white p-3 rounded-t-lg">
                            <div className="font-medium text-3xl">Thông tin cơ sở y tế</div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-start gap-2">
                                <Hospital className="h-10 w-10 text-gray-500" />
                                <div>
                                    <h3 className="font-medium">{doctorInfo.clinicName}</h3>
                                    <h2 className="text-gray-500">{doctorInfo.addressClinic}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg shadow-md">
                            <div className="bg-gradient-to-r from-blue-400 to-blue-300 text-white p-3 rounded-t-lg">
                                <div className="font-medium text-3xl">Xác nhận thông tin khám</div>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead className="font-bold text-2xl  border-b border-gray-300 mb-10">
                                        <tr>
                                            <th className="text-left p-2">#</th>
                                            <th className="text-left p-2">Chuyên khoa</th>
                                            {/* <th className="text-left p-2">Lý do khám</th> */}
                                            <th className="text-left p-2">Bác sĩ</th>
                                            <th className="text-left p-2">Thời gian khám</th>
                                            <th className="text-left p-2">Tiền khám</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr className="text-2xl">
                                            <td className="p-2 font-bold">1</td>
                                            <td className="p-2">{doctorInfo.specialtyName}</td>
                                            {/* <td className="p-2">
                                            <input
                                                type="text"
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                className="w-[150px] p-2 border rounded"
                                                placeholder="Nhập lý do khám"
                                            />
                                        </td> */}
                                            <td className="p-2">{doctorInfo.fullname}</td>
                                            <td className="p-2">
                                                <div>{state.patientState.currentDate}</div>
                                                <div>{timeSlotLabel}</div>
                                            </td>
                                            <td className="p-2">{formatCurrency(doctorInfo.price)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Patient Information */}
                        <div className="bg-white rounded-lg shadow-md h-fit">
                            <div className="bg-gradient-to-r from-blue-400 to-blue-300 text-white p-3 rounded-t-lg">
                                <div className="font-medium text-3xl">Thông tin bệnh nhân</div>
                            </div>
                            <div className="space-y-3 mt-6">
                                <div className="flex gap-1 ml-4 top-5">
                                    {/* Cột 1 */}
                                    <div className="flex-1">
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <User className="mr-2 h-6 w-6 text-gray-500" />
                                                <span className="font-semibold mr-2">Họ và tên:</span>{' '}
                                                {patientData.fullname || ''}
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="mr-2 h-6 w-6 text-gray-500" />
                                                <span className="font-semibold mr-2">Ngày sinh:</span>
                                                {new Date(patientData.birthDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="mr-2 h-6 w-6 text-gray-500" />
                                                <span className="font-semibold mr-2">Số điện thoại:</span>{' '}
                                                {patientData.phoneNumber || ''}
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="mr-2 h-6 w-6 text-gray-500" />
                                                <span className="font-semibold mr-2">Giới tính:</span>{' '}
                                                {patientData.gender === 'Male' ? 'Nam' : 'Nữ' || ''}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cột 2 */}
                                    <div className="flex-1">
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <MapPin className="mr-2 h-6 w-6 text-gray-500" />
                                                <span className="font-semibold mr-2">Địa chỉ:</span>{' '}
                                                {patientData.address || ''}
                                            </div>
                                            <div className="flex items-center">
                                                <Briefcase className="mr-2 h-6 w-6 text-gray-500" />
                                                <span className="font-semibold mr-2">Nghề nghiệp:</span>{' '}
                                                {patientData.job || ''}
                                            </div>
                                            <div className="flex items-center">
                                                <Mail className="mr-2 h-6 w-6 text-gray-500" />
                                                <span className="font-semibold mr-2">Email:</span>{' '}
                                                {patientData.email || ''}
                                            </div>
                                            <div className="flex items-center">
                                                <IdCard className="mr-2 h-6 w-6 text-gray-500" />
                                                <span className="font-semibold mr-2">CCCD:</span>{' '}
                                                {patientData.CCCD || ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 mt-3">
                                <div className="font-semibold ml-2">Thông tin bổ sung (không bắt buộc)</div>
                                <div className="space-y-2">
                                    <label className="block text-2xl font-medium ml-2">Ghi chú</label>
                                    <textarea
                                        className="w-[748px] p-3 border rounded-lg min-h-[100px] text-xl ml-2 focus:border-blue-300 focus:outline-none hover:border-blue-300"
                                        placeholder="Triệu chứng, thuốc đang dùng, tiền sử, ..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>

                                {/* File Attachment */}
                                <div className="space-y-2">
                                    <label className="block text-2xl font-medium ml-2">
                                        Tập tin đính kèm ({files.length}/5)
                                    </label>
                                    <div
                                        className={`w-[748px] border-2 rounded-lg p-4 ml-2 cursor-pointer hover:border-blue-300 ${
                                            isDragging ? 'border-blue-500 bg-blue-100' : 'border-dashed'
                                        }`}
                                        onClick={() => document.getElementById('file-upload').click()}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <div className="text-center py-10">
                                            <div className="flex items-center justify-center">
                                                <div className="text-blue-600 hover:text-blue-700 text-xl mr-1">
                                                    Chọn tập tin
                                                </div>

                                                <span className="text-xl text-gray-500"> hoặc kéo thả vào đây</span>
                                            </div>
                                            <p className="text-xl text-gray-400 mt-1">.PNG, .JPG tối đa 15MB</p>
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
                                    <div className="ml-2 flex flex-wrap gap-4">
                                        {files.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative group w-48 h-48 border rounded-lg overflow-hidden"
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
                                                    className="absolute top-2 right-2   rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity "
                                                >
                                                    <X className="mr-2 text-red-600 font-bold  hover:text-red-800" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="px-4 py-2"></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md">
                            <div className="bg-gradient-to-r from-blue-400 to-blue-300 text-white p-3 rounded-t-lg">
                                <h2 className="font-medium text-3xl">Phương thức thanh toán</h2>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-1  gap-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="direct"
                                            name="paymentMethod"
                                            value="direct"
                                            checked={paymentMethod === 'direct'}
                                            onChange={handlePaymentMethodChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor="direct" className="font-medium">
                                            Thanh toán trực tiếp
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="online"
                                            name="paymentMethod"
                                            value="online"
                                            checked={paymentMethod === 'online'}
                                            onChange={handlePaymentMethodChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor="online" className="font-medium">
                                            Thanh toán online
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-20 ">
                            <button
                                className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={handleConfirm}
                            >
                                Xác nhận
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
                {/* Confirm Button */}
                {/* <div className="flex justify-end mt-20 ">
                    <button
                        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleConfirm}
                    >
                        Xác nhận
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
                </div> */}
            </div>
        </div>
    );
}

export default ConfirmInfomation;
