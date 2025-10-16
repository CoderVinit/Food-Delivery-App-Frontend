import React, { useRef, useState, useEffect } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import axios from 'axios';
import { setShopData } from '../redux/slices/shopSlice';

const CreateEditShop = () => {
  const navigate = useNavigate();
  const {shopInfo} = useSelector((state)=>state.shop);
  const {city,state,currentAddress} = useSelector((state)=>state.user);
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    city: "",
    state: "",
    address: ""
  });
  
  const [imagePreview, setImagePreview] = useState(null);


  // Update form data when shopInfo changes
  useEffect(() => {
    if (shopInfo) {
      setFormData({
        name: shopInfo.name || "",
        image: shopInfo.image || null,
        city: shopInfo.city || city || "",
        state: shopInfo.state || state || "",
        address: shopInfo.address || currentAddress || ""
      });
      setImagePreview(shopInfo.image || null);
    } else {
      // Set default values from user data when creating new shop
      setFormData({
        name: "",
        image: null,
        city: city || "",
        state: state || "",
        address: currentAddress || ""
      });
    }
  }, [shopInfo, city, state, currentAddress]);

  console.log("shopInfo:", shopInfo);
  console.log("formData:", formData);


  const handleChange = (e) => {
    const { id, value, files } = e.target;
    
    if (files && files[0]) {
      // Handle file input
      setFormData((prevState) => ({
        ...prevState,
        [id]: files[0],
      }));
      
      // Set image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      // Handle text inputs
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.city || !formData.state || !formData.address) {
      alert("Please fill in all required fields");
      return;
    }
    
    console.log(formData);

    try {
      // Create FormData if image is present, otherwise send JSON
      let requestData;
      let headers = {};
      
      if (formData.image && typeof formData.image === 'object') {
        // If image is a File object, use FormData
        requestData = new FormData();
        requestData.append('name', formData.name);
        requestData.append('city', formData.city);
        requestData.append('state', formData.state);
        requestData.append('address', formData.address);
        requestData.append('image', formData.image);
      } else {
        // If no new image, send JSON (for edit without changing image)
        requestData = {
          name: formData.name,
          city: formData.city,
          state: formData.state,
          address: formData.address
        };
      }

      const {data} = await axios.post('http://localhost:8080/api/shop/create-edit', requestData, {
        withCredentials: true,
      });
      
      if(data.success){
        console.log("Shop created/edited successfully");
        dispatch(setShopData(data.data));
        navigate("/");
      } else {
        console.log("Failed to create/edit shop:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error occurred while creating/editing shop:", error);
      alert("An error occurred. Please try again.");
    }
  }


  return (
    <div className='flex flex-col justify-center items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen'>
      <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer' onClick={() => navigate("/")}>
        <IoArrowBackOutline size={35} className='text-[#ff4d2d]'/>
      </div>
      <div className='max-w-lg w-full bg-white shadow-lg rounded-2xl p-8 border border-orange-100'>

        <div className='flex flex-col items-center mb-6'>
          <div className='bg-orange-100 p-4 rounded-full mb-4'>
            <FaUtensils className='text-[#ff4d2d] mb-4 w-14 h-14 sm:w-18 sm:h-18'/>
          </div>
          <div className='text-3xl font-extrabold text-gray-900'>
            {shopInfo?"Edit Shop":"Add Shop"}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-2 text-gray-600">Loading shop data...</span>
          </div>
        ) : (
          <form className='space-y-5' onSubmit={handleSubmit}>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Name <span className="text-red-500">*</span></label>
              <input type="text" id="name" value={formData.name} onChange={handleChange} placeholder='Enter Shop Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' required/>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Shop Image</label>
              <input type="file" id="image" accept='image/*' onChange={handleChange} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'/>
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
                </div>
              )}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>City <span className="text-red-500">*</span></label>
                <input type="text" id="city" value={formData.city} onChange={handleChange} placeholder='City' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' required/>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>State <span className="text-red-500">*</span></label>
                <input type="text" id="state" value={formData.state} onChange={handleChange} placeholder='State' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' required/>
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Address <span className="text-red-500">*</span></label>
              <input type="text" id="address" value={formData.address} onChange={handleChange} placeholder='Enter Shop Address' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' required/>
            </div>
            <button type='submit' className='w-full bg-[#ff4d2d] text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 cursor-pointer'>
              Save
            </button>
          </form>
        )}


      </div>



    </div>
  )
}


export default CreateEditShop