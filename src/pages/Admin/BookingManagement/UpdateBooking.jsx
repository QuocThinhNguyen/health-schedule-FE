import { useNavigate, useParams } from 'react-router-dom';
import Title from '../components/Tittle';
import FormBooking from './FormBooking';
import { useEffect, useState } from 'react';
import { axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';

function UpdateBooking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState();
    useEffect(() => {
        console.log('id:', id);

        const getDetailScheduleAPI = async (bookingId) => {
            try {
                const response = await axiosInstance.get(`/booking/${bookingId}`);
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

    const updateScheduleAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/booking/${id}`, formData);
            if (response.status === 200) {
                toast.success('Cập nhật lịch hẹn thành công!');
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
