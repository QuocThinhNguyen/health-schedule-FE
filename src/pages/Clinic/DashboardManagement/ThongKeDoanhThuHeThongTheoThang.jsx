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
import { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { axiosInstance } from '~/api/apiRequest';
import { ThemeContext } from '~/context/ThemeProvider';
Chart.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

function ThongKeDoanhThuHeThongTheoThang() {
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const { isDark} = useContext(ThemeContext);

    useEffect(() => {
        const fetchRevenueChart = async () => {
            try {
                const response = await axiosInstance.get('/clinic/revenue-chart');
                if (response.status === 200) {
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
                        text: 'Biểu đồ doanh thu của bệnh viện theo tháng',
                        color: isDark ? '#ffffffe6' : '#262626',
                    },
                },
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'VNĐ',
                            color: isDark ? '#ffffffe6' : '#262626',
                        },
                        ticks: {
                            color: isDark ? '#ffffffe6' : '#262626',
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Tháng',
                            color: isDark ? '#ffffffe6' : '#262626',
                        },
                        ticks: {
                            color: isDark ? '#ffffffe6' : '#262626',
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
