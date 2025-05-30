import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '~/components/Input';

function FormServiceCategory({ onSubmit, defaultValues = {} }) {

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();

    const [isInitialized, setIsInitialized] = useState(false);
    const [buttonName, setButtonName] = useState('Thêm');

    const handleClickReturn = () => {
        navigate('/clinic/service-category');
    };

    useEffect(() => {
        if (!isInitialized && defaultValues && Object.keys(defaultValues).length > 0) {
            setValue('name', defaultValues.name || '');
            setIsInitialized(true);
            setButtonName('Cập nhật');
        }
    }, [defaultValues, setValue, isInitialized]);

    const onHandleSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        onSubmit && onSubmit(formData);
        reset({
            name: '',
        });
    };

    return (
        <form onSubmit={handleSubmit(onHandleSubmit)} className="">
            <div className="w-full flex justify-between gap-3">
                <div className="p-4 pb-4 bg-[var(--bg-primary)] rounded border border-[var(--border-primary)] w-full">
                    <Input
                        id="name"
                        label="Tên loại dịch vụ"
                        type="text"
                        placeholder="Nhập tên loại dịch vụ"
                        {...register('name', { required: 'Vui lòng nhập tên loại dịch vụ' })}
                        error={errors.name?.message}
                    />
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

export default FormServiceCategory;
