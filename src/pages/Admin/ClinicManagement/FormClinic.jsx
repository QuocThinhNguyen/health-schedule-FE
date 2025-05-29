import CustomTinyMCE from '~/components/CustomTinyMCE';
import ImageInput from '../../../components/ImageInput';
import { useNavigate } from 'react-router-dom';
import Input from '~/components/Input';
import SelectInput from '~/components/SelectInput/SelectInput';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import axios from 'axios';

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

    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [selectDistrict, setSelectDistrict] = useState(null);
    const [wards, setWards] = useState([]);
    const [selectWard, setSelectWard] = useState(null);

    console.log('Select province:', selectedProvince);

    useEffect(() => {
        if (!isInitialized && defaultValues && Object.keys(defaultValues).length > 0) {
            setValue('name', defaultValues.name || '');
            setValue('email', defaultValues.email || '');
            setValue('address', defaultValues.address || '');
            setValue('phoneNumber', defaultValues.phoneNumber || '');
            setValue('street', defaultValues.street || '');
            setAvatar(defaultValues.image);
            setBackground(defaultValues.background);
            setDescription(defaultValues.description || '');

            if (defaultValues.provinceCode && defaultValues.provinceName) {
                setSelectedProvince({
                    value: defaultValues.provinceCode,
                    label: defaultValues.provinceName,
                });
            }

            if (defaultValues.districtCode && defaultValues.districtName) {
                setSelectDistrict({
                    value: defaultValues.districtCode,
                    label: defaultValues.districtName,
                });
            }

            if (defaultValues.wardCode && defaultValues.wardName) {
                setSelectWard({
                    value: defaultValues.wardCode,
                    label: defaultValues.wardName,
                });
            }

            setIsInitialized(true);
            setButtonName('Cập nhật');
        }
    }, [defaultValues, setValue, isInitialized]);

    const onHandleSubmit = (data) => {
        const formData = new FormData();
        const fullAddress = `${data.street}, ${selectWard.label || ''}, ${selectDistrict.label || ''}, ${
            selectedProvince.label || ''
        }`;
        formData.append('name', data.name);
        formData.append('email', data.email);
        // formData.append('address', data.address);
        formData.append('address', fullAddress);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('description', description);
        formData.append('street', data.street);

        if (selectedProvince) {
            formData.append('provinceCode', selectedProvince.value);
            formData.append('provinceName', selectedProvince.label);
        }

        if (selectDistrict) {
            formData.append('districtCode', selectDistrict.value);
            formData.append('districtName', selectDistrict.label);
        }

        if (selectWard) {
            formData.append('wardCode', selectWard.value);
            formData.append('wardName', selectWard.label);
        }
        if (avatar) formData.append('image', avatar);
        // if (background) formData.append('background', background);
        onSubmit && onSubmit(formData);

        setAvatar(null);
        setBackground(null);
        setDescription('');
        setProvinces([]);
        setSelectedProvince(null);
        setDistricts([]);
        setSelectDistrict(null);
        setWards([]);
        setSelectWard(null);
        // setIsInitialized(false);
        reset({
            name: '',
            email: '',
            address: '',
            phoneNumber: '',
        });
    };

    useEffect(() => {
        const getProvinces = async () => {
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/p/');
                const formatted = response.data.map((item) => ({
                    value: item.code,
                    label: item.name,
                }));
                setProvinces(formatted);
            } catch (e) {
                console.log('Errorr: ', e.message);
            }
        };
        getProvinces();
    }, []);

    // lấy danh sách quận, huyện
    useEffect(() => {
        const getDistricts = async () => {
            if (!selectedProvince) {
                setDistricts([]);
                setSelectDistrict(null);
                setWards([]);
                setSelectWard(null);
                return;
            }
            try {
                const response = await axios.get(
                    `https://provinces.open-api.vn/api/p/${selectedProvince.value}?depth=2`,
                );
                const formatted = response.data.districts.map((item) => ({
                    value: item.code,
                    label: item.name,
                }));
                setDistricts(formatted);
            } catch (err) {
                console.log('Error: ', err);
            }
        };
        getDistricts();
    }, [selectedProvince]);

    // lấy danh sách phường, xã
    useEffect(() => {
        const getWards = async () => {
            if (!selectDistrict) {
                setWards([]);
                setSelectWard(null);
                return;
            }
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/d/${selectDistrict.value}?depth=2`);
                const formatted = response.data.wards.map((item) => ({
                    value: item.code,
                    label: item.name,
                }));
                setWards(formatted);
            } catch (err) {
                console.log('Error', err.message);
            }
        };
        getWards();
    }, [selectDistrict]);

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

                    <SelectInput
                        label="Tỉnh/Thành phố"
                        placeholder="Chọn tỉnh/thành phố"
                        options={provinces}
                        value={selectedProvince}
                        onChange={setSelectedProvince}
                        isClearable={true}
                    />
                    <SelectInput
                        label="Quận/Huyện"
                        placeholder="Chọn quận/huyện"
                        options={districts}
                        value={selectDistrict}
                        onChange={setSelectDistrict}
                        isClearable={true}
                    />
                    <SelectInput
                        label="Phường/Xã"
                        placeholder="Chọn phường/xã"
                        options={wards}
                        value={selectWard}
                        onChange={setSelectWard}
                        isClearable={true}
                    />

                    <Input
                        id="street"
                        label="Số nhà, tên đường"
                        type="text"
                        placeholder="Nhập số nhà, tên đường"
                        {...register('street', { required: 'Vui lòng nhập số nhà, tên đường' })}
                    />

                    {/* <Input
                        id="address"
                        label="Địa chỉ"
                        type="text"
                        placeholder="Nhập địa chỉ bệnh viện"
                        {...register('address', { required: 'Vui lòng nhập địa chỉ bệnh viện' })}
                        error={errors.address?.message}
                    /> */}
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
