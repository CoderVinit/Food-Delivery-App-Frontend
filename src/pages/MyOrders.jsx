import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';

const MyOrders = () => {
    const {myOrders,userInfo,ownerOrders} = useSelector((state) => state.user);
    console.log(ownerOrders)
    const navigate = useNavigate();
  return (
    <div
    className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'
    >
      <div className='w-full max-w-[800px] p-4'>
        <div className='flex items-center gap-[20px] mb-6'>
          <div className='z-[10] ' onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} className='text-[#ff4d2d] cursor-pointer' />
          </div>
          <h1 className='text-2xl font-bold text-start'>Your Cart</h1>
        </div>

        <div className='space-y-6'>
          {userInfo?.role === "user" && (myOrders?.length === 0 ? (
            <div className='text-center text-gray-500'>You have no orders yet.</div>
          ) : (
            myOrders?.map((order) => (
              <UserOrderCard key={order?.id} order={order} />
            ))
          ))}
          {userInfo?.role === "owner" && (ownerOrders?.length === 0 ? (
            <div className='text-center text-gray-500'>You have no orders yet.</div>
          ) : (
            ownerOrders?.map((order) => (
              <OwnerOrderCard key={order?.id} data={order} />
            ))
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyOrders