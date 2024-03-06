import AddressForm from "../Forms/SettingProfileForms/AddressForm";
import DateOfBirthForm from "../Forms/SettingProfileForms/DateOfBirthForm";
import NamesForm from "../Forms/SettingProfileForms/NamesForm";
import ProfileImageForm from "../Forms/SettingProfileForms/ProfileImageForm";
// import { ProfileForms } from "../Forms/SettingsForms";
//TODO: Complete this component
const AccountSettings = () => {
  return (
    <div className="flex flex-col p-10 space-y-14">
      {/* TODO update the profile image upload */}
      <ProfileImageForm />
      <div className="border border-solid py-7 px-14 shadow-xl rounded-lg">
        <div className="flex flex-col space-y-16">
          <NamesForm />
          <AddressForm />
          <DateOfBirthForm />
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
