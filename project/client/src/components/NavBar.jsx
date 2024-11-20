import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate()
    return (
        <div className="NavBar">
            <span>Ukraine cities</span>
            <button onClick={() => {navigate("/")}}>Home</button>
        </div>
    )
}

export default NavBar;