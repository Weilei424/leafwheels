const PeopleAlsoBought = ({products = []}) => {
    return (
        <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6 mt-6'>
            <p className='text-xl font-semibold text-gray-900'>People also bought</p>
            <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6'>
                {products.map(product => (
                    <div key={product._id}
                         className='space-y-4 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
                        <a href='#' className='overflow-hidden rounded'>
                            <img className='mx-auto h-32 w-full object-cover sm:h-44 sm:w-44' src={product.image}
                                 alt={product.name}/>
                        </a>
                        <div>
                            <a href='#'
                               className='text-base font-semibold leading-tight text-gray-900 hover:underline sm:text-lg'>{product.name}</a>
                            <p className='mt-2 text-base font-normal text-gray-500'>${product.price}</p>
                        </div>
                        <div>
                            <button type='button'
                                    className='flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300'>
                                Add to cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PeopleAlsoBought;