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
import { useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '~/api/apiRequest';
Chart.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);
function ThongKeLuotDatKhamThangTrongNam() {
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);

    useEffect(() => {
        const fetchBookingMonthInYearChart = async () => {
            try {
                const response = await axiosInstance.get('/admin/booking-monthinyear-chart');
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
        fetchBookingMonthInYearChart();
    }, []);

    const monthData = useMemo(() => ({
        labels: labels,
        datasets: [
            {
                label: 'Số lượt đặt khám',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    }), [labels, values]);

    const monthOptions= useMemo(() => ({
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
                ticks: {
                    beginAtZero: true,
                    stepSize: 1,
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
    }), []);
    return <Bar data={monthData} options={monthOptions} />;
}
export default ThongKeLuotDatKhamThangTrongNam;
