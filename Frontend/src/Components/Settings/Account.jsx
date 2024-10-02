import ProfileImageForm from "../Forms/SettingProfileForms/ProfileImageForm";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTruck,
  FaUserShield,
  FaShieldAlt,
} from "react-icons/fa"; // Icons for tips

const Account = () => {
  var isOwner = true;

  // Arrays for tips
  const usefulTipsForOwners = [
    {
      id: 1,
      text: "Provide detailed shipment information to avoid misunderstandings.",
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      id: 2,
      text: "Review your transporter’s ratings and reviews before assigning shipments.",
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      id: 3,
      text: "Leave a review after your shipment is completed to help others.",
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      id: 4,
      text: "Double-check addresses and contact details before submitting your shipment.",
      icon: <FaExclamationCircle className="text-yellow-500" />,
    },
    {
      id: 5,
      text: "Communicate any special requirements for the shipment with your transporter.",
      icon: <FaExclamationCircle className="text-yellow-500" />,
    },
  ];

  const usefulTipsForTransporters = [
    {
      id: 1,
      text: "Keep your vehicle profile up-to-date with accurate details.",
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      id: 2,
      text: "Respond quickly to shipment requests for better chances of selection.",
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      id: 3,
      text: "Plan your routes ahead to avoid delays and reduce fuel costs.",
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      id: 4,
      text: "Double-check your vehicle’s condition before every shipment.",
      icon: <FaExclamationCircle className="text-yellow-500" />,
    },
    {
      id: 5,
      text: "Verify the shipment's dimensions and weight to avoid complications.",
      icon: <FaExclamationCircle className="text-yellow-500" />,
    },
  ];

  const securityTips = [
    {
      id: 1,
      text: "Never share your credentials with anyone.",
      icon: <FaExclamationCircle className="text-red-500" />,
    },
    {
      id: 2,
      text: "Don’t disclose personal information in public chats.",
      icon: <FaExclamationCircle className="text-red-500" />,
    },
    {
      id: 3,
      text: "Use strong passwords and change them regularly.",
      icon: <FaExclamationCircle className="text-red-500" />,
    },
    {
      id: 4,
      text: "Be cautious of phishing attempts via email or messages.",
      icon: <FaExclamationCircle className="text-red-500" />,
    },
    {
      id: 5,
      text: "Log out from your account on public or shared devices.",
      icon: <FaExclamationCircle className="text-red-500" />,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-16">
      {/* Profile Image Form: This component will take 1 full column width */}
      <div className="w-full lg:w-1/3">
        <ProfileImageForm />
      </div>

      {/* Main Content: This component will take full width for tips */}

      <div>
        {isOwner ? (
          // Useful Tips for Owners
          <div className="bg-white border shadow-lg p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              <FaUserShield className="inline-block mr-2" /> Useful Tips
            </h3>
            <ul className="list-none space-y-4">
              {usefulTipsForOwners.map((tip) => (
                <li
                  key={tip.id}
                  className="flex items-start transition duration-300 hover:scale-105 hover:cursor-default"
                >
                  {tip.icon}
                  <span className="ml-2 text-gray-700">{tip.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // Useful Tips for Transporters
          <div className="bg-white border shadow-lg p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              <FaTruck className="inline-block mr-2" /> Useful Tips
            </h3>
            <ul className="list-none space-y-4">
              {usefulTipsForTransporters.map((tip) => (
                <li
                  key={tip.id}
                  className="flex items-start transition duration-300 hover:scale-105 hover:cursor-default"
                >
                  {tip.icon}
                  <span className="ml-2 text-gray-700">{tip.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Security Tips Section */}
        <div className="bg-red-100 border shadow-lg mt-6 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-red-600 mb-4">
            <FaShieldAlt className="inline-block mr-2" /> Security Tips
          </h3>
          <ul className="list-none space-y-4">
            {securityTips.map((tip) => (
              <li
                key={tip.id}
                className="flex items-start transition duration-300 hover:scale-105 hover:cursor-default"
              >
                {tip.icon}
                <span className="ml-2 text-gray-700">{tip.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Account;
