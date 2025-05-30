import type { Route } from "./+types/agendarConsultaRoute";
import AgendarConsulta from "~/modulos/psicologo/agendarConsulta";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Nova Consulta" },
    { name: "description", content: "Página de Agendamento de Consulta." },
  ];
}

export default function AgendarConsultaRoute() {
  return (
      <ProtectedRoute>
        <AgendarConsulta />
      </ProtectedRoute>
  );
}
