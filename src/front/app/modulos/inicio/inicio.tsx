import BotaoPadrao from "~/componentes/BotaoPadrao";
import Header from "~/componentes/Header";
import Main from "~/componentes/Main";

export function Inicio() {
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