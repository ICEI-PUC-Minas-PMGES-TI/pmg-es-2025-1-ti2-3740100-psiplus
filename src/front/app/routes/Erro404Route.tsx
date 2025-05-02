import { Erro404 } from "~/modulos/inicio/Erro404";
import type { Route } from "./+types/dashboardRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Erro 404" },
    { name: "description", content: "Página não encontrada" },
  ];
}

export default function Erro404Route() {
  return (
    <Erro404 />
  );
}
