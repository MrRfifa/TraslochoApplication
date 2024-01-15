import { useTranslation } from "react-i18next";
import mainVideo from "../assets/home/video-1.mp4"; // Adjust the path to your video file
import { LabelDestinationLinkButton } from "../Components/Buttons/CustomizedButtons";

const Main = () => {
  const { t } = useTranslation("main");
  return (
    <div id="home" className="flex justify-center h-screen relative ">
      {/* Video background */}
      <video
        className="absolute top-0 object-cover w-full h-full "
        autoPlay
        muted
        loop
      >
        <source src={mainVideo} type="video/mp4" />
      </video>

      {/* Content overlay */}
      <div className="relative z-1 flex items-center flex-col justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">{t("heading")}</h1>
        <p className="text-lg text-center mb-8">{t("content")}</p>
        <div className="flex space-x-4">
          <LabelDestinationLinkButton
            destination="/register"
            label={t("button1")}
          />
          <button className="bg-transparent text-white border border-white font-semibold px-4 py-2 rounded hover:scale-110 duration-500">
            {t("button2")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
