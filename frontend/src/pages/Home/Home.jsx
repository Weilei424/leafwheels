import FeaturedProducts from "../../components/common/Section/FeaturedProducts.jsx";
import CategoryItem from "../../components/common/Section/CategoryItem.jsx";

const products = [
    {
        _id: "1",
        name: "Tesla Model 3",
        price: 39990.0,
        image: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Main-Hero-Desktop-LHD.jpg", // From Tesla's official website, a more direct product image
    },
    {
        _id: "2",
        name: "Nissan Leaf",
        price: 27400.0,
        image: "https://hips.hearstapps.com/hmg-prod/images/2025-nissan-leaf-121-6690462ff1899.jpg?auto=format&fit=crop&w=600&q=80", // This one was already working and appears to be stable.
    },
    {
        _id: "3",
        name: "EV Charging Cable",
        price: 149.99,
        image: "https://m.media-amazon.com/images/I/61usxWzJdkL.jpg", // From Shutterstock, good for general product representation
    },
    {
        _id: "4",
        name: "Wall Charger Station",
        price: 349.99,
        image: "https://evocharge.com/wp-content/uploads/2021/02/GettyImages-1249775796.jpg", // From Shutterstock, a clearer image of a wall charger
    },
    {
        _id: "5",
        name: "Portable EV Charger",
        price: 599.99,
        image: "https://www.shutterstock.com/image-photo/portable-ev-charger-electric-vehicle-600nw-2314986427.jpg", // From Shutterstock, a reliable source
    },
    {
        _id: "6",
        name: "Car Cover",
        price: 149.99,
        image: "https://www.shutterstock.com/image-photo/car-covered-protective-cover-600nw-1044431536.jpg", // From Shutterstock, a clear image of a car with a cover
    },
];

const categories = [
    {
        href: "/electric-cars",
        name: "Electric Cars",
        imageUrl: "https://www.electrifying.com/files/OzF9FV4Xo5kq3ZAK/NewModelY_74.jpg", // A generic, well-composed image of an electric car
    },
    {
        href: "/chargers",
        name: "Chargers",
        imageUrl: "https://m.media-amazon.com/images/I/61E2LWeFpgL.jpg", // A more detailed image of charging infrastructure
    },
    {
        href: "/accessories",
        name: "Accessories",
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/electric-vehicle-accessories-1674754521.jpg", // This Unsplash image was previously provided and appears to be working.
    },
    {
        href: "/car-covers",
        name: "Car Covers",
        imageUrl: "https://images.weathertech.com/7456a866-b1d2-4634-82b0-b1a8013eb661/bmw_m3_car_cover_darkblue_Original%20file.jpg?width=800&height=800&fit=bounds", // A reliable Shutterstock image for car covers
    },
];



const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-center text-5xl font-extrabold mb-4">Explore Our Categories</h1>
                <p className="text-center text-lg text-gray-600 mb-12">
                    Discover the latest electric vehicles and accessories
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {categories.map((category) => (
                        <CategoryItem category={category} key={category.name} />
                    ))}
                </div>

                <FeaturedProducts featuredProducts={products} />
            </div>
        </div>
    );
};


export default Home;
