import React, { useRef, useState, useEffect } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import axios from 'axios';
import { setShopData } from '../redux/slices/shopSlice';

const AddItem = () => {
    const navigate = useNavigate();
    const { itemId } = useParams(); // Get itemId from URL params
    const { shopInfo } = useSelector((state) => state.shop);
    const dispatch = useDispatch();
    const categories = ["Snacks","Main Course","Dessert","Beverages","Pizza","Burger","Sandwich","South Indian","North Indian","Chinese","Fast Food","Others"]
    const [loading, setLoading] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);
    
    // Check if we're in edit mode
    const isEditMode = Boolean(itemId);
    
    const [formData, setFormData] = useState({
        name: "",
        image: null,
        price: 0,
        category: "",
        foodType: "veg"
    });

    const [imagePreview, setImagePreview] = useState(null);

    // Fetch item data if in edit mode
    useEffect(() => {
        const fetchItemData = async () => {
            if (isEditMode && itemId) {
                try {
                    setLoading(true);
                    const { data } = await axios.get(`http://localhost:8080/api/item/getItem/${itemId}`, {
                        withCredentials: true
                    });
                    
                    if (data.success) {
                        const item = data.data;
                        setItemToEdit(item);
                        setFormData({
                            name: item.name || "",
                            image: item.image || null,
                            price: item.price || 0,
                            category: item.category || "",
                            foodType: item.foodType || "veg"
                        });
                        setImagePreview(item.image || null);
                    }
                } catch (error) {
                    console.error("Error fetching item:", error);
                    alert("Failed to load item data");
                    navigate("/");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchItemData();
    }, [itemId, isEditMode, navigate]);



    const handleChange = (e) => {
        const { id, value, files } = e.target;
        if (files && files[0]) {
            // Handle file input
            setFormData((prevState) => ({
                ...prevState,
                [id]: files[0],
            }));

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData)
        try {
            setLoading(true);
            let requestData;
            let url;
            let method = 'post';

            // Determine URL and method based on mode
            if (isEditMode) {
                url = `http://localhost:8080/api/item/editItem/${itemId}`;
                method = 'put';
            } else {
                url = 'http://localhost:8080/api/item/addItem';
                method = 'post';
            }

            if (formData.image && typeof formData.image === 'object') {
                // New image file selected
                requestData = new FormData();
                requestData.append('name', formData.name);
                requestData.append('image', formData.image);
                requestData.append('price', formData.price);
                requestData.append('category', formData.category);
                requestData.append('foodType', formData.foodType);
            } else {
                // No new image, send JSON
                requestData = {
                    name: formData.name,
                    price: formData.price,
                    category: formData.category,
                    foodType: formData.foodType,
                };
            }

            const { data } = await axios({
                method,
                url,
                data: requestData,
                withCredentials: true,
            });

            if (data.success) {
                console.log(`Item ${isEditMode ? 'updated' : 'created'} successfully`);
                dispatch(setShopData(data.data));
                navigate("/");
            } else {
                console.log(`Failed to ${isEditMode ? 'update' : 'create'} item:`, data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error(`Error occurred while ${isEditMode ? 'updating' : 'creating'} item:`, error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
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
                        <FaUtensils className='text-[#ff4d2d] mb-4 w-14 h-14 sm:w-18 sm:h-18' />
                    </div>
                    <div className='text-3xl font-extrabold text-gray-900'>
                        {isEditMode ? "Edit Food" : "Add Food"}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-2 text-gray-600">
                            {isEditMode ? "Loading item data..." : "Processing..."}
                        </span>
                    </div>
                ) : (
                    <form className='space-y-5' onSubmit={handleSubmit}>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Name <span className="text-red-500">*</span></label>
                            <input type="text" id="name" value={formData.name} onChange={handleChange} placeholder='Enter Food Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' required />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
                            <input type="file" id="image" accept='image/*' onChange={handleChange} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Price <span className="text-red-500">*</span></label>
                            <input type="number" id="price" value={formData.price} onChange={handleChange} placeholder='0' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' required />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Select Category <span className="text-red-500">*</span></label>
                                <select name="category" id="category" value={formData.category} onChange={handleChange} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'>
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Select Food Type <span className="text-red-500">*</span></label>
                                <select name="foodType" id="foodType" value={formData.foodType} onChange={handleChange} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'>
                                    <option value="veg">Veg</option>
                                    <option value="non-veg">Non-Veg</option>
                                </select>   
                            </div>
                        </div>
                        <button type='submit' className='w-full bg-[#ff4d2d] text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 cursor-pointer' disabled={loading}>
                            {loading ? "Processing..." : (isEditMode ? "Update Food" : "Add Food")}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}


export default AddItem