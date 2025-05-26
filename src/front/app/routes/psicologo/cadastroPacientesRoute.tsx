import type { Route } from "./+types/cadastroPsicologoRoute";
import CadastroPacientes from "../../modulos/psicologo/cadastroPacientes";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Cadastrar Paciente" },
    { name: "description", content: "Página de Cadastro de paciente." },
  ];
}

export default function CadastroPacientesRoute() {
  return (
      <ProtectedRoute>
        <CadastroPacientes />
      </ProtectedRoute>
  );
}
