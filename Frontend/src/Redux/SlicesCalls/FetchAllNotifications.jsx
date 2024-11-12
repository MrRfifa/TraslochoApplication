import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllNotifications } from "../Features/notificationSlice";
import UserInfo from "./UserInfo";

const FetchAllNotifications = () => {
  const state = useSelector((state) => state.userInfo.value);
  const dispatch = useDispatch();
  UserInfo();

  useEffect(() => {
    dispatch(fetchAllNotifications(state.id));
  }, [dispatch, state.id]);
  return null;
};

export default FetchAllNotifications;
