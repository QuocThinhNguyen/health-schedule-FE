import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomTinyMCE from "~/components/CustomTinyMCE";
import ImageInput from "~/components/ImageInput";
import Input from "~/components/Input";
import { UserContext } from "~/context/UserContext";

function FormService({ onSubmit, defaultValues = {} }) {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();
    const [image, setImage] = useState(null);
    const [content, setContent] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [buttonName, setButtonName] = useState('Thêm');

    const handleClickReturn = () => {
        navigate('/clinic/service');
    };

    useEffect(() => {
        if (!isInitialized && defaultValues && Object.keys(defaultValues).length > 0) {
            setValue('title', defaultValues.title || '');
            setImage(defaultValues.image);
            setContent(defaultValues.content || '');
            setIsInitialized(true);
            setButtonName('Cập nhật');
        }
    }, [defaultValues, setValue, isInitialized]);

    const onHandleSubmit = (data) => {
        const formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('title', data.title);
        formData.append('content', content);
        if (image) formData.append('image', image);
        onSubmit && onSubmit(formData);
        setImage(null);
        setContent('');
        reset({
            title: '',
        });
    };

    return (
        <form
            onSubmit={handleSubmit(onHandleSubmit)}
            className="px-4 pb-4 bg-[var(--bg-primary)] rounded border border-[var(--border-primary)]"
        >
            <div className="w-full flex flex-col mt-4">
                <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">Ảnh bài viết</label>
                <ImageInput value={image} onChange={setImage} className="w-full h-96" />
            </div>
            <div className="w-full mt-4">
                <Input
                    id="title"
                    label="Tên dịch vụ"
                    type="text"
                    placeholder="Nhập tên dịch vụ"
                    {...register('name', { required: 'Vui lòng nhập tên dịch vụ' })}
                    error={errors.name?.message}
                />
            </div>
            <div className="w-full mt-4">
                <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">Mô tả</label>
                <CustomTinyMCE name="content" value={content} onChange={setContent} />
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

export default FormService;
