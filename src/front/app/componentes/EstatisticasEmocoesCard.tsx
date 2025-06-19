import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";

import {Frown, Meh, Smile, Angry, BarChart2} from "lucide-react";

import { MenuItem, Select } from "@mui/material";
import {useParams} from "react-router";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";

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
    const [filtroTempo, setFiltroTempo] = useState("mes");
    const [contagem, setContagem] = useState<
        { nome: string; qtd: number; cor: string; icone: JSX.Element; titulo: string }[]
    >([]);
    const [mediasPorDia, setMediasPorDia] = useState<(number | null)[]>([]);
    const [emocoes, setEmocoes] = useState<any>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [dadosParaGrafico, setDadosParaGrafico] = useState<(number | null)[]>([]);
    const { id: pacienteId } = useParams();


    const emocaoMap: Record<string, { cor: string; icone: React.ReactNode; titulo: string }> = {
        feliz: { cor: "#4E9B1E", icone: <Smile size={30} color="#4E9B1E" />, titulo: "Feliz" },
        triste: { cor: "#55B3EE", icone: <Frown size={30} color="#55B3EE" />, titulo: "Triste" },
        raiva: { cor: "#DC0606", icone: <Angry size={30} color="#DC0606" />, titulo: "Raiva" },
        neutro: { cor: "#EDD418", icone: <Meh size={30} color="#EDD418" />, titulo: "Neutro" },
    };

    const emocaoParaValor = {
        "raiva": 0,
        "triste": 1,
        "tristeza": 1,
        "neutro": 2,
        "feliz": 3,
        "alegria": 3
    };

    useEffect(() => {
        if (!emocoes || emocoes.length === 0) {
            setLabels([]);
            setDadosParaGrafico([]);
            const todosZerados = Object.entries(emocaoMap).map(([nome, info]) => ({
                nome,
                qtd: 0,
                cor: info.cor,
                icone: info.icone,
                titulo: info.titulo,
            }));
            setContagem(todosZerados);
            return;
        }

        const hoje = new Date();
        let intervalo = { start: hoje, end: hoje };
        let labelsGerados: string[] = [];
        let agrupamento: number[][] = [];

        switch (filtroTempo) {
            case "dia":
                intervalo = { start: startOfDay(hoje), end: endOfDay(hoje) };
                labelsGerados = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
                agrupamento = Array.from({ length: 24 }, () => []);
                break;

            case "semana":
                intervalo = {
                    start: startOfWeek(hoje, { weekStartsOn: 1 }),
                    end: endOfWeek(hoje, { weekStartsOn: 1 }),
                };
                labelsGerados = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
                agrupamento = Array.from({ length: 7 }, () => []);
                break;

            case "mes":
            default:
                intervalo = { start: startOfMonth(hoje), end: endOfMonth(hoje) };
                const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
                labelsGerados = Array.from({ length: diasNoMes }, (_, i) => `${i + 1}/${hoje.getMonth() + 1}`);
                agrupamento = Array.from({ length: diasNoMes }, () => []);
                break;
        }

        const emocoesFiltradas = emocoes.filter((emocao) => {
            if (!emocao.data) return false;
            const data = parseISO(emocao.data);
            return isWithinInterval(data, intervalo);
        });

        emocoesFiltradas.forEach((emocao) => {
            const data = parseISO(emocao.data);
            const valor = emocaoParaValor[emocao.tipoEmocaoNome?.toLowerCase()] ?? 1.5;

            if (filtroTempo === "dia") {
                const hora = new Date(emocao.hora ? `1970-01-01T${emocao.hora}` : data).getHours();
                agrupamento[hora].push(valor);
            } else if (filtroTempo === "semana") {
                const diaSemana = (data.getDay() + 6) % 7;
                agrupamento[diaSemana].push(valor);
            } else {
                const diaDoMes = data.getDate() - 1;
                agrupamento[diaDoMes].push(valor);
            }
        });

        const medias = agrupamento.map(valores =>
            valores.length === 0 ? null : parseFloat((valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1))
        );

        setLabels(labelsGerados);
        setDadosParaGrafico(medias);

        const contagem: Record<string, number> = {};
        emocoesFiltradas.forEach((emocao) => {
            const nome = emocao.tipoEmocaoNome?.toLowerCase();
            if (!nome) return;
            contagem[nome] = (contagem[nome] || 0) + 1;
        });

        const resultado = Object.entries(emocaoMap).map(([nome, info]) => ({
            nome,
            qtd: contagem[nome] || 0,
            cor: info.cor,
            icone: info.icone,
            titulo: info.titulo,
        }));

        setContagem(resultado);
    }, [emocoes, filtroTempo]);

    {/* Dados do paciente */}
    const [paciente, setPaciente] = useState<any>({
        usuario: {
            id: undefined,
            nome: "",
            email: "",

        },
    })

    useEffect(() => {
        async function carregarDados() {
            if (!pacienteId) return;

            try {
                const baseUrl = `http://localhost:8080/api/emocoes/paciente/${pacienteId}`;
                const respostaAgregados = await axios.get(`${baseUrl}?periodo=${filtroTempo}`);
                setEmocoes(respostaAgregados.data);

                if (filtroTempo === "mes") {
                    const hoje = new Date();
                    const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
                    const dadosPorDiaDoMes: number[][] = Array.from({ length: diasNoMes }, () => []);

                    emocoes.forEach(item => {
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
                    // dia ou semana -> agrupa por dia da semana (Seg = 0)
                    const dadosPorDia: number[][] = Array.from({ length: 7 }, () => []);

                    emocoes.forEach(item => {
                        if (!item.data || !item.nome) return;
                        const data = new Date(item.data);
                        if (isNaN(data.getTime())) return;

                        const diaSemana = (data.getDay() + 6) % 7;
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
    }, [filtroTempo, pacienteId]);

    return (
        <div className="w-[80%] px-2 mt-2">
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
                {contagem.map((emocao, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-md">
                        <div className="text-3xl" style={{ color: emocao.cor }}>
                            {emocao.icone}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#2E3261]">{emocao.titulo}</p>
                            <p className="text-md font-medium" style={{ color: emocao.cor }}>
                                {emocao.qtd}
                            </p>
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
                                        let icone = "😐";

                                        if (valor === 0) icone = "😡";
                                        else if (valor < 1.5) icone = "😢";
                                        else if (valor < 2) icone = "😐";
                                        else if (valor >= 2) icone = "😊";
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
