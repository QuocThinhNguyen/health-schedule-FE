import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { axiosInstance } from '~/api/apiRequest';
import Title from '../components/Tittle';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';

const UserManagement = () => {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await filterUserAPI();
        };
        fetchData();
    }, [pagination, filterValue]);

    const [deleteUser, setDeleteUser] = useState({
        userId: '',
    });

    const deleteUserAPI = async (userId) => {
        try {
            const response = await axiosInstance.delete(`/user/${userId}`);
            if (response.status === 200) {
                await filterUserAPI();
            } else {
                console.error('Failed to delete user:', response.message);
            }
        } catch (error) {
            console.error('Error delete user:', error);
        }
    };

    const filterUserAPI = async () => {
        try {
            const response = await axiosInstance.get(
                `/user/?query=${filterValue}&page=${pagination.page}&limit=${pagination.limit}`,
            );
            if (response.status === 200) {
                console.log('Fetched response:', response);
                console.log('Fetched users:', response.data);
                setUsers(response.data);
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
                console.error('No users are found:', response.message);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
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

    const handleDeleteClick = (userId) => {
        setShowConfirm(true);
        setDeleteUser({ userId: userId });
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteUser({ userId: '' });
    };

    const handleConfirmDelete = () => {
        deleteUserAPI(deleteUser.userId);
        setShowConfirm(false);
    };

    const columns = [
        { key: 'fullname', label: 'Họ và tên' },
        {
            key: 'image',
            label: 'Hình ảnh',
            type: 'image',
        },
        { key: 'email', label: 'Email' },
        { key: 'address', label: 'Địa chỉ' },
        { key: 'phoneNumber', label: 'Số điện thoại' },
    ];

    const actions = [
        { icon: <CiEdit />, onClick: (user) => navigate(`/admin/user/update-user/${user.userId}`) },
        { icon: <MdDeleteOutline />, onClick: (user) => handleDeleteClick(user.userId) },
    ];

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Quản lý tài khoản người dùng</Title>
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
                                navigate('/admin/user/create-user');
                            }}
                        >
                            <span>Thêm</span>
                            <span>
                                <IoIosAdd className="text-lg" />
                            </span>
                        </button>
                    </div>
                    <Table columns={columns} data={users} pagination={pagination} actions={actions} />
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
                            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa tài khoản</h3>
                            <p>Bạn có chắc chắn muốn xóa tài khoản này?</p>
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

export default UserManagement;
