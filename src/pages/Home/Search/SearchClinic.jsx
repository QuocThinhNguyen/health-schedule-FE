import { GrLocation } from 'react-icons/gr';

function SearchClinic(data) {

    const clinic = data.data;

    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    return (
        <div className="px-6 py-2 hover:shadow-xl flex items-center gap-4 hover:bg-[rgba(227,242,255,0.3)] cursor-pointer border-b-2 border-transparent hover:border-b-2 hover:border-blue-400">
            <div>
                <img src={`${IMAGE_URL}${clinic.image}`} alt="lỗi" className="w-12 h-12 object-cover rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="font-bold">{clinic.name}</div>
                <div className="flex items-center justify-start text-xs gap-2">
                    <GrLocation className="inline-block text-base" />
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">{clinic.address}</span>
                </div>
            </div>
        </div>
    );
}

export default SearchClinic;
