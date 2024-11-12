import { useState } from "react";
import logo from "../assets/logo/logo-no-background.png";
import {
  FaUserLarge,
  FaMessage,
  FaPowerOff,
  FaHouse,
  FaCarSide,
  FaBoxesStacked,
  FaBell,
} from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserInfo from "../Redux/SlicesCalls/UserInfo";
import AuthService from "../Services/Auth/AuthServices";
// import NotificationsIcon from "../Components/Notification/NotificationsIcon";
// import NotificationsModal from "../Components/Notification/NotificationsModal";

const Sidebar = () => {
  const state = useSelector((state) => state.userInfo.value);
  const [isOpen, setIsOpen] = useState(false);
  // const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // const toggleNotificationsModal = () =>
  //   setShowNotificationsModal(!showNotificationsModal);

  //Call the redux slice
  UserInfo();
  const notifications = useSelector((state) => state.notifications.list);
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sections = [
    { icon: FaHouse, destination: "/dashboard", name: "Dashboard" },
    { icon: FaMessage, destination: "/messages", name: "Messages" },
    { icon: FaBoxesStacked, destination: "/shipments", name: "Shipments" },
    { icon: FaCarSide, destination: "/cars", name: "Car" },
    { icon: FaBell, destination: "/notifications", name: "Notifications" },
    { icon: FaUserLarge, destination: "/profile", name: "Profile" },
  ];

  const showCarSideIcon = state.role === "Transporter";
  // const showCarSideIcon = true;

  return (
    <>
      <button
        onClick={toggleSidebar}
        aria-controls="logo-sidebar"
        type="button"
        className="absolute inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6 z-30"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full pl-5 py-5 overflow-y-auto bg-[#14213D] dark:bg-gray-800">
          <div className="flex justify-between items-center mb-5">
            <img src={logo} className="h-10 ml-2 sm:h-12" alt="Logo" />
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:bg-gray-200 p-2 rounded sm:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>

          {/* Render sections as a list */}
          <ul className="space-y-2 font-medium pt-10">
            {sections.map((section, index) => {
              // Special condition for "Notifications" section
              if (section.name === "Notifications") {
                return (
                  <li
                    onClick={() => {
                      navigate(section.destination);
                      toggleSidebar(); // Assuming this closes the sidebar
                    }}
                    className={`flex items-center space-x-3 mr-5 rounded-md p-2 hover:scale-110 hover:cursor-pointer text-[#FFFFFF] ${
                      location.pathname === section.destination
                        ? "bg-[#FCA311]" // Active style for Notifications
                        : "hover:bg-[#FCA311]"
                    }`}
                    key={index}
                  >
                    <section.icon size={25} color="#E5E5E5" />
                    <div className="text-lg flex flex-row space-x-36">
                      <span>{section.name}</span>
                      {unreadCount > 0 && (
                        <div className="absolute">
                          <span className="absolute top-1 bg-red-500 text-white text-sm rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Red dot with unread notification count */}
                  </li>
                );
              }

              // For other sections, apply normal logic
              if (section.icon === FaCarSide && !showCarSideIcon) {
                return null; // Skip rendering if condition is not met for "Car" icon
              }

              return (
                <li
                  onClick={() => {
                    navigate(section.destination);
                    toggleSidebar(); // Assuming this closes the sidebar
                  }}
                  className={`flex items-center space-x-3 mr-5 rounded-md p-2 hover:scale-110 hover:cursor-pointer text-[#FFFFFF] ${
                    location.pathname === section.destination
                      ? "bg-[#FCA311]"
                      : "hover:bg-[#FCA311]"
                  }`}
                  key={index}
                >
                  <section.icon size={25} color="#E5E5E5" />
                  <span className="text-lg">{section.name}</span>
                </li>
              );
            })}
            <li
              onClick={() => {
                AuthService.logout(state.id);
              }}
              className="flex space-x-3 items-center mr-5 rounded-md hover:scale-110 hover:bg-[#FCA311] p-2 hover:cursor-pointer text-[#FFFFFF]"
            >
              <FaPowerOff size={25} color="#E5E5E5" />
              <span className="text-lg">Logout</span>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
