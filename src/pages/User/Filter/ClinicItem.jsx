import { useEffect, useState } from 'react';
import { FiPhone } from 'react-icons/fi';
import { GoLocation } from 'react-icons/go';
import { IoIosStar } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '~/api/apiRequest';
function ClinicItem(data) {
    const navigate = useNavigate();
    const clinic = data.data;
    const [avgRating, setAvgRating] = useState(0);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);

    const handleBooking = (clinicId, clinicName) => {
        navigate(`/benh-vien?name=${clinicName}`, {
            state: { clinicId: clinicId },
        });
    };

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axiosInstance.get(`/feedback/clinic/${clinic.clinicId}`);
                if (response.status === 200) {
                    setAvgRating(response.avgRating);
                    setTotalFeedbacks(response.totalFeedbacks);
                }
            } catch (error) {
                console.error('Failed to fetch feedbacks: ', error.message);
            }
        };
        fetchFeedbacks();
    }, []);

    return (
        <div className="rounded-lg mb-4 border border-[#E4E8EC]">
            <div className="px-4 pt-4 mb-4 flex items-start gap-4">
                <div className="w-16 h-16  cursor-pointer">
                    <img
                        src={clinic.image || 'https://via.placeholder.com/150'}
                        alt={clinic.name}
                        className="w-full h-full rounded-full object-cover border border-[#E4E8EC]"
                    />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-custom262626">{clinic.name}</p>
                        <div className="flex items-center gap-1 text-sm">
                            <div className="flex items-center gap-1 px-2 py-[1px] bg-[#2d87f31a] bg-opacity-10 rounded-full">
                                <IoIosStar className="text-yellow-500" />
                                <span className="font-semibold text-black text-sm">{avgRating}/5</span>
                            </div>
                            <span className="underline text-[#595959]">{totalFeedbacks} đánh giá</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 mb-[2px] text-sm">
                        <FiPhone className="mt-1" />
                        {clinic.phoneNumber}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <GoLocation className="mt-1" />
                        {clinic.address}
                    </div>
                </div>
            </div>
            <div className="px-4 py-2 bg-[#F8F9FC] flex items-center justify-end ">
                <button
                    onClick={() => handleBooking(clinic.clinicId, clinic.name)}
                    className="px-5 h-10 bg-[#2d87f3] hover:bg-[#2c74df] text-white font-semibold rounded-lg"
                >
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
}

export default ClinicItem;
