import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import ExitIcon from "../../../public/assets/ExitIcon.png"
import BotaoPadrao from "~/componentes/BotaoPadrao";
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { useEffect, useState } from "react";
import PerfilUser from "../../../public/assets/PerfilUser.jpg";
import MenuIcon from "@mui/icons-material/Menu";
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';

//Imports da agenda
import localizer from "~/utils/calendarConfig";
import {Calendar, Views, momentLocalizer, type HeaderProps} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "~/estilos/customCalendarEmocoes.css";
import CustomToolbar from "~/componentes/CustomToolbar";
import { format, startOfWeek, endOfWeek} from "date-fns";
import { ptBR } from "date-fns/locale";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, isSameMonth, isToday } from "date-fns";
import type { View } from "react-big-calendar";
import {useNavigate} from "react-router";
import {ChevronLeft, ChevronRight} from "lucide-react";


export default function CalendarioEmocoes() {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);
    const [dataBase, setDataBase] = useState(new Date());
    const [mesLateral, setMesLateral] = useState(new Date());
    const [visualizacao, setVisualizacao] = useState<View>("week");

    {/* Ajustar menu lateral internoabrindo e fechando */}
    type BotaoLateralProps = {
        icone: React.ReactNode;
        texto: string;
        visivel: boolean;
        ativo?: boolean;
    };

    const BotaoLateral: React.FC<BotaoLateralProps> = ({ icone, texto, visivel, ativo = false }) => {
        return (
            <button
                className={`cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg w-full
                ${ativo && visivel ? "bg-white shadow-md text-[#2B2F42]" : ""}
                ${!ativo ? "hover:bg-gray-100 text-[#2B2F42]" : ""}
                `}
            >
                <div
                    className={`rounded-md p-1 ${
                        ativo ? "bg-[#0088A3]" : "bg-[#F4F7FF]"
                    }`}
                >
                    {icone}
                </div>
                {visivel && (
                    <span
                        className={`text-sm ${
                            ativo ? "font-medium" : "font-regular"
                        } whitespace-nowrap`}
                    >
                    {texto}
                </span>
                )}
            </button>
        );
    };

    {/* Partes do Calendário */}
    const proximaSemana = () => {
        const novaData = new Date(dataBase);
        novaData.setDate(novaData.getDate() + 7);
        setDataBase(novaData);
    };

    const semanaAnterior = () => {
        const novaData = new Date(dataBase);
        novaData.setDate(novaData.getDate() - 7);
        setDataBase(novaData);
    };

    function formatarIntervaloSemana(data: Date) {
        const inicio = startOfWeek(data, { weekStartsOn: 1 });
        const fim = endOfWeek(data, { weekStartsOn: 1 });

        const diaInicio = format(inicio, "dd", { locale: ptBR });
        const diaFim = format(fim, "dd", { locale: ptBR });
        const mes = format(fim, "MMMM", { locale: ptBR });

        const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);

        return `${diaInicio} - ${diaFim} de ${mesCapitalizado}`;
    }

    // Eventos
    const eventos = [
        { start: new Date(2025, 4, 26, 9, 0), end: new Date(2025, 4, 26, 10, 0), emocao: "feliz" },
        { start: new Date(2025, 4, 27, 8, 0), end: new Date(2025, 4, 27, 9, 0), emocao: "neutro" },
        { start: new Date(2025, 4, 27, 15, 0), end: new Date(2025, 4, 27, 16, 0), emocao: "raiva" },
        { start: new Date(2025, 4, 27, 9, 0), end: new Date(2025, 4, 27, 10, 0), emocao: "feliz" },
        { start: new Date(2025, 4, 27, 11, 0), end: new Date(2025, 4, 27, 12, 0), emocao: "triste" },
        { start: new Date(2025, 4, 27, 14, 0), end: new Date(2025, 4, 27, 15, 0), emocao: "neutro" },
        { start: new Date(2025, 4, 28, 8, 0), end: new Date(2025, 4, 28, 9, 0), emocao: "feliz" },
        { start: new Date(2025, 4, 28, 13, 30), end: new Date(2025, 4, 28, 14, 30), emocao: "raiva" },
        { start: new Date(2025, 4, 28, 16, 0), end: new Date(2025, 4, 28, 17, 0), emocao: "neutro" },
        { start: new Date(2025, 4, 29, 10, 0), end: new Date(2025, 4, 29, 11, 0), emocao: "triste" },
        { start: new Date(2025, 4, 29, 14, 0), end: new Date(2025, 4, 29, 15, 0), emocao: "feliz" },
        { start: new Date(2025, 4, 30, 11, 0), end: new Date(2025, 4, 30, 12, 0), emocao: "neutro" },
        { start: new Date(2025, 4, 31, 8, 30), end: new Date(2025, 4, 31, 9, 30), emocao: "triste" },
        { start: new Date(2025, 4, 31, 15, 0), end: new Date(2025, 4, 31, 16, 0), emocao: "feliz" },
        { start: new Date(2025, 5, 1, 9, 0), end: new Date(2025, 5, 1, 10, 0), emocao: "neutro" },
        { start: new Date(2025, 5, 1, 13, 0), end: new Date(2025, 5, 1, 14, 0), emocao: "raiva" },
        { start: new Date(2025, 5, 2, 10, 30), end: new Date(2025, 5, 2, 11, 30), emocao: "feliz" },
        { start: new Date(2025, 5, 2, 15, 30), end: new Date(2025, 5, 2, 16, 30), emocao: "triste" },
        { start: new Date(2025, 4, 28, 1, 0), end: new Date(2025, 4, 28, 2, 0), emocao: "triste" },
        { start: new Date(2025, 4, 28, 14, 30), end: new Date(2025, 4, 28, 15, 30), emocao: "feliz" },
        { start: new Date(2025, 4, 28, 20, 0), end: new Date(2025, 4, 28, 21, 0), emocao: "raiva" },
        { start: new Date(2025, 4, 29, 5, 0), end: new Date(2025, 4, 29, 6, 0), emocao: "neutro" },
        { start: new Date(2025, 4, 29, 19, 0), end: new Date(2025, 4, 29, 20, 0), emocao: "feliz" },
        { start: new Date(2025, 4, 30, 0, 0), end: new Date(2025, 4, 30, 1, 0), emocao: "raiva" },
        { start: new Date(2025, 4, 30, 8, 0), end: new Date(2025, 4, 30, 9, 0), emocao: "feliz" },
        { start: new Date(2025, 4, 30, 18, 30), end: new Date(2025, 4, 30, 19, 30), emocao: "triste" },
        { start: new Date(2025, 4, 31, 3, 0), end: new Date(2025, 4, 31, 4, 0), emocao: "neutro" },
    ];

    const MeuEvento = ({ event }) => {
        let Icone;
        let corFundo;

        switch (event.emocao) {
            case "feliz":
                Icone = <SentimentVerySatisfiedIcon style={{ color: "white", fontSize: 20 }} />;
                corFundo = "bg-[#4E9B1E]";
                break;
            case "triste":
                Icone = <SentimentDissatisfiedIcon style={{ color: "white", fontSize: 20 }} />;
                corFundo = "bg-[#55B3EE]";
                break;
            case "neutro":
                Icone = <SentimentNeutralIcon style={{ color: "white", fontSize: 20 }} />;
                corFundo = "bg-yellow-400";
                break;
            case "raiva":
                Icone = <SentimentVeryDissatisfiedIcon style={{ color: "white", fontSize: 20 }} />;
                corFundo = "bg-[#DC0606]";
                break;
            default:
                Icone = null;
                corFundo = "bg-gray-300";
        }

        const horario = format(new Date(event.start), "HH:mm");

        return (
            <div className={`w-full h-full flex items-center justify-center gap-2 text-white text-sm ${corFundo}`}>
                {Icone}
                {horario}
            </div>
        );
    };

    // Componente interno para customizar header do calendário principal
    const CustomHeader: React.FC<HeaderProps> = ({ date }) => {
        const weekday = format(date, "EEE", { locale: ptBR }); // ex: seg
        const dayNumber = format(date, "d", { locale: ptBR }); // ex: 27
        const isCurrentDay = isToday(date);

        const textColor = isCurrentDay ? "#F58020" : "#858585";

        return (
            <div style={{ textAlign: "center", lineHeight: 1.2 }}>
                <div style={{ fontSize: "0.75rem", color: textColor, fontWeight: 600 }}>
                    {weekday}
                </div>
                <div style={{ fontSize: "0.85rem", color: textColor, fontWeight: 600 }}>{dayNumber}</div>
            </div>
        );
    };

    //Funcao Sair
    function leave() {
        sessionStorage.removeItem("sessaoPsicologo");
        sessionStorage.removeItem("sessaoPaciente");
        navigate("/")
    }

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
                            className="ml-auto hover:text-black transition-colors duration-200 font-medium cursor-pointer"
                            texto="Sair"
                            textoColor="text-gray-600"
                            icone={<img className=" w-[26px] " src={ExitIcon} alt="Sair" />}
                            handleClick={leave}
                        />
                    </div>
                    <hr className="border-t-2 border-[#DFE5F1] my-2"/>
                    <h1 className="pt-4 font-semibold text-black mx-2 text-[20px]">Gestão de Pacientes</h1>

                    <div className="mx-1 mt-4 flex gap-7">
                        {/* Painel lateral do paciente */}
                        <div className={`flex flex-col px-2 py-3 transition-all duration-300 ${menuAberto ? "w-64" : "w-16"}`}>
                            {/* Botão de alternância */}
                            <button
                                onClick={() => setMenuAberto(!menuAberto)}
                                className="mb-4 self-end cursor-pointer mr-1"
                                title="Expandir/recolher menu"
                            >
                                <MenuIcon style={{ color: "#858EBD" }} />
                            </button>

                            {/* Perfil */}
                            <div className={`flex flex-col items-center ${menuAberto ? "items-start text-left px-4" : "text-center"}`}>
                                <div className={`flex ${menuAberto ? "items-start" : "justify-center"} pl-1`}>
                                    <img
                                        src={PerfilUser}
                                        alt="Foto do Paciente"
                                        className="rounded-full w-10 h-10 object-cover"
                                        style={{ marginLeft: menuAberto ? "0" : "12px" }} // ajuste fino
                                    />
                                </div>

                                {menuAberto && (
                                    <>
                                        <h2 className="mt-2 font-semibold text-sm text-[#3A3F63]">
                                            Nome do Paciente
                                        </h2>
                                        <p className="text-xs text-[#5A607F]">email@gmail.com</p>
                                        <p className="text-xs text-gray-400">Última consulta - 12/02/2025</p>
                                    </>
                                )}
                            </div>

                            {/* Menu de botões */}
                            <div className="mt-6 flex flex-col gap-3 w-full">
                                <BotaoLateral
                                    icone={<PersonIcon style={{ color: "#858EBD" }} />}
                                    texto="Informações Pessoais"
                                    visivel={menuAberto}
                                />
                                <BotaoLateral
                                    icone={<HistoryIcon style={{ color: "#858EBD" }} />}
                                    texto="Histórico de Consultas"
                                    visivel={menuAberto}
                                />
                                <BotaoLateral
                                    icone={<BarChartIcon style={{ color: "#858EBD" }} />}
                                    texto="Estatísticas das Emoções"
                                    visivel={menuAberto}
                                />
                                <BotaoLateral
                                    icone={<SentimentVerySatisfiedIcon style={{ color: "white" }} />}
                                    texto="Calendário de Emoções"
                                    visivel={menuAberto}
                                    ativo
                                />
                            </div>
                        </div>

                        {/* Conteúdo principal do calendário */}
                        <div className="flex-1">

                            {/* Cabeçalho com intervalo da semana + setas */}
                            <div className="flex items-center justify-between mb-4 mt-4">
                                <div className="flex items-center gap-2 ml-2">
                                  <span className="text-sm font-medium text-[#8C9BB0]">
                                    {formatarIntervaloSemana(dataBase)}
                                  </span>

                                    <button
                                        onClick={semanaAnterior}
                                        className="p-2 bg-[#F3F4F8] rounded-md cursor-pointer hover:brightness-95"
                                    >
                                        <ChevronLeft size={20} className="text-[#858585]" />
                                    </button>
                                    <button
                                        onClick={proximaSemana}
                                        className="p-2 bg-[#F3F4F8] rounded-md cursor-pointer hover:brightness-95"
                                    >
                                        <ChevronRight size={20} className="text-[#858585]" />
                                    </button>
                                </div>
                            </div>

                            {/* Grade da agenda */}
                            <div className="rounded-xl bg-[#FAFAFC] pb-7 pl-5 pr-6">
                                {visualizacao === "day" && (
                                    <button
                                        onClick={() => {
                                            setVisualizacao("week");
                                            setDataBase(new Date());
                                        }}
                                        className="mt-3 text-sm text-[#0088A3] hover:font-medium cursor-pointer transition"
                                    >
                                        ← Voltar para a semana
                                    </button>
                                )}

                                <Calendar
                                    localizer={localizer}
                                    culture="pt-BR"
                                    events={eventos}
                                    step={60}
                                    timeslots={1}
                                    min={new Date(0, 0, 0, 0, 0)}
                                    max={new Date(0, 0, 0, 23, 0)}
                                    startAccessor="start"
                                    endAccessor="end"
                                    defaultView={Views.WEEK}
                                    views={["week", "day", "agenda"]}
                                    style={{ height: "78vh" }}
                                    components={{
                                        toolbar: CustomToolbar,
                                        header: CustomHeader,
                                        event: MeuEvento,
                                    }}
                                    messages={{
                                        week: "Semana",
                                        day: "Dia",
                                        agenda: "Agenda",
                                        today: "Hoje",
                                        previous: "Anterior",
                                        next: "Próxima",
                                    }}
                                    date={dataBase}
                                    onNavigate={(novaData) => setDataBase(novaData)}
                                    view={visualizacao}
                                    onView={(view) => setVisualizacao(view)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    )
}