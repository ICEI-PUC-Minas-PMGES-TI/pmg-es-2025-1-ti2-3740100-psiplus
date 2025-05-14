import type { Route } from "./+types/CadastroPacientesRoute";
import CadastroPacientes from './modulos/psicologo/CadastroPacientes.tsx';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Cadastrar Paciente" },
    { name: "description", content: "Página de Cadastro de paciente." },
  ];
}

export default function CadastroPacientesRoute() {
  return <CadastroPacientes />;
}
