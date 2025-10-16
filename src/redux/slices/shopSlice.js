import { createSlice } from "@reduxjs/toolkit";

// Get shop from localStorage if it exists
const getShopFromStorage = () => {
    try {
        const shop = localStorage.getItem('shopInfo');
        return shop ? JSON.parse(shop) : null;
    } catch (error) {
        return null;
    }
};

const shopSlice = createSlice({
    name: "shop",
    initialState: {
        shopInfo: getShopFromStorage(), // Initialize from localStorage
        shopByCity: [],
        loading: false,
        error: null,
    },
    reducers: {
        setShopData: (state, action) => {
            state.shopInfo = action.payload;
            if (action.payload) {
                localStorage.setItem('shopInfo', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('shopInfo');
            }
        },
        setShopByCity: (state,action)=>{
            state.shopByCity = action.payload;
        },
        clearShopData: (state) => {
            state.shopInfo = null;
            state.error = null;
            localStorage.removeItem('shopInfo');
        },
        setShopLoading: (state, action) => {
            state.loading = action.payload;
        },
        setShopError: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const { setShopData, clearShopData, setShopLoading, setShopError,setShopByCity } = shopSlice.actions;

export default shopSlice.reducer;