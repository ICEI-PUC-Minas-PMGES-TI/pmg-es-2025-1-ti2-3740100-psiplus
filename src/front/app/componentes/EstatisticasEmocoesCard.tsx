import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { MenuItem, Select } from "@mui/material";

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

export function EstatisticasEmocoesCard() {
    const [filtroTempo, setFiltroTempo] = useState("semana");

    //Contagem de emocao
    const [dadosApi, setDadosApi] = useState<ContagemEmocaoDTO[]>([]);
    const emocoes: Emocao[] = dadosApi.map(mapearEmocao);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/emocoes?periodo=${filtroTempo}&pacienteId=1`) // substitua o ID real
            .then((res) => {
                setDadosApi(res.data);
            })
            .catch((err) => {
                console.error("Erro ao buscar dados de emoções:", err);
            });
    }, [filtroTempo]);

    function mapearEmocao(dto: ContagemEmocaoDTO): Emocao {
        switch (dto.nome.toLowerCase()) {
            case "feliz":
            case "alegria":
                return {
                    titulo: "Alegria",
                    qtd: dto.total,
                    icone: <SentimentVerySatisfiedIcon />,
                    cor: "#4E9B1E",
                };
            case "neutro":
                return {
                    titulo: "Neutro",
                    qtd: dto.total,
                    icone: <SentimentNeutralIcon />,
                    cor: "#D1B000",
                };
            case "triste":
            case "tristeza":
                return {
                    titulo: "Tristeza",
                    qtd: dto.total,
                    icone: <SentimentDissatisfiedIcon />,
                    cor: "#55B3EE",
                };
            case "raiva":
                return {
                    titulo: "Raiva",
                    qtd: dto.total,
                    icone: <SentimentVeryDissatisfiedIcon />,
                    cor: "#D13438",
                };
            default:
                return {
                    titulo: dto.nome,
                    qtd: dto.total,
                    icone: <SentimentNeutralIcon />,
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
                <h3 className="text-[15px] font-semibold text-[#3A3F63] mb-4">Visão de emoções semanal</h3>
                {/* Emojis no eixo Y */}
                <div className="absolute top-[80px] left-3 flex flex-col justify-between h-[300px]">
                    <SentimentVerySatisfiedIcon style={{ color: "#4E9B1E" }} /> {/* 😊 */}
                    <SentimentNeutralIcon style={{ color: "#EDD418" }} />        {/* 😐 */}
                    <SentimentDissatisfiedIcon style={{ color: "#55B3EE" }} />   {/* 😢 */}
                    <SentimentVeryDissatisfiedIcon style={{ color: "#DC0606" }} /> {/* 😡 */}
                </div>

                <Line
                    data={{
                        labels: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
                        datasets: [
                            {
                                label: "Média da emoção",
                                data: [1, 2, 1.5, 2.5, 2, 2.2, 1],
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
                                        let icone = "🙂";
                                        if (valor < 1.5) icone = "😢";
                                        else if (valor < 2) icone = "😐";
                                        else if (valor >= 2) icone = "😊";
                                        return `Média: ${icone}`;
                                    },
                                },
                            },
                            legend: {
                                display: false,
                            },
                        },
                        scales: {
                            y: {
                                min: 0,
                                max: 3,
                                ticks: {
                                    stepSize: 1,
                                    display: false,
                                },
                                grid: {
                                    drawTicks: false,
                                    drawBorder: false,
                                    color: (ctx) => {
                                        const value = ctx.tick.value;
                                        return [1, 2, 3, 4].includes(value) ? "#F0F0F0" : "transparent";
                                    },
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
