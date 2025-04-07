import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import CustomTinyMCE from '~/components/CustomTinyMCE';
import Input from '~/components/Input';
import ImageInput from '../components/ImageInput';

function FormSpecialty({ onSubmit, defaultValues = {} }) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [buttonName, setButtonName] = useState('Thêm');

    const handleClickReturn = () => {
        navigate('/admin/specialty');
    };

    useEffect(() => {
        if (!isInitialized && defaultValues && Object.keys(defaultValues).length > 0) {
            setValue('name', defaultValues.name || '');
            setImage(defaultValues.image);
            setDescription(defaultValues.description || '');
            setIsInitialized(true);
            setButtonName('Cập nhật');
        }
    }, [defaultValues, setValue, isInitialized]);

    const onHandleSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', description);
        if (image) formData.append('image', image);
        onSubmit && onSubmit(formData);
        setImage(null);
        setDescription('');
        reset({
            name: '',
            description: '',
        });
    };

    return (
        <form
            onSubmit={handleSubmit(onHandleSubmit)}
            className="px-4 pb-4 bg-[var(--bg-primary)] rounded border border-[var(--border-primary)]"
        >
            <div className="flex items-center justify-between gap-3">
                <div className="w-3/4">
                    <Input
                        label="Tên chuyên khoa"
                        type="text"
                        placeholder="Nhập tên chuyên khoa"
                        {...register('name', { required: 'Vui lòng nhập tên chuyên khoa' })}
                        error={errors.name?.message}
                    />
                </div>
                <div className="w-1/4 flex justify-center items-center mt-4">
                    <ImageInput value={image} onChange={setImage} className="w-48 h-48" />
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

export default FormSpecialty;
