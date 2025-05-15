import { useNavigate, useParams } from 'react-router-dom';
import Title from '../../../components/Tittle';
import FormClinic from './FormClinic';
import { useEffect, useState } from 'react';
import { axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';

function UpdateClinic() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState();

    useEffect(() => {
        const getDetailClinicAPI = async (id) => {
            try {
                const response = await axiosInstance.get(`/clinic/${id}`);
                if (response.status === 200) {
                    setDefaultValues(response.data);
                } else {
                    console.error('Failed to get detail clinic:', response.message);
                }
            } catch (error) {
                console.error('Error get detail clinic:', error);
            }
        };
        getDetailClinicAPI(id);
    }, [id]);

    const updateClinicAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/clinic/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                toast.success('Clinic updated successfully!');
                navigate('/admin/clinic');
            } else {
                console.error('Failed to update clinic:', response.message);
            }
        } catch (error) {
            console.error('Error update clinic:', error);
        }
    };

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Cập nhật bệnh viện</Title>
                <FormClinic defaultValues={defaultValues} onSubmit={updateClinicAPI} />
            </div>
        </>
    );
}

export default UpdateClinic;
