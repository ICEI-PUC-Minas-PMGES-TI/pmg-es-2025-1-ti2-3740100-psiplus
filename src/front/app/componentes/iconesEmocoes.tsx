// src/components/iconesEmocoes.tsx
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

// Mapeia nomes das emoções para ícones do MUI
export const iconesEmocoes: Record<string, JSX.Element> = {
    feliz: <SentimentVerySatisfiedIcon style={{ color: '#4E9B1E', fontSize: 30 }} />,
    triste: <SentimentDissatisfiedIcon style={{ color: '#55B3EE', fontSize: 30 }} />,
    neutro: <SentimentNeutralIcon style={{ color: '#EDD418', fontSize: 30 }} />,
    raiva: <SentimentVeryDissatisfiedIcon style={{ color: '#DC0606', fontSize: 30 }} />,
};
