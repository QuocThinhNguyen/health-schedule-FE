import React, { useState, useEffect, useContext } from 'react';
import { FaCamera } from 'react-icons/fa';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import {
    BarChart3,
    Calendar,
    Users,
    FileText,
    Star,
    UserCircle,
    CreditCard,
    Settings,
    Bell,
    ChevronDown,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
} from 'lucide-react';
function Overview() {
    const stats = [
        {
            title: 'Cuộc hẹn hôm nay',
            value: '8',
            change: '+2 so với hôm qua',
            status: 'increase',
        },
        {
            title: 'Bệnh nhân tuần này',
            value: '32',
            change: '+5 so với tuần trước',
            status: 'increase',
        },
        {
            title: 'Tổng bệnh nhân',
            value: '891',
            change: '+12% tháng này',
            status: 'increase',
        },
        {
            title: 'Đánh giá trung bình',
            value: '4.8',
            change: '142 đánh giá',
            status: 'neutral',
        },
    ];

    const upcomingAppointments = [
        {
            patientName: 'Nguyễn Văn A',
            time: '09:00 - 09:30',
            date: 'Hôm nay',
            status: 'confirmed',
            type: 'Khám định kỳ',
            avatar: '/placeholder.svg?height=32&width=32',
        },
        {
            patientName: 'Trần Thị B',
            time: '10:00 - 10:30',
            date: 'Hôm nay',
            status: 'pending',
            type: 'Khám lần đầu',
            avatar: '/placeholder.svg?height=32&width=32',
        },
        {
            patientName: 'Lê Văn C',
            time: '11:00 - 11:30',
            date: 'Hôm nay',
            status: 'confirmed',
            type: 'Tái khám',
            avatar: '/placeholder.svg?height=32&width=32',
        },
    ];

    return (
        <main className="flex-1">
            {/* Dashboard Content */}
            <div className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                            <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                            <div className="flex items-center justify-between">
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <span
                                    className={`text-sm ${
                                        stat.status === 'increase' ? 'text-green-500' : 'text-gray-500'
                                    }`}
                                >
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Lịch hẹn sắp tới</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả</button>
                    </div>

                    <div className="space-y-4">
                        {upcomingAppointments.map((appointment, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={appointment.avatar || '/placeholder.svg'}
                                        alt={appointment.patientName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-medium">{appointment.patientName}</h3>
                                        <p className="text-sm text-gray-500">{appointment.type}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-medium">{appointment.time}</p>
                                    <p className="text-sm text-gray-500">{appointment.date}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {appointment.status === 'confirmed' ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : appointment.status === 'pending' ? (
                                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                    <span
                                        className={`text-sm ${
                                            appointment.status === 'confirmed'
                                                ? 'text-green-500'
                                                : appointment.status === 'pending'
                                                ? 'text-yellow-500'
                                                : 'text-red-500'
                                        }`}
                                    >
                                        {appointment.status === 'confirmed'
                                            ? 'Đã xác nhận'
                                            : appointment.status === 'pending'
                                            ? 'Chờ xác nhận'
                                            : 'Đã hủy'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Overview;
