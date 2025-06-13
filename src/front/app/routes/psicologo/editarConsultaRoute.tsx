import type { Route } from "./+types/editarConsultaRoute";
import EditarConsulta from "~/modulos/psicologo/editarConsulta";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Editar Consulta" },
        { name: "description", content: "Página de Edição de Consulta." },
    ];
}

export default function EditarConsultaRoute() {
    return (
        <ProtectedRoute>
            <EditarConsulta />
        </ProtectedRoute>
    );
}
