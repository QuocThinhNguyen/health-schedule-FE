import { Bar } from 'react-chartjs-2';
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
function ThongKeLuotDatKhamThangTrongNam() {
    const monthData = {
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
                label: 'Số lượt đặt khám',
                data: [150, 200, 250, 180, 300, 270, 320, 350, 280, 300, 400, 450], // Dữ liệu mẫu
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const monthOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Thống kê số lượt đặt khám theo tháng trong năm',
            },
        },
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Tháng trong năm',
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
    return <Bar data={monthData} options={monthOptions} />;
}
export default ThongKeLuotDatKhamThangTrongNam;
