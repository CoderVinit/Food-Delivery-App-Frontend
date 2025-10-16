
import { createSlice } from "@reduxjs/toolkit";

// Get user from localStorage if it exists
const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem('userInfo');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        return null;
    }
};

const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: getUserFromStorage(),         // Initialize from localStorage
        city: "",
        state: "",
        currentAddress: "",
        itemsByCity: [],
        cartItems: [],
        myOrders: [],
        ownerOrders: [],
        availableBoys: [],
        totalAmount: 0,
        loading: false,
        error: null,
    },  
    reducers: {
        setUserData: (state, action) => {
            state.userInfo = action.payload;
            if (action.payload) {
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('userInfo');
            }
        },
        setCity: (state, action) => {
            state.city = action.payload;
        },
        setState: (state, action) => {
            state.state = action.payload;
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload;
        },
        setItemsByCity: (state, action) => {
            state.itemsByCity = action.payload;
        },
        setCartItems: (state, action) => {
            const cartItem = action.payload; 
            const existing = state.cartItems.find(item => item.id === cartItem.id);
            if(existing){
                existing.quantity+=cartItem.quantity;
            }else{
                state.cartItems.push(cartItem);
            }
            state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        updateQuantity:(state,action)=>{
            const {id, quantity} = action.payload;
            const existing = state.cartItems.find(item => item.id === id);
            if(existing){
                existing.quantity = quantity;
            }
            state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        },
        setAvailableBoys: (state, action) => {
            state.availableBoys = action.payload;
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.cartItems = state.cartItems.filter(item => item.id !== id);
            state.totalAmount = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        },
        clearUserData: (state) => {
            state.userInfo = null;
            state.city = "";
            state.state = "";
            state.currentAddress = "";
            state.error = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('shopInfo');
            // Also clear any other potential auth-related localStorage items
            localStorage.removeItem('token');
            localStorage.removeItem('authData');
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setMyOrders: (state, action) => {
            state.myOrders = action.payload;
        },
        setOwnerOrders: (state, action) => {
            state.ownerOrders = action.payload;
        }
    },
    
});

export const { setUserData, setCity, setState, setCurrentAddress, setAvailableBoys, clearUserData, setLoading, setError, setItemsByCity, setCartItems, updateQuantity, removeFromCart, setMyOrders, setOwnerOrders } = userSlice.actions;
export default userSlice.reducer;