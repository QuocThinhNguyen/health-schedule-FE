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
import { Doughnut } from 'react-chartjs-2';
import { axiosInstance } from '~/api/apiRequest';
import { ThemeContext } from '~/context/ThemeProvider';

Chart.register(
    ArcElement,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
);

function ThongKeCaKhamTrongThangNay() {
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const { isDark} = useContext(ThemeContext);

    useEffect(() => {
        const fetchStatusBookingChart = async () => {
            try {
                const response = await axiosInstance.get('/admin/status-booking-chart');
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
        fetchStatusBookingChart();
    }, []);

    useEffect(() => {
        const centerTextPlugin = {
            id: 'centerText',
            beforeDraw: (chart) => {
                if (chart.config.type !== 'doughnut') return;
                const { ctx, width, height } = chart;
                ctx.restore();
                const fontSize = (height / 200).toFixed(2);
                ctx.font = `${fontSize}em sans-serif`;
                ctx.fillStyle = isDark ? '#ffffffe6' : '#262626';
                ctx.textBaseline = 'middle';
                const total = chart.data.datasets[0].data.reduce((acc, value) => acc + value, 0);
                const text = total.toString();
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2.2;
                ctx.fillText(text, textX, textY);
                ctx.save();
            },
        };
        Chart.register(centerTextPlugin);
        return () => {
            Chart.unregister(centerTextPlugin);
        };
    }, [isDark]);

    return (
        <Doughnut
            data={{
                labels: labels,
                datasets: [
                    {
                        label: 'Số lượt đặt khám',
                        backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
                        data: values,
                    },
                ],
            }}
            options={{
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            pointStyle: 'circle',
                            usePointStyle: true,
                            boxWidth: 7,
                            boxHeight: 7,
                            color: isDark ? '#ffffffe6' : '#262626',
                        },
                        align: 'start',
                    },
                    title: {
                        display: true,
                        text: 'Biểu đồ tổng số lượt đặt khám trong tháng',
                        color: isDark ? '#ffffffe6' : '#262626',
                    },
                    tooltip: {
                        callbacks: {
                            title: function () {
                                return '';
                            },
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                return `${label}: ${value}`;
                            },
                        },
                    },
                    centerText: true, // Kích hoạt plugin tùy chỉnh cho biểu đồ này
                },
                maintainAspectRatio: false,
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

export default ThongKeCaKhamTrongThangNay;
