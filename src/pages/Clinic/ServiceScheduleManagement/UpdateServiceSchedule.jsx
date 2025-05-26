import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import FormServiceSchedule from './FormServiceSchedule';
import Title from '~/components/Tittle';

function UpdateServiceSchedule() {
    const { serviceId, scheduleDate } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState();

    useEffect(() => {
        const getDetailServiceScheduleAPI = async (serviceId, scheduleDate) => {
            try {
                const response = await axiosClient.get(`/service-schedule/${serviceId}?date=${scheduleDate}`);
                console.log('response getDetailServiceScheduleAPI', response);

                if (response.status === 200) {
                    setDefaultValues(response.data);
                } else {
                    console.error('Failed to get detail worktime:', response.message);
                }
            } catch (error) {
                console.error('Error get detail worktime:', error);
            }
        };
        getDetailServiceScheduleAPI(serviceId, scheduleDate);
    }, [serviceId, scheduleDate]);

    const updateServiceScheduleAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/service-schedule/${serviceId}`, formData);
            if (response.status === 200) {
                toast.success('Cập nhật lịch làm việc dịch vụ thành công!');
                navigate('/clinic/service-schedule');
            } else {
                console.error('Failed to update worktime:', response.message);
            }
        } catch (error) {
            console.error('Error update worktime:', error);
        }
    };
    return (
        <>
            <div className="px-3 mb-6">
                <Title>Cập nhật lịch làm việc dịch vụ</Title>
                <FormServiceSchedule defaultValues={defaultValues} onSubmit={updateServiceScheduleAPI} />
            </div>
        </>
    );
}

export default UpdateServiceSchedule;
