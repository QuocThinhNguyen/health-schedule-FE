import ServiceItem from './ServiceItem';
import React from 'react';
import Select from 'react-select';
function ListFilterService() {
    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="font-bold text-base text-black">1456 Dịch vụ</p>
                <Select
                    options={[
                        { value: 'gia-cao-den-thap', label: 'Giá cao nhất' },
                        { value: 'gia-thap-den-cao', label: 'Giá thấp nhất' },
                    ]}
                    placeholder="--------Sắp xếp-------"
                    // onChange={handleChange}
                    className="z-10 min-w-[219.2px] "
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            border: '0.8px solid #E4E8EC !important',
                            borderRadius: '4px !important',
                        }),
                        indicatorSeparator: () => ({
                            display: 'none', //
                        }),
                    }}
                />
            </div>
            <div className="mt-6">
                <ServiceItem />
                <ServiceItem />
                <ServiceItem />
                <ServiceItem />
                <ServiceItem />
                <ServiceItem />
                <ServiceItem />
                <ServiceItem />
            </div>
        </div>
    );
}

export default ListFilterService;
