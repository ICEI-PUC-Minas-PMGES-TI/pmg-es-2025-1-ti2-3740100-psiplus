import type { Route } from "./+types/gestaoRegistrosRoute";
import { GestaoRegistros } from "../../modulos/psicologo/gestaoRegistros";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Agenda" },
    { name: "description", content: "Página de Agenda do psicólogo." },
  ];
}

export default function gestaoRegistrosRoute() {
  return <GestaoRegistros />;
}
