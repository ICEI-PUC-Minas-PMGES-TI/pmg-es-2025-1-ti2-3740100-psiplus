import { Navigate, useNavigate } from "react-router";
import { useState } from "react";

interface BotaoPadraoProps {
  caminho?: string;
  texto: string;
  handleClick?: () => void;
  color?: string;
  hoverColor?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  icone?: React.ReactNode; // Ícone opcional
}

export default function BotaoPadrao({
  caminho,
  texto,
  handleClick,
  color,
  hoverColor,
  fullWidth,
  disabled,
  className,
  icone,
}: BotaoPadraoProps) {

  const [redirecionar, setRedirecionar] = useState(false);

  if (redirecionar) {
    return <Navigate to={caminho || "/"} />;
  }

  const onClickHandler = () => {
    if (disabled) return;
    if (caminho) {
      setRedirecionar(true);
    } else if (handleClick) {
      handleClick();
    }
  };

  const buttonColor = color || "bg-cyan-700";
  const buttonHoverColor = hoverColor || "bg-cyan-500";
  const fullWidthClass = fullWidth ? "w-full" : "w-auto";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : `hover:${buttonHoverColor} cursor-pointer`;

  return (
    <button
      onClick={onClickHandler}
      className={`${buttonColor} text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${fullWidthClass} ${disabledClass} ${className}`}
    >
      {icone && <span>{icone}</span>}
      {texto}
    </button>
  );
}
