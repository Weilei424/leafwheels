const CartItem = ({ item = {} }) => {
    return (
        <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6'>
            <div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
                <a href='#' className='shrink-0 md:order-1'>
                    <img className='h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24' src={item.image} alt={item.name}/>
                </a>

                <div className='flex items-center justify-between md:order-3 md:justify-end'>
                    <div className='flex items-center gap-2'>
                        <button type='button'
                                className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500'>
                            <span className='text-sm'>-</span>
                        </button>
                        <span
                            className='w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900'>{item.quantity}</span>
                        <button type='button'
                                className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500'>
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
                        <button type='button'
                                className='inline-flex items-center text-sm font-medium text-red-600 hover:underline'>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CartItem;