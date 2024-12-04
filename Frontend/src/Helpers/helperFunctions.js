function formatDate(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function convertType(number) {
  switch (number) {
    case 1:
      return "Throwing";
    default:
      return "Transporting";
  }
}

function convertStatus(number) {
  switch (number) {
    case 1:
      return "Accepted";
    case 2:
      return "Completed";
    case 3:
      return "Canceled";
    default:
      return "Pending";
  }
}

function formatAddress(addressObject) {
  const { street, city, state, postalCode, country } = addressObject;

  // Combine the fields into a single formatted string
  return `${street}, ${city}, ${state}, ${postalCode}, ${country}`;
}

function convertRequestStatus(number) {
  switch (number) {
    case 1:
      return "Accepted";
    case 2:
      return "Refused";
    default:
      return "Pending";
  }
}

function convertVehicleType(number) {
  switch (number) {
    case 1:
      return "Truck";
    default:
      return "Van";
  }
}

function isShipmentPendingOrAccepted(shipmentStatus) {
  if (shipmentStatus === "Pending" || shipmentStatus === "Accepted") {
    return true;
  }
  return false;
}

function isShipmentCanceledOrCompleted(shipmentStatus) {
  if (shipmentStatus === "Completed" || shipmentStatus === "Canceled") {
    return true;
  }
  return false;
}

function isShipmentAccepted(shipmentStatus) {
  if (shipmentStatus === "Accepted") {
    return true;
  }
  return false;
}

function isShipmentPending(shipmentStatus) {
  if (shipmentStatus === "Pending") {
    return true;
  }
  return false;
}

const helperFunctions = {
  formatDate,
  convertType,
  convertStatus,
  formatAddress,
  convertRequestStatus,
  convertVehicleType,
  isShipmentPendingOrAccepted,
  isShipmentCanceledOrCompleted,
  isShipmentAccepted,
  isShipmentPending,
};

export default helperFunctions;
