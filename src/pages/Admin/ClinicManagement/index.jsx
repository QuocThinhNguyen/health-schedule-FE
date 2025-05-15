import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '~/api/apiRequest';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';
import AdvancePagination from '~/components/AdvancePagination';
import Table from '~/components/Table';
import Title from '../../../components/Tittle';

function ClinicManagement() {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [clinics, setClinics] = useState([]);
    const [deleteClinic, setDeleteClinic] = useState({
        clinicId: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            await filterClinicAPI();
        };
        fetchData();
    }, [pagination, filterValue]);

    const deleteClinicAPI = async (clinicId) => {
        try {
            const response = await axiosInstance.delete(`/clinic/${clinicId}`);
            if (response.status === 200) {
                await filterClinicAPI();
            } else {
                console.error('Failed to delete clinic:', response.message);
            }
        } catch (error) {
            console.error('Error delete clinic:', error);
        }
    };

    const filterClinicAPI = async () => {
        try {
            const response = await axiosInstance.get(
                `/clinic/?query=${filterValue}&page=${pagination.page}&limit=${pagination.limit}`,
            );
            if (response.status === 200) {
                setClinics(response.data);
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
                console.error('No clinics are found:', response.message);
                setClinics([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setClinics([]);
        }
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    const handleLimitChange = async (e) => {
        const newLimit = parseInt(e.target.value, 10);
        setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    };

    const handleDeleteClick = (clinicId) => {
        setShowConfirm(true);
        setDeleteClinic({ clinicId: clinicId });
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteClinic({ clinicId: '' });
    };

    const handleConfirmDelete = () => {
        deleteClinicAPI(deleteClinic.clinicId);
        setShowConfirm(false);
    };

    const columns = [
        { key: 'name', label: 'Tên bệnh viện' },
        {
            key: 'image',
            label: 'Hình ảnh',
            type: 'image',
            getImageUrl: (image) => `${image}`,
        },
        { key: 'email', label: 'Email' },
        { key: 'address', label: 'Địa chỉ', wrap: true },
        { key: 'phoneNumber', label: 'Số điện thoại' },
    ];

    const actions = [
        { icon: <CiEdit />, onClick: (clinic) => navigate(`/admin/clinic/update-clinic/${clinic.clinicId}`) },
        { icon: <MdDeleteOutline />, onClick: (clinic) => handleDeleteClick(clinic.clinicId) },
    ];

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Quản lý bệnh viện</Title>
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
                                navigate('/admin/clinic/create-clinic');
                            }}
                        >
                            <span>Thêm</span>
                            <span>
                                <IoIosAdd className="text-lg" />
                            </span>
                        </button>
                    </div>
                    <Table columns={columns} data={clinics} pagination={pagination} actions={actions} />
                    <AdvancePagination
                        pagination={pagination}
                        totalElements="10"
                        onPageChange={handlePageChange}
                        selects={[10, 15, 20]}
                        onSlectChange={handleLimitChange}
                    />
                </div>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Xác nhận xóa bệnh viện</h3>
                        <p>Bạn có chắc chắn muốn xóa bệnh viện này?</p>
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
        </>
    );
}

export default ClinicManagement;
