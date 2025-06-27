import Main from "~/componentes/Main";
import { Mail, Lock } from "lucide-react";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import FormPadrao from "~/componentes/FormPadrao";
import InputPadrao from "~/componentes/InputPadrao";
import HomeLogo from "~/componentes/HomeLogo";
import { useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import Popup from "~/componentes/Popup";

export function LoginPaciente() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [mensagemPopup, setMensagemPopup] = useState("");
    const [mostrarPopup, setMostrarPopup] = useState(false);

    function fazerLogin(e: React.FormEvent) {
        e.preventDefault();
        setErro("");

        axios
            .post("http://localhost:8080/pacientes/login", {
                email,
                senha,
            })
            .then((response) => {
                const tempoDeSessao = 30 * 60 * 1000; // 30 minutos
                const dadosSessao = {
                    usuarioId: response.data.pacienteId,
                    expiraEm: Date.now() + tempoDeSessao,
                };

                sessionStorage.setItem("sessaoPaciente", JSON.stringify(dadosSessao));

                const senhaRedefinida = response.data.senhaRedefinida;
                if (senhaRedefinida) {
                    navigate("/paciente/agenda");
                } else {
                    navigate("/paciente/redefinirSenha", {
                        state: {
                            email: email,
                            senhaAntiga: senha,
                        }
                    });
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        setMensagemPopup("Email ou senha inválidos.");
                    } else {
                        setMensagemPopup("Erro interno do servidor. Tente novamente mais tarde.");
                    }
                } else {
                    setMensagemPopup("Não foi possível conectar ao servidor. Verifique sua conexão.");
                }

                setMostrarPopup(true);
            });
    }
    return (
        <Main>
            <div className="flex flex-col md:flex-row h-screen">
                {/* Lado esquerdo com gradiente (esconde em mobile) */}
                <div className="hidden md:block md:w-1/2 h-48 md:h-full">
                    <HomeLogo />
                </div>
                {/* Lado direito com formulário */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-6 md:p-8">
                    {/* Texto de boas-vindas */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-cyan-700 mb-2">Bem-vindo!</h2>
                        <p className="text-gray-600">Entre com sua conta para continuar</p>
                    </div>
                    {/* Formulário de login */}
                    <FormPadrao onSubmit={fazerLogin} className="w-full max-w-xs">
                        <InputPadrao type="email" placeholder="E-mail" name="email" icon={<Mail />} value={email} onChange={(e) => setEmail(e.target.value)} />
                        <InputPadrao type="password" placeholder="Senha" name="senha" icon={<Lock />} value={senha} onChange={(e) => setSenha(e.target.value)} />
                        <BotaoPadrao texto="Entrar" fullWidth type="submit" />
                        {/* Texto de cadastro */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 mb-2">
                                <a href="">
                                    Esqueceu a senha?
                                </a>
                            </p>
                        </div>
                    </FormPadrao>
                </div>
            </div>
            {mostrarPopup && (
                <Popup
                    titulo="Erro no login"
                    mensagem={mensagemPopup}
                    onClose={() => {
                        setMostrarPopup(false);
                    }}
                />
            )}
        </Main>
    );
}