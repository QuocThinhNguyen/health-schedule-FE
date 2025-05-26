import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "~/api/apiRequest";
import Input from "~/components/Input";
import SelectOption from "~/components/SelectOption";

function FormServiceSchedule({ onSubmit, defaultValues = {} }) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        control,
    } = useForm();

    const [services, setServices] = useState([]);
    const [data, setData] = useState({
        scheduleDate: '',
        serviceId: '',
        timeTypes: [],
    });
    const [isInitialized, setIsInitialized] = useState(false);
    const [buttonName, setButtonName] = useState('Thêm');

    const handleClickReturn = () => {
        navigate('/clinic/service-schedule');
    };

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

    const timeTypeList = Object.keys(timeTypeMapping).map((key) => ({
        value: key,
        label: timeTypeMapping[key],
    }));

    useEffect(() => {
        const getDropdownServices = async () => {
            try {
                const response = await axiosInstance.get(`/service/clinic`);
                if (response.status === 200) {
                    setServices(response.data);
                } else {
                    console.error('No doctors are found:', response.message);
                    setServices([]);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setServices([]);
            }
        };
        getDropdownServices();
    }, []);

    useEffect(() => {
        if (!isInitialized && defaultValues && Object.keys(defaultValues).length > 0) {
            setValue('scheduleDate', defaultValues.scheduleDate || '');
            setValue('serviceId', defaultValues.serviceId?.serviceId || '');
            setValue('timeTypes', defaultValues.timeTypes || []);
            setIsInitialized(true);
            setButtonName('Cập nhật');
        }
    }, [defaultValues, setValue, isInitialized]);

    const onHandleSubmit = (data) => {
        setData({
            scheduleDate: data.scheduleDate,
            serviceId: data.serviceId,
            timeTypes: data.timeTypes,
        });
        onSubmit && onSubmit(data);
        reset({
            scheduleDate: '',
            serviceId: '',
            timeTypes: [],
        });
    };
    return (
        <form
            onSubmit={handleSubmit(onHandleSubmit)}
            className="px-4 pb-4 bg-[var(--bg-primary)] rounded border border-[var(--border-primary)]"
        >
            <div className="flex items-center justify-between gap-3">
                <Input
                    id="scheduleDate"
                    label="Ngày làm việc"
                    type="date"
                    {...register('scheduleDate', { required: 'Vui lòng chọn ngày làm việc' })}
                    error={errors.scheduleDate?.message}
                />
                <div className="w-full mt-4 z-20">
                    <label htmlFor="position" className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                        Dịch vụ
                    </label>
                    <Controller
                        name="serviceId"
                        control={control}
                        rules={{ required: 'Vui lòng chọn dịch vụ' }}
                        render={({ field }) => {
                            return (
                                <SelectOption
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={services.map((item) => ({
                                        value: item.serviceId,
                                        label: item.name,
                                    }))}
                                    placeholder="Chọn dịch vụ"
                                />
                            );
                        }}
                    />
                    {errors.serviceId && <p className="text-red-500 text-sm mt-1">{errors.serviceId?.message}</p>}
                </div>
            </div>
            <div className="w-full mt-20">
                <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">Chọn thời gian</label>
                <Controller
                    control={control}
                    name="timeTypes"
                    rules={{ required: 'Vui lòng chọn ít nhất một thời gian' }}
                    render={({ field }) => {
                        const { value = [], onChange } = field;
                        const handleSelect = (val) => {
                            let updated = [];
                            if (value.includes(val)) {
                                updated = value.filter((t) => t !== val);
                            } else {
                                updated = [...value, val];
                            }
                            onChange(updated);
                        };
                        return (
                            <>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeTypeList.map((time) => (
                                        <button
                                            key={time.value}
                                            type="button"
                                            onClick={() => handleSelect(time.value)}
                                            className={`px-3 py-2 h-10 rounded border border-[var(--border-primary)]  ${
                                                value.includes(time.value)
                                                    ? 'bg-[var(--bg-active)] text-[var(--text-active)]'
                                                    : 'hover:bg-[rgba(var(--bg-active-rgb),0.15)] hover:text-[rgb(var(--bg-active-rgb))]'
                                            }`}
                                        >
                                            {time.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.timeTypes && (
                                    <p className="text-red-500 text-sm mt-1">{errors.timeTypes?.message}</p>
                                )}
                            </>
                        );
                    }}
                />
                {/* <div className="grid grid-cols-4 gap-2">
                    {timeTypeList.map((time) => (
                        <button
                            key={time.value}
                            type="button"
                            rules={{ required: 'Vui lòng chọn thời gian' }}
                            onClick={() => handleTimeTypeClick(time.value)}
                            className={`px-3 py-2 h-10 rounded border border-[var(--border-primary)]  ${
                                selectedTimeTypes.includes(time.value)
                                    ? 'bg-[var(--bg-active)] text-[var(--text-active)]'
                                    : 'hover:bg-[rgba(var(--bg-active-rgb),0.15)] hover:text-[rgb(var(--bg-active-rgb))]'
                            }`}
                        >
                            {time.label}
                        </button>
                    ))}
                    {errors.timeTypes && <p className="text-red-500 text-sm mt-1">{errors.timeTypes?.message}</p>}
                </div> */}
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

export default FormServiceSchedule;
