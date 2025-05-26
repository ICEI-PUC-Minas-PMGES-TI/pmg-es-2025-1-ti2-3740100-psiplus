import type { Route } from "./+types/registroAnotacoesRoute";
import { RegistroAnotacoes } from "~/modulos/psicologo/registroAnotacoes";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Registro de Anotações" },
    { name: "description", content: "Página de Registro de Anotações do psicólogo." },
  ];
}

export default function RegistroAnotacoesRoute() {
  return (
      <ProtectedRoute>
        <RegistroAnotacoes />
      </ProtectedRoute>
  );
}
