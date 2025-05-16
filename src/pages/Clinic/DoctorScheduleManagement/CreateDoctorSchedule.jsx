import { toast } from 'react-toastify';
import { axiosInstance } from '~/api/apiRequest';
import Title from '../../../components/Tittle';
import FormDoctorSchedule from './FormDoctorSchedule';

function CreateDoctorSchedule() {
    const createDoctorScheduleAPI = async (formData) => {
        try {
            const response = await axiosInstance.post('/schedule', formData);
            if (response.status === 200) {
                toast.success('Thêm lịch làm việc bác sĩ thành công!');
            } else {
                toast.error(response.message);
                console.error('Failed to create worktime:', response.message);
            }
        } catch (error) {
            console.error('Error creating worktime:', error);
        }
    };
    return (
        <>
            <div className="px-3 mb-6">
                <Title>Thêm lịch làm việc bác sĩ</Title>
                <FormDoctorSchedule onSubmit={createDoctorScheduleAPI} />
            </div>
        </>
    );
}

export default CreateDoctorSchedule;
