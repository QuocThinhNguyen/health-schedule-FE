import React, { useEffect, useMemo, useState } from 'react';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaHospital, FaUser } from 'react-icons/fa';
import { AiOutlineSchedule } from 'react-icons/ai';
import { axiosInstance } from '~/api/apiRequest';
import ThongKeLuotDatKhamNgayTrongThang from './ThongKeLuotDatKhamNgayTrongThang';
import ThongKeLuotDatKhamThangTrongNam from './ThongKeLuotDatKhamThangTrongNam';
import ThongKeDoanhThuHeThongTheoThang from './ThongKeDoanhThuHeThongTheoThang';
import ThongKeCaKhamTrongThangNay from './ThongKeCaKhamTrongThangNay';
import Title from '../../../components/Tittle';

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

    const ITEMS = useMemo(
        () => [
            {
                id: 1,
                key: 'Tổng số bệnh viện',
                value: count.countClinic,
                backgroundColor: 'bg-[rgba(115,93,255,0.15)]',
                textColor: 'text-[rgb(115,93,255)]',
                icon: <FaUserDoctor />,
            },
            {
                id: 2,
                key: 'Tổng số bác sĩ',
                value: count.countDoctor,
                backgroundColor: 'bg-[rgba(255,90,41,0.15)]',
                textColor: 'text-[rgb(255,90,41)]',
                icon: <FaHospital />,
            },
            {
                id: 3,
                key: 'Người dùng mới tháng này',
                value: count.countUser,
                backgroundColor: 'bg-[rgba(12,199,99,0.15)]',
                textColor: 'text-[rgb(12,199,99)]',
                icon: <FaUser />,
            },
            {
                id: 4,
                key: 'Số ca khám tháng này',
                value: count.countBooking,
                backgroundColor: 'bg-[rgba(12,156,252,0.15)]',
                textColor: 'text-[rgb(12,156,252)]',
                icon: <AiOutlineSchedule />,
            },
        ],
        [count],
    );

    return (
        <>
            <div className="px-3">
                <Title>Bảng thống kê</Title>
                <div className="flex flex-wrap justify-between min-h-28 gap-6">
                    {ITEMS.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[var(--bg-primary)] rounded-[4px] flex-1 p-4 flex justify-between items-start"
                        >
                            <div>
                                <p className="mb-4 text-[var(--text-secondary)]">{item.key}</p>
                                <p className="text-[28px] text-[var(--text-color)] font-semibold">{item.value}</p>
                            </div>
                            <div className={`p-3 rounded-[4px] ${item.backgroundColor}`}>
                                <span className={`text-2xl ${item.textColor}`}>{item.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-nowrap gap-6 mt-6">
                    <div className="flex-1 bg-[var(--bg-primary)] rounded-[4px] shadow h-[350px]">
                        <ThongKeDoanhThuHeThongTheoThang />
                    </div>
                    <div className="bg-[var(--bg-primary)] max-w-72 w-full rounded-[4px] shadow">
                        <ThongKeCaKhamTrongThangNay />
                    </div>
                </div>
                <div className="flex flex-nowrap gap-6 my-6">
                    <div className="flex-1 bg-[var(--bg-primary)] rounded-[4px] shadow h-[350px]">
                        <ThongKeLuotDatKhamNgayTrongThang />
                    </div>
                    <div className="flex-1 bg-[var(--bg-primary)] rounded-[4px] shadow  h-[350px]">
                        <ThongKeLuotDatKhamThangTrongNam />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
