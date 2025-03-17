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
    const [selectedClinicId, setSelectedClinicId] = useState(Number(searchParams.get('clinic')) || '');
    const [specialities, setSpecialities] = useState([]);

    const [genders, setGenders] = useState(searchParams.get('gender') ? searchParams.get('gender').split(',') : []);

    const [minBoundaryValue, setMinBoundaryValue] = useState(0);
    const [maxBoundaryValue, setMaxBoundaryValue] = useState(0);

    const [priceRange, setPriceRange] = useState({
        min: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
        max: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 0,
    });

    useEffect(() => {
        // Update searchParams when location.search changes
        setSearchParams(new URLSearchParams(location.search));
    }, [location.search, setSearchParams]);

    useEffect(() => {
        setSelectedClinicId(Number(searchParams.get('clinic')) || null);
        setGenders(searchParams.get('gender') ? searchParams.get('gender').split(',') : []);
        setPriceRange({
            min: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : Number(minBoundaryValue),
            max: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : Number(maxBoundaryValue),
        });
    }, [searchParams]);

    const handleFilterChange = (key, value) => {
        const newParams = { ...Object.fromEntries(searchParams.entries()), [key]: value };
        if (value === '' || value === null || value === undefined) {
            delete newParams[key];
        }
        setSearchParams(newParams);
    };

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
        fetchClinics();
    }, []);

    const handleFilterClinicChange = (e) => {
        const { name, value } = e.target;
        if (name === 'clinic') {
            setSelectedClinicId(value);
            handleFilterChange('clinic', value);
        }
    };

    useEffect(() => {
        const fetchSpecialitiesByClinic = async () => {
            try {
                let response;
                if (selectedClinicId !== '' && selectedClinicId !== null) {
                    response = await axiosClient.get(`/specialty/clinicId/${selectedClinicId}`);
                } else {
                    response = await axiosClient.get('/specialty/dropdown');
                }
                console.log('response', response.data);

                if (response.status === 200) {
                    setSpecialities(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch specialities:', error);
                setSpecialities([]);
            }
        };
        fetchSpecialitiesByClinic();
    }, [selectedClinicId]);

    //Gender
    const handleGenderChange = (e) => {
        const { value, checked } = e.target;
        setGenders((prevGenders) => {
            const newGenders = checked ? [...prevGenders, value] : prevGenders.filter((gender) => gender !== value);
            handleFilterChange('gender', newGenders.join(','));
            return newGenders;
        });
    };

    //Price
    useEffect(() => {
        fetchPriceRange();
    }, []);
    const fetchPriceRange = async () => {
        try {
            const response = await axiosClient.get('/doctor/price');

            if (response.status === 200) {
                setMinBoundaryValue(Number(response.data.minPrice));
                setMaxBoundaryValue(Number(response.data.maxPrice));
                setPriceRange({
                    min: searchParams.get('minPrice')
                        ? Number(searchParams.get('minPrice'))
                        : Number(response.data.minPrice),
                    max: searchParams.get('maxPrice')
                        ? Number(searchParams.get('maxPrice'))
                        : Number(response.data.maxPrice),
                });
            }
        } catch (error) {
            console.error('Failed to fetch price range:', error);
        }
    };

    const handleRangeChange = (values) => {
        const { min, max } = values;
        setSearchParams((prevParams) => {
            const newParams = { ...Object.fromEntries(prevParams.entries()) };
            if (min !== undefined && min !== null) {
                newParams['minPrice'] = min;
            } else {
                delete newParams['minPrice'];
            }
            if (max !== undefined && max !== null) {
                newParams['maxPrice'] = max;
            } else {
                delete newParams['maxPrice'];
            }
            return newParams;
        });
    };

    const handleDeleteAll = () => {
        const keyword = searchParams.get('keyword');
        const newParams = keyword ? { keyword } : {};
        setSearchParams(newParams);
    };
    return (
        <div className="w-full bg-[#f8f9fc] border border-[#E4E8EC] rounded-lg p-6 text-sm">
            <div className="h-max">
                {/* <div className="pb-4 border-b mb-4">
            <h4 className="text-[#1B3250] font-semibold border-l-[3px] border-[#2d87f3] uppercase leading-4 pl-2 mb-3">
                Tỉnh/Thành phố
            </h4>
            <select
                name="province"
                id="province"
                // onChange={handleProvinceChange}
                className="w-full h-10 border border-[#E4E8EC] rounded-lg p-2"
            >
                <option value="">Tất cả</option>
                <option value="">Tất cả</option>
                <option value="">A</option>
            </select>
        </div> */}
                <div className="pb-4 border-b mb-4">
                    <h3 className="text-[#1B3250] font-semibold border-l-[3px] border-[#2d87f3] uppercase leading-4 pl-2 mb-3">
                        Loại dịch vụ
                    </h3>
                    <Select
                        options={[
                            { value: 'suc-khoe', label: 'Sức khỏe' },
                            { value: 'xet-nghiem', label: 'Xét nghiệm' },
                            { value: 'tiem-chung', label: 'Tiêm chủng' },
                        ]}
                        
                        placeholder="Tất cả dịch vụ"
                        // onChange={handleChange}
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
                        // onChange={handleChange}
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

                <div className="pb-4 border-b mb-4">
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
                </div>
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
