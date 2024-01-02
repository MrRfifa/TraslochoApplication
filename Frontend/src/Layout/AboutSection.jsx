import AOS from "aos";
import "aos/dist/aos.css";
import teamImg from "../assets/home/team.svg";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation("about");
  AOS.init({
    duration: 500,
    easing: "ease-in-out",
  });

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
    <div id="about" className="w-full h-screen bg-black py-10 lg:py-28 px-4 text-white">
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-2 gap-5">
        <img
          {...animationConfig.fadeDownRight}
          className="w-[600px] mx-auto my-10"
          src={teamImg}
          alt="european union image"
        />
        <div className="flex flex-col justify-center space-y-5">
          <h1
            {...animationConfig.fadeUpRight}
            className="text-[#FCA311] md:text-3xl sm:text-2xl text-xl font-bold py-2"
          >
            {t("heading")}
          </h1>
          <p
            {...animationConfig.fadeUpRight}
            className="md:text-5xl sm:text-3xl text-2xl font-bold py-2"
          >
            {t("p1")}
          </p>
          <p
            {...animationConfig.fadeUpRight}
            className="md:text-xl sm:text-lg text-base font-bold py-2"
          >
            {t("p2")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
