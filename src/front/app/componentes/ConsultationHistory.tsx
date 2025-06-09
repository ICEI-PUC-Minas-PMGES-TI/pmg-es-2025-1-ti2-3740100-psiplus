import BotaoPadrao from "~/componentes/BotaoPadrao";
import { useNavigate, useParams } from "react-router";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from "@mui/icons-material/Check";
import { useState, useEffect } from "react";
import axios from "axios";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface Anotacao {
    data: string; // ou data_registro
    hora: string; // ou hora_registro
    conteudo: string; // ou anotacao
}

const ConsultationHistory: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const pacienteId = Number(id);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
    const [novoConteudo, setNovoConteudo] = useState("");
    const [dataConsulta, setDataConsulta] = useState("");
    const [horaConsulta, setHoraConsulta] = useState("");

    // Buscar os registros do paciente
    useEffect(() => {
        if (!pacienteId) return;

        axios.get(`http://localhost:8080/registros/${pacienteId}`)
            .then((res) => {
                const registros: Anotacao[] = res.data.map((registro: any) => ({
                    data: registro.data_registro,
                    hora: registro.hora_registro,
                    conteudo: registro.anotacao,
                }));
                setAnotacoes(registros);
            })
            .catch((err) => {
                console.error("Erro ao carregar registros:", err);
            });
    }, [pacienteId]);

    const handleAdicionarAnotacao = () => {
        const agora = new Date();
        const dataISO = agora.toISOString().split("T")[0]; // yyyy-mm-dd
        const hora = agora.toTimeString().slice(0, 5); // hh:mm

        setDataConsulta(dataISO);
        setHoraConsulta(hora);
        setModoEdicao(true);
    };

    const handleSalvar = async () => {
        if (!novoConteudo.trim()) return;

        const dataHoraCompleta = `${dataConsulta}T${horaConsulta}:00`;
        const nova: Anotacao = {
            data: new Date(dataHoraCompleta).toISOString(),
            conteudo: novoConteudo.trim(),
        };

        const novasAnotacoes = [nova, ...anotacoes];

        try {
            // Enviar as novas anotações, não as antigas!
            await axios.post(`http://localhost:8080/registros`, {
                pacienteId: pacienteId,
                data: dataConsulta,
                hora: horaConsulta,
                conteudo: novoConteudo.trim(),
            });
            setAnotacoes(novasAnotacoes);
            setNovoConteudo("");
            setModoEdicao(false);
        } catch (error) {
            console.error("Erro ao salvar anotação:", error);
        }
    };

    const anotacoesOrdenadas = [...anotacoes].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    const formatarDataHora = (iso: string) => {
        const data = new Date(iso);
        return `${data.toLocaleDateString("pt-BR")} - ${data.toLocaleTimeString("pt-BR", {
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
                        icone={<AddIcon style={{ color: "#0088A3" }} />}
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
                            icone={<SaveIcon style={{ color: "#0088A3" }} />}
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
                                    {formatarDataHora(anotacao.data)}
                                  </span>
                                    <span className="text-xl">
                                    <span className="text-xl">
                                        {!aberto && <span className="text-[13px] text-[#858EBD]">Exibir anotações</span>}
                                      {aberto ? <ExpandLessIcon sx={{ color: '#858EBD' }} /> : <ExpandMoreIcon sx={{ color: '#858EBD' }} />}
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
