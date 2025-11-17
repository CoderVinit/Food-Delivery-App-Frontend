import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { BASE_URL } from "../config/constant";
import toast from "react-hot-toast";
import axios from "axios";

const UserOrderCard = ({ order }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState(0);

  const handleRating = (value) => {
    setRating(value);
  }

  const handleSubmit = async () => {
    try {
      const {data} = await axios.post(`${BASE_URL}/api/order/rate-order/${order._id}`, { rating },{ withCredentials: true });
      if(data?.success){
        toast.success(data.message || "Rating submitted successfully");
        setSubmitted(true);
        setRatings(data.rating)
      }
    } catch (error) {
      console.error(error);
    }
  }

  console.log(order);
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex justify-between border-b pb-2">
        <div>
          <p className="font-semibold">order #{order._id.slice(-6)}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {order.paymentMethod?.toUpperCase()}
          </p>
          <p className="font-medium text-blue-500">
            {order.shopOrder?.[0].status}
          </p>
        </div>
      </div>
      {order?.shopOrder?.map((shopO, index) => (
        <div
          className="border rounded-lg p-3 bg-[#fffaf7] space-y-3"
          key={index}
        >
          <p>{shopO?.shop?.name}</p>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {shopO?.shopOrderItems?.map((item, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-40 rounded-lg p-2 bg-white"
              >
                <img
                  src={item?.item?.image}
                  alt={item?.item?.name}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <p className="text-sm font-semibold mt-1">{item?.name}</p>
                <p className="text-xs text-gray-500">
                  ₹{item?.price} x {item?.quantity}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t pt-2 items-center">
            <p className="font-semibold">Subtotal: ₹{shopO?.subtotal}</p>
            <span className="text-sm font-medium text-blue-600">
              {shopO?.status}
            </span>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center border-t pt-2">
        <p className="font-semibold">Total: ₹{order.totalAmount}</p>
        <button className="px-4 py-2 bg-[#ff4d2d] text-white rounded-lg hover:bg-[#e64528] cursor-pointer" onClick={()=>navigate(`/track-order/${order._id}`)}>
          Track Order
        </button>
      </div>

      {order?.shopOrder?.[0].status === "delivered" && !submitted && (
        <div className="mt-4 border-t pt-3">
          <div className="text-gray-800 font-semibold mb-2">Rate your order:</div>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => {
              const value = i + 1;
              const isActive = value <= (hover || rating);
              return (
                <FaStar
                  key={value}
                  size={24}
                  value={ratings}
                  onClick={() => handleRating(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(0)}
                  className="cursor-pointer transition-colors"
                  color={isActive ? "#facc15" : "#d1d5db"}
                />
              );
            })}
          </div>
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className={`px-4 py-2 rounded-md font-medium ${
              rating === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            }`}
          >
            Submit Rating
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-4 text-green-600 font-medium">
          ✅ Thank you for your feedback!
        </div>
      )}
    </div>
  );
};

export default UserOrderCard;
