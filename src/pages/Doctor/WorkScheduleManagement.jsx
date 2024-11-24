import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';

function DoctorScheduleManagement() {
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const { user } = useContext(UserContext);

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
        // Đặt ngày mặc định là ngày hiện tại khi component được tải
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, []);

    // Lấy thông tin lịch làm việc theo ngày
    const fetchScheduleByDate = async (date) => {
        try {
            const response = await axiosInstance.get(`/schedule/${user.userId}?date=${date}`);
            if (response.status === 'OK') {
                const bookedSlots = response.data.length > 0 ? response.data[0].timeTypes : [];
                setSelectedTimeSlots(bookedSlots);
            } else {
                console.error('Error fetching schedule:', response.message);
                setSelectedTimeSlots([]); // Nếu không có lịch thì để rỗng
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
            setSelectedTimeSlots([]);
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
                console.log('Doctor infooo:', response);
                if (response.errCode === 0) {
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

    // Xử lý khi người dùng chọn hoặc bỏ chọn khung giờ
    const toggleTimeSlot = (slotValue) => {
        setSelectedTimeSlots((prevSlots) =>
            prevSlots.includes(slotValue) ? prevSlots.filter((time) => time !== slotValue) : [...prevSlots, slotValue],
        );
    };

    // Xử lý khi nhấn nút "Lưu thông tin"
    const handleSave = async () => {
        const requestData = {
            doctorId: selectedDoctor.doctorId,
            scheduleDate: selectedDate,
            timeTypes: selectedTimeSlots,
        };

        console.log('Request data:', requestData);
        try {
            const response = await axiosInstance.put(`/schedule/${user.userId}`, requestData);
            if (response.status === 'OK') {
                toast.success('Lưu thành công!');
            } else if (response.message === 'Schedule already exists') {
                toast.error('Lịch làm việc cho bác sĩ đã tồn tại.');
            } else {
                toast.error('Lưu thông tin không thành công: ' + response.message);
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
            toast.error('Có lỗi xảy ra khi lưu thông tin.');
        }
    };

    return (
        <div className="p-8 w-150 h-full border rounded-lg shadow-lg bg-white overflow-y-auto">
            <h1 className="text-2xl font-bold text-center mb-8">QUẢN LÝ KẾ HOẠCH KHÁM BỆNH CỦA BÁC SĨ</h1>

            <div className="flex justify-center items-center mb-6 space-x-4">
                {/* Chọn bác sĩ */}
                <div>
                    <label className="font-semibold mr-2">Bác sĩ</label>
                    <input
                        type="text"
                        value={selectedDoctor.fullname || ''}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="border p-2 rounded"
                        disabled={true}
                    />
                </div>

                {/* Chọn ngày */}
                <div>
                    <label className="font-semibold mr-2">Chọn ngày</label>
                    <input
                        type="date"
                        value={selectedDate || ''}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border p-2 rounded"
                    />
                </div>
            </div>

            {/* Hiển thị các khung giờ */}
            <div className="flex justify-center space-x-4 mb-6">
                {timeSlots.map((slot) => (
                    <button
                        key={slot.value}
                        onClick={() => toggleTimeSlot(slot.value)}
                        className={`p-2 border rounded ${
                            selectedTimeSlots.includes(slot.value) ? 'bg-yellow-500 text-white' : 'bg-white text-black'
                        }`}
                    >
                        {slot.label}
                    </button>
                ))}
            </div>

            {/* Nút Lưu thông tin */}
            <div className="flex justify-center">
                <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
                    Lưu thông tin
                </button>
            </div>
        </div>
    );
}

export default DoctorScheduleManagement;
