import { format } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';
import { MdDeleteOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import AdvancePagination from '~/components/AdvancePagination';
import Table from '~/components/Table';
import Title from '~/components/Tittle';
import { ClinicContext } from '~/context/ClinicContext';

function ServiceManagement() {
    const navigate = useNavigate();
    const { clinicId } = useContext(ClinicContext);
    const [services, setServices] = useState([]);
    const [deleteService, setDeleteService] = useState({ serviceId: 0 });
    const [showConfirm, setShowConfirm] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    const handleDeleteClick = (serviceId) => {
        setShowConfirm(true);
        setDeleteService({ serviceId: serviceId });
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteService({ serviceId: '' });
    };

    const handleConfirmDelete = () => {
        deleteServiceAPI(deleteService.serviceId);
        setShowConfirm(false);
        toast.success('Xóa dịch vụ thành công!');
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
        if (clinicId) {
            getAllServicesAndFilter();
        }
    }, [pagination, filterValue, clinicId]);

    const getAllServicesAndFilter = async () => {
        try {
            if (!clinicId) return;
            const response = await axiosClient.get(
                `/service?keyword=${filterValue}&clinicId=${clinicId}&pageNo=${pagination.page}&pageSize=${pagination.limit}`,
            );

            if (response.status === 200) {
                setServices(response.data);
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
                console.error('No Services are found:', response.message);
                setServices([]);
            }
        } catch (error) {
            console.error('Failed to get Services:', error);
            setServices([]);
        }
    };

    const deleteServiceAPI = async (serviceId) => {
        try {
            const response = await axiosInstance.delete(`/service/${serviceId}`);
            if (response.status === 200) {
                // Xử lý khi thành công
                await getAllServicesAndFilter();
            } else {
                console.error('Failed to delete Service:', response.message);
            }
        } catch (error) {
            console.error('Error delete Service:', error);
        }
    };

    const columns = [
        { key: 'name', label: 'Tiêu đề', wrap: true },
        {
            key: 'image',
            label: 'Hình ảnh',
            type: 'image',
        },
        { key: 'price', label: 'Giá' },
        { key: 'serviceCategoryName', label: 'Loại dịch vụ' },
    ];

    const actions = [
        { icon: <CiEdit />, onClick: (service) => navigate(`/clinic/service/update-service/${service.serviceId}`) },
        { icon: <MdDeleteOutline />, onClick: (service) => handleDeleteClick(service.serviceId) },
    ];

    return (
        <div className="px-3 mb-6">
            <Title>Quản lý dịch vụ</Title>
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
                            navigate('/clinic/service/create-service');
                        }}
                    >
                        <span>Thêm</span>
                        <span>
                            <IoIosAdd className="text-lg" />
                        </span>
                    </button>
                </div>
                <Table columns={columns} data={services} pagination={pagination} actions={actions} />
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
                        <h3 className="text-lg font-semibold mb-4">Xác nhận xóa dịch vụ</h3>
                        <p>Bạn có chắc chắn muốn xóa dịch vụ này?</p>
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

export default ServiceManagement;
