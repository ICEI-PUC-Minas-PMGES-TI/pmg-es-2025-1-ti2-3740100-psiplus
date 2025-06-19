import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

type Sessao = {
    nome: string;
    expiraEm: number;
};

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [sessaoValida, setSessaoValida] = useState<boolean | null>(null); // null = carregando

    function recuperarSessao(tipo: "psicologo" | "paciente"): Sessao | null {
        const key = `sessao${tipo[0].toUpperCase()}${tipo.slice(1)}`;
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        try {
            const sessao = JSON.parse(raw) as Sessao;
            if (Date.now() > sessao.expiraEm) {
                sessionStorage.removeItem(key);
                return null;
            }
            return sessao;
        } catch {
            return null;
        }
    }

    useEffect(() => {
        async function testarBackend(): Promise<boolean> {
            try {
                const res = await axios.get(`http://localhost:8080/psicologos/1`);
                return !!res.data;
            } catch {
                return false;
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

            const path = location.pathname;

            if (path.startsWith("/psicologo") && psicologoSessao) {
                setSessaoValida(true);
            } else if (path.startsWith("/paciente") && pacienteSessao) {
                setSessaoValida(true);
            } else {
                setSessaoValida(false);
            }
        }

        init();
    }, [location.pathname]);

    useEffect(() => {
        if (sessaoValida === false) {
            const path = location.pathname;
            if (path.startsWith("/psicologo")) {
                navigate("/psicologo/login");
            } else if (path.startsWith("/paciente")) {
                navigate("/paciente/login");
            } else {
                navigate("/");
            }
        }
    }, [sessaoValida, location.pathname, navigate]);

    if (sessaoValida === null || sessaoValida === false) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress size={50} sx={{ color: "#4A90E2" }} />
            </div>
        );
    }

    return <>{children}</>;
}
