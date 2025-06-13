import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '~/components/Input';
import { UserContext } from '~/context/UserContext';
import SelectOption from '../../../components/SelectOption';
import { formatDate, formatWithInputDate } from '~/utils/formatDate';

function FormBooking({ onSubmit, defaultValues = {} }) {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        control,
    } = useForm();

    const [isInitialized, setIsInitialized] = useState(false);
    const [buttonName, setButtonName] = useState('Thêm');

    const timeTypeMapping = {
        T1: '8:00 - 9:00',
        T2: '9:00 - 10:00',
        T3: '10:00 - 11:00',
        T4: '11:00 - 12:00',
        T5: '13:00 - 14:00',
        T6: '14:00 - 15:00',
        T7: '15:00 - 16:00',
        T8: '16:00 - 17:00',
    };

    const statusMapping = {
        S1: 'Chưa xác nhận',
        S2: 'Đã xác nhận',
        S3: 'Đã thanh toán',
        S4: 'Đã khám xong',
        S5: 'Đã hủy',
    };

    const handleClickReturn = () => {
        navigate('/admin/booking');
    };

    useEffect(() => {
        if (!isInitialized && defaultValues && Object.keys(defaultValues).length > 0) {
            setValue('bookingId', defaultValues.bookingId || '');
            setValue('createdAt', formatWithInputDate(defaultValues.createdAt) || '');
            setValue('patientName', defaultValues.patientRecordId?.fullname || '');
            setValue('patientPhoneNumber', defaultValues.patientRecordId?.phoneNumber || '');
            setValue('patientEmail', defaultValues.patientRecordId?.email || '');
            setValue('patientAddress', defaultValues.patientRecordId?.address || '');
            setValue('doctor', defaultValues.doctorId?.fullname || '');
            setValue('specialty', defaultValues.info.specialtyId?.name || '');
            setValue('clinic', defaultValues.info.clinicId?.name || '');
            setValue('appointmentDate', defaultValues.appointmentDate || '');
            setValue('timeType', defaultValues.timeType || '');
            setValue('price', defaultValues.price || '');
            setValue('paymentMethod', defaultValues.paymentMethod || '');
            setValue('status', defaultValues.status || '');
            setValue('reason', defaultValues.reason || '');
            setIsInitialized(true);
            setButtonName('Cập nhật');
        }
    }, [defaultValues, setValue, isInitialized]);

    const onHandleSubmit = (data) => {
        const formData = new FormData();
        formData.append('timeType', data.timeType);
        formData.append('status', data.status);
        // formData.append('paymentMethod', data.paymentMethod);
        onSubmit && onSubmit(formData);
    };
    return (
        <form
            onSubmit={handleSubmit(onHandleSubmit)}
            className="px-4 pb-4 bg-[var(--bg-primary)] rounded border border-[var(--border-primary)]"
        >
            <div className="flex items-center justify-between gap-3">
                <Input id="bookingId" label="Mã lịch hẹn (ID)" type="text" readOnly {...register('bookingId')} />
                <Input id="createdAt" label="Ngày đặt lịch" type="date" readOnly {...register('createdAt')} />
            </div>
            <div className="flex items-center justify-between gap-3">
                <Input id="patientName" label="Bệnh nhân" type="text" readOnly {...register('patientName')} />
                <Input
                    id="patientPhoneNumber"
                    label="Số điện thoại bệnh nhân"
                    type="text"
                    readOnly
                    {...register('patientPhoneNumber')}
                />
                <Input id="patientEmail" label="Email bệnh nhân" type="text" readOnly {...register('patientEmail')} />
            </div>
            <Input id="patientAddress" label="Địa chỉ bệnh nhân" type="text" readOnly {...register('patientAddress')} />
            <div className="flex items-center justify-between gap-3">
                <Input id="doctor" label="Bác sĩ" type="text" readOnly {...register('doctor')} />
                <Input id="specialty" label="Chuyên khoa" type="text" readOnly {...register('specialty')} />
                <Input id="clinic" label="Bệnh viện" type="text" readOnly {...register('clinic')} />
            </div>
            <div className="flex items-center justify-between gap-3">
                <Input id="appointmentDate" label="Ngày khám" type="date" readOnly {...register('appointmentDate')} />

                <div className="w-full mt-4">
                    <label htmlFor="timeType" className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                        Ca khám
                    </label>
                    <Controller
                        name="timeType"
                        control={control}
                        render={({ field }) => (
                            <SelectOption
                                value={field.value}
                                onChange={field.onChange}
                                options={Object.entries(timeTypeMapping).map(([value, label]) => ({
                                    value,
                                    label,
                                }))}
                                placeholder="Chọn ca khám"
                            />
                        )}
                    />
                </div>

                <Input id="price" label="Giá khám" type="text" readOnly {...register('price')} />
            </div>
            <Input
                id="paymentMethod"
                label="Phương thức thanh toán"
                type="text"
                readOnly
                {...register('paymentMethod')}
            />

            <div className="w-full mt-4">
                <label htmlFor="status" className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                    Trạng thái đặt lịch
                </label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <SelectOption
                            value={field.value}
                            onChange={field.onChange}
                            options={Object.entries(statusMapping).map(([value, label]) => ({
                                value,
                                label,
                            }))}
                            placeholder="Chọn ca khám"
                        />
                    )}
                />
            </div>

            <div className="w-full mt-4">
                <label htmlFor="reason" className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                    Lý do khám bệnh
                </label>
                <textarea
                    id="reason"
                    rows={4}
                    readOnly
                    className="w-full px-3 py-2 border rounded-[4px] focus:outline-none focus:ring-2 bg-[var(--bg-secondary)] border-[var(--border-primary)] focus:ring-blue-500 cursor-default"
                    {...register('reason')}
                />
            </div>
            <div className="mt-4 flex justify-end gap-3">
                <button
                    onClick={handleClickReturn}
                    className="flex justify-center items-center gap-2 px-4 py-2 h-10 bg-[var(--bg-primary)] text-[var(--bg-active)] hover:bg-[#735dff26] dark:hover:bg-[#735dff26] transition-colors  rounded  border-2 border-[var(--bg-active)]"
                >
                    <span>Quay lại</span>
                </button>
                <button
                    type="submit"
                    className="flex justify-center items-center gap-2 px-4 py-2 h-10 bg-[var(--bg-active)] text-[var(--text-active)] hover:bg-[rgba(var(--bg-active-rgb),0.9)] rounded border border-[var(--border-primary)]"
                >
                    <span>{buttonName}</span>
                </button>
            </div>
        </form>
    );
}

export default FormBooking;
