import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import logo from "../assets/logo/logo-no-background.png";
import { useTranslation } from "react-i18next";
import {
  Link as ScrollLink,
  // animateScroll as scroll,
  scroller,
} from "react-scroll";
import LanguageDropdown from "../Components/Dropdowns/LanguageDropdown";
import { LabelDestinationLinkButton } from "../Components/Buttons/CustomizedButtons";

function Navbar() {
  const { t } = useTranslation("navbar");
  const [open, setOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  let Links = [
    { name: t("home"), link: "home" },
    { name: t("service"), link: "services" },
    { name: t("about"), link: "about" },
    { name: t("contact"), link: "contact" },
  ];

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }

    // Detect the active section based on the scroll position
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    const sections = Links.map((link) => link.link);

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;

        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          setActiveSection(section);
          break;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  // const scrollToTop = () => {
  //   scroll.scrollToTop();
  // };

  const scrollToSection = (section) => {
    scroller.scrollTo(section, {
      duration: 500,
      smooth: true,
    });
  };

  return (
    <div className="shadow-sm w-full fixed top-0 left-0 z-10">
      <div
        className={`md:flex items-center justify-between py-4 md:px-10 px-7 transition-all duration-500 ease-in ${
          scrolling ? "bg-black" : "bg-transparent"
        } `}
      >
        <div
          // onClick={scrollToTop}
          className="font-bold text-2xl cursor-pointer flex items-center gap-1"
        >
          <img className="w-24" src={logo} alt="cam" />
        </div>
        <div
          onClick={() => setOpen(!open)}
          className="absolute right-8 top-6 cursor-pointer md:hidden w-7 h-7 z-50"
        >
          {open ? (
            <AiOutlineClose size={25} color="#FCA311" />
          ) : (
            <AiOutlineMenu size={25} color="#FCA311" />
          )}
        </div>
        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9  ${
            open ? "top-16" : "top-[-490px]"
          } ${scrolling ? "bg-black transition-all duration-500 ease-in" : "bg-transparent"} `}
        >
          {Links.map((link, index) => (
            <li
              key={index}
              className={`md:ml-10 md:my-0 my-7 ml-0 font-semibold transition-transform transform hover:scale-110 hover:cursor-pointer ${
                activeSection === link.link ? "border-b-2 border-[#FCA311]" : ""
              }`}
            >
              <ScrollLink
                to={link.link}
                smooth={true}
                duration={500}
                className="text-white hover:text-[#FCA311] duration-500"
                onClick={() => scrollToSection(link.link)}
              >
                {link.name}
              </ScrollLink>
            </li>
          ))}
          <li className="text-white font-semibold px-3 py-1 rounded duration-500 mb-5 md:mb-0 ml-0 md:ml-5">
            <LanguageDropdown />
          </li>
          <LabelDestinationLinkButton
            destination="/login"
            label={t("button")}
          />
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
