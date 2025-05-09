import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import IconPesquisar from "../../../public/assets/IconPesquisar.png"
import ExitIcon from "../../../public/assets/ExitIcon.png"
import IconArquivado from "../../../public/assets/IconArquivado.png"
import Filtro from "../../../public/assets/Filtro.png"
import BotaoPadrao from "~/componentes/BotaoPadrao";
import TabelaPadrao from "~/componentes/TabelaPadrao";
export function Dashboard(){
    return (
        <Main>
            <div className="flex h-screen bg-white ">
                {/* Lado esquerdo com menu do psicólogo*/}
               <MenuLateralPsicólogo telaAtiva={"pacientes"}/>
                <div className="w-px bg-gray-300"></div>
                <div className="m-5 w-4/5">
                    <div className="flex">
                        <InputPadrao
                            placeholder="Pesquisar"
                            classNameInput="border-0 font-semibold text-[14px]"
                            icon={<img className="w-[25px]" src={IconPesquisar} alt="pesquisar" />}
                        />
                        <BotaoPadrao
                            color="bg-white"
                            className="text-[16px] !font-medium  ml-auto !text-black "
                            texto="Sair"
                            icone={<img className=" w-[26px] " src={ExitIcon} alt="Sair" />}
                        />
                    </div>
                    <hr className="border-t-2 border-[#DFE5F1] my-5"/>
                    <h1 className="font-semibold text-black mx-4 text-[20px]">Pacientes</h1>
                    <TabelaPadrao/>
                </div>
            </div>
        </Main>
    )
}
