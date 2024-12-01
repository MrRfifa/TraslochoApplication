import { useEffect, useState } from "react";
import VehicleService from "../../Services/Vehicles/VehicleService";
import Empty from "../../Components/Empty";
import CreateCarForm from "../../Components/Forms/Cars/CreateCarForm";
import DetailRow from "../../Components/DetailRow";
import ImageGallery from "../../Components/ImageGallery";

const Cars = () => {
  const [car, setCar] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTransporterCar = async () => {
      setLoading(true);
      try {
        const transporterCar = await VehicleService.getVehicleByTransporterId();
        // Normalize the response to an array
        setCar(transporterCar.message !== null ? [transporterCar.message] : []);

        setLoading(false); // Mark loading as complete
      } catch (error) {
        console.error("Failed to fetch pending shipments:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };
    fetchTransporterCar();
  }, []);

  if (loading) {
    // Render loading spinner while data is being fetched
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
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

  // Extract only image data because the back returns redundant data(backend issue)
  const vehicleImages = car[0].vehicleImages.map(
    (image) => image.fileContentBase64
  );

  //TODO Add models for availability, updating vehicle's data and vehicle images
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
            <span className={"font-semibold text-black text-lg"}>
              Availability:
            </span>
            <span
              className={car[0].isAvailable ? "text-green-500" : "text-red-500"}
            >
              {car[0].isAvailable ? "Available" : "Not Available"}
            </span>
          </div>

          <div className="flex flex-row text-center justify-between">
            <button
              type="button"
              className="text-white bg-green-600 hover:bg-green-800 hover:scale-105 hover:shadow-xl font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-600 dark:focus:ring-green-600"
            >
              Upload images
            </button>

            <button
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 hover:scale-105 hover:shadow-xl  font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-600 dark:focus:ring-red-600"
            >
              Delete All images
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
        {/* Gallery Grid */}
        <ImageGallery images={vehicleImages} />
      </div>
    </div>
  );
};

export default Cars;
