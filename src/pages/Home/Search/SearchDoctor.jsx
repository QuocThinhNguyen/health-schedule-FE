import { useEffect, useState } from 'react';
import { LiaStethoscopeSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '~/api/apiRequest';

function SearchDoctor(data) {
    const navigate = useNavigate();
    const doctor = data.data;
    const [academicRanksAndDegreess, setAcademicRanksAndDegreess] = useState([]);

    useEffect(() => {
        const getDropdownAcademicRanksAndDegrees = async () => {
            try {
                const response = await axiosClient.get(`/doctor/academic-ranks-and-degrees`);

                if (response.status === 200) {
                    setAcademicRanksAndDegreess(response.data);
                } else {
                    console.error('No academic ranks and degrees are found:', response.message);
                    setAcademicRanksAndDegreess([]);
                }
            } catch (error) {
                console.error('Error fetching academic ranks and degrees:', error);
                setAcademicRanksAndDegreess([]);
            }
        };
        getDropdownAcademicRanksAndDegrees();
    }, []);

    const handleBooking = (doctorId) => {
        // Điều hướng đến trang với ID bác sĩ
        navigate(`/bac-si/get?id=${doctorId}`);
    };

    return (
        <div
            onClick={() => {
                handleBooking(doctor.doctorId);
            }}
            className="px-6 py-2 hover:shadow-xl flex items-center gap-4 hover:bg-[rgba(227,242,255,0.3)] cursor-pointer border-b-2 border-transparent hover:border-b-2 hover:border-blue-400"
        >
            <div>
                <img src={doctor.image} alt={doctor.fullname} className="w-12 h-12 object-cover rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="font-bold">
                    {
                        academicRanksAndDegreess.find(
                            (academicRanksAndDegrees) => academicRanksAndDegrees.keyMap === doctor.position,
                        )?.valueVi
                    }
                    <span> </span>
                    {doctor.fullname}
                </div>
                <div className="flex items-center justify-start text-xs gap-2">
                    <LiaStethoscopeSolid className="inline-block text-base" />
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">{doctor.specialtyName}</span>
                </div>
            </div>
        </div>
    );
}

export default SearchDoctor;
