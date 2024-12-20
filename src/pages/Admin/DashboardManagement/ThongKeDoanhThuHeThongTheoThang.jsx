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
import { Bar } from 'react-chartjs-2';
Chart.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

function ThongKeDoanhThuHeThongTheoThang() {
    return (
        <Bar
            data={{
                labels: [
                    'Tháng 1',
                    'Tháng 2',
                    'Tháng 3',
                    'Tháng 4',
                    'Tháng 5',
                    'Tháng 6',
                    'Tháng 7',
                    'Tháng 8',
                    'Tháng 9',
                    'Tháng 10',
                    'Tháng 11',
                    'Tháng 12',
                ],
                datasets: [
                    {
                        label: 'VNĐ',
                        data: [120, 150, 180, 200, 170, 190, 220, 210, 0, 0, 10, 0],
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        barThickness: 35,
                        maxBarThickness: 35,
                    },
                ],
            }}
            options={{
                plugins: {
                    legend: { display: true },
                    title: {
                        display: true,
                        text: 'Biểu đồ doanh thu hệ thống theo tháng',
                    },
                },
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'VNĐ',
                        },
                    },
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                    },
                },
            }}
        />
    );
}

export default ThongKeDoanhThuHeThongTheoThang;
