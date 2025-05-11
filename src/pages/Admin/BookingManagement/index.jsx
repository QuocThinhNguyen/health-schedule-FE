import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '~/api/apiRequest';
import { IoIosSearch } from 'react-icons/io';
import Title from '../components/Tittle';
import { CiEdit } from 'react-icons/ci';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';

const BookingManagement = () => {
    const navigate = useNavigate();
    const [selectedStatus, setSelectedStatus] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await filterScheduleAPI();
        };
        fetchData();
    }, [pagination, filterValue, filterDate, selectedStatus]);

    const filterScheduleAPI = async () => {
        try {
            const response = await axiosInstance.get(
                `/booking/?query=${filterValue}&date=${filterDate}&status=${selectedStatus}&page=${pagination.page}&limit=${pagination.limit}`,
            );
            console.log(
                `/booking/?query=${filterValue}&date=${filterDate}&status=${selectedStatus}&page=${pagination.page}&limit=${pagination.limit}`,
            );
            if (response.status === 200) {
                setSchedules(response.data);
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
                console.error('No worktimes are found:', response.message);
                setSchedules([]);
            }
        } catch (error) {
            console.error('Error fetching worktimes:', error);
            setSchedules([]);
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

    const timeTypeMapping = {
        T1: '8:00 - 9:00',
        T2: '9:00 - 10:00',
        T3: '10:00 - 11:00',
        T4: '11:00 - 12:00',
        T5: '13:00 - 14:00',
        T6: '14:00 - 15:00',
        T7: '15:00 - 16:00',
        T8: '16:00 - 17:00',
    };

    const statusMapping = {
        S1: 'Chưa xác nhận',
        S2: 'Đã xác nhận',
        S3: 'Đã thanh toán',
        S4: 'Đã khám xong',
        S5: 'Đã hủy',
    };

    const processedsSchedules = schedules.map((schedule) => ({
        ...schedule,
        timeType: timeTypeMapping[schedule.timeType] || schedule.timeType,
        status: statusMapping[schedule.status] || schedule.status,
    }));

    const columns = [
        { key: 'bookingId', label: 'Mã lịch hẹn' },
        { key: 'appointmentDate', label: 'Ngày khám' },
        { key: 'timeType', label: 'Ca khám' },
        { key: 'price', label: 'Giá khám' },
        { key: 'doctorId.fullname', label: 'Bác sĩ' },
        { key: 'patientRecordId.fullname', label: 'Tên bệnh nhân' },
        { key: 'patientRecordId.phoneNumber', label: 'Số điện thoại' },
        { key: 'patientRecordId.address', label: 'Địa chỉ', wrap: true },
        { key: 'status', label: 'Trạng thái' },
    ];

    const actions = [
        { icon: <CiEdit />, onClick: (booking) => navigate(`/admin/booking/update-booking/${booking.bookingId}`) },
    ];

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Quản lý lịch hẹn</Title>
                <div className="p-4 rounded bg-[var(--bg-primary)] border border-[var(--border-primary)]">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="relative min-w-[448px]">
                                <IoIosSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-lg" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 h-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-primary)] border-[var(--border-primary)]"
                                />
                            </div>
                            <div className="max-w-md">
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 h-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-primary)] border-[var(--border-primary)]"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-3">
                        {[
                            { label: 'Tất cả', value: '' },
                            { label: 'Chưa xác nhận', value: 'S1' },
                            { label: 'Đã xác nhận', value: 'S2' },
                            { label: 'Đã thanh toán', value: 'S3' },
                            { label: 'Đã khám xong', value: 'S4' },
                            { label: 'Đã hủy', value: 'S5' },
                        ]
                            .filter((statusOption) => statusOption.label.trim() !== '')
                            .map((statusOption) => (
                                <button
                                    key={statusOption.value}
                                    onClick={() => setSelectedStatus(statusOption.value)}
                                    className={`flex justify-center items-center gap-2 px-4 py-2 h-9  rounded  border border-[var(--border-primary)] ${
                                        selectedStatus === statusOption.value
                                            ? 'bg-[var(--bg-active)] text-[var(--text-active)]'
                                            : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--bg-active)]'
                                    }`}
                                >
                                    {statusOption.label}
                                </button>
                            ))}
                    </div>
                    <Table columns={columns} data={processedsSchedules} pagination={pagination} actions={actions} />
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

export default BookingManagement;
