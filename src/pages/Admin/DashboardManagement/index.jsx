import React, { useEffect, useState } from 'react';

import ThongKeLuotDatKhamNgayTrongThang from './ThongKeLuotDatKhamNgayTrongThang';
import ThongKeLuotDatKhamThangTrongNam from './ThongKeLuotDatKhamThangTrongNam';
import ThongKeDoanhThuHeThongTheoThang from './ThongKeDoanhThuHeThongTheoThang';
import ThongKeCaKhamTrongThangNay from './ThongKeCaKhamTrongThangNay';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaHospital, FaUser } from 'react-icons/fa';
import { AiOutlineSchedule } from 'react-icons/ai';
import { axiosClient, axiosInstance } from '~/api/apiRequest';



function Dashboard() {
    const [count, setCounts] = useState({
        countClinic: 0,
        countDoctor: 0,
        countUser: 0,
        countBooking: 0,
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axiosInstance.get('/admin/homepage');
                if (response.status === 200) {
                    console.log('response', response.data);
                    setCounts({
                        countClinic: response.data.totalClinics,
                        countDoctor: response.data.totalDoctors,
                        countUser: response.data.countOfNewUserThisMonth,
                        countBooking: response.data.totalBookingThisMonth,
                    });
                } else {
                    console.error('Failed to fetch data:', response.message);
                    setDoctors([]);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setDoctors([]);
            }
        };
        fetchStatistics();
    }, []);


    const ITEMS = [
        {
            id: 1,
            key: 'Tổng số bệnh viện',
            value: count.countClinic,
            backgroundColor: 'bg-[linear-gradient(45deg,_rgb(88,86,214)_0%,_rgb(111,103,219)_100%)]',
            icon: <FaUserDoctor />,
        },
        {
            id: 2,
            key: 'Tổng số bác sĩ',
            value: count.countDoctor,
            backgroundColor: 'bg-[linear-gradient(45deg,_rgb(51,153,255)_0%,_rgb(41,130,204)_100%)]',
            icon: <FaHospital />,
        },
        {
            id: 3,
            key: 'Người dùng mới tháng này',
            value: count.countUser,
            backgroundColor: 'bg-[linear-gradient(45deg,_rgb(249,177,21)_0%,_rgb(246,150,11)_100%)]',
            icon: <FaUser />,
        },
        {
            id: 4,
            key: 'Số ca khám tháng này',
            value: count.countBooking,
            backgroundColor: 'bg-[linear-gradient(45deg,_rgb(229,83,83)_0%,_rgb(217,55,55)_100%)]',
            icon: <AiOutlineSchedule />,
        },
    ];

    return (
        <>
            <div className="p-8">
                <h1 className="text-2xl font-bold text-center">BẢNG THỐNG KÊ</h1>

                <div className="flex flex-wrap justify-between h-36 gap-6 mt-8 text-white">
                    {ITEMS.map((item) => (
                        <div
                            key={item.id}
                            className={`${item.backgroundColor} rounded-lg flex-1 px-8 flex items-center gap-6`}
                        >
                            <span className="text-6xl">{item.icon}</span>
                            <div>
                                <p>{item.key}</p>
                                <p className="text-[24px] font-bold">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-nowrap gap-6 mt-8">
                    <div className="flex-1 bg-white rounded-lg shadow h-[350px]">
                        <ThongKeDoanhThuHeThongTheoThang />
                    </div>
                    <div className="bg-white max-w-md w-full rounded-lg shadow">
                        <ThongKeCaKhamTrongThangNay />
                    </div>
                </div>
                <div className="flex flex-nowrap gap-6 mt-8">
                    <div className="flex-1 bg-white rounded-lg shadow h-[350px]">
                        <ThongKeLuotDatKhamNgayTrongThang />
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow  h-[350px]">
                        <ThongKeLuotDatKhamThangTrongNam />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
