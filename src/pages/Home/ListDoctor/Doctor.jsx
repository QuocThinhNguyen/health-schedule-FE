import { useEffect, useState } from 'react';
import { BsCoin } from 'react-icons/bs';
import { CiHospital1 } from 'react-icons/ci';
import { FaUser } from 'react-icons/fa';

import { LiaStethoscopeSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '~/api/apiRequest';
import { GoStarFill } from 'react-icons/go';

function Doctor(data) {
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
    const navigate = useNavigate();

    const handleBooking = (doctorId) => {
        // Điều hướng đến trang với ID bác sĩ
        navigate(`/bac-si/get?id=${doctorId}`);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="w-1/4 px-2 mt-4 group">
            <div className="bg-white rounded-lg shadow cursor-pointer border group-hover:border group-hover:border-[rgb(44,116,223)] group-hover:shadow-2xl">
                <div className="pt-4 pb-2 gap-3 flex flex-col items-center">
                    <div className="flex justify-center items-center h-28 w-28 mt-4 rounded-full overflow-hidden border border-customGray">
                        <img src={doctor.image} alt={doctor.fullname} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex justify-between items-center bg-[#EBF9FD] w-full px-2 py-2 text-sm">
                        <p className="flex items-center justify-center gap-1 font-semibold ">
                            Đánh giá:
                            <span className="text-customYellow">{doctor.rating}</span>
                            <GoStarFill className="text-customYellow" />
                        </p>
                        <p className="flex items-center justify-center gap-1 font-semibold">
                            Lượt khám:
                            <span className="text-customYellow">{doctor.bookingCount}</span>
                            <FaUser className="text-customYellow" />
                        </p>
                    </div>
                    <div className="px-2 w-full">
                        <div className="flex flex-col justify-between gap-2 w-full  bg-[#2d87f3] bg-opacity-5 group-hover:bg-opacity-20 px-2 py-2 rounded-lg">
                            <div className="flex justify-start gap-1">
                                <h3 className="text-lg font-bold">
                                    {
                                        academicRanksAndDegreess.find(
                                            (academicRanksAndDegrees) =>
                                                academicRanksAndDegrees.keyMap === doctor.position,
                                        )?.valueVi
                                    }
                                </h3>
                                <h3 className="text-lg text-[#262626] font-bold truncate">{doctor.fullname}</h3>
                            </div>

                            <div className="flex flex-col leading-[20px] text-sm">
                                <div className="flex items-center gap-x-2 ">
                                    <LiaStethoscopeSolid className="mt-[2px]" />
                                    {doctor.specialtyName}
                                </div>
                                <div className="flex items-center gap-x-2  font-medium ">
                                    <BsCoin className="mt-[2px]" />
                                    <span className="text-customYellow text-base">{formatCurrency(doctor.price)}</span>
                                </div>
                                <div className="flex items-start gap-x-2 h-[37.5px]">
                                    <span>
                                        <CiHospital1 className="mt-1" />
                                    </span>
                                    {doctor.clinicName}
                                </div>
                            </div>
                            <div
                                className="w-full text-center bg-white group-hover:bg-[rgb(44,116,223)] border border-gray-300 group-hover:border-[#00B5F1] group-hover:text-white  font-semibold px-3 h-10 leading-9 rounded-lg"
                                onClick={() => handleBooking(doctor.userId)}
                            >
                                Đặt khám ngay
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Doctor;
