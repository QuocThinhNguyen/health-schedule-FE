import { Outlet } from "react-router-dom";
import SidebarAdmin from "~/components/SidebarAdmin";
import HeaderAdmin from "~/components/HeaderAdmin";
import { useContext } from "react";
import { ThemeContext } from "~/context/ThemeProvider";
import SidebarClinic from "~/components/SidebarClinic";

function ClinicLayout() {
    const { isDark} = useContext(ThemeContext);
    return (
        <div className={`flex ${isDark ? 'dark' : ''}`}>
            <div className="w-60 bg-[var(--bg-primary)]">
                <SidebarClinic />
            </div>
            <div className="flex-1 max-w-screen-admin">
                <HeaderAdmin />
                <main className="w-full overflow-y-auto h-screen-admin bg-[var(--bg-secondary)] mt-[68px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default ClinicLayout;