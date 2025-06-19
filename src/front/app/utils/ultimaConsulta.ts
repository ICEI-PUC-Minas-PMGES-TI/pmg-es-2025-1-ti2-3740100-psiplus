import { useState, useEffect } from "react";
import axios from "axios";

export interface Consulta {
    id: number;
    pacienteId: number;
    psicologoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    dataHoraInicio: string;
    dataHoraFim: string;
}

export function useUltimaConsulta(pacienteId: number | string) {
    const [ultimaConsulta, setUltimaConsulta] = useState<Consulta | null>(null);

    useEffect(() => {
        if (!pacienteId) {
            setUltimaConsulta(null);
            return;
        }

        axios.get(`http://localhost:8080/consultas/ultimaconsulta/${pacienteId}`)
            .then(response => {
                setUltimaConsulta(response.data);
            })
            .catch(() => {
                setUltimaConsulta(null);
            });

    }, [pacienteId]);

    return ultimaConsulta;
}