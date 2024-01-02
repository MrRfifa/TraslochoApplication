import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useEffect, useRef, useState } from "react";
import { GlobeIcone } from "../../assets/extra/GlobeIcon";
import i18next from "i18next";
import cookies from "js-cookie";

const LanguageDropdown = () => {
  const languages = [
    {
      code: "en",
      name: "English",
      country_code: "gb",
    },
    {
      code: "it",
      name: "Italiana",
      country_code: "it",
    },
    {
      code: "de",
      name: "Deutsch",
      country_code: "de",
    },
    {
      code: "fr",
      name: "Français",
      country_code: "fr",
    },
    {
      code: "es",
      name: "Español",
      country_code: "es",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const currentLanguageCode = cookies.get("i18next") || "en";
  return (
    <div className="relative inline-block text-center " ref={dropdownRef}>
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="text-white font-medium rounded-lg text-lg px-1 py-1 text-center inline-flex items-center transition-transform transform hover:scale-110 hover:font-bold hover:text-[#FCA311]"
        type="button"
        onClick={toggleDropdown}
      >
        <GlobeIcone />
        <svg
          className="w-2.5 h-2.5 ml-2.5"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          id="dropdown"
          className="z-10 absolute mt-6 bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-black"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            {languages.map(({ code, name, country_code }) => (
              <li key={country_code} className="w-full">
                <button
                  onClick={() => {
                    i18next.changeLanguage(code);
                    toggleDropdown();
                  }}
                  disabled={code === currentLanguageCode}
                  className={
                    code === currentLanguageCode
                      ? "active py-2 opacity-50"
                      : "py-2 hover:bg-gray-100 dark:hover:bg-[#FCA311] dark:hover:text-white w-full opacity-100"
                  }
                >
                  <span className={`fi fi-${country_code} mx-2`}></span>
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
