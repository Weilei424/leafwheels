import { Link } from "react-router-dom";

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

// Dummy related products
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

const CartItem = ({ item }) => (
    <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6'>
        <div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
            <a href='#' className='shrink-0 md:order-1'>
                <img className='h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24' src={item.image} alt={item.name} />
            </a>

            <div className='flex items-center justify-between md:order-3 md:justify-end'>
                <div className='flex items-center gap-2'>
                    <button type='button' className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500'>
                        <span className='text-sm'>-</span>
                    </button>
                    <span className='w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900'>{item.quantity}</span>
                    <button type='button' className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500'>
                        <span className='text-sm'>+</span>
                    </button>
                </div>
                <div className='text-end md:order-4 md:w-32'>
                    <p className='text-lg font-bold text-gray-900 sm:text-xl'>${item.price.toLocaleString()}</p>
                </div>
            </div>

            <div className='w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md md:space-y-4'>
                <a href='#' className='text-base font-medium text-gray-900 hover:underline sm:text-lg'>{item.name}</a>
                <div className='flex items-center gap-4'>
                    <button type='button' className='inline-flex items-center text-sm font-medium text-red-600 hover:underline'>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const PeopleAlsoBought = () => (
    <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6 mt-6'>
        <p className='text-xl font-semibold text-gray-900'>People also bought</p>
        <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6'>
            {dummyRelatedProducts.map(product => (
                <div key={product._id} className='space-y-4 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
                    <a href='#' className='overflow-hidden rounded'>
                        <img className='mx-auto h-32 w-full object-cover sm:h-44 sm:w-44' src={product.image} alt={product.name} />
                    </a>
                    <div>
                        <a href='#' className='text-base font-semibold leading-tight text-gray-900 hover:underline sm:text-lg'>{product.name}</a>
                        <p className='mt-2 text-base font-normal text-gray-500'>${product.price}</p>
                    </div>
                    <div>
                        <button type='button' className='flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300'>
                            Add to cart
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const OrderSummary = () => {
    const cart = dummyCart;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const savings = 0;
    const shipping = 0;
    const tax = subtotal * 0.13;
    const total = subtotal - savings + shipping + tax;

    return (
        <div className='space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
            <p className='text-xl font-semibold text-gray-900'>Order summary</p>
            <div className='space-y-4'>
                <div className='space-y-2'>
                    <dl className='flex items-center justify-between gap-4'>
                        <dt className='text-base font-normal text-gray-500'>Original price</dt>
                        <dd className='text-base font-medium text-gray-900'>${subtotal.toLocaleString()}</dd>
                    </dl>
                    <dl className='flex items-center justify-between gap-4'>
                        <dt className='text-base font-normal text-gray-500'>Savings</dt>
                        <dd className='text-base font-medium text-green-600'>-${savings.toLocaleString()}</dd>
                    </dl>
                    <dl className='flex items-center justify-between gap-4'>
                        <dt className='text-base font-normal text-gray-500'>Store Pickup</dt>
                        <dd className='text-base font-medium text-gray-900'>$0</dd>
                    </dl>
                    <dl className='flex items-center justify-between gap-4'>
                        <dt className='text-base font-normal text-gray-500'>Tax</dt>
                        <dd className='text-base font-medium text-gray-900'>${tax.toLocaleString()}</dd>
                    </dl>
                </div>
                <dl className='flex items-center justify-between gap-4 border-t border-gray-200 pt-2'>
                    <dt className='text-base font-bold text-gray-900'>Total</dt>
                    <dd className='text-base font-bold text-gray-900'>${total.toLocaleString()}</dd>
                </dl>
            </div>
            <button type='button' className='flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300'>
                Proceed to Checkout
            </button>
            <div className='flex items-center justify-center gap-2'>
                <span className='text-sm font-normal text-gray-500'>or</span>
                <Link to='/' className='inline-flex items-center gap-2 text-sm font-medium text-blue-600 underline hover:no-underline'>
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

const GiftCouponCard = () => (
    <div className='space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
        <form className='space-y-4'>
            <div>
                <label htmlFor='voucher' className='mb-2 block text-sm font-medium text-gray-900'>Do you have a voucher or gift card?</label>
                <input type='text' id='voucher' className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500' placeholder='Enter code here' required />
            </div>
            <button type='submit' className='flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300'>
                Apply Code
            </button>
        </form>
    </div>
);

const CartPage = () => {
    const cart = dummyCart; // Using dummy data instead of useCartStore

    return (
        <div className='py-8 md:py-16'>
            <div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
                <h1 className='text-2xl font-bold text-gray-900 mb-6 sm:text-3xl'>Your Shopping Cart</h1>
                <div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
                    <div className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'>
                        {cart.length === 0 ? (
                            <EmptyCartUI />
                        ) : (
                            <div className='space-y-6'>
                                {cart.map((item) => (
                                    <CartItem key={item._id} item={item} />
                                ))}
                            </div>
                        )}
                        {cart.length > 0 && <PeopleAlsoBought />}
                    </div>
                    {cart.length > 0 && (
                        <div className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'>
                            <OrderSummary />
                            <GiftCouponCard />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmptyCartUI = () => (
    <div className='flex flex-col items-center justify-center space-y-4 py-16'>
        <svg className='h-20 w-20 text-gray-300 sm:h-24 sm:w-24' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
        </svg>
        <h3 className='text-xl font-semibold text-gray-900 sm:text-2xl'>Your cart is empty</h3>
        <p className='text-center text-gray-500 px-4'>Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link
            className='mt-4 rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300'
            to='/'
        >
            Start Shopping
        </Link>
    </div>
);

export default CartPage;