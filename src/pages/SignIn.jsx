import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  }); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);

        try {
          setLoading(true);
            const {data} = await axios.post(`http://localhost:8080/api/auth/signin`, formData,{withCredentials: true});
            if(data.success){
                console.log("User signed in successfully");
                dispatch(setUserData(data.user));
                setFormData({
                    email: "",
                    password: "",
                }); 
                navigate("/"); // Navigate to home instead of profile
                setLoading(false);
            } else {
                console.log("Sign in failed:", data.message);
                alert(data.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error signing in:", error);
            setLoading(false);
        }
    }

    const handleGoogleAuth = async () => {
        try {
          setLoading(true);
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          const {data} = await axios.post(`http://localhost:8080/api/auth/google-auth`, {email: user.email},{withCredentials: true});
          if(data.success){
            console.log("User signed in with Google:", user);
            dispatch(setUserData(data.user));
            navigate("/"); // Navigate to home
          } else {
            console.log("Google sign in failed:", data.message);
            alert(data.message);
          }
        } catch (error) {
            console.error("Error with Google authentication:", error);
            
            // Handle specific Firebase auth errors
            if (error.code === 'auth/popup-closed-by-user') {
              console.log("User closed the popup, no action needed");
              // Don't show error message for user-cancelled action
              return;
            } else if (error.code === 'auth/popup-blocked') {
              alert("Popup was blocked by browser. Please allow popups and try again.");
            } else if (error.code === 'auth/cancelled-popup-request') {
              console.log("Popup request was cancelled");
              // Don't show error for cancelled requests
              return;
            } else if (error.code === 'auth/network-request-failed') {
              alert("Network error. Please check your internet connection and try again.");
            } else if (error.code === 'auth/too-many-requests') {
              alert("Too many failed attempts. Please try again later.");
            } else {
              alert("Failed to sign in with Google. Please try again.");
            }
        } finally {
          setLoading(false);
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center w-full p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 border-[1px] border-[#ddd]">
        <h1 className="text-3xl font-black mb-2 text-[#ff4d2d]">Vingo</h1>
        <p className="text-gray-600 mb-8">
          SignIn to your account to get started with delicious food deliveries.
        </p>

        <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              id="password"
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter Your Password"
                value={formData.password}
                onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              onClick={() => setShowPassword((pre) => !pre)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="text-right mb-4 text-[#ff4d2d] cursor-pointer" onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </div>
      <button type="submit" className="w-full font-semibold text-white bg-[#ff4d2d] hover:bg-[#e64323] mt-4 flex items-center justify-center gap-2 border border-[#ddd] rounded-lg px-4 py-2 transition duration-200 cursor-pointer"> {loading ? <ClipLoader size={20} color={"#fff"} /> : "Sign In"}</button>
      </form>
      <button 
        className={`w-full font-semibold text-black hover:bg-gray-100 mt-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 transition duration-200 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`} 
        onClick={handleGoogleAuth}
        disabled={loading}
      >
        {loading ? <ClipLoader size={20} color={"#000"} /> : <FcGoogle />} 
        {loading ? "Signing in..." : "Sign In with Google"}
      </button>
      <p className="text-xs text-gray-500 mt-1 text-center">Make sure to allow popups for Google sign-in</p>
      <p className="mt-3 text-center">Don't have an account ? <span onClick={() => navigate("/signup")} className="text-[#ff4d2d] cursor-pointer underline">Sign Up</span></p>
    </div>
    </div>
  );
};

export default SignIn;
