import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { useSearchParams } from 'react-router-dom';
import { axiosClient } from '~/api/apiRequest';
import DualRangeSlider from './DualRangeSlider';

function Filter({ filters, setFilters }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [selectedClinicId, setSelectedClinicId] = useState('');
    const [specialities, setSpecialities] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistricts, setSelectedDistricts] = useState([]);

    const [minBoundaryValue, setMinBoundaryValue] = useState(0);
    const [maxBoundaryValue, setMaxBoundaryValue] = useState(0);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);

    useEffect(() => {
        fetchPriceRange();
    }, []);
    const fetchPriceRange = async () => {
        try {
            const response = await axiosClient.get('/doctor/price');
            if (response.status === 200) {
                setMinBoundaryValue(response.data.minPrice);
                setMaxBoundaryValue(response.data.maxPrice);
            }
        } catch (error) {
            console.error('Failed to fetch price range:', error);
        }
    };

    useEffect(() => {
        console.log('2');

        if (minBoundaryValue !== undefined) {
            setMinValue(minBoundaryValue);
        }
        if (maxBoundaryValue !== undefined) {
            setMaxValue(maxBoundaryValue);
        }
    }, [minBoundaryValue, maxBoundaryValue]);

    useEffect(() => {
        const initialFilters = Object.fromEntries(searchParams.entries());

        // Phân tách giá trị `district`
        if (initialFilters.district) {
            const districtsArray = initialFilters.district.split(','); // Tách chuỗi thành mảng
            setSelectedDistricts(districtsArray);
        }

        setFilters(initialFilters);
    }, [searchParams]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);

        // Cập nhật URL
        const params = new URLSearchParams(newFilters);
        setSearchParams(params);
    };

    useEffect(() => {
        const fetchApiProvince = async () => {
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/?depth=2');
                if (response.status === 200) {
                    const provinceList = response.data.map((item) => {
                        return item.name;
                    });
                    setProvinces(provinceList);
                } else {
                    console.error('Unexpected response structure:', response);
                }
            } catch (error) {
                console.error('Failed to fetch provinces:', error);
            }
        };

        fetchApiProvince();
    }, []);

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await axiosClient.get('/clinic/dropdown');
                if (response.status === 200) {
                    console.log('Clinics:', response.data);

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
        }
        handleFilterChange(e);
    };

    useEffect(() => {
        const fetchSpecialitiesByClinic = async () => {
            try {
                const response = await axiosClient.get(`/specialty/clinicId/${selectedClinicId}`);
                if (response.status === 200) {
                    console.log('Specialities:', response.data);
                    setSpecialities(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch specialities:', error);
                setSpecialities([]);
            }
        };
        if (selectedClinicId) {
            fetchSpecialitiesByClinic();
        }
    }, [selectedClinicId]);

    const handleProvinceChange = async (e) => {
        const selectedProvince = e.target.value;
        setSelectedProvince(selectedProvince);

        // Cập nhật URL, xóa district
        const newFilters = { ...filters };
        if (selectedProvince) {
            newFilters.province = selectedProvince; // Cập nhật province nếu có giá trị
        } else {
            delete newFilters.province; // Xóa province khỏi filters nếu giá trị rỗng
        }
        setFilters(newFilters);
        setSearchParams(new URLSearchParams(newFilters));

        if (selectedProvince) {
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/?depth=2`);
                if (response.status === 200) {
                    const selectedProvinceData = response.data.find((item) => item.name === selectedProvince);

                    if (selectedProvinceData) {
                        const districtList = selectedProvinceData.districts.map((district) => district.name);
                        setDistricts(districtList);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch districts:', error);
            }
        } else {
            setDistricts([]);
        }

        //Xoa danh sach cac huyen cu
        setSelectedDistricts([]);
    };

    const handleDistrictChange = (e) => {
        const { value, checked } = e.target;

        // Cập nhật danh sách quận trong trạng thái
        const updatedDistricts = checked
            ? [...selectedDistricts, value]
            : selectedDistricts.filter((district) => district !== value);

        setSelectedDistricts(updatedDistricts);

        // Cập nhật URL nếu có huyện được chọn
        const newFilters = { ...filters };
        if (updatedDistricts.length > 0) {
            newFilters.district = updatedDistricts.join(','); // Thêm danh sách huyện
        } else {
            delete newFilters.district; // Xóa district khỏi URL nếu không có huyện nào
        }

        setFilters(newFilters);
        setSearchParams(new URLSearchParams(newFilters));
    };

    const handleRangeChange = (newMin, newMax) => {
        setMinValue(newMin);
        setMaxValue(newMax);
        const newFilters = {
            ...filters,
            minPrice: newMin,
            maxPrice: newMax,
        };
        setFilters(newFilters);

        // Cập nhật URL
        setSearchParams(new URLSearchParams(newFilters));
    };

    return (
        <div className="bg-white rounded-lg">
            <div>
                <h2 className="flex gap-4 items-center justify-start text-3xl font-bold px-6 py-6">
                    <IoFilter /> Bộ lọc tìm kiếm
                </h2>
            </div>
            <div className="overflow-y-auto pb-4 h-[610px]">
                <div className="border-t border-gray-300 p-4">
                    <h3 className="font-semibold">Tỉnh/Thành phố</h3>
                    <select
                        name="province"
                        id="province"
                        onChange={handleProvinceChange}
                        className="w-full border border-gray-300 rounded-lg my-2 p-2"
                    >
                        <option value="">Tất cả</option>
                        {provinces.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    {districts.length > 0 && (
                        <div className="border-t border-gray-300 p-4">
                            <h3 className="font-semibold">Quận/Huyện</h3>
                            {districts.map((district, index) => (
                                <div key={index} className="flex items-center flex-wrap gap-2">
                                    <input
                                        type="checkbox"
                                        id={district}
                                        name="district"
                                        value={district}
                                        checked={selectedDistricts.includes(district)}
                                        onChange={handleDistrictChange}
                                    />
                                    <label className="text-2xl" htmlFor={district}>
                                        {district}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="border-t border-gray-300 p-4">
                    <h3 className="font-semibold">Bệnh viện</h3>
                    <select
                        name="clinic"
                        onChange={handleFilterClinicChange}
                        className="w-full border border-gray-300 rounded-lg my-2 p-2 text-ellipsis overflow-hidden whitespace-nowrap"
                    >
                        <option value="">Tất cả</option>
                        {clinics &&
                            clinics.map((clinic) => (
                                <option key={clinic.clinicId} value={clinic.clinicId}>
                                    {clinic.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="border-t border-gray-300 p-4">
                    <h3 className="font-semibold">Chuyên khoa</h3>
                    <select
                        name="speciality"
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-lg my-2 p-2"
                    >
                        <option value="">Tất cả</option>
                        {specialities &&
                            specialities.map((speciality) => (
                                <option key={speciality.specialtyId} value={speciality.specialtyId}>
                                    {speciality.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="border-t border-gray-300 p-4">
                    <h3 className="font-semibold">Mức giá</h3>
                    {minBoundaryValue > 0 && maxBoundaryValue > 0 && minValue > 0 && maxValue > 0 ? (
                        <DualRangeSlider
                            minBoundaryValue={minBoundaryValue}
                            maxBoundaryValue={maxBoundaryValue}
                            minValue={minValue}
                            maxValue={maxValue}
                            step={1000}
                            onChange={handleRangeChange}
                        />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                {/* <div className="flex gap-4 items-center text-xl mt-4">
                    <RiDeleteBin5Line />
                    Xóa tất cả
                </div> */}
            </div>
        </div>
    );
}

export default Filter;
