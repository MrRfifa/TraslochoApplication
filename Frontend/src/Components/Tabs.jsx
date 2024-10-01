import { useState } from "react";
import PropTypes from "prop-types";

const Tabs = ({ tabsElement }) => {
  const [activeTab, setActiveTab] = useState(0); // Initialize with first tab active

  return (
    <div className="h-full overflow-hidden">
      {/* Dropdown for small screens */}
      <div className="sm:hidden p-5">
        {/* <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label> */}
        <select
          id="tabs"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="bg-gray-50 mt-12 border border-[#FCA311] text-gray-900 text-sm rounded-lg focus:ring-[#FCA311] focus:border-[#FCA311] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#FCA311] dark:focus:border-[#FCA311]"
        >
          {tabsElement.map((tab, index) => (
            <option className="mr-20" key={index} value={index}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs for large screens */}
      <div className="hidden md:block mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          className="flex flex-wrap justify-around -mb-px text-sm font-medium text-center"
          role="tablist"
        >
          {tabsElement.map((tab, index) => (
            <li key={index} role="presentation" className="me-2">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === index
                    ? "text-[#FCA311] border-[#FCA311] dark:text-purple-500 dark:border-purple-500 cursor-auto"
                    : "hover:text-[#FCA311] hover:border-[#FCA311] dark:hover:text-[#FCA311] border-transparent text-gray-500 dark:text-gray-400 dark:border-transparent"
                }`}
                onClick={() => setActiveTab(index)}
                type="button"
                role="tab"
                aria-controls={`tab-${index}`}
                aria-selected={activeTab === index}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab content */}
      <div className="p-4">{tabsElement[activeTab].content}</div>
    </div>
  );
};

export default Tabs;

Tabs.propTypes = {
  tabsElement: PropTypes.array.isRequired,
};
