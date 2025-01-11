import React, { useEffect, useState } from 'react';
import Doctor from './Doctor';
import Pagination from '~/components/Pagination';
import { axiosClient } from '~/api/apiRequest';

function Content({ filters, setFilters}) {
    // const [searchParams, setSearchParams] = useSearchParams();
    const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });
    const [doctors, setDoctors] = useState([]);
    const [totalDoctors, setTotalDoctors] = useState(0);

    const handleSortChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        // setSearchParams(new URLSearchParams(newFilters));
    };

    const handlePageChange = async (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
        }
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                console.log('Filters:', filters);

                const queryParams = {};
                if (filters.clinic) queryParams.clinicId = filters.clinic;
                if (filters.speciality) queryParams.specialtyId = filters.speciality;
                if (filters.minPrice) queryParams.minPrice = filters.minPrice;
                if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;
                if (filters.sort) {
                    queryParams.sort = filters.sort;
                } else {
                    queryParams.sort = 'danh-gia-cao-den-thap';
                }
                queryParams.page = pagination.page;
                queryParams.limit = pagination.limit;

                const queryString = new URLSearchParams(queryParams).toString();

                const response = await axiosClient.get(`/doctor/?${queryString}`);
                console.log('Response:', response);

                if (response.status === 200) {
                    setTotalDoctors(response.totalDoctors);
                    const formattedData = response.data.map((item) => ({
                        id: item.doctorInforId,
                        position: item.position,
                        fullname: item.doctorId.fullname,
                        specialtyName: item.specialtyId.name,
                        clinicName: item.clinicId.name,
                        price: item.price,
                        image: item.doctorId.image,
                        userId: item.doctorId.userId,
                        rating: item.avgRating,
                        bookingCount: item.bookingCount,
                    }));
                    setDoctors(formattedData);

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
                console.log('Doctors:', response.data);
            } catch (error) {
                console.error('Failed to fetch doctors:', error.message);
            }
        };
        fetchDoctors();
    }, [filters, pagination]);

    return (
        <div>
            <div className="flex justify-between items-center my-2">
                <p className="text-xl text-black">
                    Tìm thấy <span className="font-bold">{totalDoctors}</span> Bác sĩ
                </p>
                <div className="flex gap-4 items-center">
                    <p className="text-xl">Sắp xếp theo:</p>
                    <select
                        name="sort"
                        id="sort"
                        className="border border-gray-300 rounded-lg my-2 p-2"
                        onChange={handleSortChange}
                    >
                        <option value="danh-gia-cao-den-thap">Đánh giá cao đến thấp</option>
                        <option value="danh-gia-thap-den-cao">Đánh giá thấp đến cao</option>
                        <option value="gia-cao-den-thap">Giá cao nhất</option>
                        <option value="gia-thap-den-cao">Giá thấp nhất</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-wrap gap-4">
                {doctors.map((doctor) => (
                    <Doctor key={doctor.doctorInforId || doctor.id} data={doctor} />
                ))}
            </div>
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

export default Content;
