import type { Route } from "./+types/editarAgendaRoute";
import EditarAgenda from "../../modulos/psicologo/editarAgenda";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Editar Agenda" },
        { name: "description", content: "Página de Edição de agenda." },
    ];
}

export default function EditarAgendaRoute() {
    return (
        <ProtectedRoute>
            <EditarAgenda />
        </ProtectedRoute>
    );
}
