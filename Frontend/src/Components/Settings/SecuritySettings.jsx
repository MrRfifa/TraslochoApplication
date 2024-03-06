import EmailForm from "../Forms/SettingProfileForms/EmailForm";
import PasswordForm from "../Forms/SettingProfileForms/PasswordForm";

const SecuritySettings = () => {
  return (
    <div className="flex flex-col p-10">
      <div className="flex flex-col space-y-5">
        <div className="border border-solid py-7 px-14 shadow-xl rounded-lg">
          <PasswordForm />
        </div>
        <div className="border border-solid py-7 px-14 shadow-xl rounded-lg">
          <EmailForm />
        </div>
        {/* <div className="border border-solid py-7 px-14 shadow-xl rounded-lg">
        <PhoneForm />
      </div> */}
      </div>
    </div>
  );
};

export default SecuritySettings;
