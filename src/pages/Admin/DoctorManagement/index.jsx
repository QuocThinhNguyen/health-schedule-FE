import { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faGauge, faClock, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';
import { UserContext } from '~/context/UserContext';
import { axiosInstance } from '~/api/apiRequest';
import Logo from '~/components/Logo';
import { toast } from 'react-toastify';

const DoctorManagement = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const { logout, user } = useContext(UserContext);
    const [filterValue, setFilterValue] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 5, totalPages: 1 });
    const [selectedFile, setSelectedFile] = useState({});
    const [previewImage, setPreviewImage] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [users, setUsers] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [avata, setAvata] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            await getAvataAccount(user.userId);
            await getDropdownClinics();
            await getDropdownSpecialties();
            await getDropdownUsers();
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await filterDoctorAPI();
        };
        fetchData();
    }, [pagination, filterValue]);

    const [doctor, setDoctor] = useState({
        doctorInforId: '',
        doctorId: '',
        fullname: '',
        position: '',
        address: '',
        phoneNumber: '',
        description: '',
        image: null,
        price: '',
        specialtyId: '',
        clinicId: '',
    });

    const [updateDoctor, setUpdateDoctor] = useState({
        doctorInforId: '',
        doctorId: '',
        fullname: '',
        email: '',
        position: '',
        address: '',
        phoneNumber: '',
        description: '',
        image: '',
        price: '',
        specialtyId: '',
        clinicId: '',
    });

    const [deleteDoctor, setDeleteDoctor] = useState({
        doctorId: '',
    });

    const mergedDoctors = doctors.map((doctor) => {
        const user = users.find((user) => user.userId === doctor.doctorId);
        return {
            ...doctor,
            email: user ? user.email : null,
            fullname: user ? user.fullname : null,
            image: user ? user.image : null,
            address: user ? user.address : null,
            phoneNumber: user ? user.phoneNumber : null,
        };
    });

    const getAvataAccount = async (userId) => {
        try {
            const response = await axiosInstance.get(`/user/${userId}`);

            if (response.status === 'OK') {
                // Xử lý khi thành công
                setAvata(response.data.image);
            } else {
                console.error('Failed to update schedule:', response.message);
            }
        } catch (error) {
            console.error('Error update schedule:', error);
        }
    };

    const getDropdownUsers = async () => {
        try {
            const response = await axiosInstance.get(`/user/dropdown`);

            if (response.errCode === 0) {
                setUsers(response.data);
            } else {
                console.error('No users are found:', response.message);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    };

    const getDropdownClinics = async () => {
        try {
            const response = await axiosInstance.get(`/clinic/dropdown`);

            if (response.errCode === 0) {
                setClinics(response.data);
            } else {
                console.error('No clinics are found:', response.message);
                setClinics([]);
            }
        } catch (error) {
            console.error('Error fetching clinics:', error);
            setClinics([]);
        }
    };

    const getDropdownSpecialties = async () => {
        try {
            const response = await axiosInstance.get(`/specialty/dropdown`);

            if (response.errCode === 0) {
                setSpecialties(response.data);
            } else {
                console.error('No specialty are found:', response.message);
                setSpecialties([]);
            }
        } catch (error) {
            console.error('Error fetching specialty:', error);
            setSpecialties([]);
        }
    };

    const updateDoctorAPI = async (updateDoctor) => {
        try {
            const response = await axiosInstance.put(`/doctor/${updateDoctor.doctorId}`, updateDoctor);

            if (response.errCode === 0) {
                // Xử lý khi thành công
                await filterDoctorAPI();
            } else {
                console.error('Failed to update doctor:', response.message);
            }
        } catch (error) {
            console.error('Error update doctor:', error);
        }
    };
    const getDetailDoctorAPI = async (doctor) => {
        setIsUpdateModalOpen(true);
        setUpdateDoctor({
            doctorInforId: doctor.doctorInforId,
            doctorId: doctor.doctorId.userId,
            fullname: doctor.doctorId.fullname,
            email: doctor.doctorId.email,
            position: doctor?.position || '',
            address: doctor.doctorId.address,
            phoneNumber: doctor.doctorId.phoneNumber,
            description: doctor?.description || '',
            image: doctor.doctorId.image,
            price: doctor?.price || '',
            specialtyId: doctor.specialtyId?.specialtyId || '',
            clinicId: doctor.clinicId?.clinicId || '',
        });
        // try {
        //     const response = await axiosInstance.get(`/doctor/${doctor.doctorInforId}`);

        //     if (response.errCode === 0) {
        //         // Xử lý khi thành công
        //         //setUpdateDoctor(response.data)
        //     } else {
        //         console.error('Failed to get detail doctor:', response.message);
        //     }
        // } catch (error) {
        //     console.error('Error get detail doctor:', error);
        // }
    };
    const deleteDoctorAPI = async (doctorId) => {
        try {
            const response = await axiosInstance.delete(`/doctor/${doctorId}`);
            if (response.errCode === 0) {
                // Xử lý khi thành công
                await filterDoctorAPI();
            } else {
                console.error('Failed to delete doctor:', response.message);
            }
        } catch (error) {
            console.error('Error delete doctor:', error);
        }
    };

    const filterDoctorAPI = async () => {
        try {
            const response = await axiosInstance.get(
                `/doctor/?query=${filterValue}&page=${pagination.page}&limit=${pagination.limit}`,
            );

            if (response.errCode === 0) {
                //console.log('Fetched users:', response.data);
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

    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (value.trim() === '') {
            // Nếu trường nhập trống, hiển thị lỗi
            setValidationErrors((prev) => ({
                ...prev,
                [name]: 'Trường này không được để trống',
            }));
        } else {
            // Nếu trường nhập hợp lệ, xóa lỗi
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleDeleteClick = (doctorId) => {
        setShowConfirm(true);
        setDeleteDoctor({ doctorId: doctorId });
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteDoctor({ doctorId: '' });
    };

    const handleConfirmDelete = () => {
        deleteDoctorAPI(deleteDoctor.doctorId); // Gọi hàm xóa bệnh viện từ props hoặc API
        setShowConfirm(false); // Ẩn hộp thoại sau khi xóa
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setValidationErrors({});
        setIsModalOpen(false);
        setDoctor({
            fullname: '',
            position: '',
            address: '',
            phoneNumber: '',
            description: '',
            image: null,
            price: '',
            specialtyId: '',
            clinicId: '',
        });
    };

    const handleOpenUpdateModal = () => {
        setIsUpdateModalOpen(true);
        console.error();
    };

    const handleCloseUpdateModal = () => {
        setValidationErrors({});
        setIsUpdateModalOpen(false);
        setPreviewImage({ image: '' });
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateDoctor({ ...updateDoctor, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const imageInputRef = useRef(null); // Khai báo ref cho input file

    const handleUpdateImageUpload = (e) => {
        //url tạm thời
        const file = e.target.files[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setPreviewImage({ image: objectURL }); // Lưu blob URL
        }
        setSelectedFile(file);
    };

    const handleAddDoctor = () => {
        //Chưa có error do không dùng Thêm
        toast.success('Thêm bác sĩ thành công!');
        console.log('New Doctor Info:', doctor);
        handleCloseModal();
    };

    const handleUpdateDoctor = () => {
        const errors = {};
        //if (!updateDoctor.fullname) errors.fullname = 'Tên bác sĩ không được để trống.';
        //if (!updateDoctor.email) errors.email = "Email không được để trống.";
        if (!updateDoctor.position) errors.position = 'Học hàm, học vị không được để trống.';
        //if (!updateDoctor.address) errors.address = 'Địa chỉ không được để trống.';
        //if (!updateDoctor.phoneNumber) errors.phoneNumber = 'Số điện thoại không được để trống.';
        if (!updateDoctor.description) errors.description = 'Mô tả không được để trống.';
        if (!updateDoctor.price) errors.price = 'Giá khám bệnh không được để trống.';
        if (!updateDoctor.specialtyId) errors.specialtyId = 'Chuyên khoa không được để trống.';
        if (!updateDoctor.clinicId) errors.clinicId = 'Bệnh viện không được để trống.';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); // Cập nhật lỗi
            return; // Ngăn không thêm nếu có lỗi
        }
        updateDoctorAPI(updateDoctor);
        toast.success('Cập nhật bác sĩ thành công!');
        setValidationErrors(errors);
        console.log('Updated Doctor Info:', updateDoctor);
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

    // Dữ liệu các mục menu
    const menuItems = [
        //{ path: '/admin/dashboard', label: 'Bảng thống kê', icon: <FontAwesomeIcon icon={faGauge} /> },
        { path: '/admin/clinic', label: 'Quản lý bệnh viện', icon: <FontAwesomeIcon icon={faHospital} /> },
        { path: '/admin/doctor', label: 'Quản lý bác sĩ', icon: '👩‍⚕️' },
        { path: '/admin/user', label: 'Quản lý tài khoản người dùng', icon: '👤' },
        { path: '/admin/specialty', label: 'Quản lý chuyên khoa', icon: '🩺' },
        { path: '/admin/schedule', label: 'Quản lý lịch hẹn', icon: '📅' },
        { path: '/admin/worktime', label: 'Quản lý thời gian làm việc', icon: <FontAwesomeIcon icon={faClock} /> },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className={`bg-gray-100 border-r transition-all duration-300 mt-4 ${isExpanded ? 'w-100' : 'w-16'}`}>
                <div className="flex items-center justify-between px-4 py-2 bg-gray-300">
                    {isExpanded && <span className="font-bold">Admin Menu</span>}
                    <button onClick={toggleAdminMenu} className="p-2 text-gray-700 hover:bg-gray-200 rounded">
                        {isExpanded ? <IoMenu /> : <IoMenu />}
                    </button>
                </div>
                <ul className="space-y-2 mt-4">
                    {/* Menu items */}
                    {menuItems.map((item) => (
                        <li
                            key={item.path}
                            className={`cursor-pointer flex items-center px-4 py-2 rounded ${
                                location.pathname === item.path
                                    ? 'bg-pink-500 text-white' // Nền hồng cho mục hiện tại
                                    : 'hover:bg-gray-200' // Hover hiệu ứng cho mục khác
                            } ${isExpanded ? 'justify-start' : 'justify-center'}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {isExpanded && <span className="ml-4">{item.label}</span>}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4">
                <div className="bg-gray-200">
                    <div className="border-t border-gray-400"></div>
                    <div className="bg-gray-200 mx-auto">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4 ml-4">
                                {/* <img
                                    src={
                                        'https://phuongnamvina.com/img_data/images/logo-benh-vien.jpg' ||
                                        'https://via.placeholder.com/150'
                                    }
                                    alt="Logo"
                                    className="w-24 h-24 object-contain"
                                /> */}
                                <Logo />
                            </div>
                            {/* Admin và Menu */}
                            <div
                                ref={adminRef}
                                className="flex items-center space-x-4 cursor-pointer"
                                onClick={toggleMenu}
                            >
                                <span className="font-bold">Admin</span>
                                <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={
                                            avata
                                                ? `http://localhost:9000/uploads/${avata}`
                                                : 'http://localhost:3000/src/assets/img/avatar.png'
                                        }
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Menu thả xuống */}
                            {isMenuOpen && (
                                <div
                                    ref={menuRef}
                                    className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md w-40 z-20"
                                    style={{
                                        top: dropdownPosition.top + 8 + 'px', // Add a small offset
                                        left: dropdownPosition.left + 'px',
                                    }}
                                >
                                    <ul className="py-2">
                                        {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Hồ sơ cá nhân</li> */}
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            Đăng xuất
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="border-t border-gray-400"></div>
                </div>

                {/* Nội dung chính */}
                <div className="px-16 py-8">
                    {/* Tiêu đề */}
                    <h2 className="text-center text-2xl font-bold mb-4">QUẢN LÝ BÁC SĨ</h2>

                    <div className="flex items-center justify-between mb-4">
                        {/* Thanh tìm kiếm */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Tìm kiếm"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                className="border border-gray-400 rounded px-3 py-2 w-96"
                            />
                            <button
                                className="bg-gray-200 border border-gray-400 px-4 py-2 rounded"
                                onClick={() => filterDoctorAPI()}
                            >
                                🔍
                            </button>
                        </div>

                        {/* Nút Thêm */}
                        {/* <button
              className="flex items-center space-x-2 bg-gray-200 border border-gray-400 px-4 py-2 rounded"
              onClick={handleOpenModal}
            >
              <span>Thêm</span>
              <span>
                <FontAwesomeIcon icon={faPlus} />
              </span>
            </button> */}
                    </div>

                    {/* Bảng */}
                    <table className="w-full border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">STT</th>
                                <th className="border border-gray-300 px-4 py-2">Hình ảnh</th>
                                <th className="border border-gray-300 px-4 py-2">Tên</th>
                                <th className="border border-gray-300 px-4 py-2">Học hàm, học vị</th>
                                <th className="border border-gray-300 px-4 py-2">Bệnh viện</th>
                                <th className="border border-gray-300 px-4 py-2">Chuyên khoa</th>
                                <th className="border border-gray-300 px-4 py-2">Địa chỉ</th>
                                <th className="border border-gray-300 px-4 py-2">SĐT</th>
                                <th className="border border-gray-300 px-4 py-2">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mergedDoctors.map((doctor, index) => (
                                <tr key={doctor.doctorInforId}>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {index + 1 + pagination.limit * (pagination.page - 1)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto">
                                            <img
                                                src={`http://localhost:9000/uploads/${doctor.doctorId.image}`}
                                                alt={doctor.image}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {doctor.doctorId.fullname}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {(() => {
                                            const positionMapping = {
                                                P0: 'Bác sĩ',
                                                P1: 'Trưởng khoa',
                                                P2: 'Giáo sư',
                                                P3: 'Phó giáo sư',
                                            };
                                            return positionMapping[doctor.position] || 'Không xác định';
                                        })()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {/* {clinics.find(clinic => clinic.clinicId === doctor.clinicId)?.name || "Chưa xác định"} */}
                                        {doctor.clinicId?.name || 'Chưa xác định'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {/* {specialties.find(specialty => specialty.specialtyId === doctor.specialtyId)?.name || "Chưa xác định"} */}
                                        {doctor.specialtyId?.name || 'Chưa xác định'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {doctor.doctorId.address}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {doctor.doctorId.phoneNumber}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center space-x-8">
                                        <button className="text-blue-500" onClick={() => getDetailDoctorAPI(doctor)}>
                                            ✏️
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </div>
                    <div className="flex justify-end items-center space-x-4 mt-4">
                        <button
                            className={`${
                                pagination.page === 1 ? 'font-normal text-gray-500' : 'font-bold text-blue-500'
                            }`}
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

                    {/* Modal Cập Nhật Bác sĩ */}
                    {isUpdateModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white w-1/2 p-6 rounded shadow-lg relative">
                                <button
                                    onClick={handleCloseUpdateModal}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                >
                                    ✖
                                </button>
                                <h2 className="text-xl font-bold mb-4">Cập nhật bác sĩ</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Cột bên trái: Tên bác sĩ và Email */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <label>Tên bác sĩ</label>
                                            <input
                                                type="text"
                                                name="fullname"
                                                value={updateDoctor.fullname}
                                                onChange={handleUpdateChange}
                                                onBlur={handleBlur}
                                                disabled
                                                className={`border w-full px-2 py-1 rounded ${
                                                    validationErrors.fullname ? 'border-red-500' : 'border-gray-100'
                                                }`}
                                            />
                                            {validationErrors.fullname && (
                                                <p className="text-red-500 text-sm">{validationErrors.fullname}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={updateDoctor.email}
                                                disabled
                                                className="border border-gray-100 w-full px-2 py-1 rounded"
                                            />
                                        </div>
                                    </div>
                                    {/* Cột bên phải: Hình ảnh và nút "Thay đổi" */}
                                    <div className="flex flex-col items-center space-x-12">
                                        <label>Hình ảnh</label>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-40 h-40 border rounded overflow-hidden cursor-pointer flex items-center justify-center"
                                                onClick={() => imageInputRef.current.click()}
                                            >
                                                <img
                                                    src={
                                                        previewImage.image
                                                            ? previewImage.image
                                                            : `http://localhost:9000/uploads/${updateDoctor.image}`
                                                    }
                                                    alt="No Image"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <input //  Nút để tải lên hình ảnh mới
                                                type="file"
                                                name="image"
                                                onChange={handleUpdateImageUpload}
                                                disabled
                                                className="hidden" // Ẩn trường input, sẽ dùng nút ẩn để mở
                                                ref={imageInputRef} // Sử dụng ref để trigger khi cần
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label>Địa chỉ</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={updateDoctor.address}
                                            onChange={handleUpdateChange}
                                            disabled
                                            onBlur={handleBlur}
                                            className={`border w-full px-2 py-1 rounded ${
                                                validationErrors.address ? 'border-red-500' : 'border-gray-100'
                                            }`}
                                        />
                                        {validationErrors.address && (
                                            <p className="text-red-500 text-sm">{validationErrors.address}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label>Số điện thoại</label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={updateDoctor.phoneNumber}
                                            onChange={handleUpdateChange}
                                            disabled
                                            onBlur={handleBlur}
                                            className={`border w-full px-2 py-1 rounded ${
                                                validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-100'
                                            }`}
                                        />
                                        {validationErrors.phoneNumber && (
                                            <p className="text-red-500 text-sm">{validationErrors.phoneNumber}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label>Học hàm, học vị</label>
                                        <select
                                            type="text"
                                            name="position"
                                            value={updateDoctor.position}
                                            onChange={handleUpdateChange}
                                            onBlur={handleBlur}
                                            className={`border w-full px-2 py-1 rounded ${
                                                validationErrors.position ? 'border-red-500' : 'border-gray-400'
                                            }`}
                                        >
                                            <option value="">Chọn học hàm, học vị</option>
                                            <option value="P0">Bác sĩ</option>
                                            <option value="P1">Trưởng khoa</option>
                                            <option value="P2">Giáo sư</option>
                                            <option value="P3">Phó giáo sư</option>
                                        </select>
                                        {validationErrors.position && (
                                            <p className="text-red-500 text-sm">{validationErrors.position}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label>Giá khám bệnh</label>
                                        <input
                                            type="text"
                                            name="price"
                                            value={updateDoctor.price}
                                            onChange={handleUpdateChange}
                                            onBlur={handleBlur}
                                            className={`border w-full px-2 py-1 rounded ${
                                                validationErrors.price ? 'border-red-500' : 'border-gray-400'
                                            }`}
                                        />
                                        {validationErrors.price && (
                                            <p className="text-red-500 text-sm">{validationErrors.price}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label>Bệnh viện</label>
                                        <select
                                            name="clinicId"
                                            value={updateDoctor.clinicId}
                                            onChange={handleUpdateChange}
                                            onBlur={handleBlur}
                                            className={`border w-full px-2 py-1 rounded ${
                                                validationErrors.clinicId ? 'border-red-500' : 'border-gray-400'
                                            }`}
                                        >
                                            <option value="">Chọn bệnh viện</option>
                                            {clinics.map((clinic, index) => (
                                                <option key={clinic.clinicId} value={clinic.clinicId}>
                                                    {clinic.name}
                                                </option>
                                            ))}
                                        </select>
                                        {validationErrors.clinicId && (
                                            <p className="text-red-500 text-sm">{validationErrors.clinicId}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label>Chuyên khoa</label>
                                        <select
                                            name="specialtyId"
                                            value={updateDoctor.specialtyId}
                                            onChange={handleUpdateChange}
                                            onBlur={handleBlur}
                                            className={`border w-full px-2 py-1 rounded ${
                                                validationErrors.specialtyId ? 'border-red-500' : 'border-gray-400'
                                            }`}
                                        >
                                            <option value="">Chọn chuyên khoa</option> {/* Tùy chọn mặc định */}
                                            {specialties.map((specialty, index) => (
                                                <option key={specialty.specialtyId} value={specialty.specialtyId}>
                                                    {specialty.name}
                                                </option>
                                            ))}
                                        </select>
                                        {validationErrors.specialtyId && (
                                            <p className="text-red-500 text-sm">{validationErrors.specialtyId}</p>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <label>Mô tả</label>
                                        <textarea
                                            name="description"
                                            value={updateDoctor.description}
                                            onChange={handleUpdateChange}
                                            onBlur={handleBlur}
                                            rows="4"
                                            className={`border w-full px-2 py-1 rounded ${
                                                validationErrors.description ? 'border-red-500' : 'border-gray-400'
                                            }`}
                                        ></textarea>
                                        {validationErrors.description && (
                                            <p className="text-red-500 text-sm">{validationErrors.description}</p>
                                        )}
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <button
                                            onClick={handleUpdateDoctor}
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
        </div>
    );
};

export default DoctorManagement;
