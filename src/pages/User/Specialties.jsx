import { MapPin, X, Search } from 'lucide-react';
import { axiosInstance } from '~/api/apiRequest';
import React, { useState, useEffect } from 'react';
import { Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

function Specialties() {
    const [searchQuery, setSearchQuery] = useState('');
    const [specialty, setSpecialty] = useState([]);
    const navigate = useNavigate();

    const { state } = useLocation();

    const getClinicId = state.clinicId;
    const getNameClinic = state.clinicName;

    console.log('specialty:', specialty);

    useEffect(() => {
        const fetchSpecialty = async () => {
            try {
                const response = await axiosInstance.get(`/specialty/clinicId/${getClinicId}`);
                console.log('response:', response);
                if (response.errCode === 0) {
                    setSpecialty(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch specialty:', error.message);
            }
        };
        fetchSpecialty();
    }, []);

    const filteredDepartments = specialty.filter((dept) => dept.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleGetSpecialty = (specialtyId, specialtyName) => {
        console.log('specialtyId:', specialtyId);
        navigate(`/bac-si?benhvien=${getNameClinic}&&?chuyenkhoa=${specialtyName}`, {
            state: {
                specialtyId: specialtyId,
                clinicId: getClinicId,
            },
        });
    };
    return (
        <div className="max-w-5xl mx-auto p-4 mt-32">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-5xl font-bold text-gray-800">Chọn chuyên khoa</h1>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Department List */}
            <div className="space-y-6">
                {filteredDepartments.map((dept) => (
                    <button
                        className="w-full flex items-center gap-4 p-4 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow text-left"
                        onClick={() => handleGetSpecialty(dept.specialtyId, dept.name)}
                    >
                        <img
                            src={`http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/${dept.image}`}
                            alt={dept.name}
                            className="w-36 h-36 object-cover rounded-full"
                        />
                        <div>
                            <h3 className="text-blue-400 font-medium mb-2 text-3xl">{dept.name}</h3>
                            <div className="flex items-start gap-2 text-gray-600 text-2xl">
                                <span>{dept.description}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Specialties;
