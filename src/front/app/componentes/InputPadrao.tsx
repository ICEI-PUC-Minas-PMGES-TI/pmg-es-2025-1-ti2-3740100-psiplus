interface InputPadraoProps {
    label?: string;
    type?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    classNameInput?: string;
    disabled?: boolean;
    required?: boolean;
  }

  export default function InputPadrao({
    type = "text",
    placeholder,
    icon,
    name,
    value,
    onChange,
    classNameInput,
                                          disabled = false,
      label,
      required,
  }: InputPadraoProps) {

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
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className= {`w-full ${paddingLeft} pr-4 py-2 border border-[#DAE0F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 ${classNameInput}`}
          />
        </div>
      </div>
    );
  }
  