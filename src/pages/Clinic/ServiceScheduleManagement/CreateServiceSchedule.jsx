import { toast } from "react-toastify";
import { axiosInstance } from "~/api/apiRequest";
import Title from "~/components/Tittle";
import FormServiceSchedule from "./FormServiceSchedule";

function CreateServiceSchedule() {
    const createServiceScheduleAPI = async (formData) => {
        try {
            const response = await axiosInstance.post('/service-schedule', formData);
            if (response.status === 200) {
                toast.success('Thêm lịch cho dịch vụ thành công!');
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
                <Title>Thêm lịch dịch vụ</Title>
                <FormServiceSchedule onSubmit={createServiceScheduleAPI} />
            </div>
        </>
    );
}

export default CreateServiceSchedule;
