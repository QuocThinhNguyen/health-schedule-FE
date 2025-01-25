import { useEffect, useState } from 'react';
import { LiaStethoscopeSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '~/api/apiRequest';

function SearchDoctor(data) {
    const navigate = useNavigate();

    const doctor = data.data;

    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
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
        console.log('Đã click vào nút Đặt khám ngay');

        // Điều hướng đến trang với ID bác sĩ
        navigate(`/bac-si/get?id=${doctorId}`);
    };

    return (
        <div
        onClick={() => {
            console.log('doctor:', doctor);
            handleBooking(doctor.doctorId.userId);
        }}
            className="px-6 py-2 hover:shadow-xl flex items-center gap-4 hover:bg-[rgba(227,242,255,0.3)] cursor-pointer border-b-2 border-transparent hover:border-b-2 hover:border-blue-400"
        >
            <div>
                <img
                    src={`${IMAGE_URL}${doctor.doctorId.image}`}
                    alt={doctor.doctorId.fullname}
                    className="w-12 h-12 object-cover rounded-full"
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="font-bold">
                    {
                        academicRanksAndDegreess.find(
                            (academicRanksAndDegrees) => academicRanksAndDegrees.keyMap === doctor.position,
                        )?.valueVi
                    }
                    <span> </span>
                    {doctor.doctorId.fullname}
                </div>
                <div className="flex items-center justify-start text-xs gap-2">
                    <LiaStethoscopeSolid className="inline-block text-base" />
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">{doctor.specialtyId.name}</span>
                </div>
            </div>
        </div>
    );
}

export default SearchDoctor;
