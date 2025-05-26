import { Navigate, useLocation } from "react-router";

type Sessao = {
    nome: string;
    expiraEm: number;
};

function recuperarSessao(tipo: "psicologo" | "paciente"): Sessao | null {
    const raw = localStorage.getItem(`sessao${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    if (!raw) return null;
    try {
        const sessao = JSON.parse(raw) as Sessao;
        if (Date.now() > sessao.expiraEm) {
            localStorage.removeItem(`sessao${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
            return null;
        }
        return sessao;
    } catch {
        return null;
    }
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    const psicologoSessao = recuperarSessao("psicologo");
    const pacienteSessao = recuperarSessao("paciente");

    if (psicologoSessao) {
        return <>{children}</>;
    }

    if (pacienteSessao) {
        return <>{children}</>;
    }

    if (location.pathname.startsWith("/psicologo")) {
        return <Navigate to="/psicologo/login" state={{ from: location }} replace />;
    } else if (location.pathname.startsWith("/paciente")) {
        return <Navigate to="/paciente/login" state={{ from: location }} replace />;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
}
