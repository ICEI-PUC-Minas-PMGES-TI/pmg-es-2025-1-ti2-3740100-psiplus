import Main from "~/componentes/Main";
import HomeLogo from "~/componentes/HomeLogo";
import FormPadrao from "~/componentes/FormPadrao";
import InputPadrao from "~/componentes/InputPadrao";
import {Lock, Mail} from "lucide-react";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import HomeLogoCadastro from "~/componentes/HomeLogoCadastro";
import {useState} from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function RedefinicaoSenha(){
    const location = useLocation();
    const navigate = useNavigate();
    const { email, senhaAntiga } = location.state || {};
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/pacientes/redefinir-senha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    senhaAntiga,
                    novaSenha: senha,
                    confirmarSenha
                }),
            });

            if (response.ok) {
                alert("Senha redefinida com sucesso!");
                navigate("/psicologo/pacientes");

            } else {
                const mensagem = await response.text();
                alert(`Erro: ${mensagem}`);
            }
        } catch (error) {
            alert("Erro ao redefinir a senha.");
            console.error(error);
        }
    };
    return (
        <Main>
            <div className="flex h-screen">
                {/* Lado esquerdo com gradiente */}
                <HomeLogoCadastro />
                {/* Lado direito com formulário */}
                <div className="w-3/4 flex flex-col items-center mt-35 bg-white p-8">

                    {/* Texto de boas-vindas */}
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-[#034B57] mb-2">Bem-vindo!</h2>
                        <p className="text-gray-600">Por favor, redefina a sua senha para prosseguir:</p>
                    </div>

                    {/* Formulário de login */}
                    <FormPadrao onSubmit={handleSubmit}>
                        <InputPadrao
                            type="password"
                            placeholder="Digite sua nova senha"
                            icon={<Lock />}
                            value={senha}
                            classNameInput="mb-4"
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <InputPadrao
                            type="password"
                            placeholder="Confirme a senha"
                            icon={<Lock />}
                            classNameInput="mb-4"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                        />
                        <BotaoPadrao texto="Entrar" fullWidth type="submit" />
                    </FormPadrao>
                </div>
            </div>
        </Main>
    );
}