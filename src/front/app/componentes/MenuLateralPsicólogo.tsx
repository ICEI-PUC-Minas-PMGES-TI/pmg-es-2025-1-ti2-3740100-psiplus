import { useState, useEffect } from "react";
import axios from "axios";
import IconPsiPlus from "../../public/assets/IconPsiPlus.png";
import PerfilUser from "../../public/assets/PerfilUser.jpg";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import IconAgendas from "../../public/assets/IconAgenda.png";
import IconPacientes from "../../public/assets/IconPacientes.png";
import BotaoAdd from "../../public/assets/BotaoAdd.png";
import { CalendarDays, ChartColumn, Users, Menu as MenuIcon, X as CloseIcon } from "lucide-react";

type MenuLateralPsicologoProps = {
    telaAtiva: "agenda" | "pacientes" | "estatistica";
};

export default function MenuLateralPsicologo({ telaAtiva }: MenuLateralPsicologoProps) {
    const [nome, setNome] = useState("Carregando...");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const sessionDataRaw = sessionStorage.getItem("sessionData");

        if (sessionDataRaw) {
            const sessionData = JSON.parse(sessionDataRaw);
            setNome(sessionData.nome);
            return;
        }

        const sessao = sessionStorage.getItem("sessaoPsicologo");
        if (!sessao) return;

        const { usuarioId } = JSON.parse(sessao);

        axios
            .get(`http://localhost:8080/psicologos/${usuarioId}`)
            .then((res) => {
                const usuario = res.data.usuario || {};
                const nomeDoUsuario = usuario.nome || "Nome não encontrado";
                const emailDoUsuario = usuario.email || "Email não encontrado";

                const sessionData = { nome: nomeDoUsuario, email: emailDoUsuario };
                sessionStorage.setItem("sessionData", JSON.stringify(sessionData));

                setNome(nomeDoUsuario);
            })
            .catch((err) => {
                console.error("Erro ao buscar psicólogo:", err);
                setNome("Erro ao carregar nome");
            });
    }, []);

    // Responsivo: mostra menu lateral em telas médias/grandes, drawer em telas pequenas
    return (
        <>
            {/* Botão de menu para mobile */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow"
                onClick={() => setOpen(true)}
                aria-label="Abrir menu"
            >
                <MenuIcon size={28} />
            </button>

            {/* Overlay para mobile */}
            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Menu lateral */}
            <div
                className={`
                    fixed top-0 left-0 h-full z-50 bg-white transition-transform duration-300
                    w-64 md:static md:w-1/6 md:translate-x-0
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                    flex flex-col
                `}
            >
                {/* Botão fechar para mobile */}
                <div className="md:hidden flex justify-end p-4">
                    <button onClick={() => setOpen(false)} aria-label="Fechar menu">
                        <CloseIcon size={28} />
                    </button>
                </div>

                <div className="flex mt-[10px] px-4">
                    <img className="w-[41px] h-[48px]" src={IconPsiPlus} alt="Logo" />
                    <h1 className="text-[20px] pt-[15px] pl-[5px] font-bold">Psi+</h1>
                </div>

                <div className="flex pt-[10px] mt-[10px] px-4">
                    <img className="w-[36px] h-[36px] rounded-full" src={PerfilUser} />
                    <div className="text-[14px] pl-[5px]">
                        <h1>{nome}</h1>
                        <h1 className="text-[#BBC6D9]">Psicólogo</h1>
                    </div>
                </div>

                <hr className="border-t-2 border-[#DFE5F1] my-4 mx-4" />

                {/* Agenda */}
                <BotaoPadrao
                    caminho={"/psicologo/agenda"}
                    className={"!items-start text-[16px] !justify-start mt-[10px]"}
                    color="bg-white"
                    texto="Agenda"
                    textoColor="text-black"
                    icone={<CalendarDays />}
                    iconeColor={"text-black"}
                    active={telaAtiva === "agenda"}
                />

                {/* Pacientes */}
                <BotaoPadrao
                    caminho={"/psicologo/pacientes"}
                    className={"!items-start text-[16px] !justify-start mt-[10px]"}
                    color="bg-white"
                    texto="Pacientes"
                    textoColor="text-black"
                    icone={<Users />}
                    iconeColor="text-black"
                    active={telaAtiva === "pacientes"}
                />

                {/* Estatisticas */}
                <BotaoPadrao
                    caminho={"/psicologo/estatisticasPacientes"}
                    className={"!items-start text-[16px] !justify-start mt-[10px]"}
                    color="bg-white"
                    texto="Estatisticas"
                    textoColor="text-black"
                    icone={<ChartColumn />}
                    active={telaAtiva === "estatistica"}
                />

                <div className="mt-auto flex flex-col items-center px-4 mb-8">
                    <BotaoPadrao
                        caminho={"/psicologo/cadastroPacientes"}
                        color="bg-[#034B57]"
                        className="text-[16px] w-full min-w-[180px] whitespace-nowrap hover:brightness-90"
                        texto="Novo paciente"
                        icone={<img className="w-[29px] mr-1" src={BotaoAdd} alt="Icon +" />}
                    />
                    <BotaoPadrao
                        caminho={"/psicologo/agendarConsulta"}
                        color="bg-[#0088A3]"
                        className="text-[16px] w-full min-w-[180px] whitespace-nowrap mt-2 hover:brightness-90"
                        texto="Nova consulta"
                        icone={<img className="w-[29px] mr-1" src={BotaoAdd} alt="Icon +" />}
                    />
                </div>
            </div>
        </>
    );
}