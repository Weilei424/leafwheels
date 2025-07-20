const StatusFilter = ({ value, onChange }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 border rounded border-gray-300"
    >
        <option value="available">Available</option>
        <option value="pending">Pending</option>
    </select>
);

export default StatusFilter;