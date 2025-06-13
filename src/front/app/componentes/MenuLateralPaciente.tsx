import { useState, useEffect } from "react";
import axios from "axios";
import IconPsiPlus from "../../public/assets/IconPsiPlus.png";
import PerfilUser from "../../public/assets/PerfilUser.jpg";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import IconAgendas from "../../public/assets/IconAgenda.png";
import IconPacientes from "../../public/assets/IconPacientes.png";
import BotaoAdd from "../../public/assets/BotaoAdd.png";
import {CalendarDays, Laugh, Smile, SmilePlus, User, Users} from "lucide-react";
import { useNavigate } from "react-router";

type MenuLateralPacienteProps = {
    telaAtiva: "agenda" | "emoçoes" | "perfil";
};

export default function MenuLateralPaciente({ telaAtiva }: MenuLateralPacienteProps) {
    const [nome, setNome] = useState("Carregando...");
    const navigate = useNavigate();

    useEffect(() => {

        const sessao = sessionStorage.getItem("sessaoPaciente");
        if (!sessao) return;

        const { usuarioId } = JSON.parse(sessao);

        axios
            .get(`http://localhost:8080/pacientes/${usuarioId}`)
            .then((res) => {
                const usuario = res.data.usuario || {};
                const nomeDoUsuario = usuario.nome || "Nome não encontrado";
                const emailDoUsuario = usuario.email || "Email não encontrado";

                const sessionData = { nome: nomeDoUsuario, email: emailDoUsuario };
                sessionStorage.setItem("sessionData", JSON.stringify(sessionData));

                setNome(nomeDoUsuario);
            })
            .catch((err) => {
                console.error("Erro ao buscar paciente:", err);
                setNome("Erro ao carregar nome");
            });
    }, []);


    return (
        <div className="sticky top-0 w-1/6 h-screen pl-[15px] text-black font-semibold flex flex-col bg-white">
            <div className="flex mt-[10px]">
                <img className="w-[41px] h-[48px]" src={IconPsiPlus} alt="Logo" />
                <h1 className="text-[20px] pt-[15px] pl-[5px] font-bold">Psi+</h1>
            </div>

            <div className="flex pt-[10px] mt-[10px]">
                <img className="w-[36px] h-[36px] rounded-full" src={PerfilUser} />
                <div className="text-[14px] pl-[5px]">
                    <h1>{nome}</h1>
                    <h1 className="text-[#BBC6D9]">Paciente</h1>
                </div>
            </div>

            <hr className="border-t-2 border-[#DFE5F1] my-4 mx-4" />

            {/* Agenda */}
            <BotaoPadrao
                caminho={"/paciente/agenda"}
                className={"!items-start text-[16px] !justify-start mt-[10px]"}
                color="bg-white"
                texto="Agenda"
                textoColor="text-black"
                icone={<CalendarDays />}
                iconeColor={"text-black"}
                active={telaAtiva === "agenda"}
            />

            {/* Emoções */}
            <BotaoPadrao
                caminho={"/paciente/calendarioEmocoes"}
                className={"!items-start text-[16px] !justify-start mt-[10px]"}
                color="bg-white"
                texto="Emoções"
                textoColor="text-black"
                icone={<Smile/>}
                iconeColor="text-black"
                active={telaAtiva === "emoçoes"}
            />

            {/* Meu perfil */}
            <BotaoPadrao
                caminho={"/paciente/perfil"}
                className={"!items-start text-[16px] !justify-start mt-[10px]"}
                color="bg-white"
                texto="Meu perfil"
                textoColor="text-black"
                icone={<User/>}
                iconeColor="text-black"
                active={telaAtiva === "perfil"}
            />

            <div className="mt-auto flex flex-col items-center px-4 mb-8">

                <BotaoPadrao
                    caminho={"/paciente/agendarConsulta"}
                    color="bg-[#0088A3]"
                    className="text-[16px] w-full min-w-[180px] whitespace-nowrap mt-2 hover:brightness-90"
                    texto="Agendar consulta"
                    icone={<img className="w-[29px] mr-1" src={BotaoAdd} alt="Icon +" />}
                />
            </div>
        </div>
    );
}
