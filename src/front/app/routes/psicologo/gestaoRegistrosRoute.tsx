import type { Route } from "./+types/gestaoRegistrosRoute";
import { GestaoRegistros } from "~/modulos/psicologo/gestaoRegistros";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Agenda" },
    { name: "description", content: "Página de Agenda do psicólogo." },
  ];
}

export default function GestaoRegistrosRoute() {
  return (
      <ProtectedRoute>
        <GestaoRegistros />
      </ProtectedRoute>
  );
}
