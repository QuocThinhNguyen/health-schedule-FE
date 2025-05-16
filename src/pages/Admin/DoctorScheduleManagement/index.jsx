import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';
import { MdDeleteOutline } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { axiosInstance } from '~/api/apiRequest';
import Title from '../../../components/Tittle';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';

function DoctorScheduleManagement() {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [worktimes, setWorkTimes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await filterWorkTimeAPI();
        };
        fetchData();
    }, [pagination, filterValue, filterDate]);

    const [deleteWorkTime, setDeleteWorkTime] = useState({
        doctorId: '',
        scheduleDate: '',
    });

    const deleteWorkTimeAPI = async () => {
        try {
            const response = await axiosInstance.delete(
                `/schedule/${deleteWorkTime.doctorId}?date=${deleteWorkTime.scheduleDate}`,
            );
            if (response.status === 200) {
                await filterWorkTimeAPI();
            } else {
                console.error('Failed to delete user:', response.message);
            }
        } catch (error) {
            console.error('Error delete user:', error);
        }
    };

    const filterWorkTimeAPI = async () => {
        try {
            const response = await axiosInstance.get(
                `/schedule/?query=${filterValue}&date=${filterDate}&page=${pagination.page}&limit=${pagination.limit}`,
            );
            if (response.status === 200) {
                setWorkTimes(response.data);
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
                setWorkTimes([]);
            }
        } catch (error) {
            console.error('Error fetching worktimes:', error);
            setWorkTimes([]);
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

    const handleDeleteClick = (doctorId, scheduleDate) => {
        setShowConfirm(true);
        setDeleteWorkTime({
            doctorId: doctorId,
            scheduleDate: scheduleDate,
        });
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteWorkTime({
            doctorId: '',
            scheduleDate: '',
        });
    };

    const handleConfirmDelete = () => {
        deleteWorkTimeAPI();
        setDeleteWorkTime({
            doctorId: '',
            scheduleDate: '',
        });
        setShowConfirm(false);
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

    const processedWorktimes = worktimes.map((worktime) => ({
        ...worktime,
        timeTypes: worktime.timeTypes.map((time) => timeTypeMapping[time]),
    }));

    const columns = [
        { key: 'doctorId.fullname', label: 'Bác sĩ' },
        { key: 'scheduleDate', label: 'Ngày làm việc' },
        { key: 'timeTypes', label: 'Ca khám', type: 'timeTypes' },
    ];

    const actions = [
        {
            icon: <CiEdit />,
            onClick: (worktime) =>
                navigate(
                    `/admin/doctor-schedule/update-doctor-schedule/${worktime.doctorId?.userId}/${worktime.scheduleDate}`,
                ),
        },
        {
            icon: <MdDeleteOutline />,
            onClick: (worktime) => handleDeleteClick(worktime.doctorId?.userId, worktime.scheduleDate),
        },
    ];

    return (
        <>
            <div className="px-3 mb-6">
                <Title>Quản lý ca làm việc</Title>
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
                        <button
                            className="flex justify-center items-center gap-2 px-4 py-2 h-10 bg-[rgba(var(--bg-active-rgb),0.15)] text-[rgb(var(--bg-active-rgb))] hover:bg-[var(--bg-active)] hover:text-[var(--text-active)] rounded-md  border border-[var(--border-primary)]"
                            onClick={() => {
                                navigate('/admin/doctor-schedule/create-doctor-schedule');
                            }}
                        >
                            <span>Thêm</span>
                            <span>
                                <IoIosAdd className="text-lg" />
                            </span>
                        </button>
                    </div>
                    <Table columns={columns} data={processedWorktimes} pagination={pagination} actions={actions} />
                    <AdvancePagination
                        pagination={pagination}
                        totalElements="10"
                        onPageChange={handlePageChange}
                        selects={[10, 15, 20]}
                        onSlectChange={handleLimitChange}
                    />

                    {showConfirm && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">Xác nhận xóa ca làm việc</h3>
                                <p>Bạn có chắc chắn muốn xóa ca làm việc này?</p>
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
            </div>
        </>
    );
}

export default DoctorScheduleManagement;
