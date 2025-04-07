import { toast } from 'react-toastify';
import { axiosInstance } from '~/api/apiRequest';
import Title from '../components/Tittle';
import FormPost from './FormPost';

function CreatePost() {
    const createPostAPI = async (formData) => {
        try {
            const response = await axiosInstance.post('/post', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                toast.success('Thêm bài viết thành công!');
            } else {
                console.error('Failed to create post:', response.message);
                toast.error('Thêm bài viết thất bại');
            }
        } catch (error) {
            console.error('Failed to create post:', error);
            toast.error('Thêm bài viết thất bại');
        }
    };

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Thêm bài viết</Title>
                <FormPost onSubmit={createPostAPI} />
            </div>
        </>
    );
}

export default CreatePost;
