import React, { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faGauge, faClock, faPlus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '~/context/UserContext';
import { axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';
import { Edit2, Eye, Trash2, Search, XCircle } from 'lucide-react';
import defaultImage from '../../../assets/img/addImage.png';
import Title from '../components/Tittle';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';
import { MdDeleteOutline } from 'react-icons/md';

const UserManagement = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const { logout, user } = useContext(UserContext);
    const [selectedFile, setSelectedFile] = useState({});
    const [previewImage, setPreviewImage] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [users, setUsers] = useState([]);
    const [avata, setAvata] = useState('');

    useEffect(() => {
        getAvataAccount(user.userId);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await filterUserAPI();
        };
        fetchData();
    }, [pagination, filterValue]);

    const [addUser, setUser] = useState({
        userId: '',
        fullname: '',
        email: '',
        address: '',
        birthDate: '',
        phoneNumber: '',
        password: '',
        image: null,
        roleId: '',
        gender: '',
    });

    const [updateUser, setUpdateUser] = useState({
        userId: '',
        fullname: '',
        email: '',
        address: '',
        birthDate: '',
        phoneNumber: '',
        password: '',
        roleId: '',
        image: '',
        gender: '',
    });

    const [deleteUser, setDeleteUser] = useState({
        userId: '',
    });

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

    const createUserAPI = async (formData) => {
        try {
            const response = await axiosInstance.post('/user', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                // Xử lý khi tạo thành công
                await filterUserAPI();
            } else {
                console.error('Failed to create user:', response.message);
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };
    const updateUserAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/user/${updateUser.userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                // Xử lý khi thành công
                await filterUserAPI();
            } else {
                console.error('Failed to update user:', response.message);
            }
        } catch (error) {
            console.error('Error update user:', error);
        }
    };
    const getDetailUserAPI = async (userId) => {
        setIsUpdateModalOpen(true);
        setUpdateUser({ ...updateUser, userId: userId });
        try {
            const response = await axiosInstance.get(`/user/${userId}`);

            if (response.status === 200) {
                // Xử lý khi thành công
                setUpdateUser({
                    userId: userId,
                    fullname: response.data?.fullname || '',
                    email: response.data?.email || '',
                    address: response.data?.address || '',
                    birthDate: response.data?.birthDate || '',
                    phoneNumber: response.data?.phoneNumber || '',
                    password: response.data?.password || '',
                    roleId: response.data?.roleId || '',
                    image: response.data?.image || '',
                    gender: response.data?.gender || '',
                });
            } else {
                console.error('Failed to get detail user:', response.message);
            }
        } catch (error) {
            console.error('Error get detail user:', error);
        }
    };
    const deleteUserAPI = async (userId) => {
        try {
            const response = await axiosInstance.delete(`/user/${userId}`);
            if (response.status === 200) {
                // Xử lý khi thành công
                await filterUserAPI();
            } else {
                console.error('Failed to delete user:', response.message);
            }
        } catch (error) {
            console.error('Error delete user:', error);
        }
    };

    const filterUserAPI = async () => {
        try {
            const response = await axiosInstance.get(
                `/user/?query=${filterValue}&page=${pagination.page}&limit=${pagination.limit}`,
            );
            //console.log(response)
            if (response.status === 200) {
                console.log('Fetched response:', response);
                console.log('Fetched users:', response.data);
                setUsers(response.data);
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
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
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

    const handleDeleteClick = (userId) => {
        setShowConfirm(true);
        setDeleteUser({ userId: userId });
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteUser({ userId: '' });
    };

    const handleConfirmDelete = () => {
        deleteUserAPI(deleteUser.userId); // Gọi hàm xóa bệnh viện từ props hoặc API
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
        setUser({
            fullname: '',
            email: '',
            address: '',
            phoneNumber: '',
            password: '',
            image: null,
            roleId: '',
            gender: '',
        });
    };

    const handleOpenUpdateModal = () => {
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setValidationErrors({});
        setIsUpdateModalOpen(false);
        setPreviewImage({ image: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...addUser, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateUser({ ...updateUser, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const imageInputRef = useRef(null); // Khai báo ref cho input file

    const handleImageUpload = (e) => {
        //url tạm thời
        const file = e.target.files[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setUser({ ...addUser, image: objectURL }); // Lưu blob URL
            // Xóa lỗi nếu có hình ảnh
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                image: '', // Xóa thông báo lỗi khi có hình ảnh hợp lệ
            }));
        }
        setSelectedFile(file);
    };

    const handleUpdateImageUpload = (e) => {
        //url tạm thời
        const file = e.target.files[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setPreviewImage({ image: objectURL }); // Lưu blob URL
        }
        setSelectedFile(file);
    };

    const handleAddUser = () => {
        const errors = {};
        if (!addUser.fullname) errors.fullname = 'Tên người dùng không được để trống.';
        if (!addUser.email) errors.email = 'Email không được để trống.';
        if (!addUser.image) errors.image = 'Hình ảnh không được để trống.';
        if (!addUser.address) errors.address = 'Địa chỉ không được để trống.';
        if (!addUser.birthDate) errors.birthDate = 'Ngày sinh không được để trống.';
        if (!addUser.phoneNumber) errors.phoneNumber = 'Số điện thoại không được để trống.';
        if (!addUser.password) errors.password = 'Mật khẩu không được để trống.';
        if (!addUser.roleId) errors.roleId = 'Vai trò không được để trống.';
        if (!addUser.gender) errors.gender = 'Giới tính không được để trống.';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); // Cập nhật lỗi
            return; // Ngăn không thêm nếu có lỗi
        }
        const formData = new FormData();
        // Thêm các trường từ user vào FormData
        Object.keys(addUser).forEach((key) => {
            formData.append(key, addUser[key]);
        });

        // Thêm file (nếu có)
        if (selectedFile && selectedFile.name) {
            formData.append('image', selectedFile);
        }
        createUserAPI(formData);
        toast.success('Thêm tài khoản thành công!');
        setValidationErrors(errors);
        setSelectedFile(null);
        handleCloseModal();
    };

    const handleUpdateUser = () => {
        const errors = {};
        if (!updateUser.fullname) errors.fullname = 'Tên người dùng không được để trống.';
        //if (!user.email) errors.email = "Email không được để trống.";
        if (!updateUser.address) errors.address = 'Địa chỉ không được để trống.';
        if (!updateUser.phoneNumber) errors.phoneNumber = 'Số điện thoại không được để trống.';
        if (!updateUser.password) errors.password = 'Mật khẩu không được để trống.';
        if (!updateUser.roleId) errors.roleId = 'Vai trò không được để trống.';
        if (!updateUser.gender) errors.gender = 'Giới tính không được để trống.';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); // Cập nhật lỗi
            return; // Ngăn không thêm nếu có lỗi
        }
        const formData = new FormData();
        // Thêm các trường từ clinic vào FormData
        Object.keys(updateUser).forEach((key) => {
            formData.append(key, updateUser[key]);
        });
        // Thêm file (nếu có)
        if (selectedFile && selectedFile.name) {
            formData.append('image', selectedFile);
        }
        updateUserAPI(formData);

        toast.success('Cập nhật tài khoản thành công!');
        setValidationErrors(errors);
        setSelectedFile(null);
        handleCloseUpdateModal();
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
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

    const columns = [
        { key: 'fullname', label: 'Họ và tên' },
        {
            key: 'image',
            label: 'Hình ảnh',
            type: 'image',
        },
        { key: 'email', label: 'Email' },
        { key: 'address', label: 'Địa chỉ' },
        { key: 'phoneNumber', label: 'Số điện thoại' },
    ];

    const actions = [
        { icon: <CiEdit />, onClick: (user) => getDetailUserAPI(user.userId) },
        { icon: <MdDeleteOutline />, onClick: (user) => handleDeleteClick(user.userId) },
    ];

    return (
        <>
            {/* Nội dung chính */}
            <div className="px-3 mb-6">
                <Title>Quản lý tài khoản người dùng</Title>
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
                            onClick={handleOpenModal}
                        >
                            <span>Thêm</span>
                            <span>
                                <IoIosAdd className="text-lg" />
                            </span>
                        </button>
                    </div>
                    <Table columns={columns} data={users} pagination={pagination} actions={actions} />
                    <AdvancePagination
                        pagination={pagination}
                        totalElements="10"
                        onPageChange={handlePageChange}
                        selects={[10, 15, 20]}
                        onSlectChange={handleLimitChange}
                    />
                </div>

                {/* Modal Thêm tài khoản*/}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white w-1/2 p-6 rounded shadow-lg relative">
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            >
                                ✖
                            </button>
                            <h2 className="text-xl font-bold mb-4">Thêm tài khoản</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Cột bên trái: Email và Mật khẩu*/}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label>
                                            Email<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={addUser.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`border w-full px-2 py-1 rounded ${
                                                validationErrors.email ? 'border-red-500' : 'border-gray-400'
                                            }`}
                                        />
                                        {validationErrors.email && (
                                            <p className="text-red-500 text-sm">{validationErrors.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label>
                                            Mật khẩu<span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'} // Thay đổi type dựa trên showPassword
                                                name="password"
                                                value={addUser.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`border w-full px-2 py-1 rounded ${
                                                    validationErrors.password ? 'border-red-500' : 'border-gray-400'
                                                }`}
                                            />
                                            <span
                                                onClick={() => toggleShowPassword()} // Toggle trạng thái showPassword
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-gray-500"
                                            >
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                            </span>
                                        </div>
                                        {validationErrors.password && (
                                            <p className="text-red-500 text-sm">{validationErrors.password}</p>
                                        )}
                                    </div>
                                </div>
                                {/* Cột bên phải: Hình ảnh và nút "Thay đổi" */}
                                <div className="flex flex-col items-center space-x-12">
                                    <label>
                                        Hình ảnh<span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-40 h-40 border rounded overflow-hidden cursor-pointer flex items-center justify-center"
                                            onClick={() => imageInputRef.current.click()}
                                        >
                                            <img
                                                src={addUser.image || defaultImage}
                                                alt="No Image"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <input //  Nút để tải lên hình ảnh mới
                                            type="file"
                                            name="image"
                                            onChange={handleImageUpload}
                                            className="hidden" // Ẩn trường input, sẽ dùng nút ẩn để mở
                                            ref={imageInputRef} // Sử dụng ref để trigger khi cần
                                        />
                                    </div>
                                    {validationErrors.image && (
                                        <p className="text-red-500 text-sm">{validationErrors.image}</p>
                                    )}
                                </div>
                                <div>
                                    <label>
                                        Tên tài khoản<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={addUser.fullname}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.fullname ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    />
                                    {validationErrors.fullname && (
                                        <p className="text-red-500 text-sm">{validationErrors.fullname}</p>
                                    )}
                                </div>
                                <div>
                                    <label>
                                        Số điện thoại<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={addUser.phoneNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    />
                                    {validationErrors.phoneNumber && (
                                        <p className="text-red-500 text-sm">{validationErrors.phoneNumber}</p>
                                    )}
                                </div>
                                <div>
                                    <label>
                                        Ngày sinh<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={addUser.birthDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.birthDate ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    />
                                    {validationErrors.birthDate && (
                                        <p className="text-red-500 text-sm">{validationErrors.birthDate}</p>
                                    )}
                                </div>
                                <div>
                                    <label>
                                        Địa chỉ<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={addUser.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.address ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    />
                                    {validationErrors.address && (
                                        <p className="text-red-500 text-sm">{validationErrors.address}</p>
                                    )}
                                </div>
                                <div>
                                    <label>
                                        Giới tính<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        type="text"
                                        name="gender"
                                        value={addUser.gender}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.gender ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                        <option value="Other">Khác</option>
                                    </select>
                                    {validationErrors.gender && (
                                        <p className="text-red-500 text-sm">{validationErrors.gender}</p>
                                    )}
                                </div>
                                <div>
                                    <label>
                                        Vai trò<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        type="text"
                                        name="roleId"
                                        value={addUser.roleId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.roleId ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    >
                                        <option value="">Chọn vai trò</option>
                                        <option value="R1">Admin</option>
                                        <option value="R2">Bác sĩ</option>
                                        <option value="R3">Người dùng</option>
                                    </select>
                                    {validationErrors.roleId && (
                                        <p className="text-red-500 text-sm">{validationErrors.roleId}</p>
                                    )}
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    <button
                                        onClick={handleAddUser}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal Cập Nhật tài khoản */}
                {isUpdateModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white w-1/2 p-6 rounded shadow-lg relative">
                            <button
                                onClick={handleCloseUpdateModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            >
                                ✖
                            </button>
                            <h2 className="text-xl font-bold mb-4">Cập nhật tài khoản</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Cột bên trái: Tên tài khoản và Email */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={updateUser.email}
                                            disabled
                                            className="border w-full px-2 py-1 rounded border-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label>Mật khẩu</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'} // Thay đổi type dựa trên showPassword
                                                name="password"
                                                value={updateUser.password}
                                                onChange={handleUpdateChange}
                                                onBlur={handleBlur}
                                                className={`border w-full px-2 py-1 rounded ${
                                                    validationErrors.password ? 'border-red-500' : 'border-gray-400'
                                                }`}
                                                disabled
                                            />
                                            <span
                                                onClick={() => toggleShowPassword()} // Toggle trạng thái showPassword
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-gray-500 pointer-events-none"
                                            >
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                            </span>
                                        </div>
                                        {validationErrors.password && (
                                            <p className="text-red-500 text-sm">{validationErrors.password}</p>
                                        )}
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
                                                        : `http://localhost:9000/uploads/${updateUser.image}`
                                                }
                                                alt="No Image"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <input //  Nút để tải lên hình ảnh mới
                                            type="file"
                                            name="image"
                                            onChange={handleUpdateImageUpload}
                                            className="hidden" // Ẩn trường input, sẽ dùng nút ẩn để mở
                                            ref={imageInputRef} // Sử dụng ref để trigger khi cần
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label>Tên tài khoản</label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={updateUser.fullname}
                                        onChange={handleUpdateChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.fullname ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    />
                                    {validationErrors.fullname && (
                                        <p className="text-red-500 text-sm">{validationErrors.fullname}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Số điện thoại</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={updateUser.phoneNumber}
                                        onChange={handleUpdateChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    />
                                    {validationErrors.phoneNumber && (
                                        <p className="text-red-500 text-sm">{validationErrors.phoneNumber}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Ngày sinh</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={updateUser.birthDate}
                                        onChange={handleUpdateChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.birthDate ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    />
                                    {validationErrors.birthDate && (
                                        <p className="text-red-500 text-sm">{validationErrors.birthDate}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Địa chỉ</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={updateUser.address}
                                        onChange={handleUpdateChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.address ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    />
                                    {validationErrors.address && (
                                        <p className="text-red-500 text-sm">{validationErrors.address}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Giới tính</label>
                                    <select
                                        type="text"
                                        name="gender"
                                        value={updateUser.gender}
                                        onChange={handleUpdateChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.gender ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                        <option value="Other">Khác</option>
                                    </select>
                                    {validationErrors.gender && (
                                        <p className="text-red-500 text-sm">{validationErrors.gender}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Vai trò</label>
                                    <select
                                        type="text"
                                        name="roleId"
                                        value={updateUser.roleId}
                                        onChange={handleUpdateChange}
                                        onBlur={handleBlur}
                                        className={`border w-full px-2 py-1 rounded ${
                                            validationErrors.roleId ? 'border-red-500' : 'border-gray-400'
                                        }`}
                                    >
                                        <option value="">Chọn vai trò</option>
                                        <option value="R1">Admin</option>
                                        <option value="R2">Bác sĩ</option>
                                        <option value="R3">Người dùng</option>
                                    </select>
                                    {validationErrors.roleId && (
                                        <p className="text-red-500 text-sm">{validationErrors.roleId}</p>
                                    )}
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    <button
                                        onClick={handleUpdateUser}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Hộp thoại xác nhận */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa tài khoản</h3>
                            <p>Bạn có chắc chắn muốn xóa tài khoản này?</p>
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

export default UserManagement;
