import React, { useState, useEffect, useContext } from 'react';
import { User, Calendar, Phone, Users, MapPin, Briefcase, Mail, IdCard, Plus } from 'lucide-react';
import { axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { Route, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmationModal from '~/components/Confirm/ConfirmationModal';

function PatientRecord() {
    const { user } = useContext(UserContext);

    const [patientData, setPatientData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false); // Quản lý hiển thị modal
    const [editingPatient, setEditingPatient] = useState(null); // Lưu thông tin bệnh nhân đang chỉnh sửa
    const [patientIdToDelete, setPatientIdToDelete] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axiosInstance.get(`/patientrecord/patient/${user.userId}`);
                console.log(response);
                if (response.status === 200) {
                    setPatientData(response.data); // Lưu toàn bộ mảng bệnh nhân vào state
                } else {
                    setError('Không thể lấy dữ liệu');
                }
            } catch (error) {
                setError('Đã xảy ra lỗi khi lấy dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [user.userId]);

    const handleDelete = (patientId) => {
        setPatientIdToDelete(patientId);
        setShowModal(true); // Show confirmation modal
    };

    const handleConfirmDelete = async () => {
        console.log(`Xóa hồ sơ bệnh nhân có ID: ${patientIdToDelete}`);
        try {
            const response = await axiosInstance.delete(`/patientrecord/${patientIdToDelete}`);
            console.log('DELETE', response);
            if (response.status === 200) {
                // Remove the deleted patient from the state
                setPatientData((prevData) =>
                    prevData.filter((patient) => patient.patientRecordId !== patientIdToDelete),
                );
                toast.success('Đã xóa hồ sơ thành công');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Lỗi khi xóa hồ sơ:', error);
            toast.error('Đã xảy ra lỗi khi xóa hồ sơ');
        }
        setShowModal(false); // Close the modal after deletion
    };

    const handleCancelDelete = () => {
        setShowModal(false); // Close the modal without deleting
    };

    const handleEdit = (patientId) => {
        console.log(`Chỉnh sửa hồ sơ bệnh nhân có ID: ${patientId}`);
        navigate(`/user/records/update?id=${patientId}`);
    };

    const handleAdd = () => {
        navigate(`/user/records/addNew`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleSubmit = (formData) => {
        console.log('Dữ liệu đã submit:', formData);
    };
    return (
        <div className="mt-20 h-fit overflow-y-auto max-w-2xl">
            <h1 className="text-2xl text-black font-bold mb-1 text-start">Danh sách hồ sơ bệnh nhân</h1>
            <div className="flex justify-end mb-2 px-4 max-w">
                <button
                    className="w-fit flex items-center justify-center gap-2 p-3 rounded-lg text-blue-600 text-sm font-medium hover:bg-blue-200 transition-colors"
                    onClick={handleAdd}
                >
                    <Plus className="w-4 h-4" />
                    Thêm hồ sơ
                </button>
            </div>
            <div className="space-y-6 mb-5">
                {patientData.map((patient) => (
                    <div
                        key={patient.patientRecordId}
                        className="bg-white shadow-md border rounded-lg overflow-hidden p-4 max-w-2xl border-spacing-3 mt-2"
                    >
                        <div className="space-y-4">
                            <div className="flex gap-4 relative top-5">
                                {/* Cột 1 */}
                                <div className="flex-1">
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <img src="/user_1.png" alt={'user_1'} className="h-6 w-6 mr-2" />
                                            <div className="font-semibold mr-2">Họ và tên:</div> {patient.fullname}
                                        </div>
                                        <div className="flex items-center">
                                            <img src="/schedule_1.png" alt={'schedule_1'} className="h-6 w-6 mr-2" />
                                            <div className="font-semibold mr-2">Ngày sinh:</div>{' '}
                                            {new Date(patient.birthDate).toLocaleDateString('vi-VN')}
                                        </div>
                                        <div className="flex items-center">
                                            <img src="/telephone.png" alt={'telephone'} className="h-6 w-6 mr-2" />
                                            <div className="font-semibold mr-2">Số điện thoại:</div>{' '}
                                            {patient.phoneNumber}
                                        </div>
                                        <div className="flex items-center">
                                            <img src="/gender.png" alt={'telephone'} className="h-6 w-6 mr-2" />
                                            <div className="font-semibold mr-2">Giới tính:</div>{' '}
                                            {patient.gender === 'Male' ? 'Nam' : 'Nữ'}
                                        </div>
                                    </div>
                                </div>

                                {/* Cột 2 */}
                                <div className="flex-1">
                                    <div className="space-y-3">
                                        <div className="flex">
                                            <img src="/location.png" alt={'telephone'} className="h-6 w-6 mr-2" />
                                            <div className="font-semibold whitespace-nowrap mr-2">Địa chỉ:</div>{' '}
                                            {patient.address}
                                        </div>
                                        <div className="flex items-center">
                                            <img src="/briefcase.png" alt={'telephone'} className="h-6 w-6 mr-2" />
                                            <div className="font-semibold mr-2">Nghề nghiệp:</div> {patient.job}
                                        </div>
                                        <div className="flex items-center">
                                            <img src="/mail.png" alt={'telephone'} className="h-6 w-6 mr-2" />
                                            <div className="font-semibold mr-2">Email:</div> {patient.email}
                                        </div>
                                        <div className="flex items-center">
                                            <img src="/id-card.png" alt={'telephone'} className="h-6 w-6 mr-2" />
                                            <div className="font-semibold mr-2">CCCD:</div> {patient.CCCD}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-10">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => handleDelete(patient.patientRecordId)}
                            >
                                Xóa hồ sơ
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => handleEdit(patient.patientRecordId)}
                            >
                                Sửa hồ sơ
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showModal}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                message="Bạn có chắc chắn muốn xóa hồ sơ bệnh nhân này?"
            />
        </div>
    );
}

export default PatientRecord;
