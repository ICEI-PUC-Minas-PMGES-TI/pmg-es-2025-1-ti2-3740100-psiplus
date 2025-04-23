interface InputPadraoProps {
    type?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export default function InputPadrao({
    type = "text",
    placeholder,
    icon,
    name,
    value,
    onChange,
  }: InputPadraoProps) {
    return (
      <div className="mb-4">
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          />
        </div>
      </div>
    );
  }
  