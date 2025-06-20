import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { iconesEmocoes } from "~/componentes/IconesEmocoes";

import { X, Calendar, Clock, Edit2, Smile } from 'lucide-react';

interface EventoEmocao {
    id: number;
    paciente: any;
    tipoEmocao: {
        nome: string;
        icone: string;
    };
    data: string;
    hora: string;
    sentimento: string;
    notas: string;
}

interface PainelLateralVisualizarEmocaoProps {
    evento: EventoEmocao | null;
    onClose?: () => void;
}

export default function PainelLateralVisualizarEmocao({ evento, onClose }: PainelLateralVisualizarEmocaoProps) {
    if (!evento) return null;

    const dataHora = new Date(`${evento.data}T${evento.hora}`);
    const dataFormatada = format(dataHora, "dd/MM/yyyy", { locale: ptBR });
    const horaFormatada = format(dataHora, "HH:mm", { locale: ptBR });

    return (
        <div className="fixed top-0 right-0 w-full max-w-md h-screen bg-white shadow-lg z-50 flex flex-col transition-transform duration-300 transform translate-x-0">
        {/* Botão fechar - canto superior direito */}
            <div className="flex justify-end p-4">
                <button onClick={onClose}>
                    <X className="text-[#7D8FB3] cursor-pointer hover:text-black transition-colors duration-200" />
                </button>
            </div>

            {/* Linha com "Emoção Diária" + ícone */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200">
                <span className="text-[#7D8FB3] font-semibold text-lg">Emoção Diária</span>
                <div className="flex items-center gap-2">
                    {evento.tipoEmocao?.nome && iconesEmocoes[evento.tipoEmocao.nome.toLowerCase()] ? (
                        iconesEmocoes[evento.tipoEmocao.nome.toLowerCase()]
                    ) : (
                        <span className="text-sm text-gray-400">?</span>
                    )}
                </div>
            </div>

            {/* Conteúdo com rolagem */}
            <div className="flex-1 overflow-y-auto">
                {/* Data e Hora */}
                <div className="grid grid-cols-2 gap-2 px-4 py-3 border-b border-gray-200 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-[#C3CAD9]" />
                        <span>{dataFormatada}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-[#C3CAD9]" />
                        <span>{horaFormatada}</span>
                    </div>
                </div>

                {/* Sentimento */}
                <div className="flex items-start space-x-3 p-4 border-b border-gray-200">
                    <Smile size={20} className="text-gray-300 mt-1" />
                    <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                        {evento.sentimento?.trim() || "Não possui registro"}
                    </p>
                </div>

                {/* Notas */}
                <div className="flex items-start space-x-3 p-4">
                    <Edit2 size={20} className="text-gray-300 mt-1" />
                    <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                        {evento.notas?.trim() || "Não possui registro"}
                    </p>
                </div>
            </div>
        </div>

    );
}
