import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export async function buscarDisponibilidadesRecorrente(psicologoId: number, inicio: Date, fim: Date) {
    try {
        const response = await axios.get(`${BASE_URL}/disponibilidades/psicologo/${psicologoId}`, {
            params: {
                psicologoId,
                inicio: inicio.toISOString(),
                fim: fim.toISOString()
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar disponibilidades:', error);
        throw error;
    }
}

export async function salvarDisponibilidadeRecorrente(disp: { psicologoId: number; start: Date; end: Date }) {
    try {
        const response = await axios.post(`${BASE_URL}/disponibilidades`, {
            psicologoId: disp.psicologoId,
            inicio: disp.start.toISOString(),
            fim: disp.end.toISOString(),
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar disponibilidade:', error);
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
