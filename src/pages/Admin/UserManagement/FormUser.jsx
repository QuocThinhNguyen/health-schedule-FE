import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '~/components/Input';
import ImageInput from '../../../components/ImageInput';
import SelectOption from '../../../components/SelectOption';
import { use } from 'react';
import { axiosClient, axiosInstance } from '~/api/apiRequest';

function FormUser({ onSubmit, defaultValues = {} }) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        control,
        watch,
    } = useForm();

    const roleId = watch('roleId');

    const genderOptions = {
        Male: 'Nam',
        Female: 'Nữ',
        Other: 'Khác',
    };
    const roleOptions = {
        R1: 'Quản trị viên',
        R2: 'Bác sĩ',
        R3: 'Người dùng',
        R4: 'Quản lý bệnh viện',
    };

    const [readOnly, setReadOnly] = useState(false);
    const [required, setRequired] = useState(true);
    const [clinicOptions, setClinicOptions] = useState([]);
    console.log('clinicOptions', clinicOptions);
    console.log('required', required);
    console.log('readOnly', readOnly);

    const [avatar, setAvatar] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [buttonName, setButtonName] = useState('Thêm');

    const handleClickReturn = () => {
        navigate('/admin/user');
    };

    useEffect(() => {
        const fetchClinicOptions = async () => {
            try {
                const response = await axiosInstance.get('/clinic/dropdown');
                console.log('response', response);
                if (response.status === 200) {
                    const option = response.data.map((item) => ({
                        value: item.clinicId,
                        label: item.name,
                    }));
                    setClinicOptions(option);
                } else {
                    console.log('Error fetching clinic options:', response.message);
                }
            } catch (error) {
                console.error('Error fetching clinic options:', error);
            }
        };
        fetchClinicOptions();
    }, []);

    useEffect(() => {
        console.log('defaultValues', defaultValues);
        if (!isInitialized && defaultValues && Object.keys(defaultValues).length > 0) {
            setValue('email', defaultValues.email || '');
            // setValue('password', defaultValues.password || '');
            setValue('fullname', defaultValues.fullname || '');
            setValue('phoneNumber', defaultValues.phoneNumber || '');
            setValue('birthDate', defaultValues.birthDate || '');
            setValue('address', defaultValues.address || '');
            setValue('gender', defaultValues.gender || '');
            setValue('roleId', defaultValues.roleId || '');
            setAvatar(defaultValues.image || null);
            setReadOnly(true);
            setRequired(false);
            setIsInitialized(true);
            setButtonName('Cập nhật');
        }
    }, [defaultValues, setValue, isInitialized]);

    const onHandleSubmit = (data) => {
        const x = {
            ...data,
            image: avatar,
        };
        console.log('-----------------> data', x);

        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('fullname', data.fullname);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('birthDate', data.birthDate);
        formData.append('address', data.address);
        formData.append('gender', data.gender);
        formData.append('roleId', data.roleId);
        formData.append('clinicId', data.clinicId);
        if (avatar) formData.append('image', avatar);
        onSubmit && onSubmit(formData);

        setAvatar(null);
        reset({
            email: '',
            password: '',
            fullname: '',
            phoneNumber: '',
            birthDate: '',
            address: '',
            gender: '',
            roleId: '',
        });
    };
    return (
        <form
            action=""
            onSubmit={handleSubmit(onHandleSubmit)}
            className="px-4 pb-4 bg-[var(--bg-primary)] rounded border border-[var(--border-primary)]"
        >
            <div className="flex items-center justify-between gap-3">
                <div className="w-3/4">
                    <div className="flex items-center justify-between gap-3">
                        <Input
                            id="email"
                            label="Email"
                            type="text"
                            readOnly={readOnly}
                            {...register('email', { required: 'Vui lòng nhập email' })}
                            error={errors.email?.message}
                        />
                        <Input
                            id="password"
                            label={required ? 'Mật khẩu' : 'Mật khẩu (Nếu không thay đổi thì để trống)'}
                            type="text"
                            {...register('password', {
                                validate: (val) => {
                                    if (required && !val) return 'Vui lòng nhập mật khẩu';
                                    return true;
                                },
                            })}
                            error={errors.password?.message}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <Input
                            id="fullname"
                            label="Họ và tên"
                            type="text"
                            {...register('fullname', { required: 'Vui lòng nhập họ và tên' })}
                            error={errors.fullname?.message}
                        />
                        <Input
                            id="phoneNumber"
                            label="Số điện thoại"
                            type="text"
                            {...register('phoneNumber', { required: 'Vui lòng nhập số điện thoại' })}
                            error={errors.phoneNumber?.message}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <Input
                            id="birthDate"
                            label="Ngày sinh"
                            type="date"
                            {...register('birthDate', { required: 'Vui lòng nhập ngày sinh' })}
                            error={errors.birthDate?.message}
                        />
                        <Input
                            id="address"
                            label="Địa chỉ"
                            type="text"
                            {...register('address', { required: 'Vui lòng nhập địa chỉ' })}
                            error={errors.address?.message}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <div className="w-full mt-4 z-50">
                            <label
                                htmlFor="gender"
                                className="block text-sm font-medium mb-1 text-[var(--text-primary)]"
                            >
                                Giới tính
                            </label>
                            <Controller
                                name="gender"
                                control={control}
                                rules={{ required: 'Vui lòng chọn giới tính' }}
                                render={({ field }) => {
                                    return (
                                        <SelectOption
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={Object.entries(genderOptions).map(([value, label]) => ({
                                                value: value,
                                                label: label,
                                            }))}
                                            placeholder="Chọn giới tính"
                                        />
                                    );
                                }}
                            />
                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender?.message}</p>}
                        </div>

                        <div className="w-full mt-4 z-50">
                            <label
                                htmlFor="roleId"
                                className="block text-sm font-medium mb-1 text-[var(--text-primary)]"
                            >
                                Vai trò
                            </label>
                            <Controller
                                name="roleId"
                                control={control}
                                rules={{ required: 'Vui lòng chọn vai trò' }}
                                render={({ field }) => {
                                    return (
                                        <SelectOption
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={Object.entries(roleOptions).map(([value, label]) => ({
                                                value: value,
                                                label: label,
                                            }))}
                                            placeholder="Chọn vai trò"
                                        />
                                    );
                                }}
                            />
                            {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId?.message}</p>}
                        </div>
                    </div>

                    {roleId === 'R4' && (
                        <div className="flex items-center justify-between gap-3">
                            <div className="w-full mt-4 z-20">
                                <label
                                    htmlFor="clinicId"
                                    className="block text-sm font-medium mb-1 text-[var(--text-primary)]"
                                >
                                    Bệnh viện quản lý
                                </label>
                                <Controller
                                    name="clinicId"
                                    control={control}
                                    rules={{ required: 'Vui lòng chọn bệnh viện quản lý' }}
                                    render={({ field }) => {
                                        return (
                                            <SelectOption
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={clinicOptions}
                                                placeholder="Chọn bệnh viện"
                                            />
                                        );
                                    }}
                                />
                                {errors.clinicId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.clinicId?.message}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-1/4 flex justify-center items-center mt-4">
                    <ImageInput value={avatar} onChange={setAvatar} className="w-48 h-48" />
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

export default FormUser;
