import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FiFileText, FiInfo, FiSettings, FiTag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { axiosInstance } from '~/api/apiRequest';
import CustomTinyMCE from '~/components/CustomTinyMCE';
import ImageInput from '~/components/ImageInput';
import Input from '~/components/Input';
import SelectOption from '~/components/SelectOption';
import { ClinicContext } from '~/context/ClinicContext';

function FormService({ onSubmit, defaultValues = {} }) {

    const { clinicId } = useContext(ClinicContext);
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
    const [image, setImage] = useState(null);
    const [serviceCatgories, setServiceCatgories] = useState([]);
    const [serviceDescription, setServiceDescription] = useState('');
    const [preparationProcess, setPreparationProcess] = useState('');
    const [serviceDetails, setServiceDetails] = useState('');

    const [isInitialized, setIsInitialized] = useState(false);
    const [buttonName, setButtonName] = useState('Thêm');

    const handleClickReturn = () => {
        navigate('/clinic/service');
    };

    useEffect(() => {
        const fetchServiceCategories = async () => {
            try {
                const response = await axiosInstance.get(`/service-category/dropdown`);
                console.log('Service categories response:', response.data);

                if (response.status === 200) {
                    setServiceCatgories(response.data);
                } else {
                    console.error('No service category are found:', response.message);
                    setServiceCatgories([]);
                }
            } catch (error) {
                console.error('Error fetching service category:', error);
                setServiceCatgories([]);
            }
        };
        fetchServiceCategories();
    }, []);

    useEffect(() => {
        if (!isInitialized && defaultValues && Object.keys(defaultValues).length > 0) {
            setValue('name', defaultValues.name || '');
            setValue('price', defaultValues.price || '');
            setValue('serviceCategoryId', defaultValues.serviceCategoryId?.serviceCategoryId || '');
            setImage(defaultValues.image);
            setServiceDescription(defaultValues.description || '');
            setPreparationProcess(defaultValues.preparationProcess || '');
            setServiceDetails(defaultValues.serviceDetail || '');
            setIsInitialized(true);
            setButtonName('Cập nhật');
        }
    }, [defaultValues, setValue, isInitialized]);

    const onHandleSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price);
        formData.append('clinicId', clinicId);
        formData.append('serviceCategoryId', data.serviceCategoryId);
        formData.append('serviceDescription', serviceDescription);
        formData.append('preparationProcess', preparationProcess);
        formData.append('serviceDetails', serviceDetails);
        if (image) formData.append('image', image);
        onSubmit && onSubmit(formData);
        setImage(null);
        setServiceDescription('');
        setPreparationProcess('');
        setServiceDetails('');
        reset({
            name: '',
            price: '',
            serviceCategoryId: '',
        });
    };

    const TABS = [
        { id: 'serviceDescription', label: 'Về dịch vụ', icon: FiInfo, field: 'serviceDescription' },
        { id: 'preparationProcess', label: 'Quá trình chuẩn bị', icon: FiSettings, field: 'preparationProcess' },
        { id: 'serviceDetails', label: 'Chi tiết dịch vụ', icon: FiFileText, field: 'serviceDetails' },
    ];

    return (
        <form onSubmit={handleSubmit(onHandleSubmit)} className="">
            <div className="w-full flex justify-between gap-3">
                <div className="p-4 pb-4 bg-[var(--bg-primary)] rounded border border-[var(--border-primary)] w-1/3">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center">
                        <FiTag className="mr-3 text-[var(--bg-active)]" />
                        Thông tin cơ bản
                    </h2>
                    <div className="w-full flex flex-col mt-4">
                        <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">Ảnh dịch vụ</label>
                        <ImageInput value={image} onChange={setImage} className="w-full h-64" />
                    </div>
                    <Input
                        id="name"
                        label="Tên dịch vụ"
                        type="text"
                        placeholder="Nhập tên dịch vụ"
                        {...register('name', { required: 'Vui lòng nhập tên dịch vụ' })}
                        error={errors.name?.message}
                    />
                    <Input
                        id="price"
                        label="Giá dịch vụ"
                        type="text"
                        placeholder="Nhập giá dịch vụ"
                        {...register('price', { required: 'Vui lòng nhập giá dịch vụ' })}
                        error={errors.price?.message}
                    />
                    <div className="w-full mt-4 z-20">
                        <label htmlFor="position" className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                            Loại dịch vụ
                        </label>
                        <Controller
                            name="serviceCategoryId"
                            control={control}
                            rules={{ required: 'Vui lòng chọn loại dịch vụ' }}
                            render={({ field }) => {
                                return (
                                    <SelectOption
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={serviceCatgories.map((item) => ({
                                            value: item.serviceCategoryId,
                                            label: item.name,
                                        }))}
                                        placeholder="Chọn loại dịch vụ"
                                    />
                                );
                            }}
                        />
                        {errors.doctorId && <p className="text-red-500 text-sm mt-1">{errors.doctorId?.message}</p>}
                    </div>
                </div>
                <div className="p-4 pb-4 bg-[var(--bg-primary)] rounded border border-[var(--border-primary)] flex-1">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center">
                        <FiFileText className="mr-3 text-[var(--bg-active)]" />
                        Mô tả chi tiết dịch vụ
                    </h2>

                    <Tabs>
                        <TabList className="flex gap-3 rounded p-2 mb-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
                            {TABS.map((tab) => (
                                <Tab
                                    key={tab.id}
                                    className="py-3 px-4 rounded cursor-pointer focus:outline-none border-transparent flex items-center gap-2 hover:bg-[rgba(var(--bg-active-rgb),0.15)] transform transition-all duration-100 ease-in-out"
                                    selectedClassName="bg-[var(--bg-active)] text-[var(--text-active)] hover:bg-[var(--bg-active)]"
                                >
                                    <tab.icon />
                                    {tab.label}
                                </Tab>
                            ))}
                        </TabList>
                        <TabPanel>
                            <div className="w-full ">
                                <CustomTinyMCE
                                    name="serviceDescription"
                                    value={serviceDescription}
                                    onChange={setServiceDescription}
                                    height={450}
                                />
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="w-full">
                                <CustomTinyMCE
                                    name="preparationProcess"
                                    value={preparationProcess}
                                    onChange={setPreparationProcess}
                                    height={450}
                                />
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="w-full">
                                <CustomTinyMCE
                                    name="serviceDetails"
                                    value={serviceDetails}
                                    onChange={setServiceDetails}
                                    height={450}
                                />
                            </div>
                        </TabPanel>
                    </Tabs>
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

export default FormService;
