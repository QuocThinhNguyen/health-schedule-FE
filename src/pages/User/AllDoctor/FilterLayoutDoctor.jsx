import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Content from './Content';
import Filter from './Filter';
import { use } from 'react';
import { axiosClient } from '~/api/apiRequest';

function FilterLayoutDoctor() {
    const [searchParams] = useSearchParams();
    const initialFilters = Object.fromEntries(searchParams.entries());
    const [filters, setFilters] = useState(initialFilters);

    return (
        <div className="bg-[#f3f4f6] min-h-screen">
            <div className="relative max-w-[1280px] my-20 py-8 mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 items-start">
                <div className="w-1/5 rounded-2xl sticky top-20">
                    <Filter filters={filters} setFilters={setFilters} />
                </div>
                <div className="w-4/5 ">
                    <Content filters={filters} setFilters={setFilters} />
                </div>
            </div>
        </div>
    );
}

export default FilterLayoutDoctor;
