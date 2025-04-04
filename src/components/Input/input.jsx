const Input = ({
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    error,
    className = "",
    ...props
  }) => {
    return (
      <div className={`w-full mt-4 ${className}`}>
        {label && <label className="block text-sm font-medium mb-1 text-[var(--text-secondary)]">{label}</label>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 h-10 border rounded-[4px] focus:outline-none focus:ring-2 bg-[var(--bg-primary)] ${
            error ? "border-red-500 focus:ring-red-500" : "border-[var(--border-primary)] focus:ring-blue-500"
          }`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  };
  
  export default Input;