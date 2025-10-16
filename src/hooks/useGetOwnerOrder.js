import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setOwnerOrders } from "../redux/slices/userSlice";



export const getOwnerOrders = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchOwnerOrders = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/order/owner-orders`, { withCredentials: true });
                if (data.success) {
                    console.log(data," Owner orders fetched successfully");
                    dispatch(setOwnerOrders(data.orders));
                }
                else {
                    console.log("Failed to fetch owner data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching owner orders:", error);
            }
        }
        fetchOwnerOrders();
    }, [dispatch]);
}