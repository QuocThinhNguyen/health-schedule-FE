import { BsCoin } from 'react-icons/bs';
import { IoIosStar } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { axiosClient } from '~/api/apiRequest';
import { useNavigate } from 'react-router-dom';
function DoctorItem(data) {
    const navigate = useNavigate();
    const [academicRanksAndDegreess, setAcademicRanksAndDegreess] = useState([]);
    const doctor = data.data;
    console.log('Check data', doctor);

    const handleBooking = (doctorId) => {
        navigate(`/bac-si/get?id=${doctorId}`);
    };

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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="rounded-lg mb-4 border border-[#E4E8EC]">
            <div className="px-4 pt-4 mb-4 flex gap-4">
                <img
                    src={doctor.image || 'https://via.placeholder.com/150'}
                    alt={doctor.fullname}
                    className="w-20 h-20 rounded-full object-cover border border-[#E4E8EC]"
                />
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-custom262626">
                                {academicRanksAndDegreess.find(
                                    (academicRanksAndDegrees) => academicRanksAndDegrees.keyMap === doctor.position,
                                )?.valueVi || 'Chưa xác định'}{' '}
                                {doctor.fullname}
                            </h3>
                            <p className="">{doctor.specialtyName}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="flex items-center gap-1 px-2 py-[1px] bg-[#2d87f31a] bg-opacity-10 rounded-full">
                                <IoIosStar className="text-yellow-500" />
                                <span className="font-semibold text-black text-sm">{doctor.avgRating}/5</span>
                            </div>
                            <span className=" text-[#595959] text-sm">{doctor.countFeedBack} đánh giá</span>
                            <div className="text-[#595959] text-sm">|</div>
                            <span className=" text-[#595959] text-sm">{doctor.totalBookings} lượt đặt khám</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-2 mb-1">
                        <div className="flex items-center justify-center rounded-3xl bg-[#e3f2ff] text-[#2d87f3] border border-[#2d87f3] px-4 py-1">
                            <p>Đặt lịch khám</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="flex items-center gap-1">
                            <BsCoin className="w-4 h-4 font-semibold text-lg text-[#009e5c] mr-2" />
                            <span>Giá</span>
                        </div>
                        <span className="font-semibold text-[#009e5c] text-lg">{formatCurrency(doctor.price)}</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#F8F9FC] px-4 py-2 flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <img
                        src={doctor.clinicImage || 'https://via.placeholder.com/150'}
                        alt={doctor.clinicName}
                        className="w-10 h-10 rounded-full object-cover border border-[#E4E8EC]"
                    />
                    <div>
                        <div className="font-semibold text-sm">{doctor.clinicName}</div>
                        <div className="text-xs text-[#595959]">{doctor.clinicAddress}</div>
                    </div>
                </div>
                <div
                    onClick={() => handleBooking(doctor.doctorId)}
                    className=" h-10 bg-blue-500 hover:bg-blue-600 text-white border px-5 py-2 rounded-lg font-semibold cursor-pointer"
                >
                    Đặt Lịch Hẹn
                </div>
            </div>
        </div>
    );
}

export default DoctorItem;
