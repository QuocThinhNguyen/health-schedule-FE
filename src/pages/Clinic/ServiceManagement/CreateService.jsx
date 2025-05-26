
import FormPost from "../PostManagement/FormPost";
import { toast } from "react-toastify";
import { axiosInstance } from "~/api/apiRequest";
import Title from "~/components/Tittle";

function CreateService() {
    const createServiceAPI = async (formData) => {
        try {
            const response = await axiosInstance.post('/service', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                toast.success('Thêm dịch vụ thành công!');
            } else {
                console.error('Failed to create service:', response.message);
                toast.error('Thêm dịch vụ thất bại');
            }
        } catch (error) {
            console.error('Failed to create service:', error);
            toast.error('Thêm dịch vụ thất bại');
        }
    };
    return (
        <>
            <div className="px-3 mb-6">
                <Title>Thêm dịch vụ</Title>
                <FormPost onSubmit={createServiceAPI} />
            </div>
        </>
    );
}

export default CreateService;