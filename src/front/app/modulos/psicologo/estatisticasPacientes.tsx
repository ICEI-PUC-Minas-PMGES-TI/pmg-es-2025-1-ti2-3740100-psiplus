import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import { useNavigate } from "react-router";
import GraficoCrescimento from "~/componentes/GraficoCrescimento";

export default function EstatisticasPacientes(){
    const navigate = useNavigate();

    function leave() {
        sessionStorage.removeItem("sessaoPsicologo");
        sessionStorage.removeItem("sessaoPaciente");
        sessionStorage.removeItem("sessionData");
        navigate("/");
    }

    return(
        <Main>
            <div className="flex min-h-screen bg-white">
                <MenuLateralPsicólogo telaAtiva="estatistica" />
                <div className="w-px bg-gray-300"></div>
                <div className="m-5 w-4/5">
                    <div className="flex">
                        <BotaoPadrao
                            texto="Sair"
                            icone={<img className="w-[26px]" src={ExitIcon} alt="Sair" />}
                            color="bg-white"
                            textoColor="text-gray-600"
                            className="ml-auto hover:text-black transition-colors duration-200 font-medium"
                            handleClick={leave}
                        />
                    </div>
                    <hr className="border-t-2 border-[#DFE5F1] my-2"/>
                    <h1 className="pt-4 font-semibold text-[#161736] mx-2 text-[25px]">ESTATÍSTICAS</h1>
                    <div className="mt-10 bg-white rounded-xl shadow-md mx-5 p-4 relative">
                        <h1 className="pt-4 font-semibold text-[#161736] mx-2 text-[25px]">Novos cadastros - Mês </h1>
                        <h1 className="pt-4 font-semibold ml-25 text-[#161736] mx-2 text-[65px]"> 25 % </h1>
                        <GraficoCrescimento />
                    </div>
                    <div className="mt-10 bg-white rounded-xl shadow-md mx-5 p-4 relative">
                        <h1 className="pt-4 font-semibold text-[#161736] mx-2 text-[20px]">Atendimentos Efetivados</h1>
                    </div>
                </div>
            </div>
        </Main>
    );

}