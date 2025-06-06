import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

function formatarParaBackend(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export async function listarDisponibilidadesRecorrente(psicologoId: number) {
    try {
        const response = await axios.get(`${BASE_URL}/disponibilidades/psicologo/${psicologoId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar exceções de disponibilidade:', error);
        throw error;
    }
}

import { format } from "date-fns";

// Util para formatar 'HH:mm:ss' e 'yyyy-MM-dd'
function formatarHora(date: Date) {
    return format(date, "HH:mm:ss");
}

function formatarData(date: Date) {
    return format(date, "yyyy-MM-dd");
}

export async function salvarDisponibilidadeRecorrente(disp: {
    psicologoId: number;
    diaSemana: number;
    horaInicio: string;
    horaFim: string;
    dataInicio: string;
    dataFim: string | null;
}) {
    try {
        const payload = {
            psicologo: { psicologoId: disp.psicologoId },
            diaSemana: disp.diaSemana,
            horaInicio: disp.horaInicio,
            horaFim: disp.horaFim,
            dataInicio: disp.dataInicio,
            dataFim: disp.dataFim
        };

        const response = await axios.post(`${BASE_URL}/disponibilidades`, payload);
        return response.data;
    } catch (error) {
        console.error("Erro ao salvar disponibilidade recorrente:", error);
        throw error;
    }
}

export async function deletarDisponibilidadeRecorrente(id: number) {
    try {
        await axios.delete(`${BASE_URL}/disponibilidades/${id}`);
    } catch (error) {
        console.error('Erro ao deletar disponibilidade:', error);
        throw error;
    }
}

export async function limparDisponibilidadesRecorrente(psicologoId: number) {
    try {
        await axios.delete(`${BASE_URL}/disponibilidades/recorrentes/${psicologoId}`);
    } catch (error) {
        console.error('Erro ao deletar disponibilidade:', error);
        throw error;
    }
}
