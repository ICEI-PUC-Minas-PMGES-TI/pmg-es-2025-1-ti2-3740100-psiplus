import type { Route } from "./+types/gestaoPacientesRoute";
import GestaoPacientes from "../../modulos/psicologo/gestaoPacientes";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Gestão de Pacientes" },
    { name: "description", content: "Página de Gestão de Pacientes." },
  ];
}

export default function GestaoPacientesRoute() {
  return (
      <ProtectedRoute>
        <GestaoPacientes />
      </ProtectedRoute>
  );
}
