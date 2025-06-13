import { useState } from "react";
import axios from "axios";
import { Trash } from 'lucide-react';

function CancelarConsultaButton({ consultaId, onConsultaCancelada }) {
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    const abrirPopup = () => setMostrarPopup(true);
    const fecharPopup = () => setMostrarPopup(false);

    const confirmarCancelamento = async () => {
        setLoading(true);
        setErro(null);
        try {
            await axios.delete(`http://localhost:8080/consultas/${consultaId}`);
            setLoading(false);
            setMostrarPopup(false);
            if (onConsultaCancelada) onConsultaCancelada();
            alert("Consulta cancelada com sucesso!");
        } catch (error) {
            setLoading(false);
            setErro("Erro ao cancelar a consulta. Tente novamente.");
            console.error(error);
        }
    };

    return (
        <>
            <button
                onClick={abrirPopup}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium cursor-pointer"
            >
                <Trash />
                Cancelar Consulta
            </button>

            {mostrarPopup && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">
                            Confirmar cancelamento
                        </h3>
                        <p className="mb-4">Tem certeza que deseja cancelar essa consulta?</p>
                        {erro && <p className="text-red-600 mb-4">{erro}</p>}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={fecharPopup}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarCancelamento}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                            >
                                {loading ? "Cancelando..." : "Confirmar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CancelarConsultaButton;
