import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import { IoIosSearch } from 'react-icons/io';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';
import Title from '../components/Tittle';

const DoctorManagement = () => {
    const navigate = useNavigate();
    const [filterValue, setFilterValue] = useState('');
    const [academicRanksAndDegreess, setAcademicRanksAndDegreess] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    useEffect(() => {
        const fetchData = async () => {
            await getDropdownAcademicRanksAndDegrees();
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await filterDoctorAPI();
        };
        fetchData();
    }, [pagination, filterValue]);

    const getDropdownAcademicRanksAndDegrees = async () => {
        try {
            const response = await axiosClient.get(`/doctor/academic-ranks-and-degrees`);
            if (response.status === 200) {
                setAcademicRanksAndDegreess(response.data);
            } else {
                console.error('No academic ranks and degrees are found:', response.message);
                setAcademicRanksAndDegreess([]);
            }
        } catch (error) {
            console.error('Error fetching academic ranks and degrees:', error);
            setAcademicRanksAndDegreess([]);
        }
    };

    const filterDoctorAPI = async () => {
        try {
            const response = await axiosInstance.get(
                `/doctor/?query=${filterValue}&page=${pagination.page}&limit=${pagination.limit}`,
            );
            if (response.status === 200) {
                setDoctors(response.data);
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
                setDoctors([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setDoctors([]);
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

    const processedDoctors = doctors.map((doctor) => ({
        ...doctor,
        positionName:
            academicRanksAndDegreess.find(
                (academicRanksAndDegrees) => academicRanksAndDegrees.keyMap === doctor.position,
            )?.valueVi || 'Chưa xác định',
    }));

    const columns = [
        { key: 'doctorId.fullname', label: 'Họ và tên' },
        {
            key: 'doctorId.image',
            label: 'Hình ảnh',
            type: 'image',
        },
        { key: 'positionName', label: 'Chức danh' },
        { key: 'clinicId.name', label: 'Bệnh viện' },
        { key: 'specialtyId.name', label: 'Chuyên khoa' },
        { key: 'doctorId.address', label: 'Địa chỉ' },
        { key: 'doctorId.phoneNumber', label: 'Số điện thoại' },
    ];

    const actions = [
        { icon: <CiEdit />, onClick: (doctor) => navigate(`/admin/doctor/update-doctor/${doctor.doctorId?.userId}`) },
    ];

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Quản lý bác sĩ</Title>
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
                    <Table columns={columns} data={processedDoctors} pagination={pagination} actions={actions} />
                    <AdvancePagination
                        pagination={pagination}
                        totalElements="10"
                        onPageChange={handlePageChange}
                        selects={[10, 15, 20]}
                        onSlectChange={handleLimitChange}
                    />
                </div>
            </div>
        </>
    );
};

export default DoctorManagement;
