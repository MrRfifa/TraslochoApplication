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

const helperFunctions = {
  formatDate,
  convertType,
  convertStatus,
  formatAddress,
  convertRequestStatus,
};

export default helperFunctions;
