import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setMyOrders } from "../redux/slices/userSlice";



export const getUserOrders = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/order/my-orders`, { withCredentials: true });
                if (data.success) {
                    console.log(data," User orders fetched successfully");
                    dispatch(setMyOrders(data.data));
                }
                else {
                    console.log("Failed to fetch user data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching user orders:", error);
            }
        }
        fetchUserOrders();
    }, [dispatch]);
}