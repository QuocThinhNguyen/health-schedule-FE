import { FiCalendar, FiDollarSign, FiCreditCard, FiMapPin, FiNavigation, FiHash, FiPhone } from 'react-icons/fi';
import { AiOutlineUser } from 'react-icons/ai';

import { TbFileDescription } from 'react-icons/tb';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { Link } from 'react-router-dom';
import { formatDate } from '~/utils/formatDate';
import { getPaymentStatusText } from '~/utils/paymentStatusUtils';

function AppointmentCard({ data, onCancel, onReview, onReviewed, onReschedule }) {
    const appointment = data;
    console.log('AppointmentCard data: ', appointment);

    return (
        <div className="w-full bg-[var(--bg-primary)] rounded-md shadow-lg overflow-hidden mx-[1px] my-3 border border-[var(--border-primary)]">
            <div className="px-4 pt-3 pb-2 bg-gray-50">
                <div className="flex items-center justify-between">
                    {appointment?.bookingType === 'SERVICE' ? (
                        <div className="flex-1 flex items-center space-x-4">
                            <div className="w-10 h-10 min-w-10 rounded-full overflow-hidden">
                                <img
                                    src="https://cdn-healthcare.hellohealthgroup.com/services/Specialty.png"
                                    alt="Doctor Avatar"
                                    className="w-full h-full object-cover block"
                                />
                            </div>
                            <div className="">
                                <h2 className="text font-semibold text-gray-900">
                                    TS.BS {appointment?.serviceId?.name || 'Không xác định'}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {appointment?.serviceId?.serviceCategoryId?.name || 'Không xác định'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center space-x-4">
                            <div className="w-10 h-10 min-w-10 rounded-full overflow-hidden">
                                <img
                                    src={appointment?.doctorId?.image}
                                    alt="Doctor Avatar"
                                    className="w-full h-full object-cover block"
                                />
                            </div>
                            <div className="">
                                <h2 className="text font-semibold text-gray-900">
                                    TS.BS {appointment?.doctorId?.fullname || 'Không xác định'}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {appointment?.doctorInfo?.specialty?.name || 'Không xác định'}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                            {appointment?.status?.valueVi || 'Không xác định'}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded-full flex items-center">
                            <FiPhone className="w-3 h-3 mr-1" />
                            {appointment?.bookingType === 'SERVICE' ? 'Dịch vụ' : 'Bác sĩ'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="px-4 py-2 text-sm">
                {appointment?.orderNumber && (
                    <div className="flex items-center space-x-6 text-gray-600">
                        <FiHash className="text-[var(--text-secondary)]" />
                        <span className="gap-2 flex items-center mt-[2px]">
                            <span className="font-semibold"> Số thứ tự:</span>{' '}
                            <span className="font-bold">{appointment?.orderNumber}</span>
                        </span>
                    </div>
                )}
                <div className="flex items-center space-x-6 text-gray-600">
                    <FiCalendar className="text-[var(--text-secondary)]" />
                    <span className="gap-2 flex items-center mt-[2px] mt-[2px]">
                        <span className="font-semibold">Ngày khám:</span>
                        {formatDate(appointment?.appointmentDate)} • {appointment?.timeType?.valueVi}
                    </span>
                </div>
                <div className="flex items-center space-x-6 text-gray-600">
                    <FiDollarSign className="text-[var(--text-secondary)]" />
                    <span className="gap-2 flex items-center mt-[2px] mt-[2px]">
                        <span className="font-semibold">Giá khám:</span>
                        <span className="">{appointment?.price || '500.000'} đ</span>
                    </span>
                </div>

                <div className="flex items-center space-x-6 text-gray-600">
                    <AiOutlineUser className="text-[var(--text-secondary)]" />
                    <span className="gap-2 flex items-center mt-[2px]">
                        <span className="font-semibold">Bệnh nhân:</span>
                        <span className=" ">{appointment?.patientRecordId?.fullname || 'Không xác định'}</span>
                    </span>
                </div>
                <div className="flex items-center space-x-6 text-gray-600">
                    <LiaBirthdayCakeSolid className="text-[var(--text-secondary)]" />
                    <span className="gap-2 flex items-center mt-[2px]">
                        <span className="font-semibold">Ngày sinh:</span>
                        <span className=" ">
                            {formatDate(appointment?.patientRecordId?.birthDate) || 'Không xác định'}
                        </span>
                    </span>
                </div>

                <div className="flex items-center space-x-6 text-gray-600">
                    <FiCreditCard className="text-[var(--text-secondary)]" />
                    <span className="gap-2 flex items-center mt-[2px]">
                        <span className="font-semibold">Phương thức thanh toán:</span>
                        <span className="">
                            {appointment?.paymentMethod || 'Không xác định'} (
                            {getPaymentStatusText(appointment?.paymentStatus) || 'Không xác định'})
                        </span>
                    </span>
                </div>

                <div className="flex items-center space-x-6 text-gray-600">
                    <TbFileDescription className="text-[var(--text-secondary)]" />
                    <span className="gap-2 flex items-center mt-[2px]">
                        <span className="font-semibold">Lý do khám:</span>
                        <span>{appointment?.reason}</span>
                    </span>
                </div>

                <div className="flex items-start space-x-6 text-gray-600">
                    <FiMapPin className="mt-[2px] text-[var(--text-secondary)]" />
                    <div className="flex-1">
                        <p className="font-medium">
                            <span className="font-semibold">Bệnh viện:</span>{' '}
                            {appointment?.doctorInfo?.clinic?.name || appointment?.serviceId?.clinicId?.name || 'Không xác định'}
                        </p>
                        <p className=" mt-1">
                            <span className="font-semibold">Địa chỉ:</span>{' '}
                            {appointment?.doctorInfo?.clinic?.address || appointment?.serviceId?.clinicId?.address || 'Không xác định'}
                        </p>

                        <button className="flex items-center space-x-1 text-blue-600  mt-1 hover:text-blue-700">
                            <FiNavigation className="mt-[2px] text-[var(--text-secondary)]" />
                            <Link target="_blank" to={appointment?.doctorInfo?.clinic?.mapUrl || appointment?.serviceId?.clinicId?.mapUrl || '#'}>
                                Chỉ đường
                            </Link>
                        </button> */}
                        <button className="flex items-center space-x-1 text-blue-600 mt-2 hover:text-blue-700">
                            <FiNavigation className="mt-[2px] text-[var(--text-secondary)]" />
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                    appointment?.doctorInfo?.clinic?.address || '',
                                )}`}
                            >
                                Chỉ đường
                            </a>
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-2 flex justify-end gap-2">
                {(appointment?.status?.keyMap === 'S2' || appointment?.status?.keyMap === 'S3') && (
                    <button
                        className="px-4 py-2 h-9 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
                        onClick={onCancel}
                    >
                        Hủy lịch hẹn
                    </button>
                )}
                {appointment?.status?.keyMap === 'S4' && (
                    <div className="flex gap-2">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
                            onClick={onReschedule}
                        >
                            Đặt khám lại
                        </button>

                        {appointment?.feedbackChecked ? (
                            <button
                                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md"
                                onClick={onReviewed}
                            >
                                Đã đánh giá
                            </button>
                        ) : (
                            <button
                                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
                                onClick={onReview}
                            >
                                Đánh giá
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppointmentCard;
