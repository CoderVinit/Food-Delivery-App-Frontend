import React from "react";

const CategoryCard = ({ data }) => {
    return (
        <div className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border-2 border-[#ff4d2d] shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shaddow-lg transition-shadow relative">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300" />
            <div
            className="absolute bottom-0 left-0 w-full bg-[#ffffff96] bg-opcacity-95 px-3 py-1 rounded-t-xl text-center shadow text-sm font-medium text-gray-800 backdrop-blur"
            >{data.name}</div>
        </div>
    );
};

export default CategoryCard;
