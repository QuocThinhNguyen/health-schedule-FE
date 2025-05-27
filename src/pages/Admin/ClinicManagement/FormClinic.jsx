import CustomTinyMCE from '~/components/CustomTinyMCE';
import ImageInput from '../../../components/ImageInput';
import { useNavigate } from 'react-router-dom';
import Input from '~/components/Input';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

function FormClinic({ onSubmit, defaultValues = {} }) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();
    const [avatar, setAvatar] = useState(null);

    const [background, setBackground] = useState(null);
    const [description, setDescription] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [buttonName, setButtonName] = useState('Thêm');

    const handleClickReturn = () => {
        navigate('/admin/clinic');
    };

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
                <div className="w-3/4">
                    <Input
                        id="name"
                        label="Tên bệnh viện"
                        type="text"
                        placeholder="Nhập tên bệnh viện"
                        {...register('name', { required: 'Vui lòng nhập tên bệnh viện' })}
                        error={errors.name?.message}
                    />
                    <Input
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="Nhập email bệnh viện"
                        {...register('email', { required: 'Vui lòng nhập email' })}
                        error={errors.email?.message}
                    />
                    <div className="mt-4 space-y-2">
                        <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                            Tỉnh/Thành phố
                        </label>
                        <Select id="province" label="Tỉnh/Thành phố" placeholder="Chọn tỉnh/thành phố" />
                    </div>

                    <Input
                        id="address"
                        label="Địa chỉ"
                        type="text"
                        placeholder="Nhập địa chỉ bệnh viện"
                        {...register('address', { required: 'Vui lòng nhập địa chỉ bệnh viện' })}
                        error={errors.address?.message}
                    />
                    <Input
                        id="phoneNumber"
                        label="Số điện thoại"
                        type="text"
                        placeholder="Nhập số điện thoại bệnh viện"
                        {...register('phoneNumber', { required: 'Vui lòng nhập số điện thoại' })}
                        error={errors.phoneNumber?.message}
                    />
                </div>
                <div className="w-1/4 flex justify-center items-center mt-4">
                    <ImageInput value={avatar} onChange={setAvatar} className="w-48 h-48" />
                </div>
            </div>
            <div className="w-full mt-4 flex flex-col">
                <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">Ảnh nền</label>
                <ImageInput value={background} onChange={setBackground} className="max-w-6xl h-96" />
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

export default FormClinic;
