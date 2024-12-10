import { useEffect, useState } from "react";
import ReviewService from "../../Services/Reviews/ReviewService";
import { useSelector } from "react-redux";
import UserInfo from "../../Redux/SlicesCalls/UserInfo";
import { errorToast } from "../Toasts";
import LoadingSpin from "../LoadingSpin";
import Empty from "../Empty";
import ReviewCard from "../Cards/ReviewCard";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState({});

  const state = useSelector((state) => state.userInfo.value);
  UserInfo();
  var isOwner = state.role === "Owner";
  const userId = state.id;

  useEffect(() => {
    const loadUserReviews = async () => {
      setLoading(true); // Start loading immediately
      try {
        const reviews = isOwner
          ? await ReviewService.getReviewsByOwnerId(userId)
          : await ReviewService.getReviewsByTransporterId(userId);

        if (reviews.success) {
          setReviews(reviews.message);
        } else {
          errorToast(
            reviews.error || "An error occurred while processing your request."
          ); // Handle generic fallback
        }
      } catch (error) {
        console.error(error);
        errorToast("Failed to load data. Please try again."); // Show a generic error toast
      } finally {
        setLoading(false); // Always stop loading
      }
    };
    loadUserReviews();
  }, [isOwner, userId]);

  if (loading) {
    return <LoadingSpin />;
  }

  return (
    <div>
      {reviews.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ReviewCard isPreview={false} onReviewDeleted={() => {}} reviews={reviews} />
        </div>
      ) : (
        <Empty
          description={"It looks like there are no reviews at the moment!"}
          message={"No reviews"}
        />
      )}
    </div>
  );
};

export default Reviews;
