import React, { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faGauge, faClock, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '~/context/UserContext';
import { axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { Edit2, Eye, Trash2, Search, XCircle } from 'lucide-react';
import { IoIosSearch } from 'react-icons/io';
import Title from '../components/Tittle';
import { CiEdit } from 'react-icons/ci';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';

const ScheduleManagement = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedStatus, setSelectedStatus] = useState('');
    const { logout, user } = useContext(UserContext);
    const [filterValue, setFilterValue] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [schedules, setSchedules] = useState([]);
    const [avata, setAvata] = useState('');

    useEffect(() => {
        getAvataAccount(user.userId);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await filterScheduleAPI();
        };
        fetchData();
    }, [pagination, filterValue, filterDate, selectedStatus]);

    const [updateSchedule, setUpdateSchedule] = useState({
        bookingId: '',
        appointmentDate: '',
        timeType: '',
        doctorName: '',
        patientName: '',
        phoneNumber: '',
        address: '',
        status: '',
    });

    const timeSlots = [
        { label: '8:00 - 9:00', value: 'T1' },
        { label: '9:00 - 10:00', value: 'T2' },
        { label: '10:00 - 11:00', value: 'T3' },
        { label: '11:00 - 12:00', value: 'T4' },
        { label: '13:00 - 14:00', value: 'T5' },
        { label: '14:00 - 15:00', value: 'T6' },
        { label: '15:00 - 16:00', value: 'T7' },
        { label: '16:00 - 17:00', value: 'T8' },
    ];

    const getAvataAccount = async (userId) => {
        try {
            const response = await axiosInstance.get(`/user/${userId}`);

            if (response.status === 200) {
                // Xử lý khi thành công
                setAvata(response.data.image);
            } else {
                console.error('Failed to update schedule:', response.message);
            }
        } catch (error) {
            console.error('Error update schedule:', error);
        }
    };

    const updateScheduleAPI = async (data) => {
        try {
            const response = await axiosInstance.put(`/booking/${updateSchedule.bookingId}`, data);

            if (response.status === 200) {
                // Xử lý khi thành công
                await filterScheduleAPI();
            } else {
                console.error('Failed to update schedule:', response.message);
            }
        } catch (error) {
            console.error('Error update schedule:', error);
        }
    };
    const getDetailScheduleAPI = async (bookingId) => {
        setIsUpdateModalOpen(true);
        setUpdateSchedule({ ...updateSchedule, bookingId: bookingId });
        try {
            const response = await axiosInstance.get(`/booking/${bookingId}`);
            if (response.status === 200) {
                // Xử lý khi thành công
                setUpdateSchedule({
                    bookingId: response.data.bookingId,
                    appointmentDate: response.data.appointmentDate,
                    timeType: response.data.timeType,
                    doctorName: response.data.doctorId.fullname,
                    patientName: response.data.patientRecordId.fullname,
                    phoneNumber: response.data.patientRecordId.phoneNumber,
                    address: response.data.patientRecordId.address,
                    status: response.data.status,
                });
            } else {
                console.error('Failed to get detail booking:', response.message);
            }
        } catch (error) {
            console.error('Error get detail booking:', error);
        }
    };

    const filterScheduleAPI = async () => {
        try {
            const response = await axiosInstance.get(
                `/booking/?query=${filterValue}&date=${filterDate}&status=${selectedStatus}&page=${pagination.page}&limit=${pagination.limit}`,
            );
            if (response.status === 200) {
                console.log('setSchedules:', response);

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
    const handleLogout = () => {
        logout();
    };

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

    // Hàm tìm label dựa trên value
    const getTimeValue = (time) => {
        const timeSlot = timeSlots.find((slot) => slot.value === time);
        return timeSlot?.label || time; // Trả về value hoặc label nếu không tìm thấy
    };

    const handleOpenUpdateModal = () => {
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setValidationErrors({});
        setIsUpdateModalOpen(false);
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateSchedule({ ...updateSchedule, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const handleUpdateSchedule = () => {
        const errors = {};
        if (!updateSchedule.timeType) errors.timeType = 'Ca khám không được để trống.';
        if (!updateSchedule.status) errors.status = 'Trạng thái không được để trống.';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); // Cập nhật lỗi
            return; // Ngăn không thêm nếu có lỗi
        }
        updateScheduleAPI(updateSchedule);
        toast.success('Cập nhật lịch hẹn thành công!');
        setValidationErrors(errors);
        handleCloseUpdateModal();
    };

    const toggleAdminMenu = () => {
        setIsExpanded(!isExpanded);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef(null);
    const adminRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation(); // Lấy đường dẫn hiện tại

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        if (isMenuOpen && adminRef.current) {
            const rect = adminRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom, // Position dropdown below the button
                left: rect.left, // Align dropdown with the left edge of Admin button
            });
        }
    }, [isMenuOpen]);

    // Close the menu if clicked outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !adminRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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
        { key: 'appointmentDate', label: 'Ngày khám' },
        { key: 'timeType', label: 'Ca khám' },
        { key: 'doctorId.fullname', label: 'Bác sĩ' },
        { key: 'patientRecordId.fullname', label: 'Tên bệnh nhân' },
        { key: 'patientRecordId.phoneNumber', label: 'Số điện thoại' },
        { key: 'patientRecordId.address', label: 'Địa chỉ' },
        { key: 'status', label: 'Trạng thái' },
    ];

    const actions = [{ icon: <CiEdit />, onClick: (schedule) => getDetailScheduleAPI(schedule.bookingId) }];

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
                            .filter((statusOption) => statusOption.label.trim() !== '') // Loại bỏ khoảng trống
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

                    {/* Modal Cập Nhật lịch hẹn */}
                    {isUpdateModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white w-1/2 p-6 rounded shadow-lg relative">
                                <button
                                    onClick={handleCloseUpdateModal}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                >
                                    ✖
                                </button>
                                <h2 className="text-xl font-bold mb-4">Cập nhật lịch hẹn</h2>
                                <div className="grid grid-cols-2">
                                    <div>
                                        <label>Ngày khám</label>
                                        <input
                                            type="date"
                                            name="appointmentDate"
                                            readOnly
                                            value={updateSchedule.appointmentDate}
                                            onChange={handleUpdateChange}
                                            disabled
                                            className="border border-gray-100 w-full px-2 py-1 rounded"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label>Bác sĩ</label>
                                        <input
                                            type="text"
                                            name="doctorName"
                                            value={updateSchedule.doctorName}
                                            disabled
                                            className="border border-gray-100 w-full px-2 py-1 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label>Bệnh nhân</label>
                                        <input
                                            type="text"
                                            name="patientName"
                                            value={updateSchedule.patientName}
                                            onChange={handleUpdateChange}
                                            disabled
                                            className="border border-gray-100 w-full px-2 py-1 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label>Ca khám</label>
                                        <select
                                            type="text"
                                            name="timeType"
                                            value={updateSchedule.timeType}
                                            onChange={handleUpdateChange}
                                            className="border border-gray-400 w-full px-2 py-1 rounded"
                                        >
                                            <option value="">Chọn ca khám</option>
                                            {timeSlots.map((time, index) => (
                                                <option key={index} value={time.value}>
                                                    {time.label}
                                                </option>
                                            ))}
                                        </select>
                                        {validationErrors.timeType && (
                                            <p className="text-red-500 text-sm">{validationErrors.timeType}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label>Địa chỉ</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={updateSchedule.address}
                                            onChange={handleUpdateChange}
                                            disabled
                                            className="border border-gray-100 w-full px-2 py-1 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label>Trạng thái</label>
                                        <select
                                            type="text"
                                            name="status"
                                            value={updateSchedule.status}
                                            onChange={handleUpdateChange}
                                            className="border border-gray-400 w-full px-2 py-1 rounded"
                                        >
                                            <option value="">Chọn trạng thái</option>
                                            <option value="S1">Chưa xác nhận</option>
                                            <option value="S2">Đã xác nhận</option>
                                            <option value="S3">Đã thanh toán</option>
                                            <option value="S4">Đã khám xong</option>
                                            <option value="S5">Đã hủy</option>
                                        </select>
                                        {validationErrors.status && (
                                            <p className="text-red-500 text-sm">{validationErrors.status}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label>Số điện thoại</label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={updateSchedule.phoneNumber}
                                            onChange={handleUpdateChange}
                                            disabled
                                            className="border border-gray-100 w-full px-2 py-1 rounded"
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <button
                                            onClick={handleUpdateSchedule}
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Cập nhật
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ScheduleManagement;
