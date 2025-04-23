import { useNavigate } from "react-router";
import React from "react";

interface BotaoPadraoProps {
  caminho?: string;
  texto: string;
  handleClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  color?: string;
  hoverColor?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  icone?: React.ReactNode;
  type?: "button" | "submit" | "reset";
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
  type = "button",
}: BotaoPadraoProps) {
  const navigate = useNavigate();

  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (handleClick) {
      handleClick?.(e);
    }      

    if (caminho) {
      navigate(caminho);
    }
  };

  const buttonColor = color || "bg-cyan-700";
  const buttonHoverColor = hoverColor || "bg-cyan-500";
  const fullWidthClass = fullWidth ? "w-full" : "w-auto";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : `hover:${buttonHoverColor} cursor-pointer`;

  return (
    <button
      type={type}
      onClick={onClickHandler}
      className={`${buttonColor} text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${fullWidthClass} ${disabledClass} ${className}`}
    >
      {icone && <span>{icone}</span>}
      {texto}
    </button>
  );
}
