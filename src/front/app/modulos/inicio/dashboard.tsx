import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import IconPesquisar from "../../../public/assets/IconPesquisar.png"
import ExitIcon from "../../../public/assets/ExitIcon.png"
import IconArquivado from "../../../public/assets/IconArquivado.png"
import Filtro from "../../../public/assets/Filtro.png"
import BotaoPadrao from "~/componentes/BotaoPadrao";
import TabelaPadrao from "~/componentes/TabelaPadrao";
import { useEffect, useState } from "react";
export function Dashboard() {
    const [pacientes, setPacientes] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/pacientes/resumo")
            .then((res) => res.json())
            .then((data) => setPacientes(data))
            .catch((err) => console.error("Erro ao buscar pacientes:", err));
    }, []);

    return (
        <Main>
            <div className="flex h-screen bg-white ">
                {/* Lado esquerdo com menu do psicólogo*/}
               <MenuLateralPsicólogo telaAtiva={"pacientes"}/>
                <div className="w-px bg-gray-300"></div>
                <div className="m-5 w-4/5">
                    <div className="flex">
                        <BotaoPadrao
                            color="bg-white"
                            className="text-[16px] !font-medium  ml-auto !text-black "
                            texto="Sair"
                            icone={<img className=" w-[26px] " src={ExitIcon} alt="Sair" />}
                        />
                    </div>
                    <h1 className="font-semibold text-black mx-2 text-[20px]">Pacientes</h1>
                    <TabelaPadrao data={pacientes}/>
                </div>
            </div>
        </Main>
    )
}
