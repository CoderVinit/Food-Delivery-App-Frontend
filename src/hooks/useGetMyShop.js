import axios from "axios";
import { useDispatch } from "react-redux";
import { setShopData } from "../redux/slices/shopSlice";
import { useEffect } from "react";



export const getShopByOwner = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchShop = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/shop/get-shop`, { withCredentials: true });
                if (data.success) {
                    console.log("Fetched shop data:", data.data);
                    dispatch(setShopData(data.data));
                }
                else {
                    console.log("Failed to fetch user data:", data.message);
                    dispatch(setShopData(null)); // Clear shop data on failure
                }
            } catch (error) {
                console.error("Error fetching shop data:", error);
                dispatch(setShopData(null)); // Clear shop data on error
            }
        }
        fetchShop();
    }, [dispatch]);
}