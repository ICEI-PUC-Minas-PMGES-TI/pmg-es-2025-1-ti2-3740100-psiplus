import IconPsiPlus from "../../public/assets/IconPsiPlus.png";
import PerfilUser from "../../public/assets/PerfilUser.jpg";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import IconAgendas from "../../public/assets/IconAgenda.png";
import IconPacientes from "../../public/assets/IconPacientes.png";
import BotaoAdd from "../../public/assets/BotaoAdd.png";
import { useEffect, useState } from "react";

export default function MenuLateralPsicólogo() {

    const [nome, setNome] = useState("");
    useEffect(() => {
        const nomeSalvo = localStorage.getItem("Nome");
        if (nomeSalvo) {
            setNome(nomeSalvo);
        }
    }, []);

    return (
        <div className="w-1/5 h-screen pl-[15px] text-black font-semibold flex flex-col bg-white">
            <div className="flex mt-[10px]">
                <img className="w-[41px] h-[48px]" src={IconPsiPlus} alt="Logo"/>
                <h1 className=" text-[20px] pt-[15px] pl-[5px] font-bold">Psi+</h1>
            </div>
            <div className="flex pt-[10px] mt-[10px]">
                <img className="w-[36px] h-[36px] rounded-full" src={PerfilUser}/>
                <div className="text-[14px] pl-[5px]">
                    <h1> {nome} </h1>
                    <h1 className="text-[#BBC6D9]"> Psicólogo </h1>
                </div>
            </div>
            <hr className="border-t-2 border-[#DFE5F1] my-4 mx-4"/>
            <BotaoPadrao
                color="bg-white"
                className="!items-start text-[16px] !justify-start !text-black mt-[10px]"
                texto="Agenda"
                icone={<img className=" w-[29px] mr-1" src={IconAgendas} alt="Icon Agenda" />}
            />
            <BotaoPadrao
                color="bg-white"
                className="!items-start text-[16px] !justify-start !text-[#0088A3] mt-[10px]"
                texto="Pacientes"
                icone={<img className=" w-[29px] mr-1" src={IconPacientes} alt="Icon Pacientes" />}
            />
            <BotaoPadrao
                color="bg-[#034B57]"
                className=" text-[16px]  mt-[330px] mx-8"
                texto="Novo paciente"
                icone={<img className=" w-[29px] mr-1" src={BotaoAdd} alt="Icon +" />}
            />
            <BotaoPadrao
                color="bg-[#0088A3]"
                className=" text-[16px]  mx-8 mt-[10px]"
                texto="Nova consulta"
                icone={<img className=" w-[29px] mr-1" src={BotaoAdd} alt="Icon +" />}
            />
        </div>
    );
}
