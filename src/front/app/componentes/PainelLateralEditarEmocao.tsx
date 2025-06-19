import { iconesEmocoes } from "~/componentes/IconesEmocoes";
import {useEffect, useState} from "react";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import axios from "axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, Calendar, Clock, Edit2, Smile, Check } from "lucide-react";
import InputPadrao from "~/componentes/InputPadrao";
import Popup from "~/componentes/Popup";

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
    pacienteId: number;
    atualizarEventos?: () => Promise<void>;
}

export default function PainelLateralEditarEmocao({
                                                      evento,
                                                      onClose,
                                                      pacienteId,
                                                      atualizarEventos,
                                                  }: PainelLateralEmocaoProps) {
    const agora = new Date();
    if (agora.getMinutes() >= 30) {
        agora.setHours(agora.getHours() + 1);
    }
    agora.setMinutes(0, 0, 0);

    function arredondarHora(data: Date) {
        const novaData = new Date(data);
        novaData.setMinutes(0, 0, 0);
        return novaData;
    }

    const agoraArredondado = arredondarHora(new Date());

    const horaFormatada = evento?.hora
        ? evento.hora.split(":")[0] + ":00"
        : format(agoraArredondado, "HH:mm", { locale: ptBR });

    const dataFormatada = evento
        ? (() => {
            const [ano, mes, dia] = evento.data.split("-").map(Number);
            const dataObj = new Date(ano, mes - 1, dia);
            return format(dataObj, "dd/MM/yyyy", { locale: ptBR });
        })()
        : format(agoraArredondado, "dd/MM/yyyy", { locale: ptBR });

    const [emocaoSelecionada, setEmocaoSelecionada] = useState<string | null>("feliz");
    const [mensagem, setMensagem] = useState("");
    const [notas, setNotas] = useState("");
    const [aberto, setAberto] = useState(false);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [tituloPopup, setTituloPopup] = useState("");
    const [mensagemPopup, setMensagemPopup] = useState("");

    useEffect(() => {
        if (evento) {
            setEmocaoSelecionada(evento.tipoEmocao?.nome ?? "feliz");
            setMensagem(evento.sentimento ?? "");
            setNotas(evento.notas ?? "");
        }
    }, [evento]);

    const alternarDropdown = () => setAberto(!aberto);

    const mapaEmocoes: { [key: string]: number } = {
        feliz: 1,
        normal: 2,
        triste: 3,
        raiva: 4,
    };

    const salvarEmocao = async (pacienteId: number) => {
        try {
            const data = evento?.data ?? format(new Date(), "yyyy-MM-dd");

            const hora = evento?.hora
                ? evento.hora.split(":")[0] + ":00"
                : format(arredondarHora(new Date()), "HH:mm");

            const tipoEmocaoId = mapaEmocoes[emocaoSelecionada!];

            const emocaoPayload = {
                pacienteId,
                tipoEmocaoId,
                data,
                hora,
                sentimento: mensagem,
                notas,
            };

            await axios.post("http://localhost:8080/api/emocoes", emocaoPayload);

            setTituloPopup("Sucesso!");
            setMensagemPopup("Emoção salva com sucesso.");
            setMostrarPopup(true);
            if (atualizarEventos) {
                await atualizarEventos();
            }

        } catch (erro: any) {
            if (erro.response?.status === 409) {
                setTituloPopup("Conflito de Horário");
                setMensagemPopup("Já existe uma emoção cadastrada nesse horário.");
            } else if (erro.response?.status === 400) {
                setTituloPopup("Dados Inválidos");
                setMensagemPopup("Verifique os dados preenchidos.");
            } else {
                setTituloPopup("Erro Inesperado");
                setMensagemPopup("Erro ao salvar emoção. Tente novamente.");
            }
            setMostrarPopup(true);
        }
    };

    return (
        <div className="fixed top-0 right-0 w-full max-w-md h-screen bg-white shadow-lg z-50 flex flex-col">
            {/* Botão fechar */}
            <div className="flex justify-end p-4">
                <button onClick={onClose}>
                    <X className="text-[#7D8FB3] cursor-pointer hover:text-black transition-colors duration-200" />
                </button>
            </div>

            {/* Cabeçalho */}
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
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto">
                {/* Data e hora */}
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
                <div className="p-3 border-b border-gray-200">
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
                <div className="p-4">
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

                {/* Botão salvar */}
                <div className="flex items-end justify-end mt-85 px-4">
                    <BotaoPadrao
                        texto="Salvar"
                        className="cursor-pointer group bg-transparent !border-none !shadow-none !text-[#0088A3] flex items-center gap-1 hover:!text-[#006e85] text-base font-bold transition-colors"
                        icone={<Check color="#0088A3" />}
                        handleClick={() => salvarEmocao(pacienteId)}
                    />
                </div>
            </div>

            {mostrarPopup && (
                <Popup
                    titulo={tituloPopup}
                    mensagem={mensagemPopup}
                    onClose={() => setMostrarPopup(false)}
                />
            )}
        </div>
    );
}
