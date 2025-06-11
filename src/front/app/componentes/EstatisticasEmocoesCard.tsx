import { useState } from "react";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { MenuItem, Select } from "@mui/material";

interface Emocao {
    titulo: string;
    qtd: number;
    icone: JSX.Element;
    cor: string;
}

export function EstatisticasEmocoesCard() {
    const [filtroTempo, setFiltroTempo] = useState("semana");

    const emocoes: Emocao[] = [
        {
            titulo: "Alegria",
            qtd: 43,
            icone: <SentimentVerySatisfiedIcon />,
            cor: "#4E9B1E",
        },
        {
            titulo: "Neutro",
            qtd: 37,
            icone: <SentimentNeutralIcon />,
            cor: "#D1B000",
        },
        {
            titulo: "Tristeza",
            qtd: 29,
            icone: <SentimentDissatisfiedIcon />,
            cor: "#55B3EE",
        },
        {
            titulo: "Raiva",
            qtd: 23,
            icone: <SentimentVeryDissatisfiedIcon />,
            cor: "#D13438",
        },
    ];

    return (
        <div className="w-full px-2 mt-2">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[17px] font-bold text-[#3A3F63]">ESTATÍSTICAS DAS EMOÇÕES</h2>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {emocoes.map((emocao, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md"
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
        </div>
    );
}
