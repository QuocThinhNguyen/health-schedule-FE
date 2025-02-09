import { MdDeleteForever } from 'react-icons/md';
import { RiDeleteBin5Line } from 'react-icons/ri';

function SideBarFilter() {
    return (
        <div className="w-full bg-[#f8f9fc] border border-[#E4E8EC] rounded-lg p-6 text-sm">
            <div className="h-max">
                <div className="pb-4 border-b mb-4">
                    <h4 className="text-[#1B3250] font-semibold border-l-[3px] border-[#2d87f3] uppercase leading-4 pl-2 mb-3">
                        Tỉnh/Thành phố
                    </h4>
                    <select
                        name="province"
                        id="province"
                        // onChange={handleProvinceChange}
                        className="w-full h-10 border border-[#E4E8EC] rounded-lg p-2"
                    >
                        <option value="">Tất cả</option>
                        <option value="">Tất cả</option>
                        <option value="">A</option>
                        {/* {provinces.map((item, index) => ( */}
                        {/* <option key={index} value={item}>
                    {item}
                </option> */}
                        {/* ))} */}
                    </select>
                </div>
                {/* <div>
            {districts.length > 0 && (
                <div className="border-t border-gray-300 p-4">
                    <h3 className="font-semibold">Quận/Huyện</h3>
                    {districts.map((district, index) => (
                    <div key={index} className="flex items-center flex-wrap gap-2">
                        <input
                            type="checkbox"
                            id={district}
                            name="district"
                            value={district}
                            checked={selectedDistricts.includes(district)}
                            onChange={handleDistrictChange}
                        />
                        <label className="text-2xl" htmlFor={district}>
                            {district}
                        </label>
                    </div>
                    ))}
                </div>
            )}
        </div> */}
            </div>
            <div className="flex gap-2 items-center text-base font-semibold cursor-pointer text-[#2d87f3] hover:opacity-80">
                <MdDeleteForever />
                Xóa tất cả
            </div>
        </div>
    );
}

export default SideBarFilter;
