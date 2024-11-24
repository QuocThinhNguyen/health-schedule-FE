import React, { useState, useEffect } from 'react';
import { MapPin, Search, Clock, DollarSign } from 'lucide-react';
import axios from 'axios';
import { axiosInstance } from '~/api/apiRequest';
import { useNavigate, useLocation } from 'react-router-dom';
import { LiaStethoscopeSolid } from 'react-icons/lia';
import { BsCoin } from 'react-icons/bs';
import { CiHospital1 } from 'react-icons/ci';
import { GrLocation } from 'react-icons/gr';

function AllDoctor() {
    const [searchQuery, setSearchQuery] = useState('');
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({ page: 1, limit: 6, totalPages: 1 });
    const [allDoctors, setAllDoctors] = useState([]); // Dữ liệu tất cả bác sĩ
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
        if (state.clinicId) {
            getClinicId = state.clinicId;
        }
        if (state.specialtyId) {
            getSpecialtyId = state.specialtyId;
        }
    }

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axiosInstance.get(
                    `/doctor?query=${searchQuery}&page=${pagination.page}&limit=${pagination.limit}&clinicId=${getClinicId}&specialtyId=${getSpecialtyId}`,
                );
                console.log('page', pagination.page);
                console.log(pagination.limit);
                console.log('response:', response);
                if (response.errCode === 0) {
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
                }
            } catch (error) {
                console.error('Failed to fetch doctors:', error.message);
            }
        };

        fetchDoctors();
    }, [pagination, searchQuery]);

    console.log('alldoctors:', allDoctors);
    console.log('doctors:', doctors);

    // const filteredDoctors = doctors.filter(
    //     (doctor) =>
    //         doctor.doctorId.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         doctor.specialtyId.name.toLowerCase().includes(searchQuery.toLowerCase()),
    // );

    const IMAGE_URL = 'http://localhost:9000/uploads/';
    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const handleBooking = (doctorId) => {
        // Điều hướng đến trang với ID bác sĩ
        navigate(`/bac-si/get?id=${doctorId}`);
    };

    const positions = ['P0', 'P1', 'P2', 'P3']; // Mảng các giá trị cần so sánh

    const getPositionLabel = (position) => {
        if (position === 'P0') {
            return 'Bác sĩ';
        } else if (position === 'P1') {
            return 'Trưởng khoa';
        } else if (position === 'P2') {
            return 'Giáo sư';
        } else if (position === 'P3') {
            return 'Phó giáo sư';
        } else {
            return ''; // Giá trị mặc định nếu không khớp với bất kỳ giá trị nào trong mảng
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 mt-28">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div className="max-w-3xl">
                    <h1 className="text-5xl font-bold text-blue-600 mb-2">ĐẶT KHÁM THEO BÁC SĨ</h1>
                    <p className="text-gray-600">Chủ động chọn bác sĩ mà bạn tin tưởng, an tâm khám bệnh</p>
                </div>
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzDnzPZqAqXqhY9oTVXKd6taVLF4c1lpAzcw&s"
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
                        placeholder="Tìm kiếm bác sĩ"
                        className="w-full pl-16 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Doctors List */}
            <div>
                {doctors.map((doctor) => (
                    <div
                        key={doctor._id}
                        className="flex justify-center items-center gap-4 p-6 mb-6 border rounded-lg hover:shadow-lg transition-shadow"
                    >
                        <img
                            src={`${IMAGE_URL}${doctor.doctorId.image}`}
                            alt={doctor.doctorId.fullname}
                            className="w-36 h-36 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between flex-col items-start">
                                <div className="flex gap-2">
                                    <h4 className="font-bold text-blue-600 text-3xl">
                                        {getPositionLabel(doctor.position)}
                                    </h4>
                                    <h4 className="font-semibold text-blue-600 text-3xl">{doctor.doctorId.fullname}</h4>
                                </div>

                                <div className="mt-2  gap-4 text-2xl">
                                    <div className="flex items-start gap-2">
                                        <LiaStethoscopeSolid className="mt-1" />
                                        {doctor.specialtyId.name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BsCoin className="mt-1" />
                                        <span>{formatCurrency(doctor.price)}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CiHospital1 className="mt-1" />
                                        <span>{doctor.clinicId.name}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <GrLocation className="mt-1" />
                                        <span>{doctor.clinicId.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="px-6 py-2 mr-8 font-semibold bg-blue-500 text-white rounded-3xl hover:bg-blue-600"
                            onClick={() => handleBooking(doctor.doctorId.userId)}
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

export default AllDoctor;
