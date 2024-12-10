import PropTypes from "prop-types";
import DetailRow from "./DetailRow";
import helperFunctions from "../Helpers/helperFunctions";

const ProfileDetails = ({
  imageProfile,
  firstName,
  lastName,
  dateOfBirth,
  activityType,
  address,
}) => {
  const addressTransporter = `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}.`;
  return (
    <div className="border border-gray-300 rounded-lg py-6 px-8 shadow-xl w-full max-w-lg mx-auto bg-white">
      <div className="flex flex-col items-center mb-6">
        <img
          src={`data:image/png;base64,${imageProfile}`}
          alt="Profile"
          className="border border-gray-200 object-cover rounded-xl w-56 h-56 md:w-72 md:h-72"
        />
      </div>
      <div className="flex flex-col gap-4">
        <DetailRow label="First Name" value={firstName} isTable={false} />
        <DetailRow label="Last Name" value={lastName} isTable={false} />
        <DetailRow label="Date of Birth" value={dateOfBirth} isTable={false} />
        <DetailRow
          label="Activity Type"
          value={helperFunctions.convertTransporterType(activityType)}
          isTable={false}
        />
        <div className="flex flex-col justify-start p-4 border-b border-gray-300">
          <span className="font-semibold">Address:</span>
          <span className="text-gray-700">{addressTransporter}</span>
        </div>
        {/* <DetailRow label="Address" value={addressTransporter} isTable={false} /> */}
      </div>
    </div>
  );
};

ProfileDetails.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  dateOfBirth: PropTypes.string.isRequired,
  activityType: PropTypes.number.isRequired,
  address: PropTypes.object.isRequired,
  imageProfile: PropTypes.any.isRequired,
};

export default ProfileDetails;
