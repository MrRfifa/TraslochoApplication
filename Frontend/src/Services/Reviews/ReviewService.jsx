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

const getReviewsByOwnerId = async (ownerId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.get(`${API_URL}review/owner/${ownerId}`, {
      headers,
    });
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

const createReview = async (ownerId, transporterId, rating, comment) => {
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.post(
      `${API_URL}review/create-review/${ownerId}/${transporterId}`,
      {
        Rating: rating,
        Comment: comment,
      },
      {
        headers,
      }
    );
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    // console.error("Error creating review:", error);
    return { success: false, error: error.response.data.message };
  }
};

const deleteReview = async (reviewId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };
  try {
    const response = await axios.delete(`${API_URL}review/${reviewId}`, {
      headers,
    });
    if (response.data && response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: "Error deleting review" };
  }
};

const ReviewService = {
  getReviewsByTransporterId,
  getReviewsByOwnerId,
  createReview,
  deleteReview,
};

export default ReviewService;
