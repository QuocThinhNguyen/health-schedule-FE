import { axiosInstance } from '~/api/apiRequest';
import ClinicItem from './ClinicItem';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
function ListFilterClinic({pagination, setPagination }) {
    const location = useLocation();
    const [searchParams] = new useSearchParams(location.search);
    const keyword = searchParams.get('keyword') || '';

    const [clinics, setClinics] = useState([]);

    useEffect(() => {
        const filterClinicAPI = async () => {
            try {
                const response = await axiosInstance.get(
                    `/clinic/?query=${keyword}&page=${pagination.page}&limit=${pagination.limit}`,
                );

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
    }, [keyword, pagination.page]);

    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="font-bold text-base">{clinics.length} Bệnh viện</p>
                <select className="w-max h-10 border border-[#E4E8EC] rounded-lg p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    <option value="1">Nổi bật</option>
                    <option value="2">Từ A đến Z Từ A đến Z</option>
                    <option value="3">Từ A đến Z</option>
                    <option value="4">Từ A đến Z</option>
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
