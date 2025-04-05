import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '~/context/UserContext';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import CustomTinyMCE from '~/components/CustomTinyMCE';
import { Edit2, Eye, Trash2, Search, XCircle } from 'lucide-react';
import { CiEdit } from 'react-icons/ci';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';
import Table from '~/components/Table';
import AdvancePagination from '~/components/AdvancePagination';
import Title from '../components/Tittle';

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
    const [academicRanksAndDegreess, setAcademicRanksAndDegreess] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await getAvataAccount(user.userId);
            await getDropdownClinics();
            await getDropdownSpecialties();
            await getDropdownUsers();
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

    const getDropdownUsers = async () => {
        try {
            const response = await axiosInstance.get(`/user/dropdown`);

            if (response.status === 200) {
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

            if (response.status === 200) {
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

            if (response.status === 200) {
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

    const updateDoctorAPI = async (updateDoctor) => {
        try {
            const response = await axiosInstance.put(`/doctor/${updateDoctor.doctorId}`, updateDoctor);

            if (response.status === 200) {
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
            if (response.status === 200) {
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

            if (response.status === 200) {
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
        { key: 'positionName', label: 'Học hàm, học vị' },
        { key: 'clinicId.name', label: 'Bệnh viện' },
        { key: 'specialtyId.name', label: 'Chuyên khoa' },
        { key: 'doctorId.address', label: 'Địa chỉ' },
        { key: 'doctorId.phoneNumber', label: 'Số điện thoại' },
    ];

    const actions = [{ icon: <CiEdit />, onClick: (clinic) => getDetailDoctorAPI(clinic.clinicId) }];

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
                    <Table columns={columns} data={processedDoctors} pagination={pagination} actions={actions} />
                    <AdvancePagination
                        pagination={pagination}
                        totalElements="10"
                        onPageChange={handlePageChange}
                        selects={[10, 15, 20]}
                        onSlectChange={handleLimitChange}
                    />
                </div>

                {isUpdateModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white w-1/2 p-6 rounded shadow-lg relative max-h-[600px] overflow-y-scroll">
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
                                        {academicRanksAndDegreess.map((academicRanksAndDegrees, index) => (
                                            <option
                                                key={academicRanksAndDegrees.keyMap}
                                                value={academicRanksAndDegrees.keyMap}
                                            >
                                                {academicRanksAndDegrees.valueVi}
                                            </option>
                                        ))}
                                        {/* <option value="P0">Bác sĩ</option>
                                        <option value="P1">Trưởng khoa</option>
                                        <option value="P2">Giáo sư</option>
                                        <option value="P3">Phó giáo sư</option> */}
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

                                    <CustomTinyMCE
                                        name="description"
                                        value={updateDoctor.description}
                                        onChange={handleUpdateChange}
                                        onBlur={handleBlur}
                                    />
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
        </>
    );
};

export default DoctorManagement;
{
    /* <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 font-bold   uppercase tracking-wider">STT</th>
                                <th className="px-4 py-2 font-bold   uppercase tracking-wider">Hình ảnh</th>
                                <th className="px-4 py-2 font-bold   uppercase tracking-wider">Tên</th>
                                <th className="px-4 py-2 font-bold   uppercase tracking-wider">Học hàm, học vị</th>
                                <th className="px-4 py-2 font-bold   uppercase tracking-wider">Bệnh viện</th>
                                <th className="px-4 py-2 font-bold   uppercase tracking-wider">Chuyên khoa</th>
                                <th className="px-4 py-2 font-bold   uppercase tracking-wider">Địa chỉ</th>
                                <th className="px-4 py-2 font-bold   uppercase tracking-wider">SĐT</th>
                                <th className="px-4 py-2 font-bold   uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mergedDoctors.map((doctor, index) => (
                                <tr key={doctor.doctorInforId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                    <td className="px-4 py-2   text-gray-900 text-center">
                                        {index + 1 + pagination.limit * (pagination.page - 1)}
                                    </td>
                                    <td className="px-4 py-2   text-gray-900">
                                        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto">
                                            <img
                                                src={`http://localhost:9000/uploads/${doctor.doctorId.image}`}
                                                alt={doctor.image}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-center  text-gray-900">{doctor.doctorId.fullname}</td>
                                    <td className="px-4 py-2  text-center text-gray-900">
                                        {academicRanksAndDegreess.find(
                                            (academicRanksAndDegrees) =>
                                                academicRanksAndDegrees.keyMap === doctor.position,
                                        )?.valueVi || 'Chưa xác định'}
                                    </td>
                                    <td className="px-4 py-2 text-center  text-gray-900">
                                 
                                        {doctor.clinicId?.name || 'Chưa xác định'}
                                    </td>
                                    <td className="px-4 py-2 text-center  text-gray-900">
                                      
                                        {doctor.specialtyId?.name || 'Chưa xác định'}
                                    </td>
                                    <td className="px-4 py-2  text-center text-gray-900">{doctor.doctorId.address}</td>
                                    <td className="px-4 py-2 text-center  text-gray-900">
                                        {doctor.doctorId.phoneNumber}
                                    </td>
                                    <td className="px-4 py-2   text-gray-900">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                className="text-blue-500 text-2xl hover:text-blue-700"
                                                onClick={() => getDetailDoctorAPI(doctor)}
                                            >
                                                <Edit2 className="w-7 h-7" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> */
}
