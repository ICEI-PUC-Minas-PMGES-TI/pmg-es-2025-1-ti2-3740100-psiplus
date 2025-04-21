import Header from "~/componentes/Header";
import Main from "~/componentes/Main";
import { Mail, Lock } from "lucide-react";
import BotaoPadrao from "~/componentes/BotaoPadrao";
  

export function LoginPsicologo() {
  return (
    <Main>
        <div className="flex h-screen">
            {/* Lado esquerdo com gradiente */}
            <div className="w-1/2 h-screen bg-gradient-to-br from-sky-950 to-cyan-500 text-white flex justify-center items-center">
                <div className="flex flex-col text-left p-12">
                    <h1 className="text-5xl font-bold mb-2">Psi+</h1>
                    <p className="text-lg max-w-md">
                    Conectando emoções, organizando cuidados.
                    </p>
                </div>
            </div>
            {/* Lado direito com formulário */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">

                {/* Texto de boas-vindas */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-cyan-700 mb-2">Bem-vindo!</h2>
                    <p className="text-gray-600">Entre com sua conta para continuar</p>
                </div>

                {/* Formulário de login */}
                <form className="w-full max-w-sm p-8 rounded shadow-md bg-transparent">

                    {/* Campo de email */}
                    <div className="mb-4">
                        <div className="relative">
                            {/* Ícone */}
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-slate-400" />
                            </span>

                            {/* Campo */}
                            <input
                            id="email"
                            type="email"
                            placeholder="E-mail"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Campo de senha */}
                    <div className="mb-4">
                        <div className="relative">
                            {/* Ícone */}
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-slate-400" />
                            </span>
                            {/* Campo */}
                            <input
                            id="senha"
                            type="password"
                            placeholder="Senha"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-400"
                            />
                        </div>
                    </div>
                    <BotaoPadrao caminho="/psicologo/dashboard" texto="Entrar" fullWidth={true} />

                </form>

                {/* Botão de cadastro */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-2">Não possui cadastro? <a href="/psicologo/cadastro" className="text-cyan-700 bold hover:underline">Cadastre-se</a></p>
                </div>

            </div>

        </div>
    </Main>
  );
}
