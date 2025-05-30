import Main from "~/componentes/Main";
import { Mail, Lock } from "lucide-react";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import FormPadrao from "~/componentes/FormPadrao";
import InputPadrao from "~/componentes/InputPadrao";
import HomeLogo from "~/componentes/HomeLogo";
import {useNavigate} from "react-router";
import {useState} from "react";
import axios from "axios";

export function LoginPsicologo() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    function fazerLogin(e: React.FormEvent) {
        e.preventDefault();
        setErro(""); // limpa o erro antes de tentar de novo

        axios
            .post("http://localhost:8080/psicologos/login", {
                email,
                senha,
            })
            .then((response) => {
                const tempoDeSessao = 30 * 60 * 1000; // 30 minutos

                const dadosSessao = {
                    usuarioId: response.data.psicologoId,
                    expiraEm: Date.now() + tempoDeSessao,
                };

                sessionStorage.setItem("sessaoPsicologo", JSON.stringify(dadosSessao));
                navigate("/psicologo/agenda");
            })
            .catch((error) => {
                console.error("Erro ao salvar os dados no backend:", error);
                alert("Houve um erro ao salvar os dados.");
            });
    }
  return (
    <Main>
        <div className="flex h-screen">
            {/* Lado esquerdo com gradiente */}
            <HomeLogo />
            {/* Lado direito com formulário */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">

                {/* Texto de boas-vindas */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-cyan-700 mb-2">Bem-vindo!</h2>
                    <p className="text-gray-600">Entre com sua conta para continuar</p>
                </div>

                {/* Formulário de login */}
                <FormPadrao onSubmit={fazerLogin}>
                    <InputPadrao type="email" placeholder="E-mail" name="email" icon={<Mail />} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <InputPadrao type="password" placeholder="Senha" name="senha" icon={<Lock />} value={senha} onChange={(e) => setSenha(e.target.value)}/>
                    <BotaoPadrao texto="Entrar" fullWidth type="submit" />
                    {/* Texto de cadastro */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 mb-2">
                            Não possui cadastro?{" "}
                            <a href="/psicologo/cadastro" className="text-cyan-700 font-semibold hover:underline">
                            Cadastre-se
                            </a>
                        </p>
                    </div>
                </FormPadrao>
            </div>
        </div>
    </Main>
  );
}
