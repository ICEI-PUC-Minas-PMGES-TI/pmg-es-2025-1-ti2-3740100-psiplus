import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Página de controle do psicólogo" },
    { name: "description", content: "Página de controle do psicólogo." },
  ];
}

export default function Dashboard() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Área de controle do psicólogo</p>
    </div>
  );
}
