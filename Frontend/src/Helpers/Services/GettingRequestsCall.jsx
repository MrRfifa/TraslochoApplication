import RequestService from "../../Services/Requests/RequestService";
import ReviewService from "../../Services/Reviews/ReviewService";
import VehicleService from "../../Services/Vehicles/VehicleService";
import helperFunctions from "../helperFunctions";

export const getCompleteRequestsCall = async (shipmentId) => {
  try {
    // Fetch the requests for the given shipment
    const requestsObject = await RequestService.getShipmentRequests(shipmentId);

    if (requestsObject.success && !requestsObject.error) {
      const enrichedRequests = await Promise.all(
        requestsObject.message.map(async (request) => {
          const { requestId, transporterId, status, firstName, lastName } =
            request;

          // Default values for the enriched data
          let rating = 0; // Default to 0 instead of N/A
          let vehicleInfo = "No vehicle data available";
          let vehicleTypeInit = -1;

          try {
            // Fetch reviews for transporter
            const reviews = await ReviewService.getReviewsByTransporterId(
              transporterId
            );
            if (reviews.success && Array.isArray(reviews.message)) {
              const totalRating = reviews.message.reduce(
                (acc, review) => acc + review.rating,
                0
              );
              const reviewCount = reviews.message.length;
              rating = reviewCount > 0 ? totalRating / reviewCount : 0; // Numeric average
            }
          } catch (reviewError) {
            console.warn(
              `Failed to fetch reviews for transporter ${transporterId}:`,
              reviewError
            );
          }

          try {
            // Fetch vehicle info for transporter
            const vehicle = await VehicleService.getVehicleDataByTransporterId(
              transporterId
            );

            if (vehicle.success && vehicle.message) {
              const { manufacture, model, year, vehicleType } = vehicle.message;
              vehicleInfo = `${manufacture || "Unknown"} ${model || "Model"} ${
                year || "Year"
              }`;
              vehicleTypeInit = vehicleType;
            }
          } catch (vehicleError) {
            console.warn(
              `Failed to fetch vehicle data for transporter ${transporterId}:`,
              vehicleError
            );
          }

          // Return the enriched request object
          return {
            requestId: requestId,
            transporterId: transporterId,
            status: status,
            firstname: firstName,
            lastname: lastName,
            ratings: rating, // Numeric value for ratings
            vehicle: vehicleInfo,
            vehicleType: helperFunctions.convertVehicleType(vehicleTypeInit),
          };
        })
      );

      return enrichedRequests.filter((req) => req); // Remove any undefined results
    }

    return []; // Return empty array if `requestsObject` is invalid or has errors
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};
