import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';
import { axiosInstance } from '~/api/apiRequest';
import Title from '../../../components/Tittle';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';

const SpecialtyManagement = () => {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [specialties, setSpecialties] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    useEffect(() => {
        const fetchData = async () => {
            await filterSpecialtyAPI();
        };
        fetchData();
    }, [pagination, filterValue]);

    const [deleteSpecialty, setDeleteSpecialty] = useState({
        specialtyId: '',
    });

    const deleteSpecialtyAPI = async (specialtyId) => {
        try {
            const response = await axiosInstance.delete(`/specialty/${specialtyId}`);
            if (response.status === 200) {
                await filterSpecialtyAPI();
            } else {
                console.error('Failed to delete specialty:', response.message);
            }
        } catch (error) {
            console.error('Error delete specialty:', error);
        }
    };

    const filterSpecialtyAPI = async () => {
        try {
            const response = await axiosInstance.get(
                `/specialty/?query=${filterValue}&page=${pagination.page}&limit=${pagination.limit}`,
            );

            if (response.status === 200) {
                setSpecialties(response.data);
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
                console.error('No specialties are found:', response.message);
                setSpecialties([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setSpecialties([]);
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

    const handleDeleteClick = (specialtyId) => {
        setShowConfirm(true);
        setDeleteSpecialty({ specialtyId: specialtyId });
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteSpecialty({ specialtyId: '' });
    };

    const handleConfirmDelete = () => {
        deleteSpecialtyAPI(deleteSpecialty.specialtyId);
        setShowConfirm(false);
        toast.success('Xóa chuyên khoa thành công!');
    };

    const columns = [
        { key: 'name', label: 'Tên chuyên khoa' },
        {
            key: 'image',
            label: 'Hình ảnh',
            type: 'image',
        },
    ];

    const actions = [
        {
            icon: <CiEdit />,
            onClick: (specialty) => navigate(`/admin/specialty/update-specialty/${specialty.specialtyId}`),
        },
        { icon: <MdDeleteOutline />, onClick: (specialty) => handleDeleteClick(specialty.specialtyId) },
    ];

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Quản lý chuyên khoa</Title>
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
                                navigate('/admin/specialty/create-specialty');
                            }}
                        >
                            <span>Thêm</span>
                            <span>
                                <IoIosAdd className="text-lg" />
                            </span>
                        </button>
                    </div>
                    <Table columns={columns} data={specialties} pagination={pagination} actions={actions} />
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
                            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa chuyên khoa</h3>
                            <p>Bạn có chắc chắn muốn xóa chuyên khoa này?</p>
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

export default SpecialtyManagement;
