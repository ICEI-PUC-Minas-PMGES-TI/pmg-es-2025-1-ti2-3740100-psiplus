// src/components/IconesEmocoes.tsx
import { Frown, Meh, Smile, Angry } from "lucide-react";

export const iconesEmocoes: Record<string, JSX.Element> = {
    feliz: <Smile color="#4E9B1E" size={30} />,
    triste: <Frown color="#55B3EE" size={30} />,
    neutro: <Meh color="#EDD418" size={30} />,
    raiva: <Angry color="#DC0606" size={30} />,
};
