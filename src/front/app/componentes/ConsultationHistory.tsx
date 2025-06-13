import BotaoPadrao from "~/componentes/BotaoPadrao";
import { useNavigate, useParams } from "react-router";
import { Plus, Save, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface ConsultationHistoryProps {
    pacienteId: number;
    historicoClinico: Anotacao[];
}

const ConsultationHistory: React.FC<ConsultationHistoryProps> = ({ pacienteId, historicoClinico }) => {
    const [anotacoes, setAnotacoes] = useState<Anotacao[]>(historicoClinico);    const navigate = useNavigate();

    const [modoEdicao, setModoEdicao] = useState(false);
    const [novoConteudo, setNovoConteudo] = useState("");
    const [dataConsulta, setDataConsulta] = useState("");
    const [horaConsulta, setHoraConsulta] = useState("");

    const handleAdicionarAnotacao = () => {
        const agora = new Date();
        const dataISO = agora.toISOString().split("T")[0]; // yyyy-mm-dd
        const hora = agora.toTimeString().split(" ")[0]; // "HH:mm:ss"

        setDataConsulta(dataISO);
        setHoraConsulta(hora);
        setModoEdicao(true);
    };

    const handleSalvar = async () => {
        if (!novoConteudo.trim()) return;

        const horaCompleta = horaConsulta.length === 5 ? horaConsulta + ":00" : horaConsulta;

        const nova: Anotacao = {
            data: dataConsulta,
            hora: horaCompleta,
            conteudo: novoConteudo.trim(),
        };

        const novasAnotacoes = [nova, ...anotacoes];

        try {
            await axios.post(`http://localhost:8080/registros`, {
                pacienteId,
                data: dataConsulta,
                hora: horaCompleta,
                conteudo: novoConteudo.trim(),
            });
            setAnotacoes(novasAnotacoes);
            setNovoConteudo("");
            setModoEdicao(false);
        } catch (error) {
            console.error("Erro ao salvar anotação:", error);
        }
    };

    useEffect(() => {
        if (!pacienteId) return;

        axios.get(`http://localhost:8080/registros/${pacienteId}`)
            .then((res) => {
                setAnotacoes(res.data);
            })
            .catch((err) => {
                console.error("Erro ao carregar registros:", err);
            });
    }, [pacienteId]);

    const anotacoesOrdenadas = [...anotacoes].sort((a, b) => {
        const horaALimpa = typeof a.hora === "string" ? a.hora.split(".")[0] : "00:00:00";
        const horaBLimpa = typeof b.hora === "string" ? b.hora.split(".")[0] : "00:00:00";

        const dataHoraA = new Date(`${a.data}T${horaALimpa}`);
        const dataHoraB = new Date(`${b.data}T${horaBLimpa}`);
        return dataHoraB.getTime() - dataHoraA.getTime();
    });

    const formatarDataHora = (data: string, hora?: string) => {
        if (!hora || typeof hora !== "string") return "Data inválida";

        // Limpa possíveis milissegundos, se houver
        const horaLimpa = hora.split(".")[0];

        const dataHora = new Date(`${data}T${horaLimpa}`);
        if (isNaN(dataHora.getTime())) return "Data inválida";

        return `${dataHora.toLocaleDateString("pt-BR")} - ${dataHora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    };

    const [abertos, setAbertos] = useState<number[]>([]);

    const toggleRegistro = (index: number) => {
        setAbertos((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };


    return (
        <div className="max-w-[900px] mx-auto">
            <div className="flex justify-between items-center mb-5">
                {!modoEdicao ? (
                    <>
                    <h2 className="text-[17px] font-bold text-[#3A3F63]">HISTÓRICO DE CONSULTAS</h2>
                    <BotaoPadrao
                        texto="Adicionar Anotação"
                        className="cursor-pointer group bg-transparent !border-none !shadow-none !text-[#0088A3] flex items-center gap-1 hover:!text-[#006e85] text-base font-bold transition-colors"
                        handleClick={handleAdicionarAnotacao}
                        icone={<Plus color="#0088A3" />}
                    />
                    </>
                ) : (
                    null
                )}
            </div>

            {modoEdicao ? (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[17px] font-bold text-[#3A3F63]">REGISTRO DE SESSÃO</h2>
                        <BotaoPadrao
                            texto="Salvar"
                            className="cursor-pointer group bg-transparent !border-none !shadow-none !text-[#0088A3] flex items-center gap-1 hover:!text-[#006e85] text-base font-bold transition-colors"
                            handleClick={handleSalvar}
                            icone={<Save color={"#0088A3"} />}
                        />
                    </div>

                    <div className="mb-6 space-y-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col">
                                <label className="text-[#3A3F63] mb-1 text-sm font-regular">Data da Consulta</label>
                                <input
                                    type="date"
                                    value={dataConsulta}
                                    onChange={(e) => setDataConsulta(e.target.value)}
                                    className="bg-[#F3F4F9] text-[#7D8DA6] rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-regular text-[#3A3F63] mb-1">Horário da Consulta</label>
                                <input
                                    type="time"
                                    value={horaConsulta}
                                    onChange={(e) => setHoraConsulta(e.target.value)}
                                    className="bg-[#F3F4F9] text-[#7D8DA6] rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-regular text-[#3A3F63] mb-1">Notas</label>
                            <textarea
                                rows={15}
                                placeholder="Insira alguma nota sobre esse paciente"
                                value={novoConteudo}
                                onChange={(e) => setNovoConteudo(e.target.value)}
                                className="w-full border border-[#DAE0F2] rounded-lg px-3 py-2 text-sm text-[#858EBD]"
                            />
                        </div>
                    </div>
                </>
            ) : anotacoes.length === 0 ? (
                <p className="text-sm text-[#333]">Nenhuma anotação registrada.</p>
            ) : (
                <ul className="space-y-4">
                    {anotacoesOrdenadas.map((anotacao, index) => {
                        const aberto = abertos.includes(index);
                        return (
                            <li
                                key={index}
                                className="bg-[#FBFBFB] text-[#3A3F63] text-sm font-regular rounded-xl p-4"
                            >
                                <div
                                    className="flex justify-between items-center cursor-pointer text-sm font-regular"
                                    onClick={() => toggleRegistro(index)}
                                >
                                  <span className="text-sm font-semibold">
                                    {formatarDataHora(anotacao.data, anotacao.hora)}
                                  </span>
                                    <span className="text-xl">
                                    <span className="text-xl">
                                        {!aberto && <span className="text-[13px] text-[#858EBD]">Exibir anotações</span>}
                                        {aberto ? <ChevronUp color="#858EBD" /> : <ChevronDown color="#858EBD" />}
                                    </span>
                                  </span>
                                </div>
                                {aberto && (
                                    <p className="text-sm mt-3 whitespace-pre-line">{anotacao.conteudo}</p>
                                )}
                            </li>
                        );
                    })}
                </ul>

            )}
        </div>
    );
};

export default ConsultationHistory;
