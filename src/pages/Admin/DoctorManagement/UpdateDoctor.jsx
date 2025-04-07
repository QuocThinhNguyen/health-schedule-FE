import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Title from '../components/Tittle';
import FormDoctor from './FormDoctor';
import { toast } from 'react-toastify';
import { axiosInstance } from '~/api/apiRequest';

function UpdateDoctor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState();

    useEffect(() => {
        const getDetailDoctorAPI = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${id}`);
                if (response.status === 200) {
                    setDefaultValues(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch doctor info: ', error.message);
            }
        };
        getDetailDoctorAPI(id);
    }, [id]);

    const updateDoctorAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/doctor/${id}`, formData);

            if (response.status === 200) {
                toast.success('Cập nhật thông tin bác sĩ thành công!');
                navigate('/admin/doctor');
            } else {
                console.error('Failed to update doctor:', response.message);
            }
        } catch (error) {
            console.error('Error update doctor:', error);
        }
    };

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Cập nhật bệnh viện</Title>
                <FormDoctor defaultValues={defaultValues} onSubmit={updateDoctorAPI} />
            </div>
        </>
    );
}

export default UpdateDoctor;
