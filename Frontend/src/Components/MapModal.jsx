import Modal from "react-modal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";

const MapModal = ({ isOpen, onClose, origin, destination }) => {
  return (
    <Modal
      className="ml-0 md:ml-72"
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Map Modal"
      ariaHideApp={false}
      style={{
        content: {
          maxWidth: "800px",
          maxHeight: "600px",
          margin: "auto",
          padding: "20px",
        },
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <h2>Shipment Route</h2>
      <MapContainer
        style={{ height: "400px", width: "100%" }}
        center={[
          (origin.lat + destination.lat) / 2,
          (origin.lng + destination.lng) / 2,
        ]}
        zoom={8}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[origin.lat, origin.lng]}>
          <Popup>From: {origin.address}</Popup>
        </Marker>
        <Marker position={[destination.lat, destination.lng]}>
          <Popup>To: {destination.address}</Popup>
        </Marker>
      </MapContainer>
      <button className="text-white text-xl font-bold border p-2 rounded-lg bg-[#FCA311]" onClick={onClose} style={{ marginTop: "20px" }}>
        Close
      </button>
    </Modal>
  );
};

MapModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  origin: PropTypes.object.isRequired,
  destination: PropTypes.object.isRequired,
};

export default MapModal;
