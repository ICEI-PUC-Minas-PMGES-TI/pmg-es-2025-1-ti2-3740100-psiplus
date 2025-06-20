import type { Route } from "./+types/editarConsultaPacienteRoute";
import EditarConsultaPaciente from "~/modulos/paciente/editarConsultaPaciente";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Editar Consulta" },
        { name: "description", content: "Página de Edição de Consulta." },
    ];
}

export default function EditarConsultaPacienteRoute() {
    return (
        <ProtectedRoute>
            <EditarConsultaPaciente />
        </ProtectedRoute>
    );
}
