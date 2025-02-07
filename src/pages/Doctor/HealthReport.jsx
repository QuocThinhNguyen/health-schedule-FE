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
    Search,
    Plus,
    Edit,
    Trash2,
    Phone,
    Mail,
    MapPin,
} from 'lucide-react';
function HealthReport() {
    const [selectedPatient, setSelectedPatient] = useState(null);

    const patients = [
        {
            id: 1,
            name: 'Nguyễn Văn A',
            age: 35,
            gender: 'Nam',
            lastVisit: '15/05/2023',
            condition: 'Đau lưng mãn tính',
        },
        { id: 2, name: 'Trần Thị B', age: 28, gender: 'Nữ', lastVisit: '20/05/2023', condition: 'Viêm xoang' },
        { id: 3, name: 'Lê Văn C', age: 42, gender: 'Nam', lastVisit: '10/05/2023', condition: 'Tăng huyết áp' },
        { id: 4, name: 'Phạm Thị D', age: 31, gender: 'Nữ', lastVisit: '18/05/2023', condition: 'Thai sản' },
        { id: 5, name: 'Hoàng Văn E', age: 55, gender: 'Nam', lastVisit: '12/05/2023', condition: 'Đau khớp' },
    ];
    return (
        <main className="flex-1">
            {/* Patient Records Content */}
            <div className="p-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    {/* Search and Add Patient */}
                    <div className="flex justify-between mb-6">
                        <div className="relative w-64">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bệnh nhân..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center">
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm bệnh nhân mới
                        </button>
                    </div>

                    {/* Patient List */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-3 font-medium">Tên bệnh nhân</th>
                                    <th className="pb-3 font-medium">Tuổi</th>
                                    <th className="pb-3 font-medium">Giới tính</th>
                                    <th className="pb-3 font-medium">Lần khám gần nhất</th>
                                    <th className="pb-3 font-medium">Tình trạng</th>
                                    <th className="pb-3 font-medium">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient.id} className="border-b last:border-b-0">
                                        <td className="py-4 font-medium">{patient.name}</td>
                                        <td className="py-4">{patient.age}</td>
                                        <td className="py-4">{patient.gender}</td>
                                        <td className="py-4">{patient.lastVisit}</td>
                                        <td className="py-4">{patient.condition}</td>
                                        <td className="py-4">
                                            <button
                                                onClick={() => setSelectedPatient(patient)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Xem chi tiết
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600 mr-3">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <p className="text-sm text-gray-500">Hiển thị 1-5 trong tổng số 20 bệnh nhân</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm border rounded-md">Trước</button>
                            <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md">1</button>
                            <button className="px-3 py-1 text-sm border rounded-md">2</button>
                            <button className="px-3 py-1 text-sm border rounded-md">3</button>
                            <button className="px-3 py-1 text-sm border rounded-md">Sau</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Patient Detail Modal */}
            {selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Chi tiết bệnh nhân</h2>
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500 mb-1">Họ và tên</p>
                                <p className="font-medium">{selectedPatient.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Tuổi</p>
                                <p className="font-medium">{selectedPatient.age}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Giới tính</p>
                                <p className="font-medium">{selectedPatient.gender}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Lần khám gần nhất</p>
                                <p className="font-medium">{selectedPatient.lastVisit}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500 mb-1">Tình trạng</p>
                                <p className="font-medium">{selectedPatient.condition}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500 mb-1">Thông tin liên hệ</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <span>0123456789</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <span>patient@example.com</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <span>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end gap-4">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                Chỉnh sửa thông tin
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                Xem lịch sử khám bệnh
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default HealthReport;
