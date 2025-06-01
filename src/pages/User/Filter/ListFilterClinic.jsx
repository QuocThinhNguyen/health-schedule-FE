import { axiosInstance } from '~/api/apiRequest';
import ClinicItem from './ClinicItem';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
function ListFilterClinic({ pagination, setPagination }) {
    // const location = useLocation();
    // const [searchParams] = new useSearchParams(location.search);
    // const keyword = searchParams.get('keyword') || '';
    const [searchParams, setSearchParams] = useSearchParams();

    // const [searchParams] = useSearchParams();

    const queryParams = useMemo(
        () => ({
            provinceCode: searchParams.get('provinceCode') || '',
            sort: searchParams.get('sort') || '',
            page: pagination.page,
            limit: pagination.limit,
        }),
        [searchParams, pagination],
    );

    const [clinics, setClinics] = useState([]);

    useEffect(() => {
        const filterClinicAPI = async () => {
            try {
                const response = await axiosInstance.get(`/clinic/?${new URLSearchParams(queryParams)}`);

                console.log('Check response clinic', response);
                if (response.status === 200) {
                    setClinics(response.data);
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
                    console.error('No clinics are found:', response.message);
                    setClinics([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setClinics([]);
            }
        };
        filterClinicAPI();

        const timeoutId = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [searchParams, pagination]);

    const handleFilterChange = (key, value) => {
        const newParams = { ...Object.fromEntries(searchParams.entries()), [key]: value };
        if (!value) {
            delete newParams[key];
        }
        setSearchParams(newParams);
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="font-bold text-base text-black">{clinics.length} Bệnh viện</p>
                <select
                    className="w-max h-10 border border-[#E4E8EC] rounded-lg p-2 text-ellipsis overflow-hidden whitespace-nowrap"
                    value={searchParams.get('sort') || ''}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                    <option value="">Nổi bật</option>
                    <option value="desc">Đánh giá từ cao đến thấp</option>
                    <option value="asc">Đánh giá từ thấp đến cao</option>
                </select>
            </div>
            <div className="mt-6">
                {clinics.map((clinic) => (
                    <ClinicItem key={clinic.clinicId} data={clinic} />
                ))}
            </div>
        </div>
    );
}

export default ListFilterClinic;
