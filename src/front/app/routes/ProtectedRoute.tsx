import { Navigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

type Sessao = {
    nome: string;
    expiraEm: number;
};

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const [sessaoValida, setSessaoValida] = useState<boolean | null>(null); // null = carregando

    useEffect(() => {
        async function testarBackend(): Promise<boolean> {
            try {
                const res = await axios.get("http://localhost:8080/psicologos/1");
                return !!res.data;
            } catch (error) {
                return false;
            }
        }

        function recuperarSessao(tipo: "psicologo" | "paciente"): Sessao | null {
            const raw = sessionStorage.getItem(`sessao${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
            if (!raw) return null;
            try {
                const sessao = JSON.parse(raw) as Sessao;
                if (Date.now() > sessao.expiraEm) {
                    sessionStorage.removeItem(`sessao${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
                    return null;
                }
                return sessao;
            } catch {
                return null;
            }
        }

        async function init() {
            const backendOk = await testarBackend();
            if (!backendOk) {
                alert("Erro: Backend não está respondendo corretamente, verifique a conexão!");
                setSessaoValida(false);
                return;
            }

            const psicologoSessao = recuperarSessao("psicologo");
            const pacienteSessao = recuperarSessao("paciente");

            if (psicologoSessao || pacienteSessao) {
                setSessaoValida(true);
            } else {
                setSessaoValida(false);
            }
        }

        init();
    }, []);

    // Spinner enquanto a sessão está sendo carregada
    if (sessaoValida === null) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress size={50} sx={{ color: "#4A90E2" }} />
            </div>
        );
    }

    if (sessaoValida) {
        return <>{children}</>;
    }

    // Redirecionamento baseado na URL
    if (location.pathname.startsWith("/psicologo")) {
        return <Navigate to="/psicologo/login" state={{ from: location }} replace />;
    } else if (location.pathname.startsWith("/paciente")) {
        return <Navigate to="/paciente/login" state={{ from: location }} replace />;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
}
