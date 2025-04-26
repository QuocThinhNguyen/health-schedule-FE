import { FaUserDoctor } from 'react-icons/fa6';
import Doctor from './Doctor';
import { FaAngleRight } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { axiosClient } from '~/api/apiRequest';
import { NavLink } from 'react-router-dom';

function ListDoctor() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axiosClient.get('/doctor/dropdown');
                if (response.status === 200) {
                    const formattedData = response.data.map((item) => ({
                        doctorInforId: item.doctorInforId,
                        position: item.position,
                        fullname: item.doctorId?.fullname,
                        specialtyName: item.specialtyId?.name,
                        clinicName: item.clinicId?.name,
                        price: item.price,
                        image: item.doctorId?.image,
                        userId: item.doctorId?.userId,
                        rating: item.avgRating,
                        bookingCount: item.bookingCount,
                    }));
                    setDoctors(formattedData);
                } else {
                    console.error('Failed to fetch data:', response.message);
                    setDoctors([]);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setDoctors([]);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div className="bg-[#F8F9FC]">
            <div className="max-w-6xl mx-auto px-4 pt-2 pb-10">
                <div className="flex items-center justify-between gap-2 mt-8 mb-2 text-2xl text-[#2D87F3]">
                    <div className="flex items-center gap-2">
                        <FaUserDoctor />
                        <span className="text-xl font-bold">Top Bác sĩ nổi bật</span>
                    </div>
                    <p className="text-sm font-semibold cursor-pointer hover:underline flex items-center gap-1">
                        <NavLink to="/tat-ca-bac-si">Xem tất cả</NavLink>
                        <FaAngleRight className="mt-1" />
                    </p>
                </div>
                <div className="flex flex-wrap">
                    {doctors.slice(0, 8).map((doctor) => (
                        <Doctor key={doctor.doctorInforId} data={doctor} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ListDoctor;
