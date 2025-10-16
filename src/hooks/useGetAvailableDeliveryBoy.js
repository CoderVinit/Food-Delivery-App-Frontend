import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import { setAvailableBoys } from "../redux/slices/userSlice";

// Use inside a component: useGetAvailableDeliveryBoys();
// It will fetch once on mount and whenever location changes.
export const useGetAvailableDeliveryBoys = () => {
  const dispatch = useDispatch();
  const { location } = useSelector((state) => state.map || {});

  const fetchAvailableDeliveryBoys = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/user/available-delivery-boys?latitude=${location?.lat}&longitude=${location?.lon}`,
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        dispatch(setAvailableBoys(data.data || []));
      } else {
        dispatch(setAvailableBoys([]));
      }
    } catch (error) {
      console.error("Error fetching available delivery boys:", error);
      dispatch(setAvailableBoys([]));
    }
  }, [dispatch, location?.lat, location?.lon]);

  useEffect(() => {
    if (location?.lat && location?.lon) {
      fetchAvailableDeliveryBoys();
    }
  }, [fetchAvailableDeliveryBoys]);
};
