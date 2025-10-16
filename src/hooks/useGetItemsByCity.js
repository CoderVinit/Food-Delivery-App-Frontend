import axios from "axios";
import { useDispatch } from "react-redux";
import { setShopByCity, setShopData } from "../redux/slices/shopSlice";
import { useEffect } from "react";
import { setError, setItemsByCity } from "../redux/slices/userSlice";



export const getItemsByCity = (city) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/item/getItems/${city}`, { withCredentials: true });
                if (data.success) {
                    dispatch(setItemsByCity(data.data));
                    dispatch(setError(""));
                }
                else {
                    dispatch(setItemsByCity([]));
                    console.log("Failed to fetch user data:", data.message);
                }
            } catch (error) {
                dispatch(setError(error.message));
                console.error("Error fetching shop data:", error);
            }
        }
        fetchItems();
    }, [dispatch,city]);
}