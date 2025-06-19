import { useEffect, useMemo, useState } from 'react';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaHospital, FaUser } from 'react-icons/fa';
import { AiOutlineSchedule } from 'react-icons/ai';
import { BiCoin, BiCoinStack } from "react-icons/bi";
import { axiosInstance } from '~/api/apiRequest';
import ThongKeLuotDatKhamNgayTrongThang from './ThongKeLuotDatKhamNgayTrongThang';
import ThongKeLuotDatKhamThangTrongNam from './ThongKeLuotDatKhamThangTrongNam';
import ThongKeDoanhThuHeThongTheoThang from './ThongKeDoanhThuHeThongTheoThang';
import ThongKeCaKhamTrongThangNay from './ThongKeCaKhamTrongThangNay';
import Title from '../../../components/Tittle';
import { TbRosetteDiscount } from 'react-icons/tb';
import { formatCurrency } from '~/utils/formatCurrency';

function Dashboard() {
    const [count, setCounts] = useState({
        countTotalRevenue: 0,
        countCommission: 0,
        countRestRevenue: 0,
        countDoctor: 0,
        countPatient: 0,
        countBooking: 0,
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axiosInstance.get('/clinic/statistics');
                console.log("Response from statistics API:", response.data);
                
                if (response.status === 200) {
                    setCounts({
                        countTotalRevenue: response.data?.statistics?.totalRevenue,
                        countCommission: response.data?.statistics?.commission,
                        countRestRevenue: response.data?.statistics?.actualRevenue,
                        countDoctor: response.data?.statistics?.countDoctorInfos,
                        countPatient:response.data?.statistics?.totalPatients,
                        countBooking:response.data?.statistics?.bookingsThisMonth,
                    });
                } else {
                    console.error('Failed to fetch data:', response.message);
                    setCounts([]);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setCounts([]);
            }
        };
        fetchStatistics();
    }, []);

    const ITEMS = useMemo(
        () => [
            {
                id: 1,
                key: 'Tổng doanh thu tháng này',
                value: formatCurrency(count.countTotalRevenue),
                backgroundColor: 'bg-[rgba(115,93,255,0.15)]',
                textColor: 'text-[rgb(115,93,255)]',
                icon: <BiCoinStack />,
            },
            {
                id: 2,
                key: 'Hoa hồng hệ thống ',
                value: formatCurrency(count.countCommission),
                backgroundColor: 'bg-[rgba(255,90,41,0.15)]',
                textColor: 'text-[rgb(255,90,41)]',
                icon: <TbRosetteDiscount />,
            },
            {
                id: 3,
                key: 'Doanh thu thực nhận tháng này',
                value: formatCurrency(count.countRestRevenue),
                backgroundColor: 'bg-[rgba(12,199,99,0.15)]',
                textColor: 'text-[rgb(12,199,99)]',
                icon: <BiCoin />,
            },
            {
                id: 3,
                key: 'Tổng số bác sĩ',
                value: count.countDoctor,
                backgroundColor: 'bg-[rgba(12,156,252,0.15)]',
                textColor: 'text-[rgb(12,156,252)]',
                icon: <FaUserDoctor />,
            },
            {
                id: 4,
                key: 'Tổng số bệnh nhân',
                value: count.countPatient,
                backgroundColor: 'bg-[rgba(12,156,252,0.15)]',
                textColor: 'text-[rgb(12,156,252)]',
                icon: <FaUser />,
            },
            {
                id: 5,
                key: 'Số lượt đặt lịch tháng này',
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-28 ">
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
