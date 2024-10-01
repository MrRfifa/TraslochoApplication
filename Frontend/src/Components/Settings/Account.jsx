import Notification from "../../Services/Notifications/Notification";
import ProfileImageForm from "../Forms/SettingProfileForms/ProfileImageForm";

const Account = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* This component will take 1 column on large screens and full width on small screens */}
      <div className="col-span-1">
        <ProfileImageForm />
      </div>

      {/* This component will take 2 columns on large screens and full width on small screens */}
      <div className="col-span-1 lg:col-span-2 bg-yellow-400 border border-solid rounded-lg py-6 px-8 shadow-xl w-full max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Notifications */}
          {/* TODO Add the notif system and get back here Settings.jsx profile.jsx */}
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <Notification />
            {/* <ul className="space-y-3">
              <li className="border-b pb-2">
                <p className="text-gray-800 font-bold">Shipment #2345</p>
                <p className="text-gray-500 text-sm">
                  Ready for delivery on 09/22/2024
                </p>
              </li>
              <li className="border-b pb-2">
                <p className="text-gray-800 font-bold">Rating Received!</p>
                <p className="text-gray-500 text-sm">
                  You got a 5-star rating on your last delivery!
                </p>
              </li>
            </ul> */}
          </div>

          {/* Useful Tips */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Useful Tips</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-gray-600">
                Ensure timely communication with your transporter.
              </li>
              <li className="text-gray-600">
                Review shipment requests before accepting.
              </li>
              <li className="text-gray-600">
                Use promo codes to save on large shipments.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
