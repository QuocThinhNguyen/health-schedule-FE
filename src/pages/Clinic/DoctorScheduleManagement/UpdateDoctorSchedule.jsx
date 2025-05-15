import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '~/api/apiRequest';
import Title from '../../../components/Tittle';
import FormDoctorSchedule from './FormDoctorSchedule';

function UpdateDoctorSchedule() {
    const { doctorId, scheduleDate } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState();

    useEffect(() => {
        const getDetailDoctorScheduleAPI = async (doctorId, scheduleDate) => {
            try {
                const response = await axiosInstance.get(`/schedule/${doctorId}?date=${scheduleDate}`);
                if (response.status === 200) {
                    setDefaultValues(response.data[0]);
                } else {
                    console.error('Failed to get detail worktime:', response.message);
                }
            } catch (error) {
                console.error('Error get detail worktime:', error);
            }
        };
        getDetailDoctorScheduleAPI(doctorId, scheduleDate);
    }, [doctorId, scheduleDate]);

    const updateDoctorScheduleAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/schedule/${doctorId}`, formData);
            if (response.status === 200) {
                toast.success('Cập nhật lịch làm việc thành công!');
                navigate('/clinic/doctor-schedule');
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
                <Title>Cập nhật lịch làm việc bác sĩ</Title>
                <FormDoctorSchedule defaultValues={defaultValues} onSubmit={updateDoctorScheduleAPI} />
            </div>
        </>
    );
}

export default UpdateDoctorSchedule;
