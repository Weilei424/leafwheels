const SortDropDown = ({ value, onChange, options }) => {

    return (
        <select
            value={value}
            onChange={onChange}
            className="w-full sm:max-w-xs rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>

    )
}

export default SortDropDown;

