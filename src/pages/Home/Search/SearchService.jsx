import { CiHospital1 } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { formatTitleForUrl } from '~/utils/formatTitleForUrl';

function SearchService(data) {
    const navigate = useNavigate();

    const service = data.data;

    const handleClickService = () => {
        navigate(`/dich-vu/${formatTitleForUrl(service.name)}-${service.serviceId}`);
    };

    return (
        <div
            onClick={handleClickService}
            className="px-6 py-2 hover:shadow-xl flex items-center gap-4 hover:bg-[rgba(227,242,255,0.3)] cursor-pointer border-b-2 border-transparent hover:border-b-2 hover:border-blue-400"
        >
            <div>
                <img src="https://cdn-healthcare.hellohealthgroup.com/services/Specialty.png" alt={service.name} className="w-12 h-12 object-cover rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="font-bold">{service.name}</div>
                <div className="flex items-center justify-start text-xs gap-2">
                    <CiHospital1 className="inline-block text-base" />
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">{service?.clinicId?.name}</span>
                </div>
            </div>
        </div>
    );
}

export default SearchService;
