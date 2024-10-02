import AddressForm from "../Forms/SettingProfileForms/AddressForm";
import DateOfBirthForm from "../Forms/SettingProfileForms/DateOfBirthForm";
import NamesForm from "../Forms/SettingProfileForms/NamesForm";

const AccountSettings = () => {
  return (
    <div className="flex flex-col p-0 md:p-5 space-y-10">
      {/* Profile Section */}
      <div className="border border-solid py-7 px-14 shadow-xl rounded-lg bg-white">
        <div className="flex flex-col space-y-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Personal Information
            </h2>
            <NamesForm />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Address Information
            </h2>
            <AddressForm />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Date of Birth
            </h2>
            <DateOfBirthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
