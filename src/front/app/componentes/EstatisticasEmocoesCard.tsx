import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";

import { Frown, Meh, Smile, Angry } from "lucide-react";

import { MenuItem, Select } from "@mui/material";
import {useParams} from "react-router";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

interface Emocao {
    titulo: string;
    qtd: number;
    icone: JSX.Element;
    cor: string;
}

interface ContagemEmocaoDTO {
    nome: string;
    total: number;
}

interface EventoEmocaoDTO {
    nome: string;
    data: string;   // Vai vir como string no formato ISO (ex: "2025-06-13")
    hora: string;   // Vai vir como string (ex: "14:30:00")
    sentimento: string;
    notas: string;
}

export function EstatisticasEmocoesCard() {
    const [filtroTempo, setFiltroTempo] = useState("semana");

    //Contagem de emocao
    const [dadosApi, setDadosApi] = useState<ContagemEmocaoDTO[]>([]);
    const emocoes: Emocao[] = dadosApi.map(mapearEmocao);
    const [mediasPorDia, setMediasPorDia] = useState<(number | null)[]>([]);
    const [eventosDetalhados, setEventosDetalhados] = useState<EventoEmocaoDTO[]>([]);
    const pacienteId = useParams("")

    const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

    //Gráfico de emocao
    const emocaoParaValor = {
        "raiva": 0,
        "triste": 1,
        "tristeza": 1,
        "neutro": 2,
        "alegria": 3
    };

    useEffect(() => {
        async function carregarDados() {
            try {

                // Buscar dados agregados para cards
                const respostaAgregados = await axios.get<ContagemEmocaoDTO[]>(
                    `http://localhost:8080/api/emocoes?periodo=${filtroTempo}&pacienteId=${pacienteId}`
                );
                setDadosApi(respostaAgregados.data);

                // Buscar dados detalhados para gráfico
                const respostaDetalhes = await axios.get<EventoEmocaoDTO[]>(
                    `http://localhost:8080/api/emocoes/eventos?periodo=${filtroTempo}&pacienteId=${pacienteId}`
                );
                const dadosDetalhados = respostaDetalhes.data;
                setEventosDetalhados(dadosDetalhados);

                if (filtroTempo === "mes") {
                    // Agrupar por dia do mês
                    const hoje = new Date();
                    const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
                    const dadosPorDiaDoMes: number[][] = Array.from({ length: diasNoMes }, () => []);

                    dadosDetalhados.forEach((item) => {
                        if (!item.data || !item.nome) return;
                        const data = new Date(item.data);
                        if (isNaN(data.getTime())) return;

                        const diaDoMesIndex = data.getDate() - 1;
                        const valor = emocaoParaValor[item.nome.toLowerCase()] ?? 1.5;
                        dadosPorDiaDoMes[diaDoMesIndex].push(valor);
                    });

                    const mediasMes = dadosPorDiaDoMes.map(lista =>
                        lista.length === 0 ? null : parseFloat((lista.reduce((a, b) => a + b, 0) / lista.length).toFixed(1))
                    );

                    setMediasPorDia(mediasMes);
                } else {
                    // Agrupar por dia da semana para 'dia' e 'semana'
                    const dadosPorDia: number[][] = Array.from({ length: 7 }, () => []);

                    dadosDetalhados.forEach((item) => {
                        if (!item.data || !item.nome) return;
                        const data = new Date(item.data);
                        if (isNaN(data.getTime())) return;

                        const diaSemana = (data.getDay() + 6) % 7; // Segunda = 0
                        const valor = emocaoParaValor[item.nome.toLowerCase()] ?? 1.5;
                        dadosPorDia[diaSemana].push(valor);
                    });

                    const medias = dadosPorDia.map(lista =>
                        lista.length === 0 ? null : parseFloat((lista.reduce((a, b) => a + b, 0) / lista.length).toFixed(1))
                    );

                    setMediasPorDia(medias);
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            }
        }
        carregarDados();
    }, [filtroTempo]);

    const dadosGrafico = diasDaSemana.map((dia, i) => ({
        dia,
        media: mediasPorDia[i],
    }));

    // Definindo labels para o gráfico de acordo com filtroTempo
    const labels = filtroTempo === "dia"
        ? ["Hoje"]
        : filtroTempo === "semana"
            ? diasDaSemana
            : ["Semana 1", "Semana 2", "Semana 3", "Semana 4"]; // exemplo para mês (ajuste conforme sua lógica)

    // Dados para o gráfico baseados nas médiasPorDia, para 'semana' ou 'dia'
    // Para filtro 'mes', você precisaria implementar o cálculo das médias semanais no backend ou frontend
    const dadosParaGrafico = filtroTempo === "dia"
        ? mediasPorDia.length > 0 && mediasPorDia[ (new Date().getDay() + 6) % 7 ] !== null
            ? [mediasPorDia[(new Date().getDay() + 6) % 7] as number]
            : [0]
        : filtroTempo === "semana"
            ? mediasPorDia.map(v => v === null ? 0 : v)
            : [0, 0, 0, 0]; // Placeholder para mês, ajuste conforme necessidade

    function mapearEmocao(dto: ContagemEmocaoDTO): Emocao {
        switch (dto.nome.toLowerCase()) {
            case "feliz":
            case "alegria":
                return {
                    titulo: "Alegria",
                    qtd: dto.total,
                    icone: <Smile />,
                    cor: "#4E9B1E",
                };
            case "neutro":
                return {
                    titulo: "Neutro",
                    qtd: dto.total,
                    icone: <Meh />,
                    cor: "#D1B000",
                };
            case "triste":
            case "tristeza":
                return {
                    titulo: "Tristeza",
                    qtd: dto.total,
                    icone: <Frown />,
                    cor: "#55B3EE",
                };
            case "raiva":
                return {
                    titulo: "Raiva",
                    qtd: dto.total,
                    icone: <Angry />,
                    cor: "#D13438",
                };
            default:
                return {
                    titulo: dto.nome,
                    qtd: dto.total,
                    icone: <Meh />,
                    cor: "#999",
                };
        }
    }

    return (
        <div className="w-full px-2 mt-2">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[17px] font-bold text-[#3A3F63]">ESTATÍSTICAS DAS EMOÇÕES</h2>
                {/* Select */}
                <Select
                    value={filtroTempo}
                    onChange={(e) => setFiltroTempo(e.target.value)}
                    size="small"
                    sx={{
                        width: 128,
                        color: '#858EBD',               // Cor do texto do select
                        boxShadow: '0 2px 4px rgba(133, 142, 189, 0.3)', // sombra só embaixo
                        margin: 0,
                        backgroundColor: 'white',
                        borderRadius: 1,
                        '& .MuiSelect-icon': {
                            color: '#858EBD !important',  // Cor da setinha, com !important para garantir
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent !important', // remover borda
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent !important', // sem borda ao passar o mouse
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent !important', // sem borda quando focado
                        },
                    }}
                    variant="outlined"  // garantir que o Select use a variante outlined
                >
                    <MenuItem value="dia">Dia</MenuItem>
                    <MenuItem value="semana">Semana</MenuItem>
                    <MenuItem value="mes">Mês</MenuItem>
                </Select>
            </div>

            {/* Cards de emoções */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {emocoes.map((emocao, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-md"
                    >
                        <div className="text-3xl" style={{ color: emocao.cor }}>
                            {emocao.icone}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#2E3261]">{emocao.titulo}</p>
                            <p className="text-md font-medium" style={{ color: emocao.cor }}>{emocao.qtd}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráfico de linha abaixo dos cards */}
            <div className="mt-10 bg-white rounded-xl shadow-md p-4 relative">
                <h3 className="text-[15px] font-semibold text-[#3A3F63] mb-4">Visão de emoções</h3>

                <Line
                    data={{
                        labels: labels,
                        datasets: [
                            {
                                label: "Média da emoção",
                                data: dadosParaGrafico,
                                borderColor: "#0088A3",
                                backgroundColor: "rgba(19, 134, 201, 0.1)",
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: "#FFA500",
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const valor = context.raw as number;
                                        let icone = "😐"; // neutro como padrão

                                        if (valor === 0) icone = "😡";        // Raiva
                                        else if (valor < 1.5) icone = "😢";   // Tristeza
                                        else if (valor < 2) icone = "😐";     // Neutro
                                        else if (valor >= 2) icone = "😊";    // Alegria
                                    },
                                },
                            },
                            legend: {
                                display: true,
                            },
                        },
                        scales: {
                            y: {
                                min: 0,
                                max: 3,
                                ticks: {
                                    stepSize: 1,
                                    callback: function(value) {
                                        switch (value) {
                                            case 0: return "😡";
                                            case 1: return "😢";
                                            case 2: return "😐";
                                            case 3: return "😊";
                                            default: return "";
                                        }
                                    },
                                },
                                grid: {
                                    drawTicks: false,
                                    drawBorder: false,
                                    color: "#F0F0F0",
                                },
                            },
                            x: {
                                ticks: {
                                    color: "#2E3261",
                                    font: {
                                        weight: "600",
                                        size: 12
                                    },
                                },
                                grid: {
                                    display: false,
                                },
                            }

                        },
                    }}
                />
            </div>
        </div>
    );
}
