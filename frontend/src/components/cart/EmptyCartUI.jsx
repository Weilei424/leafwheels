const EmptyCartUI = () => {

    return (
        <div className='flex flex-col items-center justify-center space-y-4 py-16'>
            <svg className='h-20 w-20 text-gray-300 sm:h-24 sm:w-24' fill='none' stroke='currentColor'
                 viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
                      d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'/>
            </svg>
            <h3 className='text-xl font-semibold text-gray-900 sm:text-2xl'>Your cart is empty</h3>
            <p className='text-center text-gray-500 px-4'>Looks like you haven&apos;t added anything to your cart
                yet.</p>
            <Link
                className='mt-4 rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300'
                to='/'
            >
                Start Shopping
            </Link>
        </div>
    )

}

export default EmptyCartUI;
