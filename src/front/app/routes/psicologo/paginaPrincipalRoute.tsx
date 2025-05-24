import type { Route } from "./+types/paginaPrincipalRoute";
import PaginaPrincipal from "../../modulos/psicologo/paginaPrincipal";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Página Principal" },
        { name: "description", content: "Página principal do paciente." },
    ];
}

export default function PaginaPrincipalRoute() {
    return <PaginaPrincipal />;
}