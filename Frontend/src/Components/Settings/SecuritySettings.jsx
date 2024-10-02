import EmailForm from "../Forms/SettingProfileForms/EmailForm";
import PasswordForm from "../Forms/SettingProfileForms/PasswordForm";

const SecuritySettings = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col space-y-5 w-full max-w-3xl">
        {/* Password Form */}
        <div className="border border-solid py-7 px-10 shadow-xl rounded-lg bg-white hover:shadow-2xl transition-shadow duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Update Password
          </h2>
          <PasswordForm />
        </div>

        {/* Email Form */}
        <div className="border border-solid py-7 px-10 shadow-xl rounded-lg bg-white hover:shadow-2xl transition-shadow duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Update Email
          </h2>
          <EmailForm />
        </div>

        {/* Uncomment if needed in the future */}
        {/* <div className="border border-solid py-7 px-10 shadow-xl rounded-lg bg-white hover:shadow-2xl transition-shadow duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Update Phone
          </h2>
          <PhoneForm />
        </div> */}
      </div>
    </div>
  );
};

export default SecuritySettings;
