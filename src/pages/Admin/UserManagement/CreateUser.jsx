import { toast } from 'react-toastify';
import { axiosInstance } from '~/api/apiRequest';
import Title from '../components/Tittle';
import FormUser from './FormUser';

function CreateUser() {
    const createUserAPI = async (formData) => {
        try {
            const response = await axiosInstance.post('/user', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200) {
                toast.success('Thêm tài khoản người dùng thành công!');
            } else {
                console.error('Failed to create user:', response.message);
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };
    return (
        <>
            <div className="px-3 mb-6">
                <Title>Thêm tài khoản người dùng</Title>
                <FormUser onSubmit={createUserAPI} />
            </div>
        </>
    );
}

export default CreateUser;
