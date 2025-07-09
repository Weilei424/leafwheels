export const SearchBar = ({value, onChange, placeholder}) => (
    <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full sm:max-w-xs rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label={placeholder}
    />
)



