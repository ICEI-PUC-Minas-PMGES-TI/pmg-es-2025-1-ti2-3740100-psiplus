import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Página de Login" },
    { name: "description", content: "Página de login do sistema." },
  ];
}

export default function Login() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>
      <button onClick={() => alert("Logando...")}>Entrar</button>
    </div>
  );
}
