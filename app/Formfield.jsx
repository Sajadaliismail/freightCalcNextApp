export default function FormField({
  label,
  type,
  value,
  onChange,
  name,
  error,
  ...props
}) {
  return (
    <div className="w-full mb-2 md:mb-1">
      <label
        className="block font-medium md:text-base text-sm  mb-1"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`
            w-full px-3 py-2 bg-white text-gray-900 rounded-md
            border ${error ? "border-red-500" : "border-gray-300"}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition duration-150 ease-in-out
          `}
          placeholder={label}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <p className=" text-sm text-red-500 ">{error}</p>
            <svg
              className="h-5 w-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
