import OrderSummary from "../../components/cart/OrderSummary.jsx";
import PeopleAlsoBought from "../../components/cart/PeopleAlsoBought.jsx";
import GiftCouponCard from "../../components/cart/GiftCardCoupon.jsx";
import CartItem from "../../components/cart/CartItem.jsx";
import EmptyCartUI from "../../components/cart/EmptyCartUI.jsx";



// Dummy data for demonstration
const dummyCart = [
    {
        _id: '1',
        name: 'Tesla Model 3',
        price: 39990.00,
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
        quantity: 1
    },
    {
        _id: '2',
        name: 'Nissan Leaf',
        price: 27400.00,
        image: 'https://hips.hearstapps.com/hmg-prod/images/2025-nissan-leaf-121-6690462ff1899.jpg?crop=0.772xw:0.651xh;0.103xw,0.284xh&resize=2048:*',
        quantity: 1
    }
];

// Dummy-related products
const dummyRelatedProducts = [
    {
        _id: '3',
        name: 'EV Charging Station',
        price: 599.99,
        image: 'https://btcpower.com/wp-content/uploads/2025/02/btc-blog-commercial-chargers.jpg'
    },
    {
        _id: '4',
        name: 'Car Cover',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop'
    }
];


const CartPage = () => {
    return (
        <div className='py-8 md:py-16'>
            <div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
                <h1 className='text-2xl font-bold text-gray-900 mb-6 sm:text-3xl'>Your Shopping Cart</h1>
                <div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
                    <div className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'>
                        {dummyCart.length === 0 ? (
                            <EmptyCartUI />
                        ) : (
                            <div className='space-y-6'>
                                {dummyCart.map((item) => (
                                    <CartItem key={item._id} item={item} />
                                ))}
                            </div>
                        )}
                        {dummyCart.length > 0 && <PeopleAlsoBought
                        products={dummyRelatedProducts}

                        />}
                    </div>
                    {dummyCart.length > 0 && (
                        <div className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'>
                            <OrderSummary />
                            <GiftCouponCard/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;