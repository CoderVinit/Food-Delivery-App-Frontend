import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useSelector } from 'react-redux'
import AuthProvider from './components/AuthProvider'
import { getCity } from './hooks/useGetCity'
import { getShopByOwner } from './hooks/useGetMyShop'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import { useGetShopByCity } from './hooks/useGetShopByCity'
import { getItemsByCity } from './hooks/useGetItemsByCity'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import { getOrderByOwner } from './hooks/useGetMyOrders'
import { getUserOrders } from './hooks/getUserOrders'
import { getOwnerOrders } from './hooks/useGetOwnerOrder'
import { useUpdateLocation } from './hooks/useUpdateLocation'

const App = () => {
  useUpdateLocation();
  getCity();
  getShopByOwner();
  const {userInfo,city} = useSelector((state) => state.user);
  useGetShopByCity(city);
  getItemsByCity(city);
  getOrderByOwner();
  getUserOrders()
  getOwnerOrders()
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={!userInfo ? <SignIn /> : <Navigate to="/" />} />
          <Route path="/signup" element={!userInfo ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={!userInfo ? <ForgotPassword /> : <Navigate to="/" />} />
          <Route path="/" element={userInfo ? <Home /> : <Navigate to="/signin" />} />
          <Route path="/create-shop" element={userInfo ? <CreateEditShop /> : <Navigate to="/signin" />} />
          <Route path="/add-food" element={userInfo ? <AddItem /> : <Navigate to="/signin" />} />
          <Route path="/edit-food/:itemId" element={userInfo ? <AddItem /> : <Navigate to="/signin" />} />
          <Route path="/cart" element={userInfo ? <CartPage /> : <Navigate to="/signin" />} />
          <Route path="/checkout" element={userInfo ? <Checkout /> : <Navigate to="/signin" />} />
          <Route path="/order-placed" element={userInfo ? <OrderPlaced /> : <Navigate to="/signin" />} />
          <Route path="/my-orders" element={userInfo ? <MyOrders /> : <Navigate to="/signin" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App