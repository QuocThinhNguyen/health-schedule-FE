import { useNavigate } from 'react-router-dom';
import { CiLocationOn } from 'react-icons/ci';
import renderStars from './renderStars';
import { axiosInstance } from '~/api/apiRequest';
import { useEffect, useState } from 'react';

function Clinic(data) {
    const navigate = useNavigate();
    const clinic = data.data;
    const [avgRating, setAvgRating] = useState(0);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axiosInstance.get(`/feedback/clinic/${clinic.clinicId}`);
                if (response.status === 200) {
                    setAvgRating(response.avgRating);
                }
            } catch (error) {
                console.error('Failed to fetch feedbacks: ', error.message);
            }
        };
        fetchFeedbacks();
    }, []);

    const handleBooking = (clinicId, clinicName) => {
        navigate(`/benh-vien?name=${clinicName}`, {
            state: { clinicId: clinicId },
        });
    };

    return (
        <div className="w-1/4 px-2 mt-4 group">
            <div className="bg-white rounded-lg shadow cursor-pointer border group-hover:border group-hover:border-[rgb(44,116,223)] group-hover:shadow-2xl">
                <div className="px-2 pt-4 pb-2 flex flex-col items-center gap-3">
                    <div className="flex justify-center items-center h-28 w-28  overflow-hidden ">
                        <img src={clinic.image} alt={clinic.name} className="object-cover w-full h-full" />
                    </div>

                    <div className="flex flex-col justify-between gap-1 w-full">
                        <h3 className="text-lg text-center font-semibold text-custom262626 h-14">{clinic.name}</h3>
                        <div className="bg-customBlue bg-opacity-5 group-hover:bg-opacity-20 px-2 py-2 rounded-lg flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-start gap-1 text-custom404040 font-normal text-sm">
                                    <span>
                                        <CiLocationOn className="mt-1" />
                                    </span>
                                    <span className="line-clamp-2">{clinic.address}</span>
                                </div>
                                <div className="flex items-center  leading-[18px] text-customYellow font-normal">
                                    <span className="text-base leading-none translate-y-[-1px]">{avgRating}</span>
                                    <span className="flex ml-1">{renderStars(avgRating)}</span>
                                </div>
                            </div>
                            <div
                                className="w-full text-center bg-white group-hover:bg-[rgb(44,116,223)] border border-gray-300 group-hover:border-[#00B5F1] group-hover:text-white  font-semibold px-3 h-10 leading-9 rounded-lg "
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
