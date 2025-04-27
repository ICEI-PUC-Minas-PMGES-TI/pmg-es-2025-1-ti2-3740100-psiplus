import Main from "~/componentes/Main";
import { Mail, Lock } from "lucide-react";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import FormPadrao from "~/componentes/FormPadrao";
import InputPadrao from "~/componentes/InputPadrao";
import HomeLogo from "~/componentes/HomeLogo";

export function LoginPsicologo() {
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
                <FormPadrao>
                    <InputPadrao type="email" placeholder="E-mail" name="email" icon={<Mail />} />
                    <InputPadrao type="password" placeholder="Senha" name="senha" icon={<Lock />} />
                    <BotaoPadrao caminho="/psicologo/dashboard" texto="Entrar" fullWidth />
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
