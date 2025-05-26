import type { Route } from "./+types/agendaRoute";
import { Agenda } from "~/modulos/psicologo/agenda";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Agenda" },
    { name: "description", content: "Página de Agenda do psicólogo." },
  ];
}

export default function AgendaRoute() {
  return <ProtectedRoute>
      <Agenda />;
    </ProtectedRoute>
}
