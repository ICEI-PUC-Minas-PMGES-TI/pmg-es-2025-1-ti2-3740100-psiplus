import type { Route } from "./+types/agendarConsultaRoute";
import { AgendarConsulta } from "~/modulos/psicologo/agendarConsulta";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Registro de Anotações" },
    { name: "description", content: "Página de Registro de Anotações do psicólogo." },
  ];
}

export default function AgendarConsultaRoute() {
  return (
      <ProtectedRoute>
        <AgendarConsulta />
      </ProtectedRoute>
  );
}
