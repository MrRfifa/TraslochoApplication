import AOS from "aos";
import "aos/dist/aos.css";

import eu from "../assets/home/eu.svg";
import { useTranslation } from "react-i18next";

const ServiceSection = () => {
  const { t } = useTranslation("services");
  AOS.init({
    duration: 500,
    easing: "ease-in-out",
  });

  // Animation configurations
  const animationConfig = {
    fadeUpRight: {
      "data-aos": "fade-up-right",
      "data-aos-offset": 200,
      "data-aos-delay": 50,
    },
    fadeDownRight: {
      "data-aos": "fade-down-right",
      "data-aos-offset": 200,
      "data-aos-delay": 50,
    },
  };
  return (
    <div
      id="services"
      className="w-full h-screen bg-white py-5 px-4  text-black"
    >
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-2 gap-5 ">
        <div className="flex flex-col justify-center space-y-0 lg:space-y-5">
          <h1
            {...animationConfig.fadeDownRight}
            className="text-[#FCA311] md:text-3xl sm:text-2xl text-xl font-bold py-2"
          >
            {t("heading")}
          </h1>
          <p
            {...animationConfig.fadeDownRight}
            className="md:text-5xl sm:text-3xl text-2xl font-bold py-2"
          >
            {t("p1")}
          </p>
          <p
            {...animationConfig.fadeDownRight}
            className="md:text-xl sm:text-lg text-base font-bold py-2"
          >
            {t("p2")}
          </p>
        </div>
        <img
          {...animationConfig.fadeUpRight}
          className="w-[600px] mx-auto"
          src={eu}
          alt="european union image"
        />
      </div>
    </div>
  );
};

export default ServiceSection;
