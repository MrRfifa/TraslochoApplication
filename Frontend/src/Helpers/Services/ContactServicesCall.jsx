import { successToast, warningToast } from "../../Components/Toasts";
import ContactService from "../../Services/Messages/Conversations";
import { getUserByIdCall } from "./UserServicesCall";

export const getContactsCall = async (userId) => {
  try {
    const contacts = await ContactService.getContacts(userId);

    if (!Array.isArray(contacts.message)) {
      console.error("Invalid contacts data:", contacts);
      return;
    }
    // console.log(contacts);

    // Extract unique transporter IDs and contact IDs from contacts, excluding userId
    const transporterDetailsArray = [];

    // Use Promise.all to handle multiple asynchronous calls
    await Promise.all(
      contacts.message.map(async (contact) => {
        await Promise.all(
          contact.participants.map(async (participant) => {
            if (participant !== parseInt(userId)) {
              try {
                const transporterDetails = await getUserByIdCall(participant);
                const contactId = contact._id; // Modify this based on the actual property name in your contact object
                transporterDetailsArray.push({
                  ...transporterDetails,
                  contactId,
                  participant,
                });
              } catch (getUserError) {
                console.error(
                  `Error fetching details for transporterId ${participant}:`,
                  getUserError
                );
              }
            }
          })
        );
      })
    );
    // console.log(transporterDetailsArray);

    // Remove duplicates based on transporterId
    // const uniqueTransporterDetailsArray = Array.from(
    //   new Map(
    //     transporterDetailsArray.map((item) => [item.transporterId, item])
    //   ).values()
    // );
    // console.log(uniqueTransporterDetailsArray);

    return transporterDetailsArray;
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
};

export const addContactCall = async (part1, part2, navigate) => {
  const participant1 = parseInt(part1);
  const response = await ContactService.addContact(participant1, part2);
  if (response.success) {
    successToast(response.message);
  }
  if (!response.success) {
    warningToast(response.error);
  }
  navigate("/messages");
  // console.log(response);
};
