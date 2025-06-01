import React, { useEffect, useMemo, useState } from 'react';
import { FaRegHospital, FaStethoscope, FaUser } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';
import { PiChartLineUp } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { axiosInstance } from '~/api/apiRequest';
function Statistics() {
    const [count, setCounts] = useState({
        countClinic: 0,
        countDoctor: 0,
        countUser: 0,
        countBooking: 0,
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axiosInstance.get('/statistics-homepage');
                if (response.status === 200) {
                    setCounts({
                        countBooking: response.data.totalBookings,
                        countClinic: response.data.totalClinics,
                        countDoctor: response.data.totalDoctors,
                        countUser: response.data.totalUsers,
                    });
                } else {
                    toast.error('Failed to fetch statistics homepage:', response.message);
                    setCounts([]);
                }
            } catch (error) {
                toast.error('Error fetching statistics homepage:', error);
                setCounts([]);
            }
        };
        fetchStatistics();
    }, []);

    const ITEMS = useMemo(
        () => [
            {
                id: 1,
                key: 'Lượt khám',
                value: count.countBooking,
                icon: <FaStethoscope />,
            },
            {
                id: 2,
                key: 'Bệnh viện',
                value: count.countClinic,
                icon: <FaRegHospital />,
            },
            {
                id: 3,
                key: 'Bác sĩ',
                value: count.countDoctor,
                icon: <FaUserDoctor />,
            },
            {
                id: 4,
                key: 'Người dùng',
                value: count.countUser,
                icon: <FaUser />,
            },
        ],
        [count],
    );

    return (
        <div className=" bg-[#E0F8EE] py-8">
            <div className="max-w-6xl mx-auto px-4 py-2">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-[#2D87F3]">
                    <PiChartLineUp className="text-2xl font-bold" />
                    <span>Thống kê</span>
                </h2>
                <div className="flex justify-between px-11 py-11 rounded-xl bg-white">
                    {ITEMS.map((item) => (
                        <div key={item.id} className="flex flex-col items-center gap-4">
                            {React.cloneElement(item.icon, { className: 'text-[#2D87F3] text-5xl font-bold' })}
                            <div className="flex flex-col items-center">
                                <p className="text-2xl text-[#262626] font-bold">{item.value}</p>
                                <p className="text-xl text-[#757575]">{item.key}</p>
                            </div>
                        </div>
                    ))}
                    {/* <div className="flex flex-col items-center gap-4">
                        <FaStethoscope className="text-[#2D87F3] text-5xl font-bold" />
                        <div className="flex flex-col items-center">
                            <p className="text-2xl text-[#262626] font-bold">3.0M+</p>
                            <p className="text-xl text-[#757575]">Lượt khám</p>
                        </div>
                    </div> */}
                    {/* <div className="flex flex-col items-center gap-4">
                        <FaRegHospital className="text-[#2D87F3] text-5xl font-bold" />
                        <div className="flex flex-col items-center">
                            <p className="text-2xl text-[#262626] font-bold">50+</p>
                            <p className="text-xl text-[#757575]">Bệnh viện</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <FaUserDoctor className="text-[#2D87F3] text-5xl font-bold" />
                        <div className="flex flex-col items-center">
                            <p className="text-2xl text-[#262626] font-bold">100+</p>
                            <p className="text-xl text-[#757575]">Bác sĩ</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <FaUser className="text-[#2D87F3] text-5xl font-bold" />
                        <div className="flex flex-col items-center">
                            <p className="text-2xl text-[#262626] font-bold">1000+</p>
                            <p className="text-xl text-[#757575]">Người dùng</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Statistics;
