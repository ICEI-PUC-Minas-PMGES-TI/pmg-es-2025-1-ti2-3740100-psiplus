import BotaoPadrao from "~/componentes/BotaoPadrao";
import Header from "~/componentes/Header";
import Main from "~/componentes/Main";
import HomeLogo from "~/componentes/HomeLogo";

export function Inicio() {
  return (
    <Main>
        <div className="flex h-screen">
            {/* Lado esquerdo com gradiente */}
            <HomeLogo />
            {/* Lado direito com botões */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-cyan-700 mb-2">Bem-vindo!</h2>
                    <p className="text-gray-600">Escolha uma opção abaixo para continuar</p>
                </div>
                <div className="flex flex-col gap-4">
                    <BotaoPadrao caminho="/psicologo/login" texto="Área do Psicólogo" />
                    <BotaoPadrao caminho="/paciente/login" texto="Área do Paciente" />
                </div>
            </div>
        </div>
    </Main>
  );
}