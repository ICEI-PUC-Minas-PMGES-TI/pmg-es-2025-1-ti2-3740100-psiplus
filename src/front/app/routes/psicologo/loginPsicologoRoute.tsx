import type { Route } from "./+types/loginPsicologoRoute";
import { LoginPsicologo } from "../../modulos/psicologo/loginPsicologo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Login" },
    { name: "description", content: "Página de login do psicólogo." },
  ];
}

export default function LoginPsicologoRoute() {
  return <LoginPsicologo />;
}
