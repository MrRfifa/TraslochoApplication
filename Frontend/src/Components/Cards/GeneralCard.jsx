import { Link } from "react-router-dom";
import transporterImg from "../../assets/generals/transporter.svg";
import ownerImg from "../../assets/generals/owner.svg";
import { LabelDestinationLinkButton } from "../Buttons/CustomizedButtons";
import { useTranslation } from "react-i18next";

export const GeneralWhiteCard = () => {
  const { t } = useTranslation("register");
  return (
    <div className="group before:hover:scale-95 before:hover:w-80 before:hover:h-72 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-[''] before:w-80 before:h-24 before:rounded-t-2xl before:bg-gradient-to-bl from-sky-700 to-[#14213D] before:absolute before:top-0 w-80 h-72 relative bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden">
      <div className="w-28 h-28 mt-8 rounded-full z-10 group-hover:scale-150 group-hover:-translate-x-6  group-hover:-translate-y-4 transition-all duration-500">
        <img className="w-32 mx-auto" src={transporterImg} alt="transp image" />
      </div>
      <div className="z-10 space-y-4  group-hover:-translate-y-10 transition-all duration-500">
        <span className="text-2xl font-semibold ">{t("regTransporter")}</span>

        <div className="mt-2 flex flex-row justify-between">
          <div className="hover:scale-110">
            <LabelDestinationLinkButton
              destination="/register-private"
              label={t("privateButton")}
            />
          </div>
          <div className="hover:scale-110">
            <LabelDestinationLinkButton
              destination="/register-company"
              label={t("companyButton")}
            />
          </div>
        </div>
        <p className="hover:text-[#FCA311]">
          <Link to={"/login"}>{t("haveAccountQst")}</Link>
        </p>
      </div>
    </div>
  );
};

export const GeneralBlackCard = () => {
  const { t } = useTranslation("register");
  return (
    <div className="text-[#E5E5E5] group before:hover:scale-95 before:hover:w-80 before:hover:h-72 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-[''] before:w-80 before:h-24 before:rounded-t-2xl before:bg-gradient-to-bl from-sky-700 to-[#14213D] before:absolute before:top-0 w-80 h-72 relative flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden">
      <div className="w-28 h-28 mt-8 rounded-full z-10 group-hover:scale-150 group-hover:-translate-x-6  group-hover:-translate-y-4 transition-all duration-500">
        <img className="w-32 mx-auto" src={ownerImg} alt="owner image" />
      </div>
      <div className="z-10 space-y-4  group-hover:-translate-y-10 transition-all duration-500">
        <span className="text-2xl font-semibold">{t("regOwner")}</span>
        <div className="mt-2 hover:scale-110">
          <LabelDestinationLinkButton
            destination="/register-owner"
            label={t("ownerButton")}
          />
        </div>
        <p className="hover:text-[#FCA311]">
          <Link to={"/login"}>{t("haveAccountQst")}</Link>
        </p>
      </div>
    </div>
  );
};
