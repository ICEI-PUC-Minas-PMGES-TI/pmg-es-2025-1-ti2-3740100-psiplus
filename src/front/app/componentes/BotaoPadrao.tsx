import { useNavigate } from "react-router";
import React from "react";

interface BotaoPadraoProps {
  caminho?: string;
  texto: string;
  textoColor?: string;
  handleClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  color?: string;
  hoverColor?: string;
  fullWidth?: boolean;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  icone?: React.ReactNode;
  iconeColor?: string;
  type?: "button" | "submit" | "reset";
}

export default function BotaoPadrao({
                                      caminho,
                                      texto,
                                      textoColor,
                                      handleClick,
                                      color,
                                      hoverColor,
                                      fullWidth,
                                      disabled,
                                      active = false,
                                      className = "",
                                      icone,
                                      iconeColor,
                                      type = "button",
                                    }: BotaoPadraoProps) {
  const navigate = useNavigate();

  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (handleClick) handleClick(e);
    if (caminho) navigate(caminho);
  };

  const buttonColor = color || "bg-cyan-700";
  const buttonHoverColor = hoverColor || "bg-cyan-500";
  const fullWidthClass = fullWidth ? "w-full" : "w-auto";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : `hover:${buttonHoverColor} cursor-pointer`;
  textoColor = textoColor || "text-white";
  const textoCor = active ? "!text-[#0088A3]" : textoColor;
  const iconeCor = active ? "!text-[#0088A3]" : iconeColor;

  return (
      <button
          type={type}
          onClick={onClickHandler}
          className={`${buttonColor} ${textoCor} py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${fullWidthClass} ${disabledClass} ${className}`}
      >
        {icone && <span className={iconeCor}>{icone}</span>}
        {texto}
      </button>
  );
}
