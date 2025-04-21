import React, { useState, useEffect, useContext, useMemo } from 'react';
import Select from 'react-select';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { set } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// const dummyStats = [
//     {
//         profileId: 1,
//         fullName: 'Nguyễn Văn A',
//         totalVisits: 15,
//         totalCost: 2400000,
//         monthlyVisits: [
//             { month: '01/2025', visits: 2 },
//             { month: '02/2025', visits: 3 },
//             { month: '03/2025', visits: 4 },
//             { month: '04/2025', visits: 6 },
//         ],
//         monthlyCost: [
//             { month: '01/2025', cost: 400000 },
//             { month: '02/2025', cost: 500000 },
//             { month: '03/2025', cost: 600000 },
//             { month: '04/2025', cost: 900000 },
//         ],
//         doctorStats: [
//             { doctorName: 'BS. Nguyễn Văn A', count: 5 },
//             { doctorName: 'BS. Lê Thị B', count: 3 },
//             { doctorName: 'BS. Trần Văn C', count: 7 },
//         ],
//         successRate: {
//             success: 13,
//             canceled: 2,
//         },
//     },
//     {
//         profileId: 2,
//         fullName: 'Lê Thị B',
//         totalVisits: 10,
//         totalCost: 1500000,
//         monthlyVisits: [
//             { month: '01/2025', visits: 1 },
//             { month: '02/2025', visits: 2 },
//             { month: '03/2025', visits: 3 },
//             { month: '04/2025', visits: 4 },
//         ],
//         monthlyCost: [
//             { month: '01/2025', cost: 200000 },
//             { month: '02/2025', cost: 300000 },
//             { month: '03/2025', cost: 400000 },
//             { month: '04/2025', cost: 600000 },
//         ],
//         doctorStats: [
//             { doctorName: 'BS. Lê Thị B', count: 4 },
//             { doctorName: 'BS. Phạm Minh D', count: 6 },
//         ],
//         successRate: {
//             success: 9,
//             canceled: 1,
//         },
//     },
// ];

function Statistical() {
    const [dummyStats, setDummyStats] = useState([]);
    const [totalVisits, setTotalVisits] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [monthlyVisits, setMonthlyVisits] = useState(0);
    const { user } = useContext(UserContext);
    const [selectedProfileId, setSelectedProfileId] = useState(null);
    const selectedStats = dummyStats.find((stat) => stat.profileId === selectedProfileId);

    const patientOptions = dummyStats.map((p) => ({
        label: p.fullName,
        value: p.profileId,
    }));

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/user/statistics/${user.userId}`);
                if (response.status === 200) {
                    setDummyStats(response.data);
                    setSelectedProfileId(response.data[0].profileId); // Set the first profile as default
                    setTotalRecords(response.data.length);
                    setTotalCost(
                        response.data.reduce((sum, profile) => {
                            return sum + profile.totalCost;
                        }, 0),
                    );
                    setTotalVisits(
                        response.data.reduce((sum, profile) => {
                            return sum + profile.totalVisits;
                        }, 0),
                    );

                    const current = new Date();
                    const currentMonth = String(current.getMonth() + 1).padStart(2, '0'); // e.g. '03'
                    const currentYear = current.getFullYear(); // e.g. 2025
                    const currentMonthYear = `${currentMonth}/${currentYear}`; // '03/2025'

                    const visitsThisMonth = response.data.reduce((sum, profile) => {
                        const foundMonth = profile.monthlyVisits.find((visit) => visit.month === currentMonthYear);
                        return sum + (foundMonth ? foundMonth.visits : 0);
                    }, 0);

                    setMonthlyVisits(visitsThisMonth);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [user.userId]);

    const ITEMS = [
        {
            id: 1,
            key: 'Tổng số lần khám bệnh',
            value: totalVisits,
            backgroundColor: 'bg-[linear-gradient(135deg,_#667eea_0%,_#764ba2_100%)]', // tím xanh dịu
            image: 'doctor.png',
        },
        {
            id: 2,
            key: 'Tổng hồ sơ khám bệnh',
            value: totalRecords,
            backgroundColor: 'bg-[linear-gradient(135deg,_#42e695_0%,_#3bb2b8_100%)]', // xanh mint - dịu mắt
            image: 'health-reports.png',
        },
        {
            id: 3,
            key: 'Tổng chi phí khám bệnh',
            value: formatCurrency(totalCost),
            backgroundColor: 'bg-[linear-gradient(135deg,_#f7971e_0%,_#ffd200_100%)]', // vàng cam tươi sáng
            image: 'budget.png',
        },
        {
            id: 4,
            key: 'Số lần khám tháng này',
            value: monthlyVisits,
            backgroundColor: 'bg-[linear-gradient(135deg,_#f54ea2_0%,_#ff7676_100%)]', // hồng đào hiện đại
            image: 'doctor-visit.png',
        },
    ];

    // Chart data
    // const monthlyVisitChart = {
    //     labels: selectedStats.monthlyVisits.map((item) => item.month),
    //     datasets: [
    //         {
    //             label: 'Số lần khám',
    //             data: selectedStats.monthlyVisits.map((item) => item.visits),
    //             fill: false,
    //             borderColor: 'rgb(75, 192, 192)', // xanh ngọc
    //             tension: 0.3,
    //         },
    //     ],
    // };

    // const costChart = {
    //     labels: selectedStats.monthlyCost.map((item) => item.month),
    //     datasets: [
    //         {
    //             label: 'Chi phí (VNĐ)',
    //             data: selectedStats.monthlyCost.map((item) => item.cost),
    //             backgroundColor: 'rgba(255, 159, 64, 0.5)', // cam nhạt với độ trong suốt
    //             borderColor: 'rgb(255, 159, 64)', // màu cam
    //             fill: true,
    //             tension: 0.4,
    //         },
    //     ],
    // };

    // const doctorStatsChart = {
    //     labels: selectedStats.doctorStats.map((d) => d.doctorName),
    //     datasets: [
    //         {
    //             label: 'Số lần khám',
    //             data: selectedStats.doctorStats.map((d) => d.count),
    //             backgroundColor: 'rgba(54, 162, 235, 0.7)',
    //         },
    //     ],
    // };

    // const bookingSuccessChart = {
    //     labels: ['Thành công', 'Đã hủy'],
    //     datasets: [
    //         {
    //             data: [selectedStats.successRate.success, selectedStats.successRate.canceled],
    //             backgroundColor: ['#36A2EB', '#FF6384'],
    //         },
    //     ],
    // };

    const visitData = selectedStats?.monthlyVisits?.map((item) => item.visits) || [];
    const maxVisit = Math.max(...visitData, 1);

    const doctorVisitData = selectedStats?.doctorStats?.map((d) => d.count) || [];
    const maxCount = Math.max(...doctorVisitData, 1);

    return (
        <div className="mt-20 w-full h-full">
            <div className="text-2xl text-black font-bold mb-1 text-start">Thống kê</div>
            <div className="flex flex-wrap gap-4 mt-4 text-white">
                {ITEMS.map((item) => (
                    <div
                        key={item.id}
                        className={`${item.backgroundColor} rounded-xl p-4 flex items-center gap-1 w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]`}
                    >
                        <img src={`/${item.image}`} alt={item.key} className="h-10 w-10 object-contain" />
                        <div>
                            <p className="text-sm font-medium">{item.key}</p>
                            <p className="text-2xl font-bold">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full max-w-sm mt-4">
                <Select
                    options={patientOptions}
                    onChange={(option) => setSelectedProfileId(option.value)}
                    value={patientOptions.find((opt) => opt.value === selectedProfileId)}
                />
            </div>

            {selectedStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div>
                        <h3 className="text-lg font-semibold">Lịch sử khám theo tháng</h3>
                        <Line
                            data={{
                                labels: selectedStats.monthlyVisits.map((item) => item.month),
                                datasets: [
                                    {
                                        label: 'Số lần khám',
                                        data: selectedStats.monthlyVisits.map((item) => item.visits),
                                        fill: false,
                                        borderColor: 'rgb(75, 192, 192)', // xanh ngọc
                                        tension: 0.3,
                                    },
                                ],
                            }}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        min: 0,
                                        max: maxVisit <= 5 ? 5 : maxVisit + 1,
                                        ticks: {
                                            stepSize: 1,
                                            callback: (value) => (Number.isInteger(value) ? value : null),
                                        },
                                    },
                                },
                            }}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">Chi phí khám theo tháng</h3>
                        <Line
                            data={{
                                labels: selectedStats.monthlyCost.map((item) => item.month),
                                datasets: [
                                    {
                                        label: 'Chi phí (VNĐ)',
                                        data: selectedStats.monthlyCost.map((item) => item.cost),
                                        backgroundColor: 'rgba(255, 159, 64, 0.5)', // cam nhạt với độ trong suốt
                                        borderColor: 'rgb(255, 159, 64)', // màu cam
                                        fill: true,
                                        tension: 0.4,
                                    },
                                ],
                            }}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">Số lần khám với từng bác sĩ</h3>
                        <Bar
                            data={{
                                labels: selectedStats.doctorStats.map((d) => d.doctorName),
                                datasets: [
                                    {
                                        label: 'Số lần khám',
                                        data: selectedStats.doctorStats.map((d) => d.count),
                                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                                        barThickness: 30,
                                    },
                                ],
                            }}
                            options={{
                                indexAxis: 'y', // Bar nằm ngang
                                scales: {
                                    x: {
                                        beginAtZero: true,
                                        min: 0,
                                        max: maxCount <= 5 ? 5 : maxCount + 1,
                                        ticks: {
                                            stepSize: 1,
                                            callback: (value) => (Number.isInteger(value) ? value : null),
                                        },
                                    },
                                },
                            }}
                        />
                    </div>

                    <div className="h-[200px] w-full">
                        <h3 className="text-lg font-semibold">Tỷ lệ đặt lịch</h3>
                        <Pie
                            data={{
                                labels: ['Thành công', 'Đã hủy'],
                                datasets: [
                                    {
                                        data: [selectedStats.successRate.success, selectedStats.successRate.canceled],
                                        backgroundColor: ['#36A2EB', '#FF6384'],
                                    },
                                ],
                            }}
                            options={{ maintainAspectRatio: false }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Statistical;
