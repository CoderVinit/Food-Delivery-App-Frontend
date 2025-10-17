import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCurrentOrders, setMyOrders } from "../redux/slices/userSlice";



export const getCurrentOrders = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchCurrentOrders = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/order/current-order`, { withCredentials: true });
                if (data.success) {
                    console.log(data," User orders fetched successfully");
                    dispatch(setCurrentOrders(data.data));
                }
                else {
                    console.log("Failed to fetch user data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching user orders:", error);
            }
        }
        fetchCurrentOrders();
    }, [dispatch]);
}