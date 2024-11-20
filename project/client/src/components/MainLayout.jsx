import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const MainLayout = () => {
    return (
        <div className="MainLayout">
            <NavBar/>
            <Outlet/>
        </div>
    );
}

export default MainLayout;