import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setMyOrders } from "../redux/slices/userSlice";



export const getOrderByOwner = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/order/my-orders`, { withCredentials: true });
                if (data.success) {
                    dispatch(setMyOrders(data.orders));
                }
                else {
                    console.log("Failed to fetch user order data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching order data:", error);
            }
        }
        fetchOrders();
    }, [dispatch]);
}