import { useState, useEffect, useContext } from 'react';
import { axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import Pagination from '~/components/Pagination';
import { Search, Phone, Mail, MapPin, Eye } from 'lucide-react';

function HealthReport() {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const { user } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 1000, totalPages: 1 });
    const [searchQuery, setSearchQuery] = useState('');
    const [isDetail, setIsDetail] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Số lượng mục trên mỗi trang

    useEffect(() => {
        // Đặt ngày mặc định là ngày hiện tại khi component được tải
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, []);

    useEffect(() => {
        // Hàm gọi API để lấy dữ liệu lịch hẹn
        const fetchAppointments = async () => {
            try {
                const response = await axiosInstance.get(
                    `/booking/doctor/${user.userId}?search=${searchQuery}&page=${pagination.page}&limit=${pagination.limit}`,
                );
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
        appointments
            .filter((appointments) => appointments.status.keyMap === 'S4')
            .reduce((acc, curr) => {
                const patientId = curr.patientRecordId.fullname;

                // Nếu chưa có hoặc có nhưng ngày khám cũ hơn, thì cập nhật
                if (!acc[patientId] || new Date(curr.appointmentDate) > new Date(acc[patientId].appointmentDate)) {
                    acc[patientId] = curr;
                }

                return acc;
            }, {}),
    );

    // Tính toán các mục cần hiển thị dựa trên trang hiện tại và số lượng mục trên mỗi trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = latestAppointments.slice(indexOfFirstItem, indexOfLastItem);

    const [history, setHistory] = useState([]);
    const getDetail = async (bookingId, patientRecordId) => {
        try {
            const response = await axiosInstance.get(`/booking/${bookingId}`);
            if (response.status === 200) {
                setIsDetail(response.data);
            } else {
                toast.error('Không thể xem.');
            }

            const response1 = await axiosInstance.get(`/bookingImage/${bookingId}`);

            if (response1.status === 200) {
                const images = response1.data.map((item) => item.name);
                if (images.length === 0) {
                    // toast.info('Không có ảnh đính kèm.');
                    // return;
                }
                setSelectedImages(images); // Lưu danh sách ảnh từ API
            } else {
                toast.error('Không thể tải ảnh.');
            }

            const response2 = await axiosInstance.get(
                `/booking/patient?doctorId=${user.userId}&patientId=${patientRecordId}`,
            );
            if (response2.status === 200) {
                setHistory(response2.data);
            } else {
                toast.error('Không thể tải lịch sử khám bệnh.');
            }

            setSelectedPatient(bookingId);
        } catch (error) {
            console.error('Error fetching detail:', error);
            toast.error('Có lỗi xảy ra khi xem thông tin chi tiết.');
        }
    };

    const handleViewImage = (image) => {
        window.open(image, '_blank');
    };

    const [activeTab, setActiveTab] = useState('info');

    const tabs = [
        { id: 'info', label: 'Thông tin cá nhân' },
        { id: 'history', label: 'Lịch sử khám bệnh' },
    ];

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
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="text-gray-500 border-b">
                                    <th className="pb-3 font-medium w-min whitespace-nowrap">Tên bệnh nhân</th>
                                    <th className="pb-3 font-medium w-20 ">Tuổi</th>
                                    <th className="pb-3 font-medium w-24 ">Giới tính</th>
                                    <th className="pb-3 font-medium min-w-[150px] ">Lần khám gần nhất</th>
                                    <th className="pb-3 font-medium min-w-[200px] ">Tình trạng</th>
                                    <th className="pb-3 font-medium w-32 ">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((patient) => (
                                    <tr key={patient.id} className="border-b last:border-b-0">
                                        <td className="py-4 text-center whitespace-nowrap ">
                                            {patient.patientRecordId.fullname}
                                        </td>
                                        <td className="py-4 text-center">
                                            {calculateAge(patient.patientRecordId.birthDate)}
                                        </td>
                                        <td className="py-4 text-center">
                                            {patient.patientRecordId.gender === 'Male'
                                                ? 'Nam'
                                                : patient.patientRecordId.gender === 'Female'
                                                ? 'Nữ'
                                                : 'Khác'}
                                        </td>
                                        <td className="py-4 text-center">
                                            {new Date(patient.appointmentDate).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="py-4 text-center truncate max-w-[250px]">{patient.reason}</td>
                                        <td className="py-4 text-center">
                                            <button
                                                onClick={() =>
                                                    getDetail(
                                                        patient.bookingId,
                                                        patient.patientRecordId.patientRecordId,
                                                    )
                                                }
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="text-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(latestAppointments.length / itemsPerPage)}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>

            {/* Patient Detail Modal */}
            {selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg py-4 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-2 border-b border-gray-300  pb-2 px-4">
                            <h2 className="text-xl font-semibold">Chi tiết bệnh nhân</h2>
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

                        <div className="flex justify-center">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`text-base text-[#737373] font-semibold px-4 relative mb-4 flex justify-center items-center w-full ${
                                        activeTab === tab.id ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-[-2px] left-1/2 transform -translate-x-1/2 right-0 h-0.5 bg-blue-500 mt-10" />
                                    )}
                                </button>
                            ))}
                        </div>
                        {activeTab === 'info' && (
                            <div className="grid grid-cols-2 gap-6 px-4">
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
                                    <div className="flex items-center gap-8 mt-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-gray-400" />
                                            <span>{isDetail.patientRecordId.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <span>{isDetail.patientRecordId.phoneNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <span>{isDetail.patientRecordId.email}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Danh sách ảnh */}
                                <div>
                                    <div className="text-gray-500"> Ảnh đính kèm</div>
                                    <div className="flex flex-wrap gap-4 mt-2 overflow-auto h-full">
                                        {selectedImages.length > 0 ? (
                                            selectedImages.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group w-20 h-20 border rounded-lg overflow-hidden"
                                                >
                                                    {/* Hiển thị ảnh và video*/}
                                                    {image.endsWith('.png') ||
                                                    image.endsWith('.jpg') ||
                                                    image.endsWith('.jpeg') ? (
                                                        <img
                                                            src={image}
                                                            alt={`Ảnh ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <video
                                                            src={image}
                                                            className="w-full h-full object-cover"
                                                            controls
                                                        />
                                                    )}

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
                                </div>
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="max-h-[450px] overflow-y-auto px-4">
                                {history
                                    .filter((appointment) => appointment.status.keyMap === 'S4')
                                    .map((appointment, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg shadow-md bg-[#f8f9fc] p-4 space-y-4 mb-4"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <img src="/calendar.png" alt="calendar" className="w-5 h-5" />
                                                        <span className="font-medium">
                                                            {new Date(appointment.appointmentDate).toLocaleDateString(
                                                                'vi-VN',
                                                            )}
                                                        </span>
                                                        <img src="/clock.png" alt="clock" className="w-5 h-5 ml-4" />
                                                        <span className="font-medium">
                                                            {appointment.timeType.valueVi}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p>
                                                            <span className="text-gray-600">Tình trạng:</span>{' '}
                                                            <span className="font-medium">{appointment.reason}</span>
                                                        </p>
                                                        {/* {appointment.prescription && (
                                                        <p>
                                                            <span className="text-gray-600">Đơn thuốc:</span>{' '}
                                                            {appointment.prescription}
                                                        </p>
                                                    )}
                                                    {appointment.notes && (
                                                        <p>
                                                            <span className="text-gray-600">Ghi chú:</span>{' '}
                                                            {appointment.notes}
                                                        </p>
                                                    )} */}
                                                    </div>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-blue-500 rounded-full text-xs">
                                                    {appointment.status.valueVi}
                                                </span>
                                            </div>
                                            {/* Danh sách ảnh */}
                                            <div className="mt-6 text-gray-500"> Ảnh đính kèm</div>
                                            <div className="flex flex-wrap gap-4 mt-2 overflow-auto h-full">
                                                {appointment.mediaNames.length > 0 ? (
                                                    appointment.mediaNames.map((image, index) => (
                                                        <div
                                                            key={index}
                                                            className="relative group w-20 h-20 border rounded-lg overflow-hidden"
                                                        >
                                                            {/* Hiển thị ảnh và video*/}
                                                            {image.endsWith('.png') ||
                                                            image.endsWith('.jpg') ||
                                                            image.endsWith('.jpeg') ? (
                                                                <img
                                                                    src={image}
                                                                    alt={`Ảnh ${index + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <video
                                                                    src={image}
                                                                    className="w-full h-full object-cover"
                                                                    controls
                                                                />
                                                            )}

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
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}

export default HealthReport;
