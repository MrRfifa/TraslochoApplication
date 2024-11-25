import empty from "../assets/generals/empty.svg";
import PropTypes from "prop-types";

const Empty = ({ message, description }) => {
  return (
    <div style={styles.container}>
      <img src={empty} alt="No Shipments" style={styles.image} />
      <h3 style={styles.message}>{message || "No shipments available"}</h3>
      <p style={styles.description}>
        {description ||
          "It looks like there are no shipments in this category at the moment. Try creating a shipment!"}
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto", // Centers the content horizontally
  },
  image: {
    width: "150px",
    height: "150px",
    marginBottom: "15px",
  },
  message: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  description: {
    fontSize: "1rem",
    color: "#666", // Slightly muted text for the description
    padding: "0 15px",
  },
};

Empty.propTypes = {
  message: PropTypes.string,
  description: PropTypes.string,
};

export default Empty;
