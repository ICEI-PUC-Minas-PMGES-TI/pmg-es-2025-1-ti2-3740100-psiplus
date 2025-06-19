import type { Route } from "./+types/CalendarioEmocoesPacienteRoute";
import { CalendarioEmocoesPaciente } from "~/modulos/paciente/calendarioEmocoesPaciente";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Emoções" },
        { name: "description", content: "Página inicial de calendário de emoções do paciente." },
    ];
}

export default function CalendarioEmocoesPacienteRoute() {
    return (
        <ProtectedRoute>
            <CalendarioEmocoesPaciente />
        </ProtectedRoute>
    )
}