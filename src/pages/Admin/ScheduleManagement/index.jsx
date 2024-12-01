import React, { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faGauge, faClock, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '~/context/UserContext';
import { axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';
import { AiOutlineEdit } from 'react-icons/ai';

const ScheduleManagement = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedStatus, setSelectedStatus] = useState('');
    const { logout, user } = useContext(UserContext);
    const [filterValue, setFilterValue] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 9, totalPages: 1 });
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

    // const filteredSchedules =
    //     selectedStatus === '' ? schedules : schedules.filter((sche) => sche.status === selectedStatus);

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
        console.log('Updated Schedule Info:', updateSchedule);
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
            // Set dropdown position to be below the Admin button
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

    return (
        <>
            {/* Nội dung chính */}
            <div className="p-8">
                {/* Tiêu đề */}
                <h2 className="text-center text-2xl font-bold mb-4">QUẢN LÝ LỊCH HẸN</h2>

                <div className="flex items-center justify-between mb-4">
                    {/* Thanh tìm kiếm */}
                    <div className="grid grid-col-2 gap-4">
                        <div className="flex items-center space-x-2 ">
                            <input
                                type="text"
                                placeholder="Tìm kiếm"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                className="border border-gray-400 rounded px-3 py-2 w-96"
                            />
                            <button
                                className="bg-gray-200 border border-gray-400 px-4 py-2 rounded"
                                onClick={() => filterScheduleAPI()}
                            >
                                🔍
                            </button>
                        </div>
                        <div>
                            <input
                                type="date"
                                className="border rounded px-2 py-1"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Status Filters */}
                <div className="flex space-x-4 mb-4">
                    {[
                        { label: 'Tất cả', value: '' },
                        { label: 'Thanh toán trực tiếp', value: 'S1' },
                        { label: 'Đã thanh toán', value: 'S2' },
                        { label: 'Đã khám xong', value: 'S3' },
                        { label: 'Đã hủy', value: 'S4' },
                    ]
                        .filter((statusOption) => statusOption.label.trim() !== '') // Loại bỏ khoảng trống
                        .map((statusOption) => (
                            <button
                                key={statusOption.value}
                                onClick={() => setSelectedStatus(statusOption.value)}
                                className={`px-4 py-2 rounded border ${
                                    selectedStatus === statusOption.value ? 'bg-gray-300 font-bold' : 'bg-white'
                                }`}
                            >
                                {statusOption.label}
                            </button>
                        ))}
                </div>
                {/* Bảng */}
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">STT</th>
                            <th className="border border-gray-300 px-4 py-2">Ngày khám</th>
                            <th className="border border-gray-300 px-4 py-2">Ca khám</th>
                            <th className="border border-gray-300 px-4 py-2">Bác sĩ</th>
                            <th className="border border-gray-300 px-4 py-2">Tên bệnh nhân</th>
                            <th className="border border-gray-300 px-4 py-2">SĐT</th>
                            <th className="border border-gray-300 px-4 py-2">Địa chỉ</th>
                            <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
                            <th className="border border-gray-300 px-4 py-2">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.length > 0 ? (
                            schedules.map((sche, index) => (
                                <tr key={sche.bookingId} className="text-center">
                                    <td className="border border-gray-300 px-2 py-1">
                                        {index + 1 + pagination.limit * (pagination.page - 1)}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1">
                                        {sche.appointmentDate.split('-').reverse().join('-')}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1">
                                        {getTimeValue(sche.timeType)} {/* Gọi hàm để lấy value */}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1">{sche.doctorId.fullname}</td>
                                    <td className="border border-gray-300 px-2 py-1">
                                        {sche.patientRecordId.fullname}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1">
                                        {sche.patientRecordId.phoneNumber}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1">{sche.patientRecordId.address}</td>
                                    <td className="border border-gray-300 px-2 py-1">
                                        {(() => {
                                            const statusMapping = {
                                                S1: 'Thanh toán trực tiếp',
                                                S2: 'Đã thanh toán',
                                                S3: 'Đã khám xong',
                                                S4: 'Đã hủy',
                                            };
                                            return statusMapping[sche.status] || 'Đang xử lý';
                                        })()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center space-x-8">
                                        <button
                                            className="text-blue-500 text-3xl hover:text-blue-700"
                                            onClick={() => getDetailScheduleAPI(sche.bookingId)}
                                        >
                                            <AiOutlineEdit />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4">
                                    Không có lịch hẹn nào
                                </td>
                            </tr>
                        )}
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
                        <option value="9">9</option>
                        <option value="15">15</option>
                        <option value="21">21</option>
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
                                        <option value="S1">Thanh toán trực tiếp</option>
                                        <option value="S2">Đã thanh toán</option>
                                        <option value="S3">Đã khám xong</option>
                                        <option value="S4">Đã hủy</option>
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
        </>
    );
};

export default ScheduleManagement;
