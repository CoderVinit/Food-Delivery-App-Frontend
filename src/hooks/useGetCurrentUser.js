import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";



export const getCurrentUser = async () => {
    const dispatch = useDispatch();
    try {
        const {data} = await axios.get(`http://localhost:8080/api/user/current-user`, {withCredentials: true});
        if(data.success){
            dispatch(setUserData(data.user));
        }
        else{
            console.log("Failed to fetch user data:", data.message);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}