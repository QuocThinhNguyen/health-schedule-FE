import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '~/api/apiRequest';
import FormSpecialty from './FormSpecialty';
import Title from '../../../components/Tittle';

function UpdateSpecialty() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState();

    useEffect(() => {
        const getDetailSpecialtyAPI = async (id) => {
            try {
                const response = await axiosInstance.get(`/specialty/${id}`);
                if (response.status === 200) {
                    setDefaultValues(response.data);
                } else {
                    console.error('Failed to get detail specialty:', response.message);
                }
            } catch (error) {
                console.error('Error get detail specialty:', error);
            }
        };
        getDetailSpecialtyAPI(id);
    }, [id]);

    const updateSpecialtyAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/specialty/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                toast.success('Clinic updated successfully!');
                navigate('/admin/specialty');
            } else {
                console.error('Failed to update specialty:', response.message);
            }
        } catch (error) {
            console.error('Error update specialty:', error);
        }
    };

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Cập nhật bệnh viện</Title>
                <FormSpecialty defaultValues={defaultValues} onSubmit={updateSpecialtyAPI} />
            </div>
        </>
    );
}

export default UpdateSpecialty;
