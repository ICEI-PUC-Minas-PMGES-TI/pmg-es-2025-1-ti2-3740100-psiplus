import type { Route } from "./+types/estatisticasPacientesRoute";
import EstatisticasPacientes from "~/modulos/psicologo/estatisticasPacientes"
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Estatísticas" },
        { name: "description", content: "Página de estatísticas do psicólogo." },
    ];
}

export default function EstatisticasPacientesRoute() {
    return (
        <ProtectedRoute>
            <EstatisticasPacientes />
        </ProtectedRoute>
    );
}
