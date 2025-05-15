import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { MdDeleteOutline } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import Title from '../../../components/Tittle';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';

function PostManagement() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [deletePost, setDeletePost] = useState({ postId: 0 });
    const [showConfirm, setShowConfirm] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

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

    const handlePageChange = async (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
        }
    };

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

    const processedPosts = posts.map((post) => ({
        ...post,
        createAt: format(new Date(post.createAt), 'dd-MM-yyyy'),
        updateAt: format(new Date(post.updateAt), 'dd-MM-yyyy'),
    }));

    const columns = [
        { key: 'title', label: 'Tiêu đề', wrap: true },
        { key: 'userId.fullname', label: 'Tác giả' },
        { key: 'createAt', label: 'Ngày đăng' },
        { key: 'updateAt', label: 'Ngày cập nhật' },
    ];

    const actions = [
        { icon: <CiEdit />, onClick: (post) => navigate(`/admin/post/update-post/${post.postId}`) },
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
                        onClick={() => {
                            navigate('/admin/post/create-post');
                        }}
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

export default PostManagement;
