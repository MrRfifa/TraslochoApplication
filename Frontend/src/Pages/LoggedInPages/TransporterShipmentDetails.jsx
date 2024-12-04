import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpin from "../../Components/LoadingSpin";
import ShipmentService from "../../Services/Shipments/ShipmentService";
import RequestService from "../../Services/Requests/RequestService";
import helperFunctions from "../../Helpers/helperFunctions";
import PropTypes from "prop-types";
import ImageGallery from "../../Components/ImageGallery";
import DetailRow from "../../Components/DetailRow";
import ModalButton from "../../Components/Buttons/ModalButton";
import MapModal from "../../Components/Modals/MapModal";
import { errorToast, successToast } from "../../Components/Toasts";

const TransporterShipmentDetails = ({ transporterId }) => {
  const { shipmentId } = useParams();
  const [currentShipment, setCurrentShipment] = useState();
  const [currentShipmentAddress, setCurrentShipmentAddress] = useState([]);
  const [currentShipmentImages, setCurrentShipmentImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasRequest, setHasRequest] = useState(false);
  const [requestStatus, setRequestStatus] = useState("No request");
  const [originCord, setOriginCord] = useState(null);
  const [destinationCord, setDestinationCord] = useState(null);

  useEffect(() => {
    const fetchShipmentDetails = async () => {
      setLoading(true);
      try {
        const [responseShipment, responseAddresses, responseImages] =
          await Promise.all([
            ShipmentService.getShipmentById(shipmentId),
            ShipmentService.getShipmentAddressesById(shipmentId),
            ShipmentService.getShipmentImagesById(shipmentId),
          ]);
        setCurrentShipment(responseShipment.message);
        setCurrentShipmentAddress(responseAddresses.message.data);
        setCurrentShipmentImages(responseImages.message.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch shipment details:", error);
        setLoading(false);
      }
    };

    fetchShipmentDetails();
  }, [shipmentId]);

  useEffect(() => {
    const fetchInitialRequestStatus = async () => {
      try {
        const transporterHasRequest =
          await RequestService.transporterHasRequestForShipment(
            parseInt(transporterId),
            parseInt(shipmentId)
          );
        setHasRequest(transporterHasRequest.message);
        if (hasRequest) {
          const transporterRequest =
            await RequestService.getRequestByTransporterAndShipment(
              parseInt(transporterId),
              parseInt(shipmentId)
            );
          setRequestStatus(
            helperFunctions.convertRequestStatus(
              transporterRequest.message.status
            )
          );
        } else {
          setRequestStatus("No request");
        }
      } catch (error) {
        console.error("Error fetching initial request status:", error);
        setRequestStatus("No request");
      }
    };

    fetchInitialRequestStatus();
  }, [shipmentId, transporterId, hasRequest]);

  const shipmentData = currentShipment
    ? {
        id: shipmentId,
        type: helperFunctions.convertType(currentShipment.shipmentType),
        status: helperFunctions.convertStatus(currentShipment.shipmentStatus),
        date: helperFunctions.formatDate(currentShipment.shipmentDate),
        price: `${currentShipment.price} $`,
        distance: `${currentShipment.distanceBetweenAddresses} Km`,
        origin: helperFunctions.formatAddress(currentShipmentAddress[0]),
        destination: helperFunctions.formatAddress(currentShipmentAddress[1]),
        description: currentShipment.description,
      }
    : {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
      const originCoords = await ShipmentService.fetchCoordinates(
        shipmentData.origin
      );
      const destinationCoords = await ShipmentService.fetchCoordinates(
        shipmentData.destination
      );

      setOriginCord({
        ...originCoords,
        address: shipmentData.origin,
      });

      setDestinationCord({
        ...destinationCoords,
        address: shipmentData.destination,
      });
    };

    fetchData();
    setLoading(true);
  }, [shipmentData.destination, shipmentData.origin, shipmentId]);

  const createRequest = async () => {
    try {
      const result = await RequestService.createRequest(
        transporterId,
        shipmentId
      );
      if (result.success) {
        successToast(result.message);
        setHasRequest(true); // Update request status
        setRequestStatus("Pending");
      } else {
        errorToast(result.error);
      }
    } catch (error) {
      errorToast("Failed to create request. Please try again.");
    }
  };

  const deleteRequest = async () => {
    try {
      const request = await RequestService.getRequestByTransporterAndShipment(
        parseInt(transporterId),
        parseInt(shipmentId)
      );
      const result = await RequestService.deleteRequest(
        request.message.requestId
      );
      if (result.success) {
        successToast(result.message);
        setHasRequest(false); // Update request status
        setRequestStatus("No request");
      } else {
        errorToast(result.error);
      }
    } catch (error) {
      errorToast("Failed to delete request. Please try again.");
    }
  };

  if (loading) {
    return <LoadingSpin />;
  }

  return (
    <div className={"p-5 md:ml-64 ml-0 gap-2 h-screen"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex flex-col space-y-5 mt-5 md:mt-10">
          <ImageGallery images={currentShipmentImages} />
          <div className="flex flex-col space-y-3">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="text-gray-700">{shipmentData.description}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 flex flex-col justify-between">
          <h1 className="text-3xl font-bold mb-4">Shipment Details</h1>
          <div className="grid grid-cols-1 gap-0 mb-6">
            <DetailRow isTable={false} label="Type" value={shipmentData.type} />
            <DetailRow
              isTable={false}
              label="Status"
              value={shipmentData.status}
            />
            <DetailRow isTable={false} label="Date" value={shipmentData.date} />
            <DetailRow
              isTable={false}
              label="Price"
              value={shipmentData.price}
            />
            <DetailRow
              isTable={false}
              label="Distance"
              value={shipmentData.distance}
            />
            <div className="flex flex-col justify-start p-4 border-b border-gray-300">
              <span className="font-semibold">From:</span>
              <span className="text-gray-700">{shipmentData.origin}</span>
            </div>
            <div className="flex flex-col justify-start p-4 border-b border-gray-300">
              <span className="font-semibold">To:</span>
              <span className="text-gray-700">{shipmentData.destination}</span>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <span className="font-semibold">Your Request Status:</span>
              <span
                className={`font-bold ${
                  requestStatus === "Accepted"
                    ? "text-green-500"
                    : requestStatus === "Refused"
                    ? "text-red-500"
                    : requestStatus === "Pending"
                    ? "text-yellow-500"
                    : "text-gray-700"
                }`}
              >
                {requestStatus}
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row mt-0 justify-evenly">
            <ModalButton
              buttonText="View on Map"
              buttonStyle="bg-[#14213D] hover:bg-[#3c6e71] text-white"
              ModalComponent={MapModal}
              modalProps={{
                origin: originCord,
                destination: destinationCord,
              }}
            />

            <button
              onClick={() => (hasRequest ? deleteRequest() : createRequest())}
              className="bg-[#FCA311] hover:bg-[#ff6700] text-white mb-5 py-2 px-4 rounded transition duration-200"
            >
              {hasRequest ? "Delete Request" : "Create Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TransporterShipmentDetails.propTypes = {
  transporterId: PropTypes.number.isRequired,
};

export default TransporterShipmentDetails;
