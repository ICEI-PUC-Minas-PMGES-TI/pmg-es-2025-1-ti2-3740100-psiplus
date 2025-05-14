import type { Route } from "./+types/cadastroPacientesRoute";
import CadastroPacientes from "../../modulos/psicologo/cadastroPacientes";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Cadastrar Paciente" },
    { name: "description", content: "Página de Cadastro de paciente." },
  ];
}

export default function CadastroPacientesRoute() {
  return <cadastroPacientes />;
}
