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
import { Star } from 'lucide-react';

const CommentManagement = () => {
    const [rating, setRating] = useState(5);
    const [showConfirm, setShowConfirm] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 5, totalPages: 1 });
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

    return (
        <>
            {/* Nội dung chính */}
            <div className="p-8">
                {/* Tiêu đề */}
                <h2 className="text-center text-2xl font-bold mb-4">QUẢN LÝ BÌNH LUẬN</h2>

                <div className="flex items-center justify-between mb-4">
                    {/* Thanh tìm kiếm */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên bác sĩ"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="border border-gray-400 rounded px-3 py-2 w-96"
                        />
                        <button
                            className="bg-gray-200 border border-gray-400 px-4 py-2 rounded"
                            onClick={() => filterComment()}
                        >
                            🔍
                        </button>
                    </div>
                </div>

                {/* Bảng */}
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">STT</th>
                            <th className="border border-gray-300 px-4 py-2">Người dùng</th>
                            <th className="border border-gray-300 px-4 py-2 min-w-48">Nội dung bình luận</th>
                            <th className="border border-gray-300 px-4 py-2">Số sao</th>
                            <th className="border border-gray-300 px-4 py-2">Bác sĩ</th>
                            <th className="border border-gray-300 px-4 py-2">Thời gian</th>
                            <th className="border border-gray-300 px-4 py-2 min-w-24">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {index + 1 + pagination.limit * (pagination.page - 1)}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {item.patientId.fullname}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.comment}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <div className="flex items-center gap-2 mb-2 justify-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none"
                                                disabled
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${
                                                        star <= item.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </td>

                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {item.doctorId.fullname}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {new Date(item.date).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center space-x-8">
                                    <button
                                        className="text-red-500 text-2xl hover:text-red-700"
                                        onClick={() => handleDeleteClick(item.feedBackId)}
                                    >
                                        <RiDeleteBin6Line />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Điều hướng phân trang */}
                <div className="flex justify-end items-center space-x-4 mt-4">
                    <select
                        className="border border-gray-400"
                        name="number"
                        value={pagination.limit}
                        onChange={handleLimitChange}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </div>
                <div className="flex justify-end items-center space-x-4 mt-4">
                    <button
                        className={`${pagination.page === 1 ? 'font-normal text-gray-500' : 'font-bold text-blue-500'}`}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        className={`${
                            pagination.page === pagination.totalPages
                                ? 'font-normal text-gray-500'
                                : 'font-bold text-blue-500'
                        }`}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                    >
                        Next
                    </button>
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
