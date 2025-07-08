import React from "react";

const CategoryFilter = ({ categories, selectedCategory, onChangeCategory }) => (
    <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const baseClasses = "px-4 py-2 rounded-full border transition-colors duration-300";
            const selectedClasses = "bg-green-600 text-white border-green-600";
            const defaultClasses = "border-gray-300 text-gray-700 hover:bg-green-100";

            return (
                <button
                    key={category}
                    onClick={() => onChangeCategory(category)}
                    className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
                >
                    {category}
                </button>
            );
        })}
    </div>
);

export default CategoryFilter;
