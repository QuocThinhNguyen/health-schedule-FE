import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import { Check } from 'lucide-react';
import { AlertCircle, X, AlertTriangle, Calendar, Phone, Send } from 'lucide-react';
import { set } from 'date-fns';
import { RadioGroup, Radio } from 'react-radio-group';
import emailjs from '@emailjs/browser';

function DoctorScheduleManagement() {
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const { user } = useContext(UserContext);
    const [currentNumber, setCurrentNumber] = useState([]);
    const [showConfilctModel, setShowConfilctModel] = useState(false);
    const [getBookingConflict, setGetBookingConflict] = useState([]);
    const [reasonModel, setReasonModel] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [nameDoctor, setNameDoctor] = useState('');
    const [slotValue, setSlotValue] = useState('');

    console.log('currentNumber', currentNumber);

    // Danh sách các khung giờ có sẵn
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

    useEffect(() => {
        const fetchDoctorName = async () => {
            try {
                const response = await axiosInstance.get(`/user/${user.userId}`);
                if (response.status === 200) {
                    setNameDoctor(response.data.fullname);
                } else {
                    console.error('Error fetching doctor information:', response.message);
                }
            } catch (error) {
                console.error('Error fetching doctor information:', error);
            }
        };
        fetchDoctorName();
    }, []);

    useEffect(() => {
        // Đặt ngày mặc định là ngày hiện tại khi component được tải
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, []);

    // Lấy thông tin lịch làm việc theo ngày
    const fetchScheduleByDate = async (date) => {
        try {
            const response = await axiosInstance.get(`/schedule/${user.userId}?date=${date}`);
            const scheduleData = response?.data ?? [];
            if (response.status === 200 && scheduleData.length > 0) {
                const { timeTypes = [], currentNumbers = [] } = scheduleData[0];
                setSelectedTimeSlots(timeTypes);
                setCurrentNumber(currentNumbers);
            } else {
                console.log('Error fetching schedule:', response.message);
                setSelectedTimeSlots([]); // Nếu không có lịch thì để rỗng
                setCurrentNumber([]);
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
            setSelectedTimeSlots([]);
            setCurrentNumber([]);
        }
    };

    // Gọi API khi ngày thay đổi
    useEffect(() => {
        if (selectedDate) {
            fetchScheduleByDate(selectedDate);
        }
    }, [selectedDate]);

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${user.userId}`);
                if (response.status === 200) {
                    setSelectedDoctor(response.data);
                } else {
                    console.error('Error fetching doctor information:', response.errMessage);
                }
            } catch (error) {
                console.error('Error fetching doctor information:', error);
            }
        };

        fetchDoctorInfo();
    }, []);

    // dùng api http://localhost:9000/booking/getBookingByTimeType?doctorId=2&timeType=T5&date=2025-05-17
    const fetchBookingByTimeType = async (doctorId, timeType, date) => {
        try {
            const response = await axiosInstance.get(
                `/booking/getBookingByTimeType?doctorId=${doctorId}&timeType=${timeType}&date=${date}`,
            );
            console.log('response', response);
            const data = response.data;
            return data;
            // if (response.status === 200) {
            //     setGetBookingConflict(response.data);
            // } else {
            //     console.error('Error fetching booking by time type:', response.message);
            // }
        } catch (error) {
            console.error('Error fetching booking by time type:', error);
        }
    };

    // Xử lý khi người dùng chọn hoặc bỏ chọn khung giờ
    const toggleTimeSlot = async (slotValue, index) => {
        // setSelectedTimeSlots((prevSlots) =>
        //     prevSlots.includes(slotValue) ? prevSlots.filter((time) => time !== slotValue) : [...prevSlots, slotValue],
        // );
        console.log('slot value', slotValue);
        console.log('index', index);
        setSlotValue(slotValue);
        const isSelected = selectedTimeSlots.includes(slotValue);
        if (isSelected) {
            if (currentNumber[index] > 0) {
                const data = await fetchBookingByTimeType(user.userId, slotValue, selectedDate);
                if (data) {
                    setGetBookingConflict(data);
                    setShowConfilctModel(true);
                }
                return;
            }
            setSelectedTimeSlots(selectedTimeSlots.filter((slot) => slot !== slotValue));
        } else {
            setSelectedTimeSlots([...selectedTimeSlots, slotValue]);
        }
    };

    // lấy danh sách tên, email từ getBookingConflict
    const getBookingConflictNameAndEmail = () => {
        const bookingConflict = getBookingConflict.map((item) => ({
            namePatient: item.patientRecordId.fullname,
            email: item.email,
            nameUser: item.name,
        }));
        return bookingConflict;
    };

    const getBookingIds = () => {
        const bookingIds = getBookingConflict.map((item) => item.bookingId);
        const uniqueBookingIds = [...new Set(bookingIds)];
        return uniqueBookingIds;
    };

    // Xử lý khi nhấn nút "Lưu thông tin"
    const handleSave = async () => {
        const currentDate = new Date();
        const appointmentDateObj = new Date(selectedDate);

        if (appointmentDateObj - currentDate < 24 * 60 * 60 * 1000) {
            toast.error('Không thể cập nhật lịch làm việc cho ngày hôm nay hoặc ngày mai. Vui lòng chọn ngày khác.');
            return;
        }

        const requestData = {
            doctorId: selectedDoctor.doctorId,
            scheduleDate: selectedDate,
            timeTypes: selectedTimeSlots,
        };
        console.log('Request data:', requestData);
        try {
            const response = await axiosInstance.put(`/schedule/${user.userId}`, requestData);
            console.log('Response:', response);
            if (response.status === 200) {
                toast.success('Lưu thành công!');
            } else if (response.status === 400) {
                toast.error(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
            toast.error('Có lỗi xảy ra khi lưu thông tin.');
        }
    };

    const CANCELLATION_REASONS = [
        {
            id: 'emergency',
            label: 'Có việc khẩn cấp',
            description: 'Bác sĩ có việc khẩn cấp không thể khám vào khung giờ này',
        },
        {
            id: 'sick',
            label: 'Bác sĩ không khỏe',
            description: 'Bác sĩ không đủ sức khỏe để khám bệnh vào khung giờ này',
        },
        {
            id: 'training',
            label: 'Tham gia đào tạo/hội thảo',
            description: 'Bác sĩ cần tham gia khóa đào tạo/hội thảo chuyên môn',
        },
        {
            id: 'schedule_conflict',
            label: 'Trùng lịch công việc khác',
            description: 'Bác sĩ có lịch công việc khác trùng với khung giờ này',
        },
        {
            id: 'custom',
            label: 'Lý do khác',
            description: 'Nhập lý do cụ thể',
        },
    ];

    const updateStatus = async (appointmentId, statusKey) => {
        try {
            const response = await axiosInstance.put(`/booking/${appointmentId}`, { status: statusKey });

            if (response.status === 200) {
                console.log('Cập nhật trạng thái thành công!');
            } else {
                console.log('Cập nhật trạng thái thất bại.');
            }
        } catch (error) {
            // console.error('Error updating status:', error);
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái.');
        }
    };

    const sendMailAndCancel = async () => {
        if (!selectedReason) {
            toast.error('Vui lòng chọn lý do hủy lịch.');
            return;
        }
        let sendReason;
        if (selectedReason === 'custom') {
            sendReason = customReason;
        } else {
            sendReason = CANCELLATION_REASONS.find((item) => item.id === selectedReason)?.label;
        }

        const bookingIds = getBookingIds();
        const bookingConflict = getBookingConflictNameAndEmail();
        console.log('bookingConflict', bookingConflict);

        for (const bookingId of bookingIds) {
            await updateStatus(bookingId, 'S5');
        }
        await fetchScheduleByDate(selectedDate);

        const appointmentTime = timeSlots.find((slot) => slot.value === slotValue)?.label;

        for (const item of bookingConflict) {
            const templateParams = {
                email: item.email,
                name: item.nameUser,
                patientName: item.namePatient,
                doctorName: nameDoctor,
                appointmentDate: new Date(selectedDate).toLocaleDateString('vi-VN'),
                appointmentTime: appointmentTime,
                cancellationReason: sendReason,
            };

            try {
                await emailjs.send(
                    import.meta.env.VITE_EMAIL_SERVICE_ID,
                    import.meta.env.VITE_EMAIL_TEMPLATE_DOCTOR_ID,
                    templateParams,
                    import.meta.env.VITE_EMAIL_PUBLIC_KEY,
                );
                toast.success('Gửi email thông báo thành công!');
            } catch (error) {
                console.error('Error sending email:', error);
                toast.error('Có lỗi xảy ra khi gửi email thông báo.');
            }
        }

        setCustomReason('');
        setSelectedReason('');
        setSlotValue('');
        setReasonModel(false);
    };

    return (
        <div>
            <div className="p-8 w-150 h-fit border rounded-lg shadow-lg bg-white overflow-y-auto">
                {/* <h1 className="text-2xl font-bold text-center mb-8">Quản lý lịch làm việc</h1> */}
                <div className="">
                    <div className="grid grid-cols-2 mb-6">
                        {/* Chọn ngày */}
                        <div className="flex flex-col">
                            <label className="font-semibold mb-2">Chọn ngày</label>
                            <input
                                type="date"
                                value={selectedDate || ''}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="border p-2 rounded max-w-xs"
                            />
                        </div>

                        <div className=" flex justify-end items-center gap-6 mt-8">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded"></div>
                                <span className="text-sm text-gray-600">Đã chọn</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                <span className="text-sm text-gray-600">Chưa chọn</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hiển thị các khung giờ */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8 mt-2">
                    {timeSlots.map((slot, index) => (
                        <button
                            key={slot.value}
                            onClick={() => toggleTimeSlot(slot.value, index)}
                            className={`relative h-12 px-4 rounded-lg border-2 hover:border-green-500 hover:bg-green-50/50 ${
                                selectedTimeSlots.includes(slot.value)
                                    ? 'border-green-500 bg-green-50 text-green-600'
                                    : 'border-gray-200'
                            }`}
                        >
                            {slot.label}
                            {currentNumber?.length > 0 && currentNumber[index] > 0 && (
                                <div className="absolute -top-2 -right-1 rounded-full bg-red-500 w-5 h-5 text-white flex items-center justify-center text-xs">
                                    {currentNumber[index]}
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Nút Lưu thông tin */}
                <div className="flex justify-center">
                    <button onClick={handleSave} className="bg-blue-500 text-white py-3 px-4 rounded-lg">
                        Lưu thông tin
                    </button>
                </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start mt-2">
                <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Lưu ý khi thay đổi lịch làm việc:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Các khung giờ có số hiển thị màu đỏ đã có bệnh nhân đặt lịch</li>
                        <li>Khi bỏ chọn khung giờ đã có lịch hẹn, hệ thống sẽ hiển thị cảnh báo</li>
                        <li>Bạn sẽ cần nhập lý do hủy lịch để thông báo đến bệnh nhân</li>
                        <li>Hệ thống sẽ tự động gửi email thông báo đến tất cả bệnh nhân bị ảnh hưởng</li>
                    </ul>
                </div>
            </div>
            {showConfilctModel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <p className="font-semibold text-xl text-red-500">Khung giờ đã có lịch hẹn</p>
                            </div>
                            <button className="items-end" onClick={() => setShowConfilctModel(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-4 text-base">
                            Khung giờ này đã có {getBookingConflict.length} bệnh nhân đặt lịch. Vui lòng xem xét trước
                            khi xóa
                        </div>

                        <div className="flex items-center justify-start gap-2 mt-4 bg-amber-50 p-3">
                            <Calendar className="w-5 h-5 text-red-500" />
                            <p className="font-semibold text-gray-700">
                                {new Date(getBookingConflict[0]?.appointmentDate).toLocaleDateString('vi-VN')}
                            </p>
                            <p>|</p>
                            <p className="text-amber-600">
                                {timeSlots.find((slot) => slot.value === getBookingConflict[0]?.timeType)?.label}
                            </p>
                        </div>

                        <div className="overflow-y-auto max-h-80">
                            {getBookingConflict.length > 0 &&
                                getBookingConflict.map((booking, index) => (
                                    <div key={index}>
                                        <div className="mt-4">
                                            <div className="border p-2 rounded-lg grid grid-cols-2">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                        {booking.patientRecordId?.fullname[0]}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="font-medium text-gray-800">
                                                            {booking.patientRecordId?.fullname}
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex items-center">
                                                            <Phone className="h-3.5 w-3.5 mr-1" />
                                                            {booking.patientRecordId?.phoneNumber}
                                                        </div>
                                                        <div className="text-sm text-gray-600">{booking.reason}</div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end">
                                                    <div className=" border rounded-xl h-fit px-4 py-1 text-blue-600 bg-blue-50 font-semibold">
                                                        {booking.status.valueVi}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-4">
                            <button
                                className="rounded-lg px-4 py-2 bg-gray-100 hover:bg-gray-200 border-gray-300"
                                onClick={() => setShowConfilctModel(false)}
                            >
                                Giữ khung giờ này
                            </button>
                            <button
                                className="text-white bg-red-500 rounded-lg px-4 py-2 hover:bg-red-600"
                                onClick={() => {
                                    setReasonModel(true);
                                    setShowConfilctModel(false);
                                }}
                            >
                                Xóa khung giờ
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {reasonModel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <p className="font-semibold text-xl text-red-500">Lý do hủy lịch</p>
                            </div>
                            <button className="items-end" onClick={() => setReasonModel(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-4 text-base flex items-center flex-wrap gap-1">
                            Vui lòng chọn lý do hủy lịch khám cho khung giờ
                            <p className="text-red-500 font-semibold">
                                {timeSlots.find((slot) => slot.value === getBookingConflict[0].timeType)?.label}
                            </p>{' '}
                            ngày{' '}
                            <p className="text-red-500 font-semibold">
                                {new Date(getBookingConflict[0].appointmentDate).toLocaleDateString('vi-VN')}
                            </p>
                            . Hệ thống sẽ gửi email thông báo đến {getBookingConflict.length} bệnh nhân đã đặt lịch.
                        </div>

                        <div className="mt-4">
                            <RadioGroup
                                name="cancellationReason"
                                selectedValue={selectedReason}
                                onChange={(value) => setSelectedReason(value)}
                            >
                                {CANCELLATION_REASONS.map((reason) => (
                                    <div
                                        key={reason.id}
                                        className="p-3 cursor-pointer flex items-center gap-2"
                                        onClick={() => setSelectedReason(reason.id)}
                                    >
                                        <Radio value={reason.id} />
                                        {reason.label}
                                    </div>
                                ))}
                            </RadioGroup>
                            {selectedReason === 'custom' && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Nhập lý do cụ thể</p>
                                    <textarea
                                        placeholder="Nhập lý do cụ thể"
                                        rows={2}
                                        className="w-full min-h-10 p-2 border rounded-md  focus:border-blue-600 focus:outline-none hover:border-blue-600 text-base"
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-4">
                            <button
                                className="rounded-lg px-4 py-2 bg-gray-100 hover:bg-gray-200 border-gray-300"
                                onClick={() => setReasonModel(false)}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                className="text-white bg-blue-500 rounded-lg px-4 py-2 hover:bg-blue-600 flex items-center"
                                onClick={sendMailAndCancel}
                            >
                                <Send className="w-4 h-4 mr-1" />
                                Gửi thông báo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorScheduleManagement;
