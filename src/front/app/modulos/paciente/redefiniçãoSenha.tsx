import Main from "~/componentes/Main";
import HomeLogo from "~/componentes/HomeLogo";
import FormPadrao from "~/componentes/FormPadrao";
import InputPadrao from "~/componentes/InputPadrao";
import {Lock, Mail} from "lucide-react";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import HomeLogoCadastro from "~/componentes/HomeLogoCadastro";
import {useState} from "react";

export function RedefinicaoSenha(){
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
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
                    <FormPadrao >
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