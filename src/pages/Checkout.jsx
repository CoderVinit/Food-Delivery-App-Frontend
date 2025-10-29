import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/slices/mapSlice";
import axios from "axios";
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { removeFromCart } from "../redux/slices/userSlice";
import { BASE_URL } from "../config/constant";

function RecenterMap({ lat, lon }) {
  const map = useMap();
  map.setView([lat, lon], 16, { animate: true });
  return null;
}


const Checkout = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { location, address } = useSelector((state) => state.map);
  const {cartItems,totalAmount} = useSelector(state=>state.user);
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const AmountWithDeliveryFee = totalAmount + deliveryFee;

  const dispatch = useDispatch();
  const onDragEnd = (event) => {
    const marker = event.target;
    const position = marker.getLatLng();
    dispatch(setLocation({ lat: position.lat, lon: position.lng }));
    getAddressByLatLng(position.lat, position.lng);
  };





  const getAddressByLatLng = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${
          import.meta.env.VITE_GEOAPI_KEY
        }`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        console.log("Address:", data.features[0].properties.address_line2);
        dispatch(setAddress(data.features[0].properties.address_line2));
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
    return null;
  };

  const currentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      getAddressByLatLng(latitude, longitude);
    });
  };

  const getlatLongByLocation = async () => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          searchLocation
        )}&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`
      );
      if (res.data.features && res.data.features.length > 0) {
        const lat = res.data.features[0].properties.lat;
        const lon = res.data.features[0].properties.lon;
        // console.log(lat, lon);
        dispatch(setLocation({ lat: lat, lon: lon }));
        dispatch(setAddress(res.data.features[0].properties.address_line2));
      }
    } catch (error) {
      console.error("Error fetching lat long:", error);
    }
  };


  // handle checkout function for order place

  const handleCheckout = async() => {
    try {
      const {data} = await axios.post(`${BASE_URL}/api/order/place-order`,{
        cartItems,
        paymentMethod,
        deliveryAddress: {text: address, latitude: location.lat, longitude: location.lon},
        totalAmount: AmountWithDeliveryFee
      },{withCredentials: true});
      if(data.success){
      console.log("Order placed successfully:", data);
      navigate("/order-placed");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  }

  useEffect(() => {
    if(cartItems.length === 0){
      navigate("/");
    }
    setSearchLocation(address);
  }, [address]);

  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      <div
        className="absolute top-[20px] left-[20px] z-[10]"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
      </div>
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <IoLocationSharp className="text-[#ff4d2d]" /> Delivery Location
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={searchLocation}
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              placeholder="Enter your delivery address ....."
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <button
              onClick={getlatLongByLocation}
              className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
            >
              <IoSearchOutline />
            </button>
            <button
              onClick={currentLocation}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
            >
              <TbCurrentLocation />
            </button>
          </div>

          {/* Map implementation starts from here */}
          <div className="rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-baseline justify-center">
              <MapContainer
                className="w-full h-full"
                center={[location?.lat, location?.lon]}
                zoom={17}
              >
                <RecenterMap lat={location?.lat} lon={location?.lon} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[location?.lat, location?.lon]}
                  draggable
                  eventHandlers={{
                    dragend: onDragEnd,
                  }}
                />
              </MapContainer>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Payment Method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "cod"
                  ? "border-[#ff4d2d] bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              } cursor-pointer`}
               onClick={() => setPaymentMethod("cod")}
            >

                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <MdDeliveryDining className="text-green-600 text-xl" />
                </span>
                <div>
                  <p className="font-medium text-gray-800">Cash on Delivery</p>
                  <p className="text-gray-500 text-xs">Pay when food arrives</p>
                </div>

            </div>
            <div
             className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "online"
                  ? "border-[#ff4d2d] bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              } cursor-pointer`}
              onClick={() => setPaymentMethod("online")}
            >
               <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobileScreenButton className="text-purple-700 text-lg"/>
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <FaCreditCard className="text-blue-700 text-lg"/>
                </span>
                <div>
                  <p className="font-medium text-gray-800">UPI / Credit / Debit Card</p>
                  <p className="text-gray-500 text-xs">Pay Securely Online</p>
                </div>
            </div>
          </div>
        </section>

{/* order summary */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Order Summary
            </h2>
            <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
              {
                cartItems?.map((item,index)=>(
                  <div className="flex justify-between text-sm text-gray-700" key={index}>
                    <span>{item?.name} x {item?.quantity}</span>
                    <span>₹{item?.price * item?.quantity}</span>
                  </div>
                ))
              }
              <hr className="my-2 border-gray-200" />
              <div className="flex justify-between font-medium text-gray-800">
                <span>Subtotal:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee:</span>
                <span>{deliveryFee === 0 ? "Free" : "₹" + deliveryFee}</span>
              </div>
              <div className="flex justify-between text-[#ff4d2d]">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">₹{AmountWithDeliveryFee}</span>
              </div>
            </div>
          </section>
            <button
              onClick={paymentMethod === "cod" ? handleCheckout : handleCheckout}
            className="w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold cursor-pointer"
            >
              {paymentMethod === "cod" ? "Place Order": "Pay & Place Order"}
            </button>
      </div>
    </div>
  );
};

export default Checkout;
