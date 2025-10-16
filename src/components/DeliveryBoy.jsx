import React from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const DeliveryBoy = () => {
  const { userInfo } = useSelector((state) => state.user);
  const [assignments, setAssignments] = useState([]);
  const getAssignments = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/api/order/get-assignment",
        { withCredentials: true }
      );
      if (result.data.success) {
        console.log(result.data.data);
        setAssignments(result.data.data);
      } else {
        console.log(result.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAssignments();
  }, [userInfo]);

  console.log("assignments",assignments);

  const handleAcceptOrder = async (assignmentId) => {
    try {
      const { data } = await axios.post(
        `http://localhost:8080/api/order/accept-order/${assignmentId}`,{},
        { withCredentials: true }
      );
      if (data.success) {
        alert("Order accepted successfully");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />
      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center text-center gap-2 w-[90%] border border-orange-100">
          <h1 className="text-xl font-bold text-[#ff4d2d]">
            Welcome, {userInfo?.fullName}
          </h1>
          <p className="text-[#ff4d2d]">
            <span className="font-semibold">Latitude:</span>{" "}
            {userInfo?.location?.coordinates[0]},{" "}
            <span className="font-semibold">Longitude:</span>{" "}
            {userInfo?.location?.coordinates[1]}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
          <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
            Available Orders
          </h1>
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <p className="text-gray-600">No assignments available</p>
            ) : (
              assignments.map((assignment, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {assignment?.shopName}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Delivery Address:</span>{" "}
                      {assignment?.deliveryAddress?.text}
                    </p>
                    <p className="text-xs text-gray-400">
                      {assignment?.items.length} items | ₹{assignment?.subtotal}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAcceptOrder(assignment.assignmentId)}
                    className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600 cursor-pointer"
                  >
                    Accept
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoy;
