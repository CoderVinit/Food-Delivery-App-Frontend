import axios from "axios";
import { useDispatch } from "react-redux";
import { setShopData, setShopLoading, setShopError } from "../redux/slices/shopSlice";
import { useEffect, useCallback } from "react";
import { BASE_URL } from "../config/constant";

export const useGetShopByOwner = () => {
    const dispatch = useDispatch();
    
    const fetchShop = useCallback(async () => {
        try {
            dispatch(setShopLoading(true));
            dispatch(setShopError(null));
            
            const { data } = await axios.get(`${BASE_URL}/api/shop/get-shop`, { withCredentials: true });
            if (data.success) {
                console.log("Fetched shop data:", data.data);
                toast.success(data?.message || "Shop data fetched successfully");
                dispatch(setShopData(data.data));
            } else {
                const errorMsg = data.message || "Failed to fetch shop data";
                console.log("Failed to fetch shop data:", errorMsg);
                toast.error(errorMsg);
                dispatch(setShopError(errorMsg));
                dispatch(setShopData(null));
            }
        } catch (error) {
            console.error("Error fetching shop data:", error);
            const errorMsg = error.response?.data?.message || error.message || "Network error while fetching shop data";
            toast.error(errorMsg);
            dispatch(setShopError(errorMsg));
            dispatch(setShopData(null));
        } finally {
            dispatch(setShopLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchShop();
    }, [fetchShop]);

    return fetchShop;
}