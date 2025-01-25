import { axiosClient } from '~/api/apiRequest';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DoctorItem from './DoctorItem';
function ListFilterDoctor({ pagination, setPagination }) {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams(location.search);
    const keyword = searchParams.get('keyword') || '';
    const clinicId = searchParams.get('clinic') || '';
    const specialtyId = searchParams.get('speciality') || '';
    const sort = searchParams.get('sort') || 'noi-bat';
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
        const filterDoctorAPI = async () => {
            try {
                console.log('keyword:', keyword);
                console.log('clinicId:', clinicId);
                console.log('specialtyId:', specialtyId);
                console.log('sort:', sort);
                const queryParams = {};
                if (keyword) queryParams.query = keyword;
                if (clinicId) queryParams.clinicId = clinicId;
                if (specialtyId) queryParams.specialtyId = specialtyId;
                queryParams.sort = sort;
                queryParams.page = pagination.page;
                queryParams.limit = pagination.limit;

                const response = await axiosClient.get(`/doctor/?${new URLSearchParams(queryParams).toString()}`);
                if (response.status === 200) {
                    setDoctors(response.data);
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
    }, [keyword, clinicId, specialtyId, sort, pagination.page]);

    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="font-bold text-base">{totalDoctors} Bác sĩ</p>
                <select
                    name="sort"
                    id="sort"
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-max h-10 border border-[#E4E8EC] rounded-lg p-2 text-ellipsis overflow-hidden whitespace-nowrap"
                >
                    <option value="noi-bat">Nổi bật</option>
                    <option value="danh-gia-cao-den-thap">Đánh giá cao đến thấp</option>
                    <option value="danh-gia-thap-den-cao">Đánh giá thấp đến cao</option>
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
