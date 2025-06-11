import type { Route } from "./+types/gestaoPacientesRoute";
import { EstatisticasEmocoes } from "~/modulos/psicologo/estatisticasEmocoes";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Estatísticas das Emoções" },
        { name: "description", content: "Página do Estatísticas das Emoções." },
    ];
}

export default function EstatisticasEmocoesRoute() {
    return (
        <ProtectedRoute>
            <EstatisticasEmocoes />
        </ProtectedRoute>
    );
}