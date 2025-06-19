import { FaUserDoctor } from 'react-icons/fa6';
import Doctor from '../ListDoctor/Doctor';
import { FaAngleRight } from 'react-icons/fa';
import { useEffect, useState, useContext } from 'react';
import { axiosClient, axiosClientPython } from '~/api/apiRequest';
import { NavLink } from 'react-router-dom';
import { UserContext } from '~/context/UserContext';
import { use } from 'react';
import { set } from 'date-fns';
import { toast } from 'react-toastify';

function ListDoctorRecommended({ symptoms = [] }) {
    const [doctors, setDoctors] = useState([]);
    const { user } = useContext(UserContext);
    const [recommendation, setRecommendation] = useState([]);
    const userId = user.userId;

    useEffect(() => {
        const getDoctorRecommendation = async () => {
            try {
                const payload = {
                    patient_id: user.userId,
                    specialist_symptoms: symptoms,
                };

                const response = await axiosClientPython.post('/recommend', payload, { withCredentials: true });
                if (response.status === 200) {
                    // console.log('Response:', response.data);
                    setRecommendation(response.data.map((item) => item.doctor_id));
                    console.log('Đã lấy danh sách bác sĩ thành công!');
                } else {
                    console.error('No recommendation found:', response.message);
                    setRecommendation([]);
                }
            } catch (error) {
                console.error('Error fetching doctor recommendation:', error);
            }
        };
        if (userId) {
            getDoctorRecommendation();
        }
    }, [userId]);

    useEffect(() => {
        const fetchRecommendedDoctors = async () => {
            if (recommendation.length === 0) return;

            try {
                // Gọi song song tất cả các API /doctor/:id
                console.log('Check recommendation', recommendation);
                const promises = recommendation.map((id) => axiosClient.get(`/doctor/${id}`));
                const responses = await Promise.all(promises);

                console.log('Responses 123:', responses);

                const formattedData = responses.map((res) => {
                    const doctorData = res.data;
                    return {
                        doctorInforId: doctorData.doctorInforId,
                        position: doctorData.position,
                        fullname: doctorData.fullname,
                        specialtyName: doctorData.specialtyName,
                        clinicName: doctorData.clinicName,
                        price: doctorData.price,
                        image: doctorData.image,
                        userId: doctorData.doctorId,
                        rating: doctorData.avgRating,
                        bookingCount: doctorData.bookingCount,
                    };
                });

                // console.log('Formatted Data:', formattedData);

                setDoctors(formattedData);
            } catch (error) {
                console.error('Error fetching doctor details:', error);
                setDoctors([]);
            }
        };

        fetchRecommendedDoctors();
    }, [recommendation]);

    return (
        <div>
            {doctors.length > 0 && (
                <div className="bg-[#F8F9FC]">
                    <div className="max-w-6xl mx-auto px-4 pt-2 pb-10">
                        <div className="flex items-center justify-between gap-2 mt-8 mb-2 text-2xl text-[#2D87F3]">
                            <div className="flex items-center gap-2">
                                <FaUserDoctor />
                                <span className="text-xl font-bold">Bác sĩ bạn có thể quan tâm</span>
                            </div>
                            {/* <p className="text-sm font-semibold cursor-pointer hover:underline flex items-center gap-1">
                            <NavLink to="/tat-ca-bac-si">Xem tất cả</NavLink>
                            <FaAngleRight className="mt-1" />
                        </p> */}
                        </div>
                        <div className="flex flex-wrap">
                            {doctors.slice(0, 8).map((doctor) => (
                                <Doctor key={doctor.doctorInforId} data={doctor} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListDoctorRecommended;
