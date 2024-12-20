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
Chart.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);
function ThongKeLuotDatKhamNgayTrongThang() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dayData = {
        labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
        datasets: [
            {
                label: 'Số lượt đặt khám',
                data: [
                    10, 15, 20, 18, 0, 25, 20, 12, 28, 35, 22, 25, 30, 29, 24, 22, 31, 33, 27, 25, 20, 19, 18, 24, 29,
                    35, 37, 40, 42, 38, 35,
                ],
                borderColor: 'rgba(255, 0, 0, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Màu nền của các điểm dữ liệu
                pointBackgroundColor: 'rgba(255, 0, 0, 1)', // Màu nền của các điểm dữ liệu
                pointBorderColor: 'rgba(255, 0, 0, 0.5)', // Màu viền của các điểm dữ liệu
                pointHoverBackgroundColor: 'rgba(0, 255, 0, 0.5)', // Màu nền của các điểm dữ liệu khi di chuột qua
                pointHoverBorderColor: 'rgba(255, 0, 0, 0.5)', // Màu viền của các điểm dữ liệu khi di chuột qua
                // tension: 0.4,
                pointRadius: 3, // Kích thước của các điểm dữ liệu
                pointHoverRadius: 5,
                fill: true,
            },
        ],
    };

    const dayOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Thống kê số lượt đặt khám theo ngày trong tháng',
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                    pointStyle: 'circle',
                    usePointStyle: true,
                    boxWidth: 7,
                    boxHeight: 7,
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
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Ngày trong tháng',
                },
                ticks: {
                    autoSkip: false,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Số lượt đặt khám',
                },
            },
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
            },
        },
    };
    return <Line data={dayData} options={dayOptions} />;
}

export default ThongKeLuotDatKhamNgayTrongThang;
