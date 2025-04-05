import React, { useState, useEffect } from 'react';
import { MapPin, Search, Clock, DollarSign } from 'lucide-react';
import axios from 'axios';
import { axiosInstance } from '~/api/apiRequest';
import { useNavigate, useLocation } from 'react-router-dom';
import { LiaStethoscopeSolid } from 'react-icons/lia';
import { BsCoin } from 'react-icons/bs';
import { CiHospital1 } from 'react-icons/ci';
import { GrLocation } from 'react-icons/gr';
import Pagination from '~/components/Pagination';

function AllSpecialty() {
    const [searchQuery, setSearchQuery] = useState('');
    const [specialties, setSpecialties] = useState([]);
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({ page: 1, limit: 6, totalPages: 1 });
    const [allSpecialties, setAllSpecialties] = useState([]); // Dữ liệu tất cả bác sĩ
    const { state } = useLocation();
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
    let getClinicId = '';
    let getSpecialtyId = '';

    if (state) {
        getClinicId = state.clinicId;
        getSpecialtyId = state.specialtyId;
    }

    useEffect(() => {
        const fetchFindDoctors = async () => {
            try {
                const response = await axiosInstance.get(
                    `/doctor?limit=${20}&clinicId=${getClinicId}&specialtyId=${getSpecialtyId}`,
                );

                if (response.status === 200) {
                    setAllSpecialties(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch specialties:', error.message);
            }
        };

        fetchFindDoctors();
    }, []);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await axiosInstance.get(
                    `/specialty?query=${searchQuery}&page=${pagination.page}&limit=${pagination.limit}`,
                );
                if (response.status === 200) {
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
                }
            } catch (error) {
                console.error('Failed to fetch specialties:', error.message);
            }
        };

        fetchSpecialties();
    }, [pagination, searchQuery]);

    // const filteredDoctors = specialties.filter((doctor) => doctor.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const IMAGE_URL = 'http://localhost:9000/uploads/';
    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const handleBooking = (specialtyId, specialtyName) => {
        // Điều hướng đến trang với ID bác sĩ
        navigate(`/bac-si?chuyenkhoa=${specialtyName}`, {
            state: { specialtyId: specialtyId },
        });
    };

    const positions = ['P0', 'P1', 'P2']; // Mảng các giá trị cần so sánh

    const getPositionLabel = (position) => {
        if (position === 'P0') {
            return 'Bác sĩ';
        } else if (positions.includes(position)) {
            return 'Chức danh khác'; // Thay thế bằng nhãn phù hợp cho các giá trị khác trong mảng
        } else {
            return position; // Giá trị mặc định nếu không khớp với bất kỳ giá trị nào trong mảng
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 mt-28">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div className="max-w-3xl">
                    <h1 className="text-5xl font-bold text-blue-600 mb-2">ĐẶT KHÁM THEO CHUYÊN KHOA</h1>
                    <p className="text-gray-600">
                        Khám bệnh đúng chuyên môn, đảm bảo hiệu quả, dễ dàng <br /> chọn lựa bác sĩ và cơ sở phù hợp
                    </p>
                </div>
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIG58rQfHK7x31pRrXaGNV3CxbAJduVLMBww&s"
                    alt="Medical Staff"
                    className="w-[300px] h-auto"
                />
            </div>

            {/* Search Section */}
            <div className="mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm chuyên khoa"
                        className="w-full pl-16 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Doctors List */}
            <div>
                {specialties.map((doctor) => (
                    <div
                        key={doctor._id}
                        className="flex justify-center items-center gap-4 p-6 mb-6 border rounded-lg hover:shadow-lg transition-shadow"
                    >
                        <img
                            src={`${IMAGE_URL}${doctor.image}`}
                            alt={doctor.name}
                            className="w-36 h-36 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between flex-col items-start">
                                <div className="flex gap-2">
                                    <h4 className="font-semibold text-blue-600 text-3xl">{doctor.name}</h4>
                                </div>

                                <div className="mt-2  gap-4 text-2xl">
                                    <div className="flex items-start gap-2">
                                        <span>{doctor.description}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="px-6 py-2 mr-8 font-semibold bg-blue-500 text-white rounded-3xl hover:bg-blue-600"
                            onClick={() => handleBooking(doctor.specialtyId, doctor.name)}
                        >
                            Đặt ngay
                        </button>
                    </div>
                ))}
            </div>
            {/* Điều hướng phân trang */}
            <div className="flex justify-end items-center space-x-4 mt-4">
                <select
                    className="border border-gray-400"
                    name="number"
                    value={pagination.limit}
                    onChange={handleLimitChange}
                >
                    <option value="6">6</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </select>
            </div>
            {/* <div className="flex justify-end items-center space-x-4 mt-4">
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
            </div> */}
            <div className="text-center">
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default AllSpecialty;
