import Title from '../../../components/Tittle';
import FormClinic from './FormClinic';
import { axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';

function CreateClinic() {
    const createClinicAPI = async (formData) => {
        try {
            const response = await axiosInstance.post('/clinic', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                toast.success('Clinic created successfully!');
            } else {
                console.error('Failed to create clinic:', response.message);
            }
        } catch (error) {
            console.error('Error creating clinic:', error);
        }
    };

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Thêm bệnh viện</Title>
                <FormClinic onSubmit={createClinicAPI} />
            </div>
        </>
    );
}

export default CreateClinic;
