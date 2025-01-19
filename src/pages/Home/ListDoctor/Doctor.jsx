import { useEffect, useState } from 'react';
import { BsCoin } from 'react-icons/bs';
import { CiHospital1 } from 'react-icons/ci';
import { FaUser } from 'react-icons/fa';
import { IoIosStar } from 'react-icons/io';
import { LiaStethoscopeSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '~/api/apiRequest';

function Doctor(data) {
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
    const navigate = useNavigate();

    const handleBooking = (doctorId) => {
        console.log('Đã click vào nút Đặt khám ngay');

        // Điều hướng đến trang với ID bác sĩ
        navigate(`/bac-si/get?id=${doctorId}`);
    };
    return (
        <div className="w-1/4 px-2 mt-4 group">
            <div className="bg-white rounded-lg shadow-md cursor-pointer border group-hover:border group-hover:border-[rgb(44,116,223)] group-hover:shadow-2xl">
                <div className="pt-4 pb-2 gap-4 flex flex-col items-center">
                    <div className="flex justify-center items-center h-28 w-28 mt-4 rounded-full overflow-hidden">
                        <img
                            src={`${IMAGE_URL}${doctor.image}`}
                            alt={doctor.fullname}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="flex justify-between items-center bg-[#EBF9FD] w-full px-2 py-2 text-sm">
                        <p className="flex items-center justify-center gap-1 font-semibold ">
                            Đánh giá:
                            <span className="text-yellow-500">{doctor.rating}</span>
                            <IoIosStar className="text-yellow-500" />
                        </p>
                        <p className="flex items-center justify-center gap-1 font-semibold">
                            Lượt khám:
                            <span className="text-yellow-500">{doctor.bookingCount}</span>
                            <FaUser className="text-yellow-500" />
                        </p>
                    </div>
                    <div className="px-2 w-full">
                        <div className="flex flex-col justify-between gap-2 w-full text-[#003553] bg-[#2d87f3] bg-opacity-10 group-hover:bg-opacity-30 px-2 py-2 rounded-lg">
                            <div className="flex justify-start gap-1">
                                <h3 className="text-lg font-bold">
                                    {
                                        academicRanksAndDegreess.find(
                                            (academicRanksAndDegrees) =>
                                                academicRanksAndDegrees.keyMap === doctor.position,
                                        )?.valueVi
                                    }
                                </h3>
                                <h3 className="text-lg font-bold truncate">{doctor.fullname}</h3>
                            </div>

                            <div className="flex flex-col leading-[20px] text-sm">
                                <div className="flex items-start gap-2">
                                    <LiaStethoscopeSolid className="mt-1" />
                                    {doctor.specialtyName}
                                </div>
                                <div className="flex items-start gap-2 text-red-700 font-semibold text-base">
                                    <BsCoin className="mt-1" />
                                    {doctor.price.toLocaleString('vi-VN')}đ
                                </div>
                                <div className="flex items-start gap-2 h-[37.5px]">
                                    <span>
                                        <CiHospital1 className="mt-1" />
                                    </span>
                                    {doctor.clinicName}
                                </div>
                            </div>
                            <div
                                className="w-full text-center bg-white group-hover:bg-[rgb(44,116,223)] border border-gray-300 group-hover:border-[#00B5F1] group-hover:text-white  font-semibold py-2 px-3 rounded-lg"
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
