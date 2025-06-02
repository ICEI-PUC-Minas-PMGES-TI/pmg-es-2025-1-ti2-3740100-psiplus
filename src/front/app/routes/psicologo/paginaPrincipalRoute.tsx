import type { Route } from "./+types/paginaPrincipalRoute";
import PaginaPrincipal from "../../modulos/psicologo/paginaPrincipal";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Página Principal" },
        { name: "description", content: "Página principal do psicólogo." },
    ];
}

export default function PaginaPrincipalRoute() {
    return (
        <ProtectedRoute>
            <PaginaPrincipal />
        </ProtectedRoute>
    )
}