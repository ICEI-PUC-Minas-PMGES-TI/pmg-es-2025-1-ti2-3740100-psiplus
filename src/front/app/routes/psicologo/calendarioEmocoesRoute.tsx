import type { Route } from "./+types/gestaoPacientesRoute";
import CalendarioEmocoes from "~/modulos/psicologo/calendarioEmocoes";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Calendário de Emoções" },
        { name: "description", content: "Página do Calendário de Emoções." },
    ];
}

export default function CalendarioEmocoesRoute() {
    return (
        <ProtectedRoute>
            <CalendarioEmocoes />
        </ProtectedRoute>
    );
}