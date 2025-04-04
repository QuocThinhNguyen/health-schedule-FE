import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef, useContext } from 'react';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { format } from 'date-fns';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { UserContext } from '~/context/UserContext';
import CustomTinyMCE from '~/components/CustomTinyMCE';
import { Edit2, Trash2, Search, XCircle } from 'lucide-react';
import defaultImage from '../../../assets/img/addImage.png';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import Title from '../components/Tittle';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';

function NewsManagement() {
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState({
        userId: 0,
        title: '',
        content: '',
        image: '',
    });
    const [updatePost, setUpdatePost] = useState({
        postId: 0,
        userId: 0,
        title: '',
        content: '',
        image: '',
    });
    const [deletePost, setDeletePost] = useState({ postId: 0 });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedFile, setSelectedFile] = useState({});
    const [previewImage, setPreviewImage] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [filterValue, setFilterValue] = useState('');

    const [pagination, setPagination] = useState({ page: 1, limit: 7, totalPages: 1 });

    const { user } = useContext(UserContext);

    const handleDeleteClick = (postId) => {
        setShowConfirm(true);
        setDeletePost({ postId: postId });
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeletePost({ postId: '' });
    };

    const handleConfirmDelete = () => {
        deletePostAPI(deletePost.postId);
        setShowConfirm(false);
        toast.success('Xóa bài viết thành công!');
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setValidationErrors({});
        setIsModalOpen(false);
        setPost({
            title: '',
            image: '',
            content: '',
        });
    };

    const handleOpenUpdateModal = () => {
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setValidationErrors({});
        setIsUpdateModalOpen(false);
        setPreviewImage({ image: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdatePost({ ...updatePost, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (value.trim() === '') {
            // Nếu trường nhập trống, hiển thị lỗi
            setValidationErrors((prev) => ({
                ...prev,
                [name]: 'Trường này không được để trống',
            }));
        } else {
            // Nếu trường nhập hợp lệ, xóa lỗi
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const imageInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setPost({ ...post, image: objectURL }); // Lưu blob URL
            // Xóa lỗi nếu có hình ảnh
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                image: '', // Xóa thông báo lỗi khi có hình ảnh hợp lệ
            }));
        }

        setSelectedFile(file);
    };

    const handleUpdateImageUpload = (e) => {
        //url tạm thời
        const file = e.target.files[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setPreviewImage({ image: objectURL }); // Lưu blob URL
        }
        setSelectedFile(file);
    };

    // Chuyển trang
    const handlePageChange = async (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
        }
    };

    //Đổi số lượng (limit)
    const handleLimitChange = async (e) => {
        const newLimit = parseInt(e.target.value, 10);
        setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    };

    useEffect(() => {
        getAllPostsAndFilter();
    }, [pagination, filterValue]);

    const getAllPostsAndFilter = async () => {
        try {
            const response = await axiosClient.get(
                `/post?query=${filterValue}&page=${pagination.page}&limit=${pagination.limit}`,
            );
            if (response.status === 200) {
                console.log('Posts:', response);

                setPosts(response.data);
                if (response.totalPages === 0) {
                    response.totalPages = 1;
                }
                if (pagination.totalPages !== response.totalPages) {
                    setPagination((prev) => ({
                        ...prev,
                        page: 1,
                        totalPages: response.totalPages,
                    }));
                }
            } else {
                console.error('No posts are found:', response.message);
                setPosts([]);
            }
        } catch (error) {
            console.error('Failed to get posts:', error);
            setPosts([]);
        }
    };

    const createPostAPI = async (formData) => {
        try {
            const response = await axiosInstance.post('/post', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                await getAllPostsAndFilter();
            } else {
                console.error('Failed to create post:', response.message);
                toast.error('Thêm bài viết thất bại 1!');
            }
        } catch (error) {
            console.error('Failed to create post:', error);
            toast.error('Thêm bài viết thất bại 2!');
        }
    };

    const getDetailPostAPI = async (postId) => {
        setIsUpdateModalOpen(true);
        setUpdatePost({ ...updatePost, postId: postId });
        try {
            const response = await axiosInstance.get(`/post/${postId}`);
            if (response.status === 200) {
                setUpdatePost(response.data);
            } else {
                console.error('No post found:', response.message);
            }
        } catch (error) {
            console.error('Failed to get post:', error);
        }
    };

    const updatePostAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/post/${updatePost.postId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                // Xử lý khi thành công
                await getAllPostsAndFilter();
            } else {
                console.error('Failed to update clinic:', response.message);
            }
        } catch (error) {
            console.error('Error update clinic:', error);
        }
    };

    const deletePostAPI = async (postId) => {
        try {
            const response = await axiosInstance.delete(`/post/${postId}`);
            if (response.status === 200) {
                // Xử lý khi thành công
                await getAllPostsAndFilter();
            } else {
                console.error('Failed to delete clinic:', response.message);
            }
        } catch (error) {
            console.error('Error delete clinic:', error);
        }
    };

    const handleAddPost = () => {
        const errors = {};
        if (!post.title) errors.title = 'Tiêu đề không được để trống.';
        if (!post.content) errors.content = 'Nội dung không được để trống.';
        if (!post.image) errors.image = 'Hình ảnh không được để trống';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); // Cập nhật lỗi
            return; // Ngăn không thêm nếu có lỗi
        }
        const formData = new FormData();
        // Thêm các trường từ Post vào FormData
        post.userId = parseInt(user.userId);
        Object.keys(post).forEach((key) => {
            formData.append(key, post[key]);
        });

        // Thêm file (nếu có)
        if (selectedFile && selectedFile.name) {
            formData.append('image', selectedFile);
        }
        createPostAPI(formData);
        toast.success('Thêm bài viết thành công!');
        setValidationErrors(errors);
        setSelectedFile(null);
        handleCloseModal();
    };

    const handleUpdatePost = () => {
        const errors = {};
        if (!updatePost.title) errors.title = 'Tiêu đề không được để trống.';
        if (!updatePost.content) errors.content = 'Nội dung không được để trống.';
        if (!updatePost.image) errors.image = 'Hình ảnh không được để trống';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); // Cập nhật lỗi
            return; // Ngăn không thêm nếu có lỗi
        }
        const formData = new FormData();
        // Thêm các trường từ Post vào FormData
        updatePost.userId = parseInt(user.userId);
        Object.keys(updatePost).forEach((key) => {
            formData.append(key, updatePost[key]);
        });

        // Thêm file (nếu có)
        if (selectedFile && selectedFile.name) {
            formData.append('image', selectedFile);
        }
        updatePostAPI(formData);
        toast.success('Cập nhật bài viết thành công!');
        setValidationErrors(errors);
        setSelectedFile(null);
        handleCloseUpdateModal();
    };

    const processedPosts = posts.map((post) => ({
        ...post,
        createAt: format(new Date(post.createAt), 'dd-MM-yyyy'),
        updateAt: format(new Date(post.updateAt), 'dd-MM-yyyy'),
    }));
    console.log('Posts:-------------', processedPosts);
    

    const columns = [
        { key: 'title', label: 'Tiêu đề' },
        { key: 'userId.fullname', label: 'Tác giả' },
        { key: 'createAt', label: 'Ngày đăng' },
        { key: 'updateAt', label: 'Ngày cập nhật' },
    ];

    const actions = [
        { icon: <CiEdit />, onClick: (post) => getDetailPostAPI(post.postId) },
        { icon: <MdDeleteOutline />, onClick: (post) => handleDeleteClick(post.postId) },
    ];

    return (
        <div className="px-3 mb-6">
            <Title>Quản lý tin tức</Title>
            <div className="p-4 rounded bg-[var(--bg-primary)] border border-[var(--border-primary)]">
                <div className="flex items-center justify-between mb-3">
                    <div className="relative flex-1 max-w-md">
                        <IoIosSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-lg" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 h-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-primary)] border-[var(--border-primary)]"
                        />
                    </div>
                    <button
                        className="flex justify-center items-center gap-2 px-4 py-2 h-10 bg-[rgba(var(--bg-active-rgb),0.15)] text-[rgb(var(--bg-active-rgb))] hover:bg-[var(--bg-active)] hover:text-[var(--text-active)] rounded-md  border border-[var(--border-primary)]"
                        onClick={handleOpenModal}
                    >
                        <span>Thêm</span>
                        <span>
                            <IoIosAdd className="text-lg" />
                        </span>
                    </button>
                </div>
                <Table columns={columns} data={processedPosts} pagination={pagination} actions={actions} />
                <AdvancePagination
                    pagination={pagination}
                    totalElements="10"
                    onPageChange={handlePageChange}
                    selects={[10, 15, 20]}
                    onSlectChange={handleLimitChange}
                />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
                    <div className="bg-white w-1/2 p-6 rounded shadow-lg relative max-h-[600px] overflow-y-scroll">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-3 right-3 text-4xl text-gray-500 hover:text-gray-800"
                        >
                            <IoCloseOutline />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Thêm tin tức</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label>
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={post.title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.name ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    />
                                    {validationErrors.title && (
                                        <p className="text-red-500 text-sm">{validationErrors.title}</p>
                                    )}
                                </div>
                            </div>

                            {/* Cột bên phải: Hình ảnh và nút "Thay đổi" */}
                            <div className="flex flex-col items-center space-x-12">
                                <label>Hình ảnh</label>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-40 h-40 border rounded overflow-hidden cursor-pointer flex items-center justify-center"
                                        onClick={() => imageInputRef.current.click()}
                                    >
                                        <img
                                            src={post.image || defaultImage}
                                            alt="No image"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <input //  Nút để tải lên hình ảnh mới
                                        type="file"
                                        name="image"
                                        onChange={handleImageUpload}
                                        className="hidden" // Ẩn trường input, sẽ dùng nút ẩn để mở
                                        ref={imageInputRef} // Sử dụng ref để trigger khi cần
                                    />
                                </div>
                                {validationErrors.image && (
                                    <p className="text-red-500 text-sm">{validationErrors.image}</p>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label>
                                    Nội dung <span className="text-red-500">*</span>
                                </label>

                                <CustomTinyMCE
                                    name="content" // Đặt tên cho trường
                                    value={post.content} // Giá trị hiện tại từ state
                                    onChange={handleChange} // Hàm xử lý khi nội dung thay đổi
                                    onBlur={handleBlur} // Hàm xử lý khi mất focus (nếu cần)
                                />
                                {/* 
                                <textarea
                                    name="content"
                                    value={post.content}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    rows="8"
                                    className={`border w-full px-2 py-1 rounded ${
                                        validationErrors.description ? 'border-red-500' : 'border-gray-400'
                                    }`}
                                ></textarea> */}
                                {validationErrors.content && (
                                    <p className="text-red-500 text-sm">{validationErrors.content}</p>
                                )}
                            </div>
                            {/* onClick={handleAddpost} */}
                            <div className="col-span-2 flex justify-end">
                                <button onClick={handleAddPost} className="bg-blue-500 text-white px-4 py-2 rounded">
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isUpdateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
                    <div className="bg-white w-1/2 p-6 rounded shadow-lg relative max-h-[600px] overflow-y-scroll">
                        <button
                            onClick={handleCloseUpdateModal}
                            className="absolute top-3 right-3 text-4xl text-gray-500 hover:text-gray-800"
                        >
                            <IoCloseOutline />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Cập nhật tin tức</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label>
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={updatePost.title}
                                        onChange={handleUpdateChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.name ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    />
                                    {validationErrors.title && (
                                        <p className="text-red-500 text-sm">{validationErrors.title}</p>
                                    )}
                                </div>
                            </div>

                            {/* Cột bên phải: Hình ảnh và nút "Thay đổi" */}
                            <div className="flex flex-col items-center space-x-12">
                                <label>Hình ảnh</label>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-40 h-40 border rounded overflow-hidden cursor-pointer flex items-center justify-center"
                                        onClick={() => imageInputRef.current.click()}
                                    >
                                        <img
                                            src={
                                                previewImage.image
                                                    ? previewImage.image
                                                    : `http://localhost:9000/uploads/${updatePost.image}`
                                            }
                                            alt="No Image"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <input //  Nút để tải lên hình ảnh mới
                                        type="file"
                                        name="image"
                                        onChange={handleUpdateImageUpload}
                                        className="hidden" // Ẩn trường input, sẽ dùng nút ẩn để mở
                                        ref={imageInputRef} // Sử dụng ref để trigger khi cần
                                    />
                                </div>
                                {validationErrors.image && (
                                    <p className="text-red-500 text-sm">{validationErrors.image}</p>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label>
                                    Nội dung <span className="text-red-500">*</span>
                                </label>

                                <CustomTinyMCE
                                    name="content" // Đặt tên cho trường
                                    value={updatePost.content} // Giá trị hiện tại từ state
                                    onChange={handleUpdateChange} // Hàm xử lý khi nội dung thay đổi
                                    onBlur={handleBlur} // Hàm xử lý khi mất focus (nếu cần)
                                />
                                {/* 
                                <textarea
                                    name="content"
                                    value={post.content}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    rows="8"
                                    className={`border w-full px-2 py-1 rounded ${
                                        validationErrors.description ? 'border-red-500' : 'border-gray-400'
                                    }`}
                                ></textarea> */}
                                {validationErrors.content && (
                                    <p className="text-red-500 text-sm">{validationErrors.content}</p>
                                )}
                            </div>
                            {/* onClick={handleAddpost} */}
                            <div className="col-span-2 flex justify-end">
                                <button onClick={handleUpdatePost} className="bg-blue-500 text-white px-4 py-2 rounded">
                                    Cậpt nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Hộp thoại xác nhận */}
            {showConfirm && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Xác nhận xóa tin tức</h3>
                        <p>Bạn có chắc chắn muốn xóa tin tức này?</p>
                        <div className="mt-4 flex justify-end gap-4">
                            <button onClick={handleCancelDelete} className="px-4 py-2 bg-gray-500 text-white rounded">
                                Hủy
                            </button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewsManagement;
