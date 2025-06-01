import ServiceItem from './ServiceItem';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { axiosClient } from '~/api/apiRequest';
function ListFilterService({ pagination, setPagination }) {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [services, setServices] = useState([]);
    const [totalServices, setTotalServices] = useState(0);
    useEffect(() => {
        // Update searchParams when location.search changes
        setSearchParams(new URLSearchParams(location.search));
    }, [location.search, setSearchParams]);

    const handleFilterChange = (key, value) => {
        const newParams = { ...Object.fromEntries(searchParams.entries()), [key]: value };
        if (value === '' || value === null || value === undefined) {
            delete newParams[key];
        }
        setSearchParams(newParams);
    };

    const queryParams = useMemo(() => {
        return {
            keyword: searchParams.get('keyword') || '',
            clinicId: Number(searchParams.get('clinic')) || '',
            serviceCategoryId: Number(searchParams.get('serviceCategory')) || '',
            minPrice: Number(searchParams.get('minPrice')) || '',
            maxPrice: Number(searchParams.get('maxPrice')) || '',
            sort: searchParams.get('sort') || '',
            pageNo: pagination.page,
            pageSize: pagination.limit,
        };
    }, [searchParams, pagination]);

    useEffect(() => {
        const filterServicesAPI = async () => {
            try {
                const response = await axiosClient.get(`/service/?${new URLSearchParams(queryParams).toString()}`);
                console.log("response", response);
                
                if (response.status === 200) {
                    setServices(response.data);
                    console.log('response', response);

                    setTotalServices(response.totalElement);
                    if (response.totalPage === 0) {
                        response.totalPage = 1;
                    }
                    if (pagination.totalPages !== response.totalPage) {
                        const newPagination = {
                            ...pagination,
                            page: 1,
                            totalPages: response.totalPage,
                        };
                        setPagination(newPagination);
                    }
                } else {
                    console.error('No users are found:', response.message);
                    setServices([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setServices([]);
            }
        };
        filterServicesAPI();

        const timeoutId = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [searchParams, pagination]);

    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="font-bold text-base text-black">{totalServices} Dịch vụ</p>
                <Select
                    options={[
                        { value: 'gia-cao-den-thap', label: 'Giá cao nhất' },
                        { value: 'gia-thap-den-cao', label: 'Giá thấp nhất' },
                    ]}
                    placeholder="--------Sắp xếp-------"
                    onChange={(option) => handleFilterChange('sort', option.value)}
                    className="z-10 min-w-[219.2px] "
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            border: '0.8px solid #E4E8EC !important',
                            borderRadius: '4px !important',
                        }),
                        indicatorSeparator: () => ({
                            display: 'none', //
                        }),
                    }}
                />
            </div>
            <div className="mt-6">
                {services.map((service, index) => (
                    <ServiceItem key={index} data={service} />
                ))}
            </div>
        </div>
    );
}

export default ListFilterService;
