import type Route  from "./+types/perfilPacienteRoute";
import PerfilPaciente from "~/modulos/paciente/perfilPaciente";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Perfil" },
        { name: "description", content: "Perfil do paciente." },
    ];
}

export default function perfilPacienteRoute() {
    return (
        <ProtectedRoute>
            <PerfilPaciente/>
        </ProtectedRoute>
    )
}