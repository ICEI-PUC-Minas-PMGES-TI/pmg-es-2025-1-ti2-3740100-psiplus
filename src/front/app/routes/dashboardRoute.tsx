import type { Route } from "./+types/dashboardRoute";
import {Dashboard} from "~/modulos/inicio/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Página de controle do psicólogo" },
    { name: "description", content: "Página de controle do psicólogo." },
  ];
}

export default function DashboardRoute() {
  return <Dashboard/>;
}
