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
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { axiosInstance } from '~/api/apiRequest';
Chart.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

function ThongKeDoanhThuHeThongTheoThang() {
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);

    useEffect(() => {
        const fetchRevenueChart = async () => {
            try {
                const response = await axiosInstance.get('/admin/revenue-chart');
                if (response.status === 200) {
                    console.log('response', response.data);
                    setLabels(response.data.labels);
                    setValues(response.data.values);
                } else {
                    console.error('Failed to fetch data:', response.message);
                    setLabels([]);
                    setValues([]);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setLabels([]);
                setValues([]);
            }
        };
        fetchRevenueChart();
    }, []);

    return (
        <Bar
            data={{
                labels: labels,
                datasets: [
                    {
                        label: 'VNĐ',
                        data: values,
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
