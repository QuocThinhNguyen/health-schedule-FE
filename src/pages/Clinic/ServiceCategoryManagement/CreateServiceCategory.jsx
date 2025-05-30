import { axiosInstance } from '~/api/apiRequest';
import FormServiceCategory from './FormServiceCategory';
import Title from '~/components/Tittle';
import { toast } from 'react-toastify';

function CreateServiceCategory() {
    const createServiceCategoryAPI = async (formData) => {
        try {
            const response = await axiosInstance.post('/service-category', formData, {});
            if (response.status === 200) {
                toast.success('Thêm loại dịch vụ thành công!');
            } else {
                console.error('Failed to create service:', response.message);
                toast.error('Thêm loại dịch vụ thất bại');
            }
        } catch (error) {
            console.error('Failed to create service:', error);
            toast.error('Thêm loại dịch vụ thất bại');
        }
    };
    return (
        <>
            <div className="px-3 mb-6">
                <Title>Thêm loại dịch vụ</Title>
                <FormServiceCategory onSubmit={createServiceCategoryAPI} />
            </div>
        </>
    );
}

export default CreateServiceCategory;
