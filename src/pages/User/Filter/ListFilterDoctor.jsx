import { axiosClient } from '~/api/apiRequest';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import DoctorItem from './DoctorItem';
function ListFilterDoctor({ pagination, setPagination }) {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [doctors, setDoctors] = useState([]);
    const [totalDoctors, setTotalDoctors] = useState(0);

    const handleFilterChange = (key, value) => {
        const newParams = { ...Object.fromEntries(searchParams.entries()), [key]: value };
        if (!value) {
            delete newParams[key];
        }
        setSearchParams(newParams);
    };

    useEffect(() => {
        // Update searchParams when location.search changes
        setSearchParams(new URLSearchParams(location.search));
    }, [location.search, setSearchParams]);

    const queryParams = useMemo(() => {
        return {
            keyword: searchParams.get('keyword') || '',
            clinicId: Number(searchParams.get('clinic')) || '',
            specialtyId: Number(searchParams.get('speciality')) || '',
            gender: searchParams.get('gender') || '',
            minPrice: Number(searchParams.get('minPrice')) || '',
            maxPrice: Number(searchParams.get('maxPrice')) || '',
            sort: searchParams.get('sort') || 'noi-bat',
            page: pagination.page,
            limit: pagination.limit,
        };
    }, [searchParams, pagination]);

    useEffect(() => {
        const filterDoctorAPI = async () => {
            try {
                const response = await axiosClient.get(`/doctor/search?${new URLSearchParams(queryParams).toString()}`);
                if (response.status === 200) {
                    setDoctors(response.data);
                    console.log('response', response);
                    
                    setTotalDoctors(response.totalDoctors);
                    if (response.totalPages === 0) {
                        response.totalPages = 1;
                    }
                    if (pagination.totalPages !== response.totalPages) {
                        const newPagination = {
                            ...pagination,
                            page: 1,
                            totalPages: response.totalPages,
                        };
                        setPagination(newPagination);
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
        filterDoctorAPI();

        const timeoutId = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [searchParams, pagination]);

    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="font-bold text-base text-black">{totalDoctors} Bác sĩ</p>
                <select
                    name="sort"
                    id="sort"
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-max h-10 border border-[#E4E8EC] rounded-lg p-2 text-ellipsis overflow-hidden whitespace-nowrap"
                >
                    <option value="noi-bat">Nổi bật</option>
                    <option value="danh-gia-cao-den-thap">Đánh giá từ cao đến thấp</option>
                    <option value="danh-gia-thap-den-cao">Đánh giá từ thấp đến cao</option>
                    <option value="gia-cao-den-thap">Giá cao nhất</option>
                    <option value="gia-thap-den-cao">Giá thấp nhất</option>
                </select>
            </div>
            <div className="mt-6">
                {doctors.map((doctor, index) => (
                    <DoctorItem key={index} data={doctor} />
                ))}
            </div>
        </div>
    );
}

export default ListFilterDoctor;
