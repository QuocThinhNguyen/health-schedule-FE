import { useEffect, useState } from 'react';
import { BsCoin } from 'react-icons/bs';
import { CiHospital1 } from 'react-icons/ci';
import { FaUser } from 'react-icons/fa';
import { IoIosStar } from 'react-icons/io';
import { LiaStethoscopeSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '~/api/apiRequest';

function Doctor(data) {
    const navigate = useNavigate();
    const doctor = data.data;
    console.log('doctor', doctor);

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
    }, [data]);

    const handleBooking = (doctorId) => {
        console.log('Đã click vào nút Đặt khám ngay');

        // Điều hướng đến trang với ID bác sĩ
        navigate(`/bac-si/get?id=${doctorId}`);
    };

    return (
        <>
            <div className="w-[236px] bg-white rounded-lg shadow-md cursor-pointer hover:shadow-2xl transition duration-300">
                <div className="p-6">
                    <div className="flex flex-col items-center">
                        <div className="flex justify-center items-center h-[120px] w-[120px] rounded-full overflow-hidden">
                            <img
                                src={`http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/${doctor.image}`}
                                alt={doctor.name}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        <div className="flex flex-col justify-between gap-4 w-full text-[#003553]">
                            <div>
                                <h3 className="text-3xl font-normal text-left">
                                    {
                                        academicRanksAndDegreess.find(
                                            (academicRanksAndDegrees) =>
                                                academicRanksAndDegrees.keyMap === doctor.position,
                                        )?.valueVi
                                    }
                                </h3>
                                <h3 className="text-4xl font-semibold text-left truncate">{doctor.fullname}</h3>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="flex items-center justify-center gap-1">
                                    <IoIosStar className="text-yellow-500" />
                                    {doctor.rating}
                                </p>
                                <p className="flex items-center justify-center gap-1">
                                    Lượt khám: {doctor.bookingCount}
                                    <FaUser className="text-yellow-500" />
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 leading-[20px]">
                                <div className="flex items-start gap-2">
                                    <LiaStethoscopeSolid className="mt-1" />
                                    {doctor.specialtyName}
                                </div>
                                <div className="flex items-start gap-2">
                                    <BsCoin className="mt-1" />
                                    {doctor.price}
                                </div>
                                <div className="flex items-start gap-2 h-[37.5px]">
                                    <CiHospital1 className="mt-1" />
                                    {doctor.clinicName}
                                </div>
                            </div>
                            <div
                                className="w-full text-center bg-[#00B5F1] hover:bg-white border hover:border-[#00B5F1] hover:text-[#00B5F1] text-white font-bold py-3 px-4 rounded-xl"
                                onClick={() => handleBooking(doctor.userId)}
                            >
                                Đặt khám ngay
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Doctor;
