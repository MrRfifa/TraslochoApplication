const Cars = () => {
  //TODO Add models for availability, updating vehicle's data and vehicle images
  return (
    <div className="mx-auto ml-0 md:ml-64 p-6 bg-white rounded-lg grid md:grid-cols-2 grid-rows-1 gap-5">
      {/* Vehicle Description Section */}
      <div className="mb-8 text-center mt-10 md:mt-0 p-6 bg-gray-50 shadow-md rounded-lg">
        <div className="flex flex-col justify-start gap-5 mt-10">
          <div className="flex flex-row text-center justify-between">
            <h2 className="text-gray-500 text-xl">Year</h2>
            <p className="text-lg font-medium text-gray-900">2021</p>
          </div>
          <div className="flex flex-row text-center justify-between">
            <h2 className="text-gray-500 text-xl">Manufacturer</h2>
            <p className="text-lg font-medium text-gray-900">Toyota</p>
          </div>
          <div className="flex flex-row text-center justify-between">
            <h2 className="text-gray-500 text-xl">Model</h2>
            <p className="text-lg font-medium text-gray-900">Camry</p>
          </div>
          <div className="flex flex-row text-center justify-between">
            <h2 className="text-gray-500 text-xl">Color</h2>
            <p className="text-lg font-medium text-gray-900">Black</p>
          </div>
          <div className="flex flex-row text-center justify-between">
            <h2 className="text-gray-500 text-xl">Vehicle Type</h2>
            <p className="text-lg font-medium text-gray-900">Van</p>
          </div>
          <div className="flex flex-row text-center justify-between">
            <h2 className="text-gray-500 text-xl">Length</h2>
            <p className="text-lg font-medium text-gray-900">5.5m</p>
          </div>
          <div className="flex flex-row text-center justify-between">
            <h2 className="text-gray-500 text-xl">Height</h2>
            <p className="text-lg font-medium text-gray-900">2.9m</p>
          </div>
          <div className="flex flex-row text-center justify-between">
            <h2 className="text-gray-500 text-xl">Availability</h2>
            <p className="text-lg font-medium text-green-400">Available</p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Repeat for each image */}
          {[...Array(11)].map((_, index) => (
            <div key={index}>
              <img
                className="h-auto max-w-full rounded-lg hover:scale-105 transition-transform duration-200"
                src={`https://flowbite.s3.amazonaws.com/docs/gallery/square/image-${
                  index + 1
                }.jpg`}
                alt={`Car image ${index + 1}`}
              />
            </div>
          ))}
          <img
            className="h-auto max-w-full rounded-lg hover:scale-105 transition-transform duration-200"
            src={`https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg`}
            alt={`Car image + 1}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Cars;
