import { useState } from "react";
import { useSpring, animated } from "react-spring";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaChevronRight,
  FaChevronLeft,
  FaGear,
  FaMessage,
  FaPowerOff,
  FaHouse,
  FaCarSide,
  FaBoxesStacked,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserInfo from "../Redux/SlicesCalls/UserInfo";
import AuthService from "../Services/Auth/AuthServices";

const Sidebar = () => {
  const state = useSelector((state) => state.userInfo.value);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  //Call the redux slice
  UserInfo();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarAnimation = useSpring({
    transform: isSidebarOpen ? "translateX(0)" : "translateX(-120%)",
  });

  const sections = [
    { icon: FaHouse, destination: "/dashboard" },
    { icon: FaMessage, destination: "/messages" },
    { icon: FaBoxesStacked, destination: "/shipments" },
    { icon: FaCarSide, destination: "/cars" },
    { icon: FaGear, destination: "/settings" },
  ];

  const showCarSideIcon = state.role === "Transporter";

  // Initialize AOS library
  AOS.init();

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        className="bg-[#FCA311] p-2 rounded-full"
        onClick={toggleSidebar}
        data-aos="fade-right"
        data-aos-offset="300"
        data-aos-duration="500"
      >
        {isSidebarOpen ? (
          <FaChevronLeft size={40} color="white" />
        ) : (
          <FaChevronRight size={40} color="white" />
        )}
      </button>
      <animated.div
        className="flex flex-col gap-2"
        style={{
          ...sidebarAnimation,
          position: "fixed",
          top: 80,
          left: 0,
          padding: "16px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
        data-aos="fade-right"
        data-aos-offset="50"
        data-aos-duration="50"
      >
        {sections.map((section, index) => {
          if (section.icon === FaCarSide && !showCarSideIcon) {
            return null; // Skip rendering if condition is not met
          }
          if (section.icon === FaHouse && showCarSideIcon) {
            return null; // Skip rendering if condition is not met
          }
          return (
            <div
              className="p-2 hover:cursor-pointer"
              key={index}
              data-aos="fade-right"
              data-aos-offset="300"
              data-aos-duration="500"
            >
              <Link to={section.destination}>
                <section.icon
                  size={40}
                  className=" hover:scale-125"
                  color="#FCA311"
                />
              </Link>
            </div>
          );
        })}
        <div
          className="p-2 hover:cursor-pointer"
          data-aos="fade-right"
          data-aos-offset="300"
          data-aos-duration="500"
        >
          <FaPowerOff
            onClick={() => {
              AuthService.logout(state.id);
            }}
            size={40}
            className="hover:scale-125"
            color="#FCA311"
          />
        </div>
      </animated.div>
    </div>
  );
};

export default Sidebar;
