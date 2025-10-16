import axios from "axios";
import { useDispatch } from "react-redux";
import { setShopByCity } from "../redux/slices/shopSlice";
import { useEffect } from "react";

export const useGetShopByCity = (city) => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (!city) return; // Don't fetch if no city provided
        
        const fetchShop = async () => {
            try {
                console.log('Fetching shops for city:', city);
                const { data } = await axios.get(`http://localhost:8080/api/shop/get-shop-by-city/${city}`, { 
                    withCredentials: true 
                });
                
                if (data.success) {
                    console.log('Shops fetched successfully:', data.data);
                    dispatch(setShopByCity(data.data));
                } else {
                    console.log("Failed to fetch shop data:", data.message);
                    dispatch(setShopByCity([])); // Set empty array on failure
                }
            } catch (error) {
                console.error("Error fetching shop data:", error);
                dispatch(setShopByCity([])); // Set empty array on error
            }
        };
        
        fetchShop();
    }, [dispatch, city]);
};