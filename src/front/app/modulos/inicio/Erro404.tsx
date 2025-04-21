import BotaoPadrao from "~/componentes/BotaoPadrao";
import Header from "~/componentes/Header";
import Main from "~/componentes/Main";

export function Erro404() {
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
            {/* Lado direito */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
                <p className="text-3xl font-bold text-cyan-700 mb-2">404 - Página não encontrada</p>
                <p className="text-gray-600 mb-4">Desculpe, a página que você está procurando não existe.</p>
                <BotaoPadrao caminho="/" texto="Voltar para o início" color="bg-cyan-700" hoverColor="bg-cyan-500" />
            </div>
        </div>
    </Main>
  );
}