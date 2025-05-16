import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '~/api/apiRequest';
import FormUser from './FormUser';
import Title from '../../../components/Tittle';

function UpdateUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState();

    useEffect(() => {
        const getDetailUserAPI = async (id) => {
            try {
                const response = await axiosInstance.get(`/user/${id}`);
                if (response.status === 200) {
                    setDefaultValues(response.data);
                } else {
                    console.error('Failed to get detail user:', response.message);
                }
            } catch (error) {
                console.error('Error get detail user:', error);
            }
        };
        getDetailUserAPI(id);
    }, [id]);

    const updateUserAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/user/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200) {
                toast.success('Cập nhật tài khoản người dùng thành công!');
                navigate('/admin/user');
            } else {
                console.error('Failed to update user:', response.message);
            }
        } catch (error) {
            console.error('Error update user:', error);
        }
    };

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Cập nhật tài khoản người dùng</Title>
                <FormUser defaultValues={defaultValues} onSubmit={updateUserAPI} />
            </div>
        </>
    );
}

export default UpdateUser;
