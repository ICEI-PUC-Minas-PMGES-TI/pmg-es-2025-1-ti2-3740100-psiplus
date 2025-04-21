import type { Route } from "./+types/inicioRoute";
import { Inicio } from "~/modulos/inicio/inicio";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psi+ | Início" },
    { name: "description", content: "Conectando emoções, organizando cuidados." },
  ];
}

export default function InicioRoute() {
  return <Inicio />;
}
