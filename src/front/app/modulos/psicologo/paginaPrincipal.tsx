import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";

export default function Agenda() {
    const [semanaAtual, setSemanaAtual] = useState(0);
    const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const datas = ["02", "03", "04", "05", "06", "07"];
    const horas = [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
    ];

    return (
        <Main>
            <div className="flex min-h-screen bg-white">
                <MenuLateralPsicólogo telaAtiva="agenda" />
                <div className="w-px bg-gray-300"></div>

                <div className="flex-1 p-5 overflow-visible">

                    <div className="flex items-center justify-between mt-5 mb-4">
                        <h1 className="text-[20px] font-semibold text-[#161736] ml-1">Minha Agenda</h1>
                    </div>

                    {/* Navegação da semana */}
                    <div className="flex items-center justify-between mb-4">
                        {/* Esquerda: Data + Setinhas */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#8C9BB0] ml-2">02 - 08 Março</span>

                            <div className="flex gap-1">
                                <button
                                    onClick={() => setSemanaAtual((s) => s - 1)}
                                    className="p-2 bg-[#F3F4F8] rounded-md cursor-pointer hover:brightness-95"
                                >
                                    <ChevronLeft size={20} className="text-[#858585]" />
                                </button>
                                <button
                                    onClick={() => setSemanaAtual((s) => s + 1)}
                                    className="p-2 bg-[#F3F4F8] rounded-md cursor-pointer hover:brightness-95"
                                >
                                    <ChevronRight size={20} className="text-[#858585]" />
                                </button>
                            </div>
                        </div>

                        {/* Direita: Botão editar */}
                        <button className="bg-[#ADD9E2] text-[#0088A3] cursor-pointer
                        px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 hover:brightness-95">
                            <EditIcon style={{ fontSize: 18, color: "#0088A3" }} />
                            Editar agenda
                        </button>
                    </div>

                    {/* Grade da agenda */}
                    <div className="grid grid-cols-[60px_repeat(6,1fr)] gap-0 bg-[#FAFAFC] rounded-xl overflow-hidden text-xs pr-4 pb-4">
                        {/* Cabeçalho dos dias */}
                        <div className="bg-[#FAFAFC]"></div>
                        {dias.map((dia, idx) => (
                            <div
                                key={`dia-${idx}`}
                                className="bg-[#FAFAFC] py-2 text-center font-semibold text-[#858585] mt-2"
                            >
                                {dia}
                            </div>
                        ))}

                        {/* Datas dos dias da semana */}
                        <div className="bg-[#FAFAFC]"></div>
                        {datas.map((data, idx) => (
                            <div
                                key={`data-${idx}`}
                                className="bg-[#FAFAFC] pb-2 text-center text-sm font-medium text-[#161736]"
                            >
                                {data}
                            </div>
                        ))}

                        {/* Linhas da grade */}
                        {horas.map((hora, i) => (
                            <>
                                <div
                                    key={`hora-${i}`}
                                    className="text-xs font-medium text-[#161736] bg-[#FAFAFC] px-2 py-4 ml-1.5"
                                >
                                    {hora}
                                </div>
                                {dias.map((_, j) => (
                                    <div
                                        key={`${i}-${j}`}
                                        className={`
                        bg-[#FAFAFC] h-16 border-t border-l border-[#EFEFF1]
                        hover:brightness-97 cursor-pointer p-2
                        ${j === dias.length - 1 ? 'border-r' : ''}
                        ${i === horas.length - 1 ? 'border-b' : ''}
                    `}
                                    >
                                        {/* Aqui vão os agendamentos */}
                                    </div>
                                ))}
                            </>
                        ))}
                    </div>
                </div>

                {/* Painel lateral (Resumo Diário com calendário e atendimentos) */}
                <div className="w-[300px] border-l border-gray-200 bg-white shadow px-4 py-6 relative flex flex-col">

                    {/* Botão Sair no canto superior direito */}
                    <button className="absolute top-6 right-6 flex items-center gap-2 text-gray-600 hover:text-black cursor-pointer">
                        <img className="w-[20px]" src={ExitIcon} alt="Sair" />
                        <span className="text-sm font-medium">Sair</span>
                    </button>

                    {/* Calendário estático */}
                    <div className="mt-15">
                        <div className="flex items-center justify-between text-lg font-semibold text-[#7D8DA6] mb-4 px-1">
                            {/* Mês alinhado à esquerda */}
                            <span>Maio 2025</span>
                            {/* Setas de navegação alinhadas à direita */}
                            <div className="flex gap-1 mb-4">
                                <button className="p-1 hover:text-[#161736] cursor-pointer">
                                    <ChevronLeft size={24} />
                                </button>
                                <button className="p-1 hover:text-[#161736] cursor-pointer">
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-x-3 text-[12px] text-[#161736] font-semibold mb-1">
                            <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
                        </div>
                        <div className="grid grid-cols-7 text-[13px] font-medium gap-y-1.5 text-[#161736]">
                            {Array.from({ length: 31 }, (_, i) => {
                                const dia = i + 1;
                                const isSelected = dia >= 23 && dia <= 27;
                                return (
                                    <span
                                        key={dia}
                                        className={`py-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                                            isSelected ? 'bg-[#0088A3] text-white font-semibold' : ''
                                        }`}>{dia}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* Consultas do dia */}
                    <div className="mt-8">
                        <h2 className="text-base font-bold text-[#161736] mb-4">Consultas do dia</h2>

                        {[
                            { nome: "Fernanda Oliveira", hora: "09:00", img: "https://randomuser.me/api/portraits/women/1.jpg" },
                            { nome: "Diego Cardoso", hora: "10:00", img: "https://randomuser.me/api/portraits/men/2.jpg" },
                            { nome: "Rafael Nogueira", hora: "14:00", img: "https://randomuser.me/api/portraits/men/3.jpg" },
                            { nome: "Tatiane Ribeiro", hora: "16:00", img: "https://randomuser.me/api/portraits/women/4.jpg" },
                        ].map((cliente, idx) => (
                            <div key={idx} className="flex items-center bg-[#EDF0F5] rounded-lg px-3 py-2 mb-2">
                                <img src={cliente.img} alt={cliente.nome} className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <p className="font-medium text-sm text-[#161736]">{cliente.nome}</p>
                                    <p className="text-xs text-[#8C9BB0] flex items-center gap-1">
                                        <span className="w-2 h-2 bg-[#F79824] rounded-full inline-block"></span> {cliente.hora}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Main>
    );
}