import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
    return (
        <Link to={"/category" + category.href}>
            <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                <div className="flex justify-center p-6 bg-gray-50 rounded-md">
                    <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="h-40 object-contain"
                        loading="lazy"
                    />
                </div>
                <div className="mt-4">
                    <h3 className="text-gray-900 text-xl font-semibold">{category.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">Explore {category.name}</p>
                </div>
            </div>
        </Link>
    );
};

export default CategoryItem;
