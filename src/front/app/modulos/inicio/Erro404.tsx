import BotaoPadrao from "~/componentes/BotaoPadrao";
import Header from "~/componentes/Header";
import Main from "~/componentes/Main";
import HomeLogo from "~/componentes/HomeLogo";

export function Erro404() {
  return (
    <Main>
        <div className="flex h-screen">
            {/* Lado esquerdo com gradiente */}
            <HomeLogo />
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