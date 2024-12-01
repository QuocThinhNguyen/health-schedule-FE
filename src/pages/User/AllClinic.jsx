import React, { useState, useEffect } from 'react';
import { MapPin, Search, Clock, DollarSign } from 'lucide-react';
import axios from 'axios';
import { axiosInstance } from '~/api/apiRequest';
import { useNavigate, useLocation } from 'react-router-dom';
import { LiaStethoscopeSolid } from 'react-icons/lia';
import { BsCoin } from 'react-icons/bs';
import { CiHospital1 } from 'react-icons/ci';
import { GrLocation } from 'react-icons/gr';

function AllClinic() {
    const [searchQuery, setSearchQuery] = useState('');
    const [clinics, setClinics] = useState([]);
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({ page: 1, limit: 6, totalPages: 1 });
    const [allClinics, setAllClinics] = useState([]); // Dữ liệu tất cả bác sĩ
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

    console.log('STATEEEE', state);

    let getClinicId = '';
    let getSpecialtyId = '';

    if (state) {
        getClinicId = state.clinicId;
        getSpecialtyId = state.specialtyId;
    }

    useEffect(() => {
        const fetchFindClinics = async () => {
            try {
                const response = await axiosInstance.get(
                    `/doctor?limit=${20}&clinicId=${getClinicId}&specialtyId=${getSpecialtyId}`,
                );

                if (response.status === 200) {
                    setAllClinics(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch clinics:', error.message);
            }
        };

        fetchFindClinics();
    }, []);

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await axiosInstance.get(
                    `/clinic?query=${searchQuery}&page=${pagination.page}&limit=${pagination.limit}`,
                );
                console.log('page', pagination.page);
                console.log(pagination.limit);
                console.log('response:', response);
                if (response.status === 200) {
                    setClinics(response.data);
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
                console.error('Failed to fetch clinics:', error.message);
            }
        };

        fetchClinics();
    }, [pagination, searchQuery]);

    console.log('alldoctors:', allClinics);
    console.log('clinics:', clinics);

    // const filteredDoctors = clinics.filter(
    //     (doctor) => doctor.name.toLowerCase().includes(searchQuery.toLowerCase()),
    //     // doctor.specialtyId.name.toLowerCase().includes(searchQuery.toLowerCase()),
    // );

    const IMAGE_URL = 'http://localhost:9000/uploads/';
    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const handleBooking = (clinicId, clinicName) => {
        navigate(`/benh-vien?name=${clinicName}`, {
            state: { clinicId: clinicId },
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
                    <h1 className="text-5xl font-bold text-blue-600 mb-2">ĐẶT KHÁM TẠI CƠ SỞ</h1>
                    <p className="text-gray-600">Đặt khám nhanh chóng, tiết kiệm thời gian, an toàn tiện lợi</p>
                </div>
                <img
                    src="data:image/jpeg;base64,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"
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
                        placeholder="Tìm kiếm bệnh viện"
                        className="w-full pl-16 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Doctors List */}
            <div>
                {clinics.map((doctor) => (
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
                                    <h4 className="font-semibold text-blue-600 text-4xl">{doctor.name}</h4>
                                </div>

                                <div className="mt-2  gap-4 text-2xl">
                                    <div className="flex items-start gap-2">
                                        <GrLocation className="mt-1" />
                                        <span>{doctor.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="px-6 py-2 mr-8 font-semibold bg-blue-500 text-white rounded-3xl hover:bg-blue-600"
                            onClick={() => handleBooking(doctor.clinicId, doctor.name)}
                        >
                            Xem chi tiết
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
        </div>
    );
}

export default AllClinic;
