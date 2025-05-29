import React from "react";
import "../estilos/PopupCadastroSucesso.css";

interface PopupProps {
    mensagem: string;
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ mensagem, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <img src="../../public/assets/IconPsiPlus.png" alt="Logo Psi+" /> {/* ajuste o path se necessário */}
                <h2>{mensagem}</h2>
                <p>Um e-mail será enviado automaticamente ao paciente com seu usuário e senha.</p>
                <button onClick={onClose}>Continue</button>
            </div>
        </div>
    );
};

export default Popup;
