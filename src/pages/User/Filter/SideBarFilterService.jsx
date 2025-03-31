import { useLocation, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { axiosClient } from '~/api/apiRequest';
import PriceRangeSlider from './PriceRangeSlider';
import { MdDeleteForever } from 'react-icons/md';
import Select from 'react-select';

function SideBarFilterServie() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [clinics, setClinics] = useState([]);
    const [serviveCategories, setServiceCategories] = useState([]);
    const [selectedClinicId, setSelectedClinicId] = useState(Number(searchParams.get('clinic')) || '');

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await axiosClient.get('/clinic/dropdown');
                if (response.status === 200) {
                    setClinics(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch clinics:', error);
                setClinics([]);
            }
        };
        const fetchServices = async () => {
            try {
                const response = await axiosClient.get('/service-category/dropdown');
                if (response.status === 200) {
                    setServiceCategories(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch clinics:', error);
                setServiceCategories([]);
            }
        };
        fetchClinics();
        fetchServices();
    }, []);

    const handleFilterChange = (key, value) => {
        const newParams = { ...Object.fromEntries(searchParams.entries()), [key]: value };
        if (value === '' || value === null || value === undefined) {
            delete newParams[key];
        }
        setSearchParams(newParams);
    };

    const handleDeleteAll = () => {
        const keyword = searchParams.get('keyword');
        const newParams = keyword ? { keyword } : {};
        setSearchParams(newParams);
    };
    return (
        <div className="w-full bg-[#f8f9fc] border border-[#E4E8EC] rounded-lg p-6 text-sm">
            <div className="h-max">
                <div className="pb-4 border-b mb-4">
                    <h3 className="text-[#1B3250] font-semibold border-l-[3px] border-[#2d87f3] uppercase leading-4 pl-2 mb-3">
                        Loại dịch vụ
                    </h3>
                    <Select
                        options={serviveCategories}
                        getOptionValue={(option) => option.serviceCategoryId}
                        getOptionLabel={(option) => option.name}
                        placeholder="Tất cả dịch vụ"
                        onChange={(option) =>
                            handleFilterChange('serviceCategory', option ? option.serviceCategoryId : '')
                        }
                        className="z-20"
                        isSearchable
                        isClearable
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                border: '0.8px solid #E4E8EC !important',
                                borderRadius: '4px !important',
                            }),
                        }}
                    />
                </div>

                <div className="pb-4 border-b mb-4">
                    <h4 className="text-[#1B3250] font-semibold border-l-[3px] border-[#2d87f3] uppercase leading-4 pl-2 mb-3">
                        Bệnh viện
                    </h4>
                    <Select
                        options={clinics}
                        getOptionValue={(option) => option.clinicId}
                        getOptionLabel={(option) => option.name}
                        placeholder="Tất cả bệnh viện"
                        onChange={(option) => handleFilterChange('clinic', option ? option.clinicId : '')}
                        className="z-10"
                        isSearchable
                        isClearable
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                border: '0.8px solid #E4E8EC !important',
                                borderRadius: '4px !important',
                            }),
                        }}
                    />
                </div>

                {/* <div className="pb-4 border-b mb-4">
                    <h3 className="font-semibold border-l-[3px] border-[#2d87f3] uppercase leading-4 pl-2 mb-3">
                        Mức giá
                    </h3>
                    {minBoundaryValue && maxBoundaryValue && ( 
                        <PriceRangeSlider
                            min={minBoundaryValue}
                            max={maxBoundaryValue}
                            onChange={handleRangeChange}
                            values={priceRange}
                        />
                     )}
                </div> */}
                <div
                    onClick={handleDeleteAll}
                    className="flex gap-2 items-center text-base font-semibold cursor-pointer text-[#2d87f3] hover:opacity-80"
                >
                    <MdDeleteForever />
                    Xóa tất cả
                </div>
            </div>
        </div>
    );
}

export default SideBarFilterServie;
