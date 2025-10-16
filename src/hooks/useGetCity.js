import axios from "axios";
import { useDispatch } from "react-redux";
import { setCity, setCurrentAddress, setState } from "../redux/slices/userSlice";
import { useEffect } from "react";
import { setAddress, setLocation } from "../redux/slices/mapSlice";



export const getCity = async () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(async (position) => {
            console.log(position)
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                const {data} = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`);
                console.log(data.features[0].properties);
                if(data.features.length > 0){
                    const city = data.features[0].properties.city;
                    const state = data.features[0].properties.state;
                    const currentAddress = data.features[0].properties.address_line1;
                    console.log("City:", city);
                    dispatch(setCity(city));
                    dispatch(setState(state));
                    dispatch(setCurrentAddress(currentAddress));
                    dispatch(setLocation({lat:latitude, lon:longitude}));
                    dispatch(setAddress(data.features[0].properties.address_line2));
                }
            } catch (error) {
                console.error("Error fetching city:", error);
            }
        })
    }, [])
}