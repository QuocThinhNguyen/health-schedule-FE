import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '~/api/apiRequest';
import FormService from './FormService';
import Title from '~/components/Tittle';
import { toast } from 'react-toastify';

function UpdateService() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState();

    useEffect(() => {
        const getDetailServiceAPI = async (id) => {
            try {
                const response = await axiosInstance.get(`/service/${id}`);
                if (response.status === 200) {
                    setDefaultValues(response.data);
                } else {
                    console.error('No service found:', response.message);
                }
            } catch (error) {
                console.error('Failed to get service:', error);
            }
        };
        getDetailServiceAPI(id);
    }, [id]);

    const updateServiceAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/service/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                toast.success('Cập nhật dịch vụ thành công!');
                navigate('/clinic/service');
            } else {
                console.error('Failed to update service:', response.message);
            }
        } catch (error) {
            console.error('Error update service:', error);
        }
    };
    return (
        <>
            <div className="px-3 mb-6">
                <Title>Cập nhật dịch vụ</Title>
                <FormService defaultValues={defaultValues} onSubmit={updateServiceAPI} />
            </div>
        </>
    );
}

export default UpdateService;
