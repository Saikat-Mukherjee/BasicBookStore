export default function InputField({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800
          focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
      />
    </div>
  );
}
