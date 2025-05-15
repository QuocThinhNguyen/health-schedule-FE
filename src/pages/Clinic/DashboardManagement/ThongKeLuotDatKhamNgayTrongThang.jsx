import { Line } from 'react-chartjs-2';
import {
    Chart,
    ArcElement,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
} from 'chart.js';
import { useContext, useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '~/api/apiRequest';
import { ThemeContext } from '~/context/ThemeProvider';
Chart.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);
function ThongKeLuotDatKhamNgayTrongThang() {
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const [maxValue, setMaxValue] = useState(0);
    const { isDark } = useContext(ThemeContext);

    useEffect(() => {
        const fetchBookingDayInMonthChart = async () => {
            try {
                const response = await axiosInstance.get('/admin/booking-dayinmonth-chart');
                if (response.status === 200) {
                    setLabels(response.data.labels);
                    setValues(response.data.values);
                    setMaxValue(Math.max(...response.data.values));
                } else {
                    console.error('Failed to fetch data:', response.message);
                    setLabels([]);
                    setValues([]);
                    setMaxValue(0);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setLabels([]);
                setValues([]);
                setMaxValue(0);
            }
        };
        fetchBookingDayInMonthChart();
    }, []);

    const max = maxValue > 1 ? Math.ceil(maxValue * 1.5) : 6;

    const dayData = useMemo(
        () => ({
            labels: labels,
            datasets: [
                {
                    label: 'Số lượt đặt khám',
                    data: values,
                    borderColor: 'rgba(255, 0, 0, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Màu nền của các điểm dữ liệu
                    pointBackgroundColor: 'rgba(255, 0, 0, 1)', // Màu nền của các điểm dữ liệu
                    pointBorderColor: 'rgba(255, 0, 0, 0.5)', // Màu viền của các điểm dữ liệu
                    pointHoverBackgroundColor: 'rgba(0, 255, 0, 0.5)', // Màu nền của các điểm dữ liệu khi di chuột qua
                    pointHoverBorderColor: 'rgba(255, 0, 0, 0.5)', // Màu viền của các điểm dữ liệu khi di chuột qua
                    tension: 0.4,
                    pointRadius: 3, // Kích thước của các điểm dữ liệu
                    pointHoverRadius: 5,
                    fill: true,
                    color: isDark ? '#ffffffe6' : '#262626',
                },
            ],
        }),
        [labels, values, isDark],
    );

    const dayOptions = useMemo(
        () => ({
            plugins: {
                title: {
                    display: true,
                    text: 'Thống kê số lượt đặt khám theo ngày trong tháng',
                    color: isDark ? '#ffffffe6' : '#262626',
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        pointStyle: 'circle',
                        usePointStyle: true,
                        boxWidth: 7,
                        boxHeight: 7,
                        color: isDark ? '#ffffffe6' : '#262626',
                    },
                },
                tooltip: {
                    callbacks: {
                        title: function (context) {
                            return `Ngày ${context[0].label}`;
                        },
                        label: function (context) {
                            const label = context.dataset.label || '';
                            const yValue = context.raw;
                            return `${label}: ${yValue}`;
                        },
                    },
                },
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Ngày trong tháng',
                        color: isDark ? '#ffffffe6' : '#262626',
                    },
                    ticks: {
                        autoSkip: false,
                        color: isDark ? '#ffffffe6' : '#262626',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Số lượt đặt khám',
                        color: isDark ? '#ffffffe6' : '#262626',
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                        suggestedMax: maxValue > 1 ? Math.ceil(maxValue * 1.5) : 6,
                        color: isDark ? '#ffffffe6' : '#262626',
                        callback: function (value) {
                            if (Number.isInteger(value)) {
                                return value;
                            }
                        },
                    },
                },
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                },
            },
            grid: {
                display: true,
                color: 'rgba(200, 200, 200, 0.3)', // Giảm độ đậm
            },
        }),
        [isDark], // Thêm maxValue vào dependencies,
    );

    return <Line data={dayData} options={dayOptions} />;
}

export default ThongKeLuotDatKhamNgayTrongThang;
