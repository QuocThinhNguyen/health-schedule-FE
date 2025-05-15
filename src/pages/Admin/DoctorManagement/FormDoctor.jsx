import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '~/components/Input';
import ImageInput from '../../../components/ImageInput';
import CustomTinyMCE from '~/components/CustomTinyMCE';
import SelectOption from '../../../components/SelectOption';
import { axiosClient, axiosInstance } from '~/api/apiRequest';

function FormDoctor({ onSubmit, defaultValues = {} }) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        control,
    } = useForm();

    const [clinics, setClinics] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [academicRanksAndDegreess, setAcademicRanksAndDegreess] = useState([]);

    const [avatar, setAvatar] = useState(null);
    const [description, setDescription] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [buttonName, setButtonName] = useState('Thêm');

    const handleClickReturn = () => {
        navigate('/admin/doctor');
    };

    useEffect(() => {
        const fetchData = async () => {
            await getDropdownClinics();
            await getDropdownSpecialties();
            await getDropdownAcademicRanksAndDegrees();
        };
        fetchData();
    }, []);

    const getDropdownClinics = async () => {
        try {
            const response = await axiosInstance.get(`/clinic/dropdown`);

            if (response.status === 200) {
                setClinics(response.data);
            } else {
                console.error('No clinics are found:', response.message);
                setClinics([]);
            }
        } catch (error) {
            console.error('Error fetching clinics:', error);
            setClinics([]);
        }
    };

    const getDropdownSpecialties = async () => {
        try {
            const response = await axiosInstance.get(`/specialty/dropdown`);

            if (response.status === 200) {
                setSpecialties(response.data);
            } else {
                console.error('No specialty are found:', response.message);
                setSpecialties([]);
            }
        } catch (error) {
            console.error('Error fetching specialty:', error);
            setSpecialties([]);
        }
    };

    const getDropdownAcademicRanksAndDegrees = async () => {
        try {
            const response = await axiosClient.get(`/doctor/academic-ranks-and-degrees`);

            if (response.status === 200) {
                setAcademicRanksAndDegreess(response.data);
            } else {
                console.error('No academic ranks and degrees are found:', response.message);
                setAcademicRanksAndDegreess([]);
            }
        } catch (error) {
            console.error('Error fetching academic ranks and degrees:', error);
            setAcademicRanksAndDegreess([]);
        }
    };

    useEffect(() => {
        console.log('defaultValues', defaultValues);

        if (!isInitialized && defaultValues && Object.keys(defaultValues).length > 0) {
            setValue('fullname', defaultValues.fullname || '');
            setValue('email', defaultValues.email || '');
            setValue('address', defaultValues.address || '');
            setValue('phoneNumber', defaultValues.phoneNumber || '');
            setValue('position', defaultValues.position || '');
            setValue('price', defaultValues.price || '');
            setValue('specialtyId', defaultValues.specialtyId || '');
            setValue('clinicId', defaultValues.clinicId || '');
            setAvatar(defaultValues.image);
            setDescription(defaultValues.description || '');
            setIsInitialized(true);
            setButtonName('Cập nhật');
        }
    }, [defaultValues, setValue, isInitialized]);

    const onHandleSubmit = (data) => {
        const formData = new FormData();
        formData.append('position', data.position);
        formData.append('price', data.price);
        formData.append('specialtyId', data.specialtyId);
        formData.append('clinicId', data.clinicId);
        formData.append('description', description);
        onSubmit && onSubmit(formData);

        setDescription('');
        reset({
            position: '',
            price: '',
            specialtyId: '',
            clinicId: '',
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
                        <Input id="fullname" label="Họ và tên" type="text" readOnly {...register('fullname')} />
                        <Input id="email" label="Email" type="text" readOnly {...register('email')} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <Input id="address" label="Địa chỉ" type="text" readOnly {...register('address')} />
                        <Input
                            id="phoneNumber"
                            label="Số điện thoại"
                            type="text"
                            readOnly
                            {...register('phoneNumber')}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <div className="w-full mt-4 z-20">
                            <label
                                htmlFor="position"
                                className="block text-sm font-medium mb-1 text-[var(--text-primary)]"
                            >
                                Chức danh
                            </label>
                            <Controller
                                name="position"
                                control={control}
                                rules={{ required: 'Vui lòng chọn chức danh' }}
                                render={({ field }) => {
                                    return (
                                        <SelectOption
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={academicRanksAndDegreess.map((item) => ({
                                                value: item.keyMap,
                                                label: item.valueVi,
                                            }))}
                                            placeholder="Chọn chức danh"
                                        />
                                    );
                                }}
                            />
                            {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position?.message}</p>}
                        </div>
                        <Input
                            id="price"
                            label="Giá khám (VNĐ)"
                            type="text"
                            {...register('price', { required: 'Vui lòng nhập giá khám' })}
                            error={errors.price?.message}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <div className="w-full mt-4 z-10">
                            <label
                                htmlFor="specialtyId"
                                className="block text-sm font-medium mb-1 text-[var(--text-primary)]"
                            >
                                Chuyên khoa
                            </label>
                            <Controller
                                name="specialtyId"
                                control={control}
                                rules={{ required: 'Vui lòng chọn chuyên khoa' }}
                                render={({ field }) => {
                                    return (
                                        <SelectOption
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={specialties.map((item) => ({
                                                value: item.specialtyId,
                                                label: item.name,
                                            }))}
                                            placeholder="Chọn chuyên khoa"
                                        />
                                    );
                                }}
                            />
                            {errors.specialtyId && (
                                <p className="text-red-500 text-sm mt-1">{errors.specialtyId?.message}</p>
                            )}
                        </div>
                        <div className="w-full mt-4 z-10">
                            <label
                                htmlFor="clinicId"
                                className="block text-sm font-medium mb-1 text-[var(--text-primary)]"
                            >
                                Bệnh viện
                            </label>
                            <Controller
                                name="clinicId"
                                control={control}
                                rules={{ required: 'Vui lòng chọn bệnh viện' }}
                                render={({ field }) => {
                                    return (
                                        <SelectOption
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={clinics.map((item) => ({
                                                value: item.clinicId,
                                                label: item.name,
                                            }))}
                                            placeholder="Chọn bệnh viện"
                                        />
                                    );
                                }}
                            />
                            {errors.clinicId && <p className="text-red-500 text-sm mt-1">{errors.clinicId?.message}</p>}
                        </div>
                    </div>
                </div>
                <div className="w-1/4 flex justify-center items-center mt-4">
                    <ImageInput value={avatar} onChange={setAvatar} className="w-48 h-48" />
                </div>
            </div>

            <div className="w-full mt-4">
                <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">Mô tả</label>
                <CustomTinyMCE name="description" value={description} onChange={setDescription} />
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

export default FormDoctor;
