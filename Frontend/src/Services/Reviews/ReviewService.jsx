import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

const getReviewsByTransporterId = async (transporterId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(
      `${API_URL}review/transporter/${transporterId}`,
      {
        headers,
      }
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: "Reviews not available" };
    }
  } catch (error) {
    // console.error("Error getting reviews:", error);
    return { success: false, error: "Error getting reviews" };
  }
};

const ReviewService = {
  getReviewsByTransporterId,
};

export default ReviewService;
