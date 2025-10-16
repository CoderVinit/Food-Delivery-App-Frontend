import axios from "axios";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

// Hook contract:
// - Call inside a component to get a function: updateStatus(orderId, shopOrderId, status)
// - It performs the API call and optionally dispatches updated data
export const useUpdateStatus = () => {
  const dispatch = useDispatch();

  const updateStatus = useCallback(async (orderId, shopOrderId, status) => {
    try {
      const { data: resp } = await axios.post(
        `http://localhost:8080/api/order/update-order-status/${orderId}/${shopOrderId}`,
        { status },
        { withCredentials: true }
      );
      if (resp?.success) {
        console.log("Order status updated successfully");
      }
      return resp;
    } catch (error) {
      console.log(error?.message);
      throw error;
    }
  }, [dispatch]);

  return updateStatus;
};
