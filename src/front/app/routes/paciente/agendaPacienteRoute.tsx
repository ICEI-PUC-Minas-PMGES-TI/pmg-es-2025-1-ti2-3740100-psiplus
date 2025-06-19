import type { Route } from "./+types/AgendaPacienteRoute";
import { AgendaPaciente } from "~/modulos/paciente/agendaPaciente";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Agenda" },
        { name: "description", content: "Página inicial de agenda do paciente." },
    ];
}

export default function AgendaPacienteRoute() {
    return (
        <ProtectedRoute>
             <AgendaPaciente />
        </ProtectedRoute>
    )
}