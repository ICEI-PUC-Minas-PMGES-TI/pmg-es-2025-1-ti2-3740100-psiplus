import React from "react";
import "../estilos/Popup.css";

interface PopupProps {
    titulo: string;
    mensagem: string;
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ titulo, mensagem, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <img src="../../public/assets/IconPsiPlus.png" alt="Logo Psi+" /> {/* ajuste o path se necessário */}
                <h2>{titulo}</h2>
                <p>{mensagem}</p>
                <button onClick={onClose}>Continue</button>
            </div>
        </div>
    );
};

export default Popup;
