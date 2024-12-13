import React, { useState, useEffect, useContext } from 'react';
import { Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User, Calendar, Phone, Users, MapPin, Briefcase, Mail, IdCard } from 'lucide-react';
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
            const payload = {
                doctorId: state.patientState.doctorId,
                patientRecordId: state.patientId,
                appointmentDate: state.patientState.currentDate,
                timeType: state.patientState.timeSlot,
                price: doctorInfo.price,
                reason: reason || '',
            };

            const response = await axiosInstance.post('/booking/book-appointment-direct', payload);

            console.log('Response', response);

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
            const payload = {
                doctorId: state.patientState.doctorId,
                patientRecordId: state.patientId,
                appointmentDate: state.patientState.currentDate,
                timeType: state.patientState.timeSlot,
                price: doctorInfo.price,
                reason: reason || '',
            };

            const response = await axiosInstance.post('/booking/book-appointment-online', payload);

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
        <div className="max-w-fit mx-auto p-4 space-y-4 mt-32 mb-20">
            <h1 className="text-5xl font-bold text-blue-600 mb-2 text-center">Xác nhận thông tin</h1>
            {/* Hospital Information */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="bg-blue-400 text-white p-3 rounded-t-lg">
                    <h2 className="font-medium">Thông tin cơ sở y tế</h2>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1  gap-4">
                        <h3 className="font-medium">{doctorInfo.clinicName}</h3>
                        <h2 className="">{doctorInfo.addressClinic}</h2>
                    </div>
                </div>
            </div>

            {/* Appointment Details */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="bg-blue-400 text-white p-3 rounded-t-lg">
                    <h2 className="font-medium">Xác nhận thông tin khám</h2>
                </div>
                <div className="p-4 overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead className="text-2xl text-gray-600">
                            <tr>
                                <th className="text-left p-2">#</th>
                                <th className="text-left p-2">Chuyên khoa</th>
                                <th className="text-left p-2">Lý do khám</th>
                                <th className="text-left p-2">Bác sĩ</th>
                                <th className="text-left p-2">Thời gian khám</th>
                                <th className="text-left p-2">Tiền khám</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-2xl">
                                <td className="p-2">1</td>
                                <td className="p-2">{doctorInfo.specialtyName}</td>
                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-[150px] p-2 border rounded"
                                        placeholder="Nhập lý do khám"
                                    />
                                </td>
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
                <div className="bg-blue-400 text-white p-3 rounded-t-lg">
                    <h2 className="font-medium">Thông tin bệnh nhân</h2>
                </div>
                <div className="space-y-3">
                    <div className="flex gap-1 ml-4 top-5">
                        {/* Cột 1 */}
                        <div className="flex-1">
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <User className="mr-2 h-6 w-6 text-gray-500" />
                                    <span className="font-semibold mr-2">Họ và tên:</span> {patientData.fullname || ''}
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
                                    <span className="font-semibold mr-2">Địa chỉ:</span> {patientData.address || ''}
                                </div>
                                <div className="flex items-center">
                                    <Briefcase className="mr-2 h-6 w-6 text-gray-500" />
                                    <span className="font-semibold mr-2">Nghề nghiệp:</span> {patientData.job || ''}
                                </div>
                                <div className="flex items-center">
                                    <Mail className="mr-2 h-6 w-6 text-gray-500" />
                                    <span className="font-semibold mr-2">Email:</span> {patientData.email || ''}
                                </div>
                                <div className="flex items-center">
                                    <IdCard className="mr-2 h-6 w-6 text-gray-500" />
                                    <span className="font-semibold mr-2">CCCD:</span> {patientData.CCCD || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="bg-blue-400 text-white p-3 rounded-t-lg">
                    <h2 className="font-medium">Phương thức thanh toán</h2>
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
            {/* Confirm Button */}
            <div className="flex justify-end mt-20 ">
                <button className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleConfirm}>
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
    );
}

export default ConfirmInfomation;
