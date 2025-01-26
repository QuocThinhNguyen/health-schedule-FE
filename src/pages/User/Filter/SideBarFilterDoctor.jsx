import { IoFilter } from 'react-icons/io5';
import { RiDeleteBin5Line } from 'react-icons/ri';
import DualRangeSlider from './DualRangeSlider';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { axiosClient } from '~/api/apiRequest';
function SideBarFilterDoctor() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [clinics, setClinics] = useState([]);
    const [selectedClinicId, setSelectedClinicId] = useState('');
    const [specialities, setSpecialities] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    const handleFilterChange = (key, value) => {
        const newParams = { ...Object.fromEntries(searchParams.entries()), [key]: value };
        if (!value) {
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
                    <h4 className="text-[#1B3250] font-semibold border-l-[3px] border-[#2d87f3] uppercase leading-4 pl-2 mb-3">
                        Bệnh viện
                    </h4>
                    <select
                        name="clinic"
                        value={searchParams.get('clinic') || ''}
                        onChange={handleFilterClinicChange}
                        className="w-full h-10 border border-[#E4E8EC] rounded-lg p-2 text-ellipsis overflow-hidden whitespace-nowrap"
                    >
                        <option value="">Tất cả bệnh viện</option>
                        {clinics.map((clinic) => (
                            <option key={clinic.clinicId} value={clinic.clinicId}>
                                {clinic.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="pb-4 border-b mb-4">
                    <h3 className="text-[#1B3250] font-semibold border-l-[3px] border-[#2d87f3] uppercase leading-4 pl-2 mb-3">
                        Chuyên khoa
                    </h3>
                    <select
                        name="speciality"
                        value={searchParams.get('speciality') || ''}
                        onChange={(e) => handleFilterChange('speciality', e.target.value)}
                        className="w-full h-10 border border-[#E4E8EC] rounded-lg p-2"
                    >
                        <option value="">Tất cả chuyên khoa</option>
                        {specialities.map((speciality) => (
                            <option key={speciality.specialtyId} value={speciality.specialtyId}>
                                {speciality.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="pb-4 border-b mb-4">
                    <h3 className="text-[#1B3250] font-semibold border-l-[3px] border-[#2d87f3] uppercase leading-4 pl-2 mb-3">
                        Giới tính
                    </h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p>Nam</p>
                            <input  className="w-5 h-5" type="checkbox" name="Nam" value="Nam" />
                        </div>
                        <div className="flex items-center justify-between">
                            <p>Nữ</p>
                            <input className="w-5 h-5" type="checkbox" name="Nữ" value="Nữ" />
                        </div>
                    </div>
                </div>
                <div className="pb-4 border-b mb-4">
                    <h3 className="font-semibold border-l-[3px] border-[#2d87f3] uppercase leading-4 pl-2 mb-3">
                        Mức giá
                    </h3>
                    <DualRangeSlider
                    // minBoundaryValue={minBoundaryValue}
                    // maxBoundaryValue={maxBoundaryValue}
                    // minValue={minValue}
                    // maxValue={maxValue}
                    // step={1000}
                    // onChange={handleRangeChange}
                    />
                    {/* {minBoundaryValue > 0 && maxBoundaryValue > 0 && minValue > 0 && maxValue > 0 ? (
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
    )} */}
                </div>
                <div className="flex gap-2 items-center text-base font-semibold cursor-pointer">
                    <RiDeleteBin5Line />
                    Xóa tất cả
                </div>
            </div>
        </div>
    );
}

export default SideBarFilterDoctor;
