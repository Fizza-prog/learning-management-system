import { useState, useRef, useEffect } from "react";
import { MdAccountCircle } from "react-icons/md";
import {
    FaUser,
    FaCog,
    FaLock,
    FaQuestionCircle,
    FaSignOutAlt,
} from "react-icons/fa";
import './ProfileDropdown.css'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/context/AuthContext";
import { logoutUser } from "../../../../api/authApi";
export default function TopbarUser() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

    console.log(user)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                await logoutUser(refreshToken);
            }
        } catch (error) {
            console.error(error);
        } finally {
            logout();

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            navigate("/login");
        }
    };

    return (
        <div className="topbar-user" ref={dropdownRef}>
            <div
                className="user-avatar"
                onClick={() => setOpen(!open)}
            >
                {userInitial}
            </div>

            {open && (
                <div className="profile-dropdown">
                    <div className="profile-header">
                        <h4>
                            {user?.firstName} {user?.lastName}
                        </h4>

                        <p>
                            {user?.role
                                ?.replace("_", " ")
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </p>
                    </div>

                    <div className="dropdown-divider"></div>

                    <button className="dropdown-item">
                        <FaUser />
                        <span>My Profile</span>
                    </button>

                    <button className="dropdown-item">
                        <FaCog />
                        <span>Account Settings</span>
                    </button>

                    <button className="dropdown-item">
                        <FaLock />
                        <span>Change Password</span>
                    </button>

                    <button className="dropdown-item">
                        <FaQuestionCircle />
                        <span>Help & Support</span>
                    </button>

                    <div className="dropdown-divider"></div>

                    <button
                        className="dropdown-item logout"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}