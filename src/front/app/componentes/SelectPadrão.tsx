interface SelectPadraoProps {
    label?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    classNameSelect?: string;
    disabled?: boolean;
    required?: boolean;
    children: React.ReactNode;
}

export default function SelectPadrao({
    label,
    placeholder,
    icon,
    name,
    value,
    onChange,
    classNameSelect,
    disabled = false,
    required,
    children,
    }: SelectPadraoProps){

    const paddingLeft = icon ? "pl-10" : "pl-3";
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-[#7E7E7E] mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </span>
                )}
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={`w-full ${paddingLeft} pr-4 py-2 border border-[#DAE0F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white appearance-none ${classNameSelect}`}
                >
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                    {children}
                </select>
            </div>
        </div>
    );
}

