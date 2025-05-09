import type { Route } from "./+types/agendaRoute";
import { Agenda } from "../../modulos/psicologo/agenda";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Agenda" },
    { name: "description", content: "Página de Agenda do psicólogo." },
  ];
}

export default function AgendaRoute() {
  return <Agenda />;
}
