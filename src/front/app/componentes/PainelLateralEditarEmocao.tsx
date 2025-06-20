import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { iconesEmocoes } from "~/componentes/IconesEmocoes";

import {X, Calendar, Clock, Edit2, Smile, Pencil, Save, Trash2} from 'lucide-react';
import {useState} from "react";
import axios from "axios";
import BotaoPadrao from "~/componentes/BotaoPadrao";

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

interface PainelLateralEditarEmocaoProps {
    evento: EventoEmocao | null;
    onClose?: () => void;
    pacienteId: number | string;
    atualizarEventos?: () => Promise<void>;
}

export default function PainelLateralEditarEmocaoProps({ evento, onClose, atualizarEventos, pacienteId }: PainelLateralEditarEmocaoProps) {
    if (!evento) return null;

    const [editando, setEditando] = useState(false);
    const [mensagem, setMensagem] = useState(evento?.sentimento || "");
    const [notas, setNotas] = useState(evento?.notas || "");
    const [emocao, setEmocao] = useState(evento?.tipoEmocao?.nome?.toLowerCase() || "feliz");
    const [aberto, setAberto] = useState(false);

    const alternarDropdown = () => setAberto(!aberto);

    const mapaEmocoes: { [key: string]: number } = {
        feliz: 1,
        neutro: 2,
        triste: 3,
        raiva: 4,
    };

    const tipoEmocaoId = mapaEmocoes[emocao];

    const handleSalvarEdicao = async () => {
        try {
            const payload = {
                pacienteId: evento.paciente?.pacienteId ?? pacienteId,
                tipoEmocaoId: mapaEmocoes[emocao],
                data: evento.data,
                hora: evento.hora,
                sentimento: mensagem,
                notas: notas,
            };

            await axios.put(`http://localhost:8080/api/emocoes/${evento.id}`, payload);
            setEditando(false);
            if (onClose) onClose();
            if (atualizarEventos) await atualizarEventos();
        } catch (err) {
            console.error("Erro ao salvar:", err);
        }
    };

    const handleExcluir = async () => {
        const confirmar = window.confirm("Tem certeza que deseja excluir esta emoção?");
        if (!confirmar) return;

        try {
            await axios.delete(`http://localhost:8080/api/emocoes/${evento.id}`);
            if (onClose) onClose();
            if (atualizarEventos) await atualizarEventos();
        } catch (err) {
            console.error("Erro ao excluir:", err);
        }
    };


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
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200">



                {/* Linha com "Emoção Diária" + ícone */}
                <span className="text-[#7D8FB3] font-semibold text-lg">Emoção Diária</span>
                {editando ? (
                    <div className="relative">
                        <button
                            onClick={alternarDropdown}
                            className="w-36 px-4 py-2 rounded-full border border-gray-300 hover:border-gray-400 transition flex items-center justify-between gap-2"
                        >
                            <span>{emocao ? iconesEmocoes[emocao] : iconesEmocoes["feliz"]}</span>
                            <svg
                                className={`w-4 h-4 transition-transform ${aberto ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {aberto && (
                            <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded shadow p-2 flex flex-col z-10">
                                {Object.entries(iconesEmocoes).map(([nome, icone]) => (
                                    <button
                                        key={nome}
                                        onClick={() => {
                                            setEmocao(nome);
                                            setAberto(false);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded"
                                    >
                                        {icone}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    iconesEmocoes[emocao]
                )}

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
                    {editando ? (
                        <textarea
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            className="w-full text-sm text-gray-700 border border-gray-200 rounded p-2"
                        />
                    ) : (
                        <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                            {evento.sentimento?.trim() || "Não possui registro"}
                        </p>
                    )}
                </div>

                {/* Notas */}
                <div className="flex items-start space-x-3 p-4">
                    <Edit2 size={20} className="text-gray-300 mt-1" />
                    {editando ? (
                        <textarea
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            className="w-full text-sm text-gray-700 border border-gray-200 rounded p-2"
                        />
                    ) : (
                        <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                            {evento.notas?.trim() || "Não possui registro"}
                        </p>
                    )}
                </div>

            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200">
                {/* Botão Editar/Salvar - esquerda */}
                {!editando ? (
                    <BotaoPadrao
                        texto="Editar"
                        icone={<Pencil size={18} className="text-[#0088A3]" />}
                        color="bg-white"
                        textoColor="text-[#0088A3]"
                        className="hover:underline transition-colors duration-200 font-medium cursor-pointer"
                        handleClick={() => setEditando(true)}
                    />
                ) : (
                    <BotaoPadrao
                        texto="Salvar"
                        icone={<Save size={18} className="text-green-600" />}
                        color="bg-white"
                        textoColor="text-green-600"
                        className="hover:underline transition-colors duration-200 font-medium cursor-pointer"
                        handleClick={handleSalvarEdicao}
                    />
                )}

                {/* Botão Excluir - direita */}
                <BotaoPadrao
                    texto="Excluir"
                    icone={<Trash2 size={18} className="text-red-600" />}
                    color="bg-white"
                    textoColor="text-red-600"
                    className="hover:underline transition-colors duration-200 font-medium cursor-pointer"
                    handleClick={handleExcluir}
                />
            </div>

        </div>

    );
}
