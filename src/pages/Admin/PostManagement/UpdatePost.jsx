import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { axiosInstance } from '~/api/apiRequest';
import Title from '../components/Tittle';
import FormPost from './FormPost';

function UpdatePost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState();

    useEffect(() => {
        const getDetailPostAPI = async (id) => {
            try {
                const response = await axiosInstance.get(`/post/${id}`);
                if (response.status === 200) {
                    setDefaultValues(response.data);
                } else {
                    console.error('No post found:', response.message);
                }
            } catch (error) {
                console.error('Failed to get post:', error);
            }
        };
        getDetailPostAPI(id);
    }, [id]);

    const updatePostAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/post/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                toast.success('Cập nhật bệnh viện thành công!');
                navigate('/admin/post');
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
                <Title>Cập nhật bài viết</Title>
                <FormPost defaultValues={defaultValues} onSubmit={updatePostAPI} />
            </div>
        </>
    );
}

export default UpdatePost;
