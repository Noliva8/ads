import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div>
            <header>
                <h1>Admin Dashboard</h1>
                <nav>
                    <NavLink to="/admin" end>Overview</NavLink>{" | "}
                    <NavLink to="/admin/manage-adverts">Adverts</NavLink>{" | "}
                    <NavLink to="/admin/manage-songs">Songs</NavLink>{" | "}
                    <NavLink to="/admin/metadata">Metadata</NavLink>{" | "}
                    <NavLink to="/admin/settings">Settings</NavLink>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}