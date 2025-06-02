import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

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
            dataHoraInicio: excecao.start.toISOString(),
            dataHoraFim: excecao.end.toISOString(),
            motivo: excecao.motivo ?? '',
            tipo: excecao.tipo,
        };

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
