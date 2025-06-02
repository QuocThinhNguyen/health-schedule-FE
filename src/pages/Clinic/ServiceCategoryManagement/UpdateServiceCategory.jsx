import { axiosInstance } from "~/api/apiRequest";
import FormServiceCategory from "./FormServiceCategory";
import Title from "~/components/Tittle";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function UpdateServiceCategory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState();

    useEffect(() => {
        const getDetailServiceCategoriesAPI = async (id) => {
            try {
                console.log('id', id);

                const response = await axiosInstance.get(`/service-category/${id}`);
                if (response.status === 200) {
                    console.log('response getDetailServiceCateogoryAPI', response.data);
                    setDefaultValues(response.data);
                } else {
                    console.error('No getDetailServiceCateogoryAPI found:', response.message);
                }
            } catch (error) {
                console.error('Failed to get getDetailServiceCateogoryAPI:', error);
            }
        };
        getDetailServiceCategoriesAPI(id);
    }, [id]);

    const updateServiceCategoriesAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/service-category/${id}`, formData, {
            });

            if (response.status === 200) {
                toast.success('Cập nhật loại dịch vụ thành công!');
                navigate('/clinic/service-category');
            } else {
                console.error('Failed to update service category:', response.message);
            }
        } catch (error) {
            console.error('Error update service category:', error);
        }
    };
    return (
        <>
            <div className="px-3 mb-6">
                <Title>Cập nhật loại dịch vụ</Title>
                <FormServiceCategory defaultValues={defaultValues} onSubmit={updateServiceCategoriesAPI} />
            </div>
        </>
    );
}
export default UpdateServiceCategory;