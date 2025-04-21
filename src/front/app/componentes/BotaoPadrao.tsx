import { useNavigate } from "react-router";

interface BotaoPadraoProps {
  caminho: string;
  texto: string;
  handleClick?: () => void;
  color?: string;
  hoverColor?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function BotaoPadrao({ caminho, texto, handleClick, color, hoverColor, fullWidth, disabled }: BotaoPadraoProps) {
  const navigate = useNavigate();

  const onClickHandler = handleClick || (() => navigate(caminho));

  const buttonColor = color || "bg-cyan-700";
  const buttonHoverColor = hoverColor || "bg-cyan-500";
  const fullWidthClass = fullWidth ? "w-full" : "w-auto";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : `hover:${buttonHoverColor} cursor-pointer`;

  return (
    <button
      onClick={onClickHandler}
      className={`${buttonColor} text-white py-2 px-4 rounded-lg transition-colors ${fullWidthClass} ${disabledClass}`}
    >
      {texto}
    </button>
  );
}
