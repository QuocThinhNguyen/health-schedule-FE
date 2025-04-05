import React, { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faGauge, faClock, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';
import { UserContext } from '~/context/UserContext';
import { axiosInstance } from '~/api/apiRequest';
import Logo from '~/components/Logo';
import { toast } from 'react-toastify';
import { MdDeleteOutline } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { Edit2, Eye, Trash2, Search, Star } from 'lucide-react';
import { CiEdit } from 'react-icons/ci';
import Title from '../components/Tittle';
import { IoIosSearch } from 'react-icons/io';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';
import { format } from 'date-fns';

const CommentManagement = () => {
    const [rating, setRating] = useState(5);
    const [showConfirm, setShowConfirm] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await filterComment();
        };
        fetchData();
    }, [pagination, filterValue, filterDate]);

    const [deleteComment, setDeleteComment] = useState({
        doctorId: '',
        scheduleDate: '',
    });

    const deleteCommentAPI = async () => {
        try {
            const response = await axiosInstance.delete(`/feedback/${deleteComment.feedBackId}`);
            if (response.status === 200) {
                // Xử lý khi thành công
                toast.success('Xóa bình luận thành công');
                await filterComment();
            } else {
                toast.error('Xóa bình luận thất bại');
            }
        } catch (error) {
            console.error('Error delete user:', error);
        }
    };

    const filterComment = async () => {
        try {
            const response = await axiosInstance.get(
                `/feedback/filter?query=${filterValue}&page=${pagination.page}&limit=${pagination.limit}`,
            );
            if (response.status === 200) {
                console.log('Response:', response);
                setComments(response.data);
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
                console.error('No comments are found:', response.message);
                setComments([]);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
        }
    };

    console.log('Comments:', comments);

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

    const handleDeleteClick = (feedBackId) => {
        setShowConfirm(true);
        setDeleteComment({
            feedBackId: feedBackId,
        });
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteComment({
            doctorId: '',
            scheduleDate: '',
        });
    };

    const handleConfirmDelete = () => {
        deleteCommentAPI(); // Gọi hàm xóa bệnh viện từ props hoặc API
        setDeleteComment({
            feedBackId: '',
        });
        setShowConfirm(false); // Ẩn hộp thoại sau khi xóa
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const adminRef = useRef(null);

    useEffect(() => {
        if (isMenuOpen && adminRef.current) {
            const rect = adminRef.current.getBoundingClientRect();
            // Set dropdown position to be below the Admin button
            setDropdownPosition({
                top: rect.bottom, // Position dropdown below the button
                left: rect.left, // Align dropdown with the left edge of Admin button
            });
        }
    }, [isMenuOpen]);

    const processedComments = comments.map((comment) => ({
        ...comment,
        date: format(new Date(comment.date), 'dd-MM-yyyy'),
    }));
    console.log('Processed Comments:----------------', processedComments);

    const columns = [
        { key: 'patientId.fullname', label: 'Người dùng' },
        { key: 'rating', label: 'Đánh giá', type: 'rating' },
        { key: 'comment', label: 'Bình luận' },
        { key: 'doctorId.fullname', label: 'Bác sĩ' },
        { key: 'date', label: 'Ngày bình luận' },
    ];

    const actions = [{ icon: <MdDeleteOutline />, onClick: (comment) => handleDeleteClick(comment.feedBackId) }];

    return (
        <>
            {/* Nội dung chính */}
            <div className="px-3 mb-6">
                <Title>Quản lý bình luận</Title>
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
                    </div>
                    <Table columns={columns} data={processedComments} pagination={pagination} actions={actions} />
                    <AdvancePagination
                        pagination={pagination}
                        totalElements="10"
                        onPageChange={handlePageChange}
                        selects={[10, 15, 20]}
                        onSlectChange={handleLimitChange}
                    />
                </div>

                {/* Hộp thoại xác nhận */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa ca làm việc</h3>
                            <p>Bạn có chắc chắn muốn xóa bình luận này?</p>
                            <div className="mt-4 flex justify-end gap-4">
                                <button
                                    onClick={handleCancelDelete}
                                    className="px-4 py-2 bg-gray-500 text-white rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CommentManagement;
