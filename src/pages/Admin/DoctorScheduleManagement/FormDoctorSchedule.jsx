import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '~/components/Input';
import { axiosInstance } from '~/api/apiRequest';
import SelectOption from '../components/SelectOption';

function FormDoctorSchedule({ onSubmit, defaultValues = {} }) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        control,
    } = useForm();

    const [doctors, setDoctors] = useState([]);

    const [isInitialized, setIsInitialized] = useState(false);
    const [buttonName, setButtonName] = useState('Thêm');

    const handleClickReturn = () => {
        navigate('/admin/doctor-schedule');
    };

    useEffect(() => {
        const getDropdownDoctors = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/dropdown`);
                if (response.status === 200) {
                    setDoctors(response.data);
                } else {
                    console.error('No doctors are found:', response.message);
                    setDoctors([]);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setDoctors([]);
            }
        };
        getDropdownDoctors();
    }, []);

    useEffect(() => {
        if (!isInitialized && defaultValues && Object.keys(defaultValues).length > 0) {
            setValue('name', defaultValues.name || '');
            setValue('email', defaultValues.email || '');
            setValue('address', defaultValues.address || '');
            setValue('phoneNumber', defaultValues.phoneNumber || '');
            setAvatar(defaultValues.image);
            setBackground(defaultValues.background);
            setDescription(defaultValues.description || '');
            setIsInitialized(true);
            setButtonName('Cập nhật');
        }
    }, [defaultValues, setValue, isInitialized]);

    const onHandleSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('address', data.address);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('description', description);
        if (avatar) formData.append('image', avatar);
        // if (background) formData.append('background', background);
        onSubmit && onSubmit(formData);

        setAvatar(null);
        setBackground(null);
        setDescription('');
        // setIsInitialized(false);
        reset({
            name: '',
            email: '',
            address: '',
            phoneNumber: '',
        });
    };
    return (
        <form
            action=""
            onSubmit={handleSubmit(onHandleSubmit)}
            className="px-4 pb-4 bg-[var(--bg-primary)] rounded border border-[var(--border-primary)]"
        >
            <div className="flex items-center justify-between gap-3">
                <Input id="scheduleDate" label="Ngày làm việc" type="date" {...register('scheduleDate')} />
                <div className="w-full mt-4 z-20">
                    <label htmlFor="position" className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                        Bác sĩ
                    </label>
                    <Controller
                        name="doctorId"
                        control={control}
                        rules={{ required: 'Vui lòng chọn bác sĩ' }}
                        render={({ field }) => {
                            return (
                                <SelectOption
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={doctors.map((item) => ({
                                        value: item.doctorId?.userId,
                                        label: item.doctorId?.fullname,
                                    }))}
                                    placeholder="Chọn bác sĩ"
                                />
                            );
                        }}
                    />
                    {errors.doctorId && <p className="text-red-500 text-sm mt-1">{errors.doctorId?.message}</p>}
                </div>
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

export default FormDoctorSchedule;
