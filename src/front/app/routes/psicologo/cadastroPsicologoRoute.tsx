import type { Route } from "./+types/cadastroPsicologoRoute";
import { CadastroPsicologo } from "../../modulos/psicologo/cadastroPsicologo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Cadastro" },
    { name: "description", content: "Página de Cadastro do psicólogo." },
  ];
}

export default function CadastroPsicologoRoute() {
  return <CadastroPsicologo />;
}
