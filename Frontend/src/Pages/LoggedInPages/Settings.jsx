import { useState } from "react";
import AccountSettings from "../../Components/Settings/AccountSettings";
import SecuritySettings from "../../Components/Settings/SecuritySettings";
import { Toaster } from "react-hot-toast";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [profileSection, setProfileSection] = useState(true);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleProfileSectionClick = (section) => {
    setProfileSection(section);
  };

  return (
    <div className="ml-4 md:ml-28">
      <Toaster />
      {/* Tabs for small screens */}
      <div className="block md:hidden mb-4">
        <button
          className={`mr-4 px-4 py-2 rounded ${
            activeTab === "tab1"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => handleTabClick("tab1")}
        >
          Tab 1
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "tab2"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => handleTabClick("tab2")}
        >
          Tab 2
        </button>
      </div>

      {/* Grid layout for larger screens */}
      <div className="hidden md:block">
        <div className="grid grid-cols-3 gap-0">
          {/* Preview 1 large screen : buttons */}
          <div className="h-screen col-span-1 pt-56">
            <div className="flex flex-col space-y-5 items-center">
              <button
                className={`py-6 shadow-lg w-[100%] md:w-[80%] lg:w-[60%] rounded-xl border border-solid ${
                  profileSection ? "bg-[#FCA311]" : "bg-slate-100"
                } `}
                onClick={() => handleProfileSectionClick(true)}
              >
                Account settings
              </button>
              <button
                className={`py-6 shadow-lg w-[100%] md:w-[80%] lg:w-[60%] rounded-xl ${
                  profileSection ? "bg-slate-100" : "bg-[#FCA311]"
                }`}
                onClick={() => handleProfileSectionClick(false)}
              >
                Security
              </button>
            </div>
          </div>

          {/* Preview 2  large screen */}
          <div className="h-screen col-span-2 pt-10">
            {profileSection ? <AccountSettings /> : <SecuritySettings />}
          </div>
        </div>
      </div>

      {/* Tabbed interface for small screens */}
      <div className="block md:hidden">
        {/* Content of Tab 1 */}
        {activeTab === "tab1" && (
          <div className="bg-red-500 h-screen pt-10">Preview 1</div>
        )}

        {/* Content of Tab 2 */}
        {activeTab === "tab2" && (
          <div className="bg-blue-500 h-screen pt-10">Preview 2</div>
        )}
      </div>
    </div>
  );
};

export default Settings;
