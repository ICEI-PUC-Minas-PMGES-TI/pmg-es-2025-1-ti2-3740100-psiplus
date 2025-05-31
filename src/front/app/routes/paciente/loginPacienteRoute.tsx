import type { Route } from "./+types/loginPacienteRoute";
import { LoginPaciente } from "../../modulos/paciente/loginPaciente";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Psi+ | Login" },
        { name: "description", content: "Página de login do paciente." },
    ];
}

export default function LoginPsicologoRoute() {
    return <LoginPaciente />;
}
