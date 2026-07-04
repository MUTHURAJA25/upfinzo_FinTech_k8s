import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notify } from "@/components/notifications";

function Header() {
    const [isUserDropdownShown, setIsUserDropdownShown] = useState(false);
    const [isNotificationDropdownShown, setIsNotificationDropdownShown] =
        useState(false);
    const [user, setUser] = useState(null);
    const userDropdownRef = useRef(null);
    const notificationDropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(event.target)
            ) {
                setIsUserDropdownShown(false);
            }
            if (
                notificationDropdownRef.current &&
                !notificationDropdownRef.current.contains(event.target)
            ) {
                setIsNotificationDropdownShown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        notify.success("Logged out successfully");
        navigate("/login");
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownShown((prev) => !prev);
        setIsNotificationDropdownShown(false);
    };

    const toggleNotificationDropdown = () => {
        setIsNotificationDropdownShown((prev) => !prev);
        setIsUserDropdownShown(false);
    };

    const toggleMenu = () => {
        document
            .getElementsByClassName("layout-navbar-fixed")[0]
            .classList.toggle("layout-menu-expanded");
    };

    if (!user) {
        return null;
    }

    return (
        <nav
            className="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme"
            id="layout-navbar"
        >
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
                <a
                    className="nav-item nav-link px-0 me-xl-6"
                    href="#!"
                    onClick={toggleMenu}
                >
                    <i className="icon-base ri ri-menu-line icon-22px"></i>
                </a>
            </div>
            <div
                className="navbar-nav-right d-flex align-items-center justify-content-end"
                id="navbar-collapse"
            >
                <ul className="navbar-nav flex-row align-items-center ms-md-auto">
                    {/* Notification Dropdown */}
                    <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-4 me-xl-1" ref={notificationDropdownRef}>
                        <a
                            className="position-relative nav-link dropdown-toggle hide-arrow btn btn-icon btn-text-secondary rounded-pill"
                            onClick={toggleNotificationDropdown}
                        >
                            <i className="icon-base ri ri-notification-2-line icon-22px"></i>
                            <span
                                className="position-absolute top-0 start-50 translate-middle-y badge badge-dot bg-danger mt-2 border"></span>
                        </a>
                        <ul
                            className={`dropdown-menu dropdown-menu-end py-0 ${isNotificationDropdownShown ? "show" : ""
                                }`}
                        >
                            <li className="dropdown-menu-header border-bottom py-50">
                                <div className="dropdown-header d-flex align-items-center py-2">
                                    <h6 className="mb-0 me-auto">Notification</h6>
                                    <div className="d-flex align-items-center h6 mb-0">
                    <span className="badge rounded-pill bg-label-primary fs-xsmall me-2">
                      8 New
                    </span>
                                        <Link to="/" className="dropdown-notifications-all p-2">
                                           <i className="icon-base ri ri-mail-open-line text-heading"></i>
                                        </Link>
                                    </div>
                                </div>
                            </li>
                            <li className="dropdown-notifications-list scrollable-container">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item list-group-item-action dropdown-notifications-item">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar">
                                                    <img
                                                        src={new URL('@/assets/images/illustration/1.png', import.meta.url).href}
                                                        alt="avatar"
                                                        className="rounded-circle"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="small mb-1">Congratulation Lettie 🎉</h6>
                                                <small className="mb-1 d-block text-body">
                                                    Won the monthly best seller gold badge
                                                </small>
                                                <small className="text-body-secondary">1h ago</small>
                                            </div>
                                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                                <a
                                                    href="javascript:void(0)"
                                                    className="dropdown-notifications-read"
                                                >
                                                    <span className="badge badge-dot"></span>
                                                </a>
                                                <a
                                                    href="javascript:void(0)"
                                                    className="dropdown-notifications-archive"
                                                >
                                                    <span className="icon-base ri ri-close-line"></span>
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                    {/* Add other notification items as needed */}
                                </ul>
                            </li>
                            <li className="border-top">
                                <div className="d-grid p-4">
                                    <a
                                        className="btn btn-primary btn-sm d-flex"
                                        href="javascript:void(0);"
                                    >
                                        <small className="align-middle">
                                            View all notifications
                                        </small>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </li>

                    {/* User Dropdown */}
                    <li
                        className="nav-item navbar-dropdown dropdown-user dropdown"
                        ref={userDropdownRef}
                    >
                        <a
                            className="nav-link dropdown-toggle hide-arrow"
                            onClick={toggleUserDropdown}
                        >
                            <div className="avatar avatar-online">
                                <img src={new URL('@/assets/images/illustration/1.png', import.meta.url).href} alt="avatar" className="rounded-circle" />
                            </div>
                        </a>
                        <ul
                            className={`dropdown-menu dropdown-menu-end mt-3 py-2 ${isUserDropdownShown ? "show" : ""
                                }`}
                        >
                            <li>
                                <a
                                    className="dropdown-item"
                                    href="pages-account-settings-account.html"
                                >
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0 me-2">
                                            <div className="avatar avatar-online">
                                                <img
                                                    src={new URL('@/assets/images/illustration/1.png', import.meta.url).href}
                                                    alt="avatar"
                                                    className="w-px-40 h-auto rounded-circle"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 small">{user.name || "User"}</h6>
                                            <small className="text-body-secondary">
                                                {user.email}
                                            </small>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <div className="dropdown-divider"></div>
                            </li>
                            <li>
                                <Link to={`/user-profile/${user?.id}`} className="dropdown-item">
                                    <i className="icon-base ri ri-user-3-line icon-22px me-3"></i>
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/change-password" className="dropdown-item">
                                    <i className="icon-base ri ri-lock-line icon-sm icon-22px me-3"></i>
                                    Change Password
                                </Link>
                            </li>
                            <li>
                                 <Link to="/user/settings/notification" className="dropdown-item">
                                    <i className="icon-base ri ri-settings-4-line icon-22px me-3"></i>
                                    Settings
                                </Link>
                            </li>
                            <li>
                                 <Link to="/docs/forms/generate-inputs" className="dropdown-item">
                                    <i className="icon-base ri ri-lifebuoy-line icon-22px me-3"></i>
                                     How to generate inputs 
                                </Link>
                            </li>
                            <li>
                                <div className="d-grid px-4 pt-2 pb-1">
                                    <button className="btn btn-sm btn-danger d-flex" onClick={handleLogout} type="button">
                                        <small className="align-middle">Logout</small>
                                        <i className="icon-base ri ri-logout-box-r-line ms-2 icon-16px"></i>
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Header;
