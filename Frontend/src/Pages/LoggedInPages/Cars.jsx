import { useEffect, useState } from "react";
import VehicleService from "../../Services/Vehicles/VehicleService";
import Empty from "../../Components/Empty";
import CreateCarForm from "../../Components/Forms/Cars/CreateCarForm";
import DetailRow from "../../Components/DetailRow";
import ImageGallery from "../../Components/ImageGallery";
import UpdateCarModal from "../../Components/Modals/UpdateCarModal";
import { errorToast, successToast } from "../../Components/Toasts";
import UploadCarImages from "../../Components/Modals/UploadCarImages";
import LoadingSpin from "../../Components/LoadingSpin";

const Cars = () => {
  const [car, setCar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isImagesUpdateOpen, setIsImagesUpdateOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const fetchTransporterCar = async () => {
      setLoading(true);
      try {
        const transporterCar = await VehicleService.getVehicleByTransporterId();
        const carData = transporterCar.message ? [transporterCar.message] : [];
        setCar(carData);

        if (carData.length > 0) {
          setIsAvailable(carData[0].isAvailable); // Initialize availability state
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch transporter car:", error);
        setLoading(false);
      }
    };

    fetchTransporterCar();
  }, []);

  const updateCarAvailability = async () => {
    try {
      const result = await VehicleService.toggleCarAvailability(
        car[0].id,
        isAvailable
      );
      if (result.success) {
        successToast(result.message);
        setIsAvailable((prev) => !prev); // Toggle availability state
      } else {
        errorToast(result.error);
      }
    } catch (error) {
      errorToast("Failed to update availability. Please try again.");
    }
  };

  if (loading) {
    return (
     <LoadingSpin />
    );
  }

  if (car.length === 0 && !showForm) {
    return (
      <div className="flex flex-col justify-start items-center space-y-10">
        <Empty
          message={"There is no car currently"}
          description={
            "To add a car you have to click the button and fill out the form"
          }
        />
        <button
          onClick={() => setShowForm(true)}
          className="text-white w-52 bg-blue-400 hover:scale-105 hover:bg-blue-600 px-4 py-2 rounded-full transition duration-200"
        >
          Create vehicle
        </button>
      </div>
    );
  }

  if (car.length === 0 && showForm) {
    return (
      <div className="ml-0 md:ml-64 flex">
        <CreateCarForm />
      </div>
    );
  }


  const vehicleImages =
    car[0]?.vehicleImages?.map((image) => image.fileContentBase64) || [];

  return (
    <div className="mx-auto ml-0 md:ml-64 p-6 bg-white rounded-lg grid md:grid-cols-2 grid-rows-1 gap-5">
      {/* Vehicle Description Section */}
      <div className="mb-8 text-center mt-10 md:mt-0 p-6 bg-gray-50 shadow-md rounded-lg">
        <div className="flex flex-col justify-start gap-5">
          <DetailRow
            isTable={false}
            label="Manufacture"
            value={car[0].manufacture}
          />
          <DetailRow isTable={false} label="Model" value={car[0].model} />
          <DetailRow isTable={false} label="Color" value={car[0].color} />
          <DetailRow
            isTable={false}
            label="Type"
            value={car[0].vehicleType === 0 ? "Van" : "Truck"}
          />
          <DetailRow isTable={false} label="Length" value={car[0].length} />
          <DetailRow isTable={false} label="Height" value={car[0].height} />
          <div className="flex justify-between items-center text-xl p-4 border-b border-gray-300 text-gray-600">
            <span className="font-semibold text-black text-lg">
              Availability:
            </span>
            <span
              className={
                isAvailable
                  ? "text-green-500 font-bold"
                  : "text-red-500 font-bold"
              }
            >
              {isAvailable ? "Available" : "Not Available"}
            </span>
          </div>

          <div className="flex flex-row text-center justify-between">
            <button
              onClick={() => setIsUpdateOpen(true)}
              type="button"
              className="text-white bg-yellow-400 hover:bg-yellow-500 hover:scale-105 hover:shadow-xl font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2"
            >
              Update Info
            </button>
            {isUpdateOpen && (
              <UpdateCarModal
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                currentVehicle={car[0]}
              />
            )}

            <button
              onClick={updateCarAvailability}
              className={`text-white hover:scale-105 hover:shadow-xl font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 ${
                isAvailable
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isAvailable ? "Mark as Unavailable" : "Mark as Available"}
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-6xl mx-auto p-6">
        <ImageGallery images={vehicleImages} />
        <button
          onClick={() => setIsImagesUpdateOpen(true)}
          type="button"
          className="text-white bg-green-600 hover:bg-green-800 hover:scale-105 hover:shadow-xl font-medium rounded-full text-sm px-5 py-2.5"
        >
          Upload Images
        </button>
        {isImagesUpdateOpen && (
          <UploadCarImages
            isOpen={isImagesUpdateOpen}
            onClose={() => setIsImagesUpdateOpen(false)}
            vehicleId={car[0].id}
          />
        )}
      </div>
    </div>
  );
};

export default Cars;
