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
import { useContext, useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '~/api/apiRequest';
import { ThemeContext } from '~/context/ThemeProvider';
Chart.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);
function ThongKeLuotDatKhamThangTrongNam() {
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const { isDark } = useContext(ThemeContext);

    useEffect(() => {
        const fetchBookingMonthInYearChart = async () => {
            try {
                const response = await axiosInstance.get('/clinic/booking-monthinyear-chart');
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

    const monthData = useMemo(
        () => ({
            labels: labels,
            datasets: [
                {
                    label: 'Số lượt đặt khám',
                    data: values,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    color: isDark ? '#ffffffe6' : '#000',
                },
            ],
        }),
        [labels, values, isDark],
    );

    const monthOptions = useMemo(
        () => ({
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Thống kê số lượt đặt khám thành công theo tháng trong năm',
                    color: isDark ? '#ffffffe6' : '#262626',
                },
            },
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tháng trong năm',
                        color: isDark ? '#ffffffe6' : '#262626',
                    },
                    ticks: {
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
        }),
        [isDark],
    );
    return <Bar data={monthData} options={monthOptions} />;
}
export default ThongKeLuotDatKhamThangTrongNam;
