import { FaAngleRight, FaClinicMedical } from 'react-icons/fa';
import Clinic from './Clinic';
import { useEffect, useState } from 'react';
import { axiosClient } from '~/api/apiRequest';
import { NavLink } from 'react-router-dom';

function ListClinic() {
    const [clinics, setClinics] = useState([]);

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await axiosClient.get('/clinic/dropdown');

                if (response.status === 200) {
                    const formattedData = response.data.map((item) => ({
                        clinicId: item.clinicId,
                        name: item.name,
                        address: item.address,
                        image: item.image,
                    }));
                    setClinics(formattedData);
                } else {
                    console.error('Failed to fetch data:', response.message);
                    setClinics([]);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setClinics([]);
            }
        };
        fetchClinics();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 pb-10">
            <div className="flex items-center justify-between gap-2 mt-8 mb-2 text-2xl text-[#2D87F3]">
                <div className="flex items-center gap-2 ">
                    <FaClinicMedical />
                    <span className="text-xl font-bold ">Top Bệnh viện nổi bật</span>
                </div>
                <p className="text-sm font-semibold cursor-pointer hover:underline flex items-center gap-1">
                    <NavLink to="/tat-ca-benh-vien">Xem tất cả</NavLink>
                    <FaAngleRight className="mt-1" />
                </p>
            </div>
            <div className="flex flex-wrap">
                {clinics.slice(0, 8).map((clinic) => (
                    <Clinic key={clinic.clinicId} data={clinic} />
                ))}
            </div>
        </div>
    );
}

export default ListClinic;
