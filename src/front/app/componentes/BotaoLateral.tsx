import React from "react";

type BotaoLateralProps = {
    icone: React.ReactNode;
    texto: string;
    visivel: boolean;
    ativo?: boolean;
    onClick?: () => void;
};

const BotaoLateral: React.FC<BotaoLateralProps> = ({ icone, texto, visivel, ativo = false, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full cursor-pointer transition-colors duration-150
        ${ativo ? "bg-white shadow-md text-[#2B2F42]" : "hover:bg-gray-100 text-[#2B2F42]"}`}
        >
            <div className={`rounded-md p-1 ${ativo ? "bg-[#0088A3]" : "bg-[#F4F7FF]"}`}>
                {icone}
            </div>
            {visivel && (
                <span className={`text-sm ${ativo ? "font-medium" : "font-regular"} whitespace-nowrap`}>
          {texto}
        </span>
            )}
        </button>
    );
};

export default BotaoLateral;
