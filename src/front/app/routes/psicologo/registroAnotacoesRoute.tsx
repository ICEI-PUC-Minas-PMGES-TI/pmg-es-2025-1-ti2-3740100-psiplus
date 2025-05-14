import type { Route } from "./+types/registroAnotacoesRoute";
import { RegistroAnotacoes } from "../../modulos/psicologo/registroAnotações";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Agenda" },
    { name: "description", content: "Página de Agenda do psicólogo." },
  ];
}

export default function registroAnotacoesRoute() {
  return <RegistroAnotacoes />;
}
