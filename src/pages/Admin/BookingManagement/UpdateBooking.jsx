import { useNavigate, useParams } from 'react-router-dom';
import Title from '../../../components/Tittle';
import FormBooking from './FormBooking';
import { useEffect, useState } from 'react';
import { axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';

function UpdateBooking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState();
    useEffect(() => {
        console.log('id:', id);

        const getDetailScheduleAPI = async (bookingId) => {
            try {
                const response = await axiosInstance.get(`/booking/${bookingId}`);
                console.log('Check response', response);
                if (response.status === 200) {
                    console.log('Get detail booking:', response.data);
                    setDefaultValues(response.data);
                } else {
                    console.error('Failed to get detail booking:', response.message);
                }
            } catch (error) {
                console.error('Error get detail booking:', error);
            }
        };
        getDetailScheduleAPI(id);
    }, [id]);

    const timeTypeMapping = {
        T1: '8:00 - 9:00',
        T2: '9:00 - 10:00',
        T3: '10:00 - 11:00',
        T4: '11:00 - 12:00',
        T5: '13:00 - 14:00',
        T6: '14:00 - 15:00',
        T7: '15:00 - 16:00',
        T8: '16:00 - 17:00',
    };

    const updateScheduleAPI = async (formData) => {
        try {
            const status = formData.get('status');
            console.log('Check status:', status);
            let checkStatus;
            if (status === 'S1') {
                checkStatus = 'Chưa xác nhận';
            } else if (status === 'S2') {
                checkStatus = 'Đã xác nhận';
            } else if (status === 'S3') {
                checkStatus = 'Đã thanh toán';
            } else if (status === 'S4') {
                checkStatus = 'Đã khám xong';
            } else {
                checkStatus = 'Đã hủy';
            }
            const response = await axiosInstance.put(`/booking/${id}`, formData);
            if (response.status === 200) {
                toast.success('Cập nhật lịch hẹn thành công!');
                const templateParams = {
                    email: defaultValues.patientRecordId.patientId.email,
                    name: defaultValues.patientRecordId.patientId.fullname,
                    patientName: defaultValues.patientRecordId.fullname,
                    doctorName: defaultValues.doctorId.fullname,
                    appointmentDate: new Date(defaultValues.appointmentDate).toLocaleDateString('vi-VN'),
                    appointmentTime: timeTypeMapping[defaultValues.timeType],
                    clinicName: defaultValues.info.clinicId.name,
                    status: checkStatus,
                };

                await emailjs.send(
                    import.meta.env.VITE_EMAIL_SERVICE2_ID,
                    import.meta.env.VITE_EMAIL_TEMPLATE_ADMIN_UPDATE_ID,
                    templateParams,
                    import.meta.env.VITE_EMAIL_PUBLIC_KEY2,
                );

                navigate('/admin/booking');
            } else {
                console.error('Failed to update schedule:', response.message);
            }
        } catch (error) {
            console.error('Error update schedule:', error);
        }
    };

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Cập nhật lịch hẹn</Title>
                <FormBooking defaultValues={defaultValues} onSubmit={updateScheduleAPI} />
            </div>
        </>
    );
}

export default UpdateBooking;
