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
import { Edit2, Eye, Trash2, Search, XCircle } from 'lucide-react';
import Title from '../components/Tittle';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';

function DoctorScheduleManagement() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [selectedTimesUpdate, setSelectedTimesUpdate] = useState([]);
    const { logout, user } = useContext(UserContext);
    const [showConfirm, setShowConfirm] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [doctors, setDoctors] = useState([]);
    const [worktimes, setWorkTimes] = useState([]);
    const [avata, setAvata] = useState('');

    useEffect(() => {
        getAvataAccount(user.userId);
    }, []);

    useEffect(() => {
        getDropdownDoctors();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await filterWorkTimeAPI();
        };
        fetchData();
    }, [pagination, filterValue, filterDate]);

    const [worktime, setWorkTime] = useState({
        //scheduleId: "",
        scheduleDate: '',
        doctorId: '',
        timeTypes: [],
    });

    const [updateWorkTime, setUpdateWorkTime] = useState({
        //scheduleId: "",
        scheduleDate: '',
        doctorId: '',
        timeTypes: [],
    });

    const [deleteWorkTime, setDeleteWorkTime] = useState({
        doctorId: '',
        scheduleDate: '',
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

    const getDropdownDoctors = async () => {
        try {
            const response = await axiosInstance.get(`/doctor/dropdown`);

            if (response.status === 200) {
                setDoctors(response.data);
            } else {
                console.error('No doctors are found:', response.message);
                setDoctors([]);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctors([]);
        }
    };

    const createWorkTimeAPI = async (data) => {
        try {
            const response = await axiosInstance.post('/schedule', data);

            if (response.status === 200) {
                // Xử lý khi tạo thành công
                await filterWorkTimeAPI();
            } else {
                console.error('Failed to create worktime:', response.message);
            }
        } catch (error) {
            console.error('Error creating worktime:', error);
        }
    };
    const updateWorkTimeAPI = async (data) => {
        try {
            const response = await axiosInstance.put(`/schedule/${updateWorkTime.doctorId}`, data);

            if (response.status === 200) {
                // Xử lý khi thành công
                await filterWorkTimeAPI();
            } else {
                console.error('Failed to update worktime:', response.message);
            }
        } catch (error) {
            console.error('Error update worktime:', error);
        }
    };
    const getDetailWorkTimeAPI = async (doctorId, scheduleDate) => {
        handleOpenUpdateModal();
        setUpdateWorkTime({ ...updateWorkTime, doctorId: doctorId, scheduleDate: scheduleDate });
        try {
            const response = await axiosInstance.get(`/schedule/${doctorId}?date=${scheduleDate}`);
            if (response.status === 200) {
                // Xử lý khi thành công
                setUpdateWorkTime({
                    //scheduleId: response.data.scheduleId,
                    scheduleDate: response.data[0].scheduleDate,
                    doctorId: response.data[0].doctorId.userId,
                    timeTypes: response.data[0].timeTypes,
                });
                setSelectedTimesUpdate(response.data[0].timeTypes);
            } else {
                console.error('Failed to get detail worktime:', response.message);
            }
        } catch (error) {
            console.error('Error get detail worktime:', error);
        }
    };
    const deleteWorkTimeAPI = async () => {
        try {
            const response = await axiosInstance.delete(
                `/schedule/${deleteWorkTime.doctorId}?date=${deleteWorkTime.scheduleDate}`,
            );
            if (response.status === 200) {
                // Xử lý khi thành công
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
                console.log('filterWorkTimeAPI:', response);
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

    const handleTimeSlotClick = (time) => {
        let times;
        if (selectedTimes.includes(time)) {
            times = selectedTimes.filter((t) => t !== time); // Bỏ chọn nếu đã chọn
        } else {
            times = [...selectedTimes, time]; // Thêm vào nếu chưa chọn
            setValidationErrors({ ...validationErrors, time: '' });
        }
        setSelectedTimes(times);

        setWorkTime((prevState) => ({
            ...prevState,
            timeTypes: times,
        }));
    };

    const handleTimeSlotUpdateClick = (value) => {
        let updatedTimes;

        if (selectedTimesUpdate.includes(value)) {
            // Loại bỏ giá trị nếu đã tồn tại
            updatedTimes = selectedTimesUpdate.filter((time) => time !== value);
        } else {
            // Thêm giá trị mới
            updatedTimes = [...selectedTimesUpdate, value];
            setValidationErrors({ ...validationErrors, time: '' });
        }

        setSelectedTimesUpdate(updatedTimes); // Cập nhật trạng thái selectedTimesUpdate

        // Cập nhật updateWorkTime.timeTypes
        setUpdateWorkTime((prevState) => ({
            ...prevState,
            timeTypes: updatedTimes,
        }));
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
        deleteWorkTimeAPI(); // Gọi hàm xóa bệnh viện từ props hoặc API
        setDeleteWorkTime({
            doctorId: '',
            scheduleDate: '',
        });
        setShowConfirm(false); // Ẩn hộp thoại sau khi xóa
    };

    const handleLogout = () => {
        logout();
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setValidationErrors({});
        setIsModalOpen(false);
        setWorkTime({
            scheduleDate: '',
            doctorId: '',
            timeTypes: [],
        });
        setSelectedTimes([]);
    };

    const handleOpenUpdateModal = () => {
        setIsUpdateModalOpen(true);
        setSelectedTimesUpdate(updateWorkTime.timeTypes);
    };

    const handleCloseUpdateModal = () => {
        setValidationErrors({});
        setIsUpdateModalOpen(false);
        setSelectedTimesUpdate([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWorkTime({ ...worktime, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateWorkTime({ ...updateWorkTime, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const handleAddWorktime = () => {
        const errors = {};
        if (worktime.timeTypes.length === 0) errors.time = 'Ca làm việc không được để trống.';
        if (worktime.doctorId === '') errors.doctorId = 'Bác sĩ không được để trống.';
        if (worktime.scheduleDate === '') errors.scheduleDate = 'Ngày khám không được để trống.';
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); // Cập nhật lỗi
            return; // Ngăn không thêm nếu có lỗi
        }
        createWorkTimeAPI(worktime);
        toast.success('Thêm ca làm việc thành công!');
        setValidationErrors(errors);
        handleCloseModal();
    };

    const handleUpdateWorktime = () => {
        const errors = {};
        if (updateWorkTime.timeTypes.length === 0) errors.time = 'Ca làm việc không được để trống.';
        if (updateWorkTime.doctorId === '') errors.doctorId = 'Bác sĩ không được để trống.';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); // Cập nhật lỗi
            return; // Ngăn không thêm nếu có lỗi
        }
        updateWorkTimeAPI(updateWorkTime);
        toast.success('Cập nhật ca làm việc thành công!');
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
    console.log('processedWorktimes:', processedWorktimes);

    const columns = [
        { key: 'doctorId.fullname', label: 'Bác sĩ' },
        { key: 'scheduleDate', label: 'Ngày làm việc' },
        { key: 'timeTypes', label: 'Ca khám', type: 'timeTypes' },
    ];

    const actions = [
        {
            icon: <CiEdit />,
            onClick: (worktime) => getDetailWorkTimeAPI(worktime.doctorId.userId, worktime.scheduleDate),
        },
        {
            icon: <MdDeleteOutline />,
            onClick: (worktime) => handleDeleteClick(worktime.doctorId.userId, worktime.scheduleDate),
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
                            onClick={handleOpenModal}
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

                    {/* Modal Thêm Ca Làm Việc*/}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white w-1/2 p-6 rounded shadow-lg relative">
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                >
                                    ✖
                                </button>
                                <h2 className="text-xl font-bold mb-4">Thêm ca làm việc</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label>Chọn ngày</label>
                                        <input
                                            type="date"
                                            name="scheduleDate"
                                            value={worktime.scheduleDate}
                                            onChange={handleChange}
                                            className="border w-full px-2 py-1 rounded border-gray-400"
                                        />
                                        {validationErrors.scheduleDate && (
                                            <p className="text-red-500 text-sm">{validationErrors.scheduleDate}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label>Chọn bác sĩ</label>
                                        <select
                                            type="text"
                                            name="doctorId"
                                            value={worktime.doctorId}
                                            onChange={handleChange}
                                            className="border w-full px-2 py-1 rounded border-gray-400"
                                        >
                                            <option value="">Chọn bác sĩ</option>
                                            {doctors.map((doctor, index) => (
                                                <option key={index} value={doctor.doctorId.userId}>
                                                    {doctor.doctorId.fullname}
                                                </option>
                                            ))}
                                        </select>
                                        {validationErrors.doctorId && (
                                            <p className="text-red-500 text-sm">{validationErrors.doctorId}</p>
                                        )}
                                    </div>
                                </div>
                                {/* Time Slot Selection */}
                                <div>
                                    <label className="block font-bold mt-12 mb-4">Chọn thời gian</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time.value}
                                                onClick={() => handleTimeSlotClick(time.value)}
                                                className={`border px-4 py-2 rounded ${
                                                    selectedTimes.includes(time.value)
                                                        ? 'bg-gray-300 font-bold'
                                                        : 'bg-white'
                                                }`}
                                            >
                                                {time.label}
                                            </button>
                                        ))}
                                    </div>
                                    {validationErrors.time && (
                                        <p className="text-red-500 text-sm">{validationErrors.time}</p>
                                    )}
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    <button
                                        onClick={handleAddWorktime}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Modal Cập Nhật Ca Làm Việc*/}
                    {isUpdateModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white w-1/2 p-6 rounded shadow-lg relative">
                                <button
                                    onClick={handleCloseUpdateModal}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                >
                                    ✖
                                </button>
                                <h2 className="text-xl font-bold mb-4">Cập nhật ca làm việc</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label>Ngày khám</label>
                                        <input
                                            type="date"
                                            name="date"
                                            disabled
                                            value={updateWorkTime.scheduleDate}
                                            onChange={handleUpdateChange}
                                            className="border w-full px-2 py-1 rounded border-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label>Chọn bác sĩ</label>
                                        <select
                                            type="text"
                                            name="doctorId"
                                            value={updateWorkTime.doctorId}
                                            onChange={handleUpdateChange}
                                            className={`border w-full px-2 py-1 rounded ${
                                                validationErrors.doctorId ? 'border-red-500' : 'border-gray-400'
                                            }`}
                                        >
                                            <option value="">Chọn bác sĩ</option>
                                            {doctors.map((doctor, index) => (
                                                <option key={index} value={doctor.doctorId.userId}>
                                                    {doctor.doctorId.fullname}
                                                </option>
                                            ))}
                                        </select>
                                        {validationErrors.doctorId && (
                                            <p className="text-red-500 text-sm">{validationErrors.doctorId}</p>
                                        )}
                                    </div>
                                </div>
                                {/* Time Slot Selection */}
                                <div>
                                    <label className="block font-bold mt-12 mb-4">Chọn thời gian</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time.value}
                                                className={`border px-4 py-2 rounded ${
                                                    selectedTimesUpdate.includes(time.value)
                                                        ? 'bg-gray-300 font-bold'
                                                        : 'bg-white'
                                                }`}
                                                onClick={() => handleTimeSlotUpdateClick(time.value)}
                                            >
                                                {time.label}
                                            </button>
                                        ))}
                                    </div>
                                    {validationErrors.time && (
                                        <p className="text-red-500 text-sm">{validationErrors.time}</p>
                                    )}
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    <button
                                        onClick={handleUpdateWorktime}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Hộp thoại xác nhận */}
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
