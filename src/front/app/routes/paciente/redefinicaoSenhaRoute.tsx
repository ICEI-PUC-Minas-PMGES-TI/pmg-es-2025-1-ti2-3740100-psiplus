import type { Route } from "./+types/redefinicaoSenhaRoute";
import {RedefinicaoSenha} from "../../modulos/paciente/redefiniçãoSenha";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Login" },
        { name: "description", content: "Página de redefinição de senha do paciente." },
    ];
}

export default function redefinicaoSenhaRoute() {
    return (
        <ProtectedRoute>
            <RedefinicaoSenha/>
        </ProtectedRoute>
    )
}
