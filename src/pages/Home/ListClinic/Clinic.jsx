import { useEffect, useState } from 'react';
import { BsCoin } from 'react-icons/bs';
import { CiHospital1 } from 'react-icons/ci';
import { FaUser } from 'react-icons/fa';
import { GrLocation } from 'react-icons/gr';
import { IoIosStar } from 'react-icons/io';
import { LiaStethoscopeSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '~/api/apiRequest';
import { GoLocation } from 'react-icons/go';

function Clinic(data) {
    const navigate = useNavigate();
    const clinic = data.data;

    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;

    // const [academicRanksAndDegreess, setAcademicRanksAndDegreess] = useState([]);
    // useEffect(() => {
    //     const getDropdownAcademicRanksAndDegrees = async () => {
    //         try {
    //             const response = await axiosClient.get(`/doctor/academic-ranks-and-degrees`);

    //             if (response.status === 200) {
    //                 setAcademicRanksAndDegreess(response.data);
    //             } else {
    //                 console.error('No academic ranks and degrees are found:', response.message);
    //                 setAcademicRanksAndDegreess([]);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching academic ranks and degrees:', error);
    //             setAcademicRanksAndDegreess([]);
    //         }
    //     };
    //     getDropdownAcademicRanksAndDegrees();
    // }, [data]);

    // const handleBooking = (doctorId) => {
    //     console.log('Đã click vào nút Đặt khám ngay');

    //     // Điều hướng đến trang với ID bác sĩ
    //     navigate(`/bac-si/get?id=${doctorId}`);
    // };

    const handleBooking = (clinicId, clinicName) => {
        navigate(`/benh-vien?name=${clinicName}`, {
            state: { clinicId: clinicId },
        });
    };

    return (
        <div className="w-1/4 px-2 mt-4 group">
            <div className="bg-white rounded-lg shadow-md cursor-pointer border group-hover:border group-hover:border-[rgb(44,116,223)] group-hover:shadow-2xl">
                <div className="px-2 pt-4 pb-2 flex flex-col items-center gap-4">
                    <div className="flex justify-center items-center h-28 w-28 rounded-full overflow-hidden">
                        <img
                            src={`${IMAGE_URL}${clinic.image}`}
                            alt={clinic.name}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    <div className="flex flex-col justify-between gap-6 w-full">
                        <h3 className="text-lg font-bold text-center h-14">{clinic.name}</h3>
                        <div className="bg-[#2d87f3] bg-opacity-10 group-hover:bg-opacity-30 px-2 py-2 rounded-lg flex flex-col gap-4">
                            <div className="flex items-start gap-1 text-[rgb(89,89,89)] text-xs font-normal h-12">
                                <span>
                                    <GoLocation />
                                </span>
                                <span className="">{clinic.address}</span>
                            </div>
                            <div
                                className="w-full text-center bg-white group-hover:bg-[rgb(44,116,223)] border border-gray-300 group-hover:border-[#00B5F1] group-hover:text-white  font-semibold py-2 px-3 rounded-lg "
                                onClick={() => handleBooking(clinic.clinicId, clinic.name)}
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

export default Clinic;
