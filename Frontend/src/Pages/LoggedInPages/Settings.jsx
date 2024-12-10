import Account from "../../Components/Settings/Account";
import AccountSettings from "../../Components/Settings/AccountSettings";
import Reviews from "../../Components/Settings/Reviews";
import SecuritySettings from "../../Components/Settings/SecuritySettings";
import Tabs from "../../Components/Tabs/Tabs";

const tabsData = [
  {
    label: "Profile",
    content: <Account />,
  },
  {
    label: "Reviews",
    content: <Reviews />,
  },
  {
    label: "Account",
    content: <AccountSettings />,
  },
  {
    label: "Security",
    content: <SecuritySettings />,
  },
];
const Settings = () => {
  return (
    <div className="md:ml-64 ml-0">
      <Tabs tabsElement={tabsData} />
    </div>
  );
};

export default Settings;
