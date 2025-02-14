import React, { useState, useEffect, useContext } from 'react';
import { FaCamera } from 'react-icons/fa';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import Pagination from '~/components/Pagination';
import { Search, Phone, Mail, MapPin, Eye } from 'lucide-react';
function HealthReport() {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const { user } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [searchQuery, setSearchQuery] = useState('');
    const [isDetail, setIsDetail] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const IMAGE_URL = 'http://localhost:9000/uploads/';

    console.log('CHECK DETAIL', isDetail);
    useEffect(() => {
        // Đặt ngày mặc định là ngày hiện tại khi component được tải
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, []);

    console.log(
        'Check',
        `/booking/doctor/${user.userId}?search=${searchQuery}&page=${pagination.page}&limit=${pagination.limit}`,
    );
    useEffect(() => {
        // Hàm gọi API để lấy dữ liệu lịch hẹn
        const fetchAppointments = async () => {
            try {
                const response = await axiosInstance.get(
                    `/booking/doctor/${user.userId}?search=${searchQuery}&page=${pagination.page}&limit=${pagination.limit}`,
                );
                console.log('ResponseBooking:', response);

                if (response.status === 200) {
                    setAppointments(response.data);
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
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setAppointments([]);
            }
        };

        // Gọi API mỗi khi selectedDate thay đổi

        fetchAppointments();
    }, [pagination, searchQuery]);

    const handlePageChange = async (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
        }
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDifference = today.getMonth() - birthDateObj.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }

        return age;
    };

    const latestAppointments = Object.values(
        appointments.reduce((acc, curr) => {
            const patientId = curr.patientRecordId.fullname;

            // Nếu chưa có hoặc có nhưng ngày khám cũ hơn, thì cập nhật
            if (!acc[patientId] || new Date(curr.appointmentDate) > new Date(acc[patientId].appointmentDate)) {
                acc[patientId] = curr;
            }

            return acc;
        }, {}),
    );

    console.log('CHECKK', latestAppointments);

    const getDetail = async (bookingId) => {
        try {
            const response = await axiosInstance.get(`/booking/${bookingId}`);
            if (response.status === 200) {
                setIsDetail(response.data);
            } else {
                toast.error('Không thể xem.');
            }

            const response1 = await axiosInstance.get(`/bookingImage/${bookingId}`);
            // console.log('ResponseImage:', response);

            if (response1.status === 200) {
                const images = response1.data.map((item) => item.imageName);
                if (images.length === 0) {
                    // toast.info('Không có ảnh đính kèm.');
                    // return;
                }
                setSelectedImages(images); // Lưu danh sách ảnh từ API
            } else {
                toast.error('Không thể tải ảnh.');
            }

            setSelectedPatient(bookingId);
        } catch (error) {
            console.error('Error fetching detail:', error);
            toast.error('Có lỗi xảy ra khi xem thông tin chi tiết.');
        }
    };

    const handleViewImage = (image) => {
        const imageUrl = `${IMAGE_URL}${image}`;
        window.open(imageUrl, '_blank');
        console.log('OPEN');
    };
    return (
        <main className="flex-1">
            {/* Patient Records Content */}
            <div className="">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    {/* Search and Add Patient */}
                    <div className="flex justify-between mb-6">
                        <div className="relative w-64">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bệnh nhân..."
                                className="w-full pl-10 pr-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Patient List */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-3 font-medium">Tên bệnh nhân</th>
                                    <th className="pb-3 font-medium">Tuổi</th>
                                    <th className="pb-3 font-medium">Giới tính</th>
                                    <th className="pb-3 font-medium">Lần khám gần nhất</th>
                                    <th className="pb-3 font-medium">Tình trạng</th>
                                    <th className="pb-3 font-medium">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestAppointments.map((patient) => (
                                    <tr key={patient.id} className="border-b last:border-b-0">
                                        <td className="py-4 font-medium">{patient.patientRecordId.fullname}</td>
                                        <td className="py-4">{calculateAge(patient.patientRecordId.birthDate)}</td>
                                        <td className="py-4">
                                            {patient.patientRecordId.gender === 'Male'
                                                ? 'Nam'
                                                : patient.patientRecordId.gender === 'Female'
                                                ? 'Nữ'
                                                : 'Khác'}
                                        </td>
                                        <td className="py-4">
                                            {new Date(patient.appointmentDate).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="py-4">{patient.reason}</td>
                                        <td className="py-4">
                                            <button
                                                onClick={() => getDetail(patient.bookingId)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Xem chi tiết
                                            </button>
                                            {/* <button className="text-gray-400 hover:text-gray-600 mr-3">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <Trash2 className="w-5 h-5" />
                                            </button> */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {/* <div className="text-center">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div> */}
                </div>
            </div>

            {/* Patient Detail Modal */}
            {selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Chi tiết bệnh nhân</h2>
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500 mb-1">Họ và tên</p>
                                <p className="font-medium">{isDetail.patientRecordId.fullname}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Tuổi</p>
                                <p className="font-medium">{calculateAge(isDetail.patientRecordId.birthDate)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Giới tính</p>
                                <p className="font-medium">
                                    {isDetail.patientRecordId.gender === 'Male'
                                        ? 'Nam'
                                        : isDetail.patientRecordId.gender === 'Female'
                                        ? 'Nữ'
                                        : 'Khác'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Lần khám gần nhất</p>
                                <p className="font-medium">
                                    {new Date(isDetail.appointmentDate).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500 mb-1">Tình trạng</p>
                                <p className="font-medium">{isDetail.reason}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500 mb-1">Thông tin liên hệ</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <span>{isDetail.patientRecordId.phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <span>{isDetail.patientRecordId.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <span>{isDetail.patientRecordId.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Danh sách ảnh */}
                        <div className="mt-6 text-gray-500"> Ảnh đính kèm</div>
                        <div className="flex flex-wrap gap-4 mt-2 overflow-auto h-full">
                            {selectedImages.length > 0 ? (
                                selectedImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative group w-20 h-20 border rounded-lg overflow-hidden"
                                    >
                                        {/* Hiển thị ảnh */}
                                        <img
                                            src={`${IMAGE_URL}${image}`}
                                            alt={`Ảnh ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Eye Icon (Zoom) */}
                                        <div
                                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            onClick={() => handleViewImage(image)}
                                        >
                                            <Eye className="text-white w-8 h-8" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Không có ảnh</p>
                            )}
                        </div>
                        {/* <div className="mt-8 flex justify-end gap-4">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                Chỉnh sửa thông tin
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                Xem lịch sử khám bệnh
                            </button>
                        </div> */}
                    </div>
                </div>
            )}
        </main>
    );
}

export default HealthReport;
