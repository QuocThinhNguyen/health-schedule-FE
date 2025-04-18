import { BsCoin } from 'react-icons/bs';
import { CiHospital1, CiLocationOn } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { formatTitleForUrl } from '~/utils/formatTitleForUrl';

function Service({ data }) {
    const navigate = useNavigate();
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const handleClickService = () => {
        navigate(`/dich-vu/${formatTitleForUrl(data.name)}-${data.serviceId}`);
    };

    return (
        <div className="px-2 mt-4 group">
            <div className="bg-white rounded-xl shadow cursor-pointer border group-hover:border group-hover:border-[rgb(44,116,223)] group-hover:shadow-2xl">
                <div className="flex flex-col items-center">
                    <div className="flex justify-center max-w-full w-full h-[174px] items-center overflow-hidden ">
                        <img
                            src={
                                data?.image ||
                                'https://cdn-healthcare.hellohealthgroup.com/2024/10/1730355742_6723221e070f74.33065859.jpg?w=384&q=75'
                            }
                            loading="lazy"
                            alt={data?.name || 'Dịch vụ không xác định'}
                            className="object-cover object-center w-full h-full rounded-tl-xl rounded-tr-xl"
                        />
                    </div>

                    <div className="px-3 pt-2 pb-3 flex flex-col justify-between gap-2 w-full">
                        <div className="flex-1 flex flex-col gap-1 leading-[20px] text-sm">
                            <p className="mb-1 font-semibold leading-6 text-lg line-clamp-2 min-h-12 text-custom262626">
                                {data?.name || 'Dịch vụ không xác định'}
                            </p>
                            <p className="flex items-center gap-x-1">
                                <BsCoin className="mt-[2px] " />
                                <span className="text-customYellow text-base font-medium">
                                    {formatCurrency(data?.price) || 'Không xác định'}
                                </span>
                            </p>
                            <p className="flex items-start gap-x-1">
                                <CiHospital1 className="mt-1" />
                                {data?.clinicId?.name || 'Bệnh viện không xác định'}
                            </p>
                            <p className="flex items-start gap-x-1 min-h-10">
                                <span>
                                    <CiLocationOn className="mt-1 " />
                                </span>
                                <span className="line-clamp-2">
                                    {data?.clinicId?.address || 'Địa chỉ không xác định'}
                                </span>
                            </p>
                        </div>

                        <div
                            onClick={handleClickService}
                            className="w-full text-center bg-white group-hover:bg-[rgb(44,116,223)] border border-gray-300 group-hover:border-[#00B5F1] group-hover:text-white  font-semibold px-3 h-10 leading-9  rounded-lg "
                        >
                            Đặt lịch dịch vụ
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Service;
