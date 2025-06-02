import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

function formatarParaBackend(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export async function listarExcecoesDisponibilidade(psicologoId: number) {
    try {
        const response = await axios.get(`${BASE_URL}/disponibilidades/excecoes/psicologo/${psicologoId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar exceções de disponibilidade:', error);
        throw error;
    }
}

export interface ExcecaoDisponibilidadePayload {
    psicologoId: number;
    start: Date;
    end: Date;
    tipo: 'DISPONIVEL' | 'INDISPONIVEL';
    motivo?: string;
}

export async function salvarExcecaoDisponibilidade(excecao: ExcecaoDisponibilidadePayload) {
    try {
        const payload = {
            psicologo: { psicologoId: excecao.psicologoId },
            dataHoraInicio: formatarParaBackend(excecao.start),
            dataHoraFim: formatarParaBackend(excecao.end),
            motivo: excecao.motivo ?? '',
            tipo: excecao.tipo,
        };

        if (!excecao.start || !excecao.end) {
            throw new Error("Start ou End está indefinido ao salvar exceção.");
        }

        const response = await axios.post(`${BASE_URL}/disponibilidades/excecoes`, payload);
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar exceção de disponibilidade:', error);
        throw error;
    }
}

export async function deletarExcecaoDisponibilidade(id: number) {
    try {
        await axios.delete(`${BASE_URL}/disponibilidades/excecoes/${id}`);
    } catch (error) {
        console.error('Erro ao deletar exceção de disponibilidade:', error);
        throw error;
    }
}
