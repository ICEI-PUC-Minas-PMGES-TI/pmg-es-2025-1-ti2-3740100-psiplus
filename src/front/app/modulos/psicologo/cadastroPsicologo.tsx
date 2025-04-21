import Main from "~/componentes/Main";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import FormPadrao from "~/componentes/FormPadrao";
import InputPadrao from "~/componentes/InputPadrao";

export function CadastroPsicologo() {
  return (
    <Main>
      <div className="flex h-screen">
        {/* Lado esquerdo com gradiente */}
        <div className="w-1/2 h-screen bg-gradient-to-br from-sky-950 to-cyan-500 text-white flex justify-center items-center">
          <div className="flex flex-col text-left p-12">
            <h1 className="text-5xl font-bold mb-2">Psi+</h1>
            <p className="text-lg max-w-md">Conectando emoções, organizando cuidados.</p>
          </div>
        </div>

        {/* Lado direito com formulário */}
        <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
          {/* Texto de boas-vindas */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-cyan-700 mb-2">Crie sua conta!</h2>
            <p className="text-gray-600">Gerencie seus pacientes gratuitamente</p>
          </div>

          {/* Formulário */}
          <FormPadrao>
            <InputPadrao placeholder="Nome" icon={<User />} />
            <InputPadrao type="email" placeholder="E-mail" icon={<Mail />} />
            <InputPadrao type="password" placeholder="Senha" icon={<Lock />} />
            <InputPadrao type="password" placeholder="Confirme a senha" icon={<Lock />} />

            <div className="flex items-center mb-6">
                <input id="termos" type="checkbox" className="mr-2 accent-cyan-600" />
                <label htmlFor="termos" className="text-gray-700 text-sm">
                Aceito os <span className="underline cursor-pointer text-cyan-700">termos e condições</span>
                </label>
            </div>

            <BotaoPadrao caminho="/psicologo/dashboard" texto="Cadastrar" fullWidth />
            <BotaoPadrao caminho="/" texto="Voltar" fullWidth={true} className="mt-4" icone={<ArrowLeft />} color="bg-slate-400" hoverColor="bg-slate-500" />
          </FormPadrao>
        </div>
      </div>
    </Main>
  );
}
