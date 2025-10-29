import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { setMyOrders, setOrdersLoading, setOrdersError } from "../redux/slices/userSlice";

export const useGetMyOrders = () => {
    const dispatch = useDispatch();
    
    const fetchOrders = useCallback(async () => {
        try {
            dispatch(setOrdersLoading(true));
            dispatch(setOrdersError(null));
            
            const { data } = await axios.get(`http://localhost:8080/api/order/my-orders`, { withCredentials: true });
            if (data.success) {
                dispatch(setMyOrders(data.data || data.orders || []));
            } else {
                const errorMsg = data.message || "Failed to fetch my orders";
                console.log("Failed to fetch my orders:", errorMsg);
                dispatch(setOrdersError(errorMsg));
                dispatch(setMyOrders([]));
            }
        } catch (error) {
            console.error("Error fetching my orders:", error);
            const errorMsg = error.response?.data?.message || error.message || "Network error while fetching orders";
            dispatch(setOrdersError(errorMsg));
            dispatch(setMyOrders([]));
        } finally {
            dispatch(setOrdersLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return fetchOrders;
}