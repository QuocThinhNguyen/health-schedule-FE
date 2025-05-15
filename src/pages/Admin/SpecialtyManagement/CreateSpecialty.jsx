import { toast } from 'react-toastify';
import { axiosInstance } from '~/api/apiRequest';
import Title from '../../../components/Tittle';
import FormSpecialty from './FormSpecialty';

function CreateSpecialty() {
    const createSpecialtyAPI = async (formData) => {
        try {
            const response = await axiosInstance.post('/specialty', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200) {
                toast.success('Thêm chuyên khoa thành công!');
            } else {
                console.error('Failed to create specialty:', response.message);
            }
        } catch (error) {
            console.error('Error creating specialty:', error);
        }
    };
    return (
        <>
            <div className="px-3 mb-6">
                <Title>Thêm chuyên khoa</Title>
                <FormSpecialty onSubmit={createSpecialtyAPI} />
            </div>
        </>
    );
}

export default CreateSpecialty;
