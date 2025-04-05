import React, { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faGauge, faClock, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '~/context/UserContext';
import { axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';
import { Edit2, Eye, Trash2, Search, XCircle } from 'lucide-react';
import defaultImage from '../../../assets/img/addImage.png';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import Title from '../components/Tittle';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';

const SpecialtyManagement = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const { logout, user } = useContext(UserContext);
    const [selectedFile, setSelectedFile] = useState({});
    const [previewImage, setPreviewImage] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [specialties, setSpecialties] = useState([]);
    const [avata, setAvata] = useState('');

    useEffect(() => {
        getAvataAccount(user.userId);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await filterSpecialtyAPI();
        };
        fetchData();
    }, [pagination, filterValue]);

    const [specialty, setSpecialty] = useState({
        specialtyId: '',
        name: '',
        description: '',
        image: null,
    });

    const [updateSpecialty, setUpdateSpecialty] = useState({
        specialtyId: '',
        name: '',
        description: '',
        image: '',
    });

    const [deleteSpecialty, setDeleteSpecialty] = useState({
        specialtyId: '',
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

    const createSpecialtyAPI = async (formData) => {
        try {
            const response = await axiosInstance.post('/specialty', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                // Xử lý khi tạo thành công
                await filterSpecialtyAPI();
            } else {
                console.error('Failed to create specialty:', response.message);
            }
        } catch (error) {
            console.error('Error creating specialty:', error);
        }
    };
    const updateSpecialtyAPI = async (formData) => {
        try {
            const response = await axiosInstance.put(`/specialty/${updateSpecialty.specialtyId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                // Xử lý khi thành công
                await filterSpecialtyAPI();
            } else {
                console.error('Failed to update specialty:', response.message);
            }
        } catch (error) {
            console.error('Error update specialty:', error);
        }
    };
    const getDetailSpecialtyAPI = async (specialtyId) => {
        setIsUpdateModalOpen(true);
        setUpdateSpecialty({ ...updateSpecialty, specialtyId: specialtyId });
        try {
            const response = await axiosInstance.get(`/specialty/${specialtyId}`);

            if (response.status === 200) {
                // Xử lý khi thành công
                setUpdateSpecialty(response.data);
            } else {
                console.error('Failed to get detail specialty:', response.message);
            }
        } catch (error) {
            console.error('Error get detail specialty:', error);
        }
    };
    const deleteSpecialtyAPI = async (specialtyId) => {
        try {
            const response = await axiosInstance.delete(`/specialty/${specialtyId}`);
            if (response.status === 200) {
                // Xử lý khi thành công
                await filterSpecialtyAPI();
            } else {
                console.error('Failed to delete specialty:', response.message);
            }
        } catch (error) {
            console.error('Error delete specialty:', error);
        }
    };

    const filterSpecialtyAPI = async () => {
        try {
            const response = await axiosInstance.get(
                `/specialty/?query=${filterValue}&page=${pagination.page}&limit=${pagination.limit}`,
            );

            if (response.status === 200) {
                console.log('Response:', response);

                setSpecialties(response.data);
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
                console.error('No specialties are found:', response.message);
                setSpecialties([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setSpecialties([]);
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

    const handleDeleteClick = (specialtyId) => {
        setShowConfirm(true);
        setDeleteSpecialty({ specialtyId: specialtyId });
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteSpecialty({ specialtyId: '' });
    };

    const handleConfirmDelete = () => {
        deleteSpecialtyAPI(deleteSpecialty.specialtyId); // Gọi hàm xóa bệnh viện từ props hoặc API
        setShowConfirm(false); // Ẩn hộp thoại sau khi xóa
        toast.success('Xóa chuyên khoa thành công!');
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
        setSpecialty({
            name: '',
            description: '',
            image: null,
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
        setSpecialty({ ...specialty, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateSpecialty({ ...updateSpecialty, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const imageInputRef = useRef(null); // Khai báo ref cho input file

    const handleImageUpload = (e) => {
        //url tạm thời
        const file = e.target.files[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setSpecialty({ ...specialty, image: objectURL }); // Lưu blob URL
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

    const handleAddSpecialty = () => {
        const errors = {};
        if (!specialty.name) errors.name = 'Tên chuyên khoa không được để trống.';
        if (!specialty.image) errors.image = 'Hình ảnh không được để trống.';
        if (!specialty.description) errors.description = 'Mô tả không được để trống.';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); // Cập nhật lỗi
            return; // Ngăn không thêm nếu có lỗi
        }
        const formData = new FormData();
        // Thêm các trường từ specialty vào FormData
        Object.keys(specialty).forEach((key) => {
            formData.append(key, specialty[key]);
        });

        // Thêm file (nếu có)
        if (selectedFile && selectedFile.name) {
            formData.append('image', selectedFile);
        }

        createSpecialtyAPI(formData);
        toast.success('Thêm chuyên khoa thành công!');
        setValidationErrors(errors);
        setSelectedFile(null);
        handleCloseModal();
    };

    const handleUpdateSpecialty = () => {
        const errors = {};
        if (!updateSpecialty.name) errors.name = 'Tên chuyên khoa không được để trống.';
        if (!updateSpecialty.description) errors.description = 'Mô tả không được để trống.';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); // Cập nhật lỗi
            return; // Ngăn không thêm nếu có lỗi
        }
        const formData = new FormData();
        // Thêm các trường từ specialty vào FormData
        Object.keys(updateSpecialty).forEach((key) => {
            formData.append(key, updateSpecialty[key]);
        });
        // Thêm file (nếu có)
        if (selectedFile && selectedFile.name) {
            formData.append('image', selectedFile);
        }
        updateSpecialtyAPI(formData);
        toast.success('Cập nhật chuyên khoa thành công!');
        setValidationErrors(errors);
        setSelectedFile(null);
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

    const columns = [
        { key: 'name', label: 'Tên chuyên khoa' },
        {
            key: 'image',
            label: 'Hình ảnh',
            type: 'image',
        },
    ];

    const actions = [
        { icon: <CiEdit />, onClick: (specialty) => getDetailSpecialtyAPI(specialty.specialtyId) },
        { icon: <MdDeleteOutline />, onClick: (specialty) => handleDeleteClick(specialty.specialtyId) },
    ];

    return (
        <>
            {/* Nội dung chính */}
            <div className="px-3 mb-6">
                <Title>Quản lý chuyên khoa</Title>
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
                    <Table columns={columns} data={specialties} pagination={pagination} actions={actions} />
                    <AdvancePagination
                        pagination={pagination}
                        totalElements="10"
                        onPageChange={handlePageChange}
                        selects={[10, 15, 20]}
                        onSlectChange={handleLimitChange}
                    />
                </div>

                {/* Modal Thêm chuyên khoa*/}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white w-1/2 p-6 rounded shadow-lg relative">
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            >
                                ✖
                            </button>
                            <h2 className="text-xl font-bold mb-4">Thêm chuyên khoa</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Cột bên trái: Tên chuyên khoa và Email */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label>
                                            Tên chuyên khoa<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={specialty.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`border w-full px-2 py-1 rounded ${
                                                validationErrors.name ? 'border-red-500' : 'border-gray-400'
                                            }`}
                                        />
                                        {validationErrors.name && (
                                            <p className="text-red-500 text-sm">{validationErrors.name}</p>
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
                                                src={specialty.image || defaultImage}
                                                alt="Current Specialty"
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
                                </div>
                                <div className="col-span-2">
                                    <label>
                                        Mô tả<span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={specialty.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        rows="6"
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
                                        onClick={handleAddSpecialty}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal Cập Nhật chuyên khoa */}
                {isUpdateModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white w-1/2 p-6 rounded shadow-lg relative">
                            <button
                                onClick={handleCloseUpdateModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            >
                                ✖
                            </button>
                            <h2 className="text-xl font-bold mb-4">Cập nhật chuyên khoa</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Cột bên trái: Tên chuyên khoa và Email */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label>Tên chuyên khoa</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={updateSpecialty.name}
                                            onChange={handleUpdateChange}
                                            onBlur={handleBlur}
                                            className={`border w-full px-2 py-1 rounded ${
                                                validationErrors.name ? 'border-red-500' : 'border-gray-400'
                                            }`}
                                        />
                                        {validationErrors.name && (
                                            <p className="text-red-500 text-sm">{validationErrors.name}</p>
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
                                                        : `http://localhost:9000/uploads/${updateSpecialty.image}`
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
                                <div className="col-span-2">
                                    <label>Mô tả</label>
                                    <textarea
                                        name="description"
                                        value={updateSpecialty.description}
                                        onChange={handleUpdateChange}
                                        onBlur={handleBlur}
                                        rows="6"
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
                                        onClick={handleUpdateSpecialty}
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
                            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa chuyên khoa</h3>
                            <p>Bạn có chắc chắn muốn xóa chuyên khoa này?</p>
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

export default SpecialtyManagement;
