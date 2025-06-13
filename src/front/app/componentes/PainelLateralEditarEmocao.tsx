import { iconesEmocoes } from "~/componentes/IconesEmocoes";
import {useState} from "react";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import axios from "axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { X, Calendar, Clock, Edit2, Smile, Check } from 'lucide-react';
import InputPadrao from "~/componentes/InputPadrao";

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

interface PainelLateralEmocaoProps {
    evento: EventoEmocao | null;
    onClose?: () => void;
}

export default function PainelLateralEditarEmocao({ evento, onClose, pacienteId }: PainelLateralEmocaoProps) {

    const agora = new Date();
    if (agora.getMinutes() >= 30) {
        agora.setHours(agora.getHours() + 1);
    }
    agora.setMinutes(0, 0, 0);
    const dataFormatada = format(agora, "dd/MM/yyyy", { locale: ptBR });
    const horaFormatada = format(agora, "HH:mm", { locale: ptBR });
    const [emocaoSelecionada, setEmocaoSelecionada] = useState<string | null> (null);
    const [mensagem, setMensagem] = useState("");
    const[notas, setNotas] = useState("");
    const [aberto, setAberto] = useState(false);
    const alternarDropdown = () => setAberto(!aberto);
    const selecionarEmocao = (nome:string) => {
        setEmocaoSelecionada(nome);
        setAberto(false);
    }

    const mapaEmocoes: { [key: string]: number } = {
        "feliz": 4,
        "normal": 3,
        "triste": 2,
        "raiva": 1,
    };

    const tipoEmocaoId = mapaEmocoes[emocaoSelecionada];


    const salvarEmocao = async (pacienteId: number, tipoEmocaoId: number) => {
        try {
            const agora = new Date();
            const data = format(agora, "yyyy-MM-dd", { locale: ptBR }); // formato aceito pelo backend
            const hora = format(agora, "HH:mm", { locale: ptBR });

            const emocaoPayload = {
                paciente: { pacienteId }, // precisa bater com o esperado pelo seu backend
                tipoEmocao: { id: tipoEmocaoId }, // idem aqui
                data,
                hora,
                sentimento: mensagem,
                notas,
            };

            const resposta = await axios.post("http://localhost:8080/api/emocoes", emocaoPayload);
            console.log("Emoção salva com sucesso:", resposta.data);
        } catch (erro) {
            console.error("Erro ao salvar emoção:", erro);
        }
    };

    return (
        <div className="fixed top-0 right-0 w-full max-w-md h-screen bg-white shadow-lg z-50 flex flex-col">
            {/* Botão fechar - canto superior direito */}
            <div className="flex justify-end p-4">
                <button onClick={onClose}>
                    <X className="text-[#7D8FB3] cursor-pointer hover:text-black transition-colors duration-200" />
                </button>
            </div>

            {/* Linha com "Emoção Diária" + ícone */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200">
                <span className="text-[#7D8FB3] font-semibold text-lg">Emoção Diária</span>
                <div className="relative">
                    <button
                        onClick={alternarDropdown}
                        className="w-36 px-4 py-2 rounded-full border border-gray-300 hover:border-gray-400 transition flex items-center justify-between gap-2"
                    >
                        <span>{emocaoSelecionada ? iconesEmocoes[emocaoSelecionada] : iconesEmocoes["feliz"]}</span>
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
                                        setEmocaoSelecionada(nome);
                                        setAberto(false); // fecha o dropdown
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded"
                                >
                                    {icone}
                                </button>
                            ))}
                        </div>
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
                <div className="items-start space-x-3 p-3 border-b border-gray-200">
                    <InputPadrao
                        type="textarea"
                        icon={<Smile size={20} className="text-gray-300 mr-4" />}
                        placeholder="Como você está se sentindo hoje?"
                        name="mensagem"
                        value={mensagem}
                        classNameInput="border-none !text-gray-500 !text-sm leading-relaxed whitespace-pre-line"
                        onChange={(e) => setMensagem(e.target.value)}
                    />
                </div>

                {/* Notas */}
                <div className="items-start space-x-3 p-4">
                    <InputPadrao
                        type="textarea"
                        icon={<Edit2 size={20} className="text-gray-300 mr-4" />}
                        placeholder="Adicione uma nota"
                        name="notas"
                        value={notas}
                        classNameInput="border-none !text-gray-500 !text-sm leading-relaxed whitespace-pre-line"
                        onChange={(e) => setNotas(e.target.value)}
                    />
                </div>

                <div className="flex items-end justify-end mt-85">
                    <BotaoPadrao
                        texto="Salvar"
                        className="cursor-pointer group bg-transparent !border-none !shadow-none !text-[#0088A3] flex items-center gap-1 hover:!text-[#006e85] text-base font-bold transition-colors"
                        icone={<Check color="#0088A3" />}
                        handleClick={() => salvarEmocao(1, mapaEmocoes[emocaoSelecionada])}
                    />
                </div>
            </div>

        </div>
    );
}