import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import ExitIcon from "../../../public/assets/ExitIcon.png"
import BotaoPadrao from "~/componentes/BotaoPadrao";
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import PerfilUser from "../../../public/assets/PerfilUser.jpg";
import MenuIcon from "@mui/icons-material/Menu";
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import PainelLateralEmocao from "~/componentes/PainelLateralEmocao";
import { iconesEmocoes } from "~/componentes/IconesEmocoes";

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
import {ChevronLeft, ChevronRight} from "lucide-react";


interface Usuario {
    id?: number;
    nome: string;
    email: string;
}

interface Paciente {
    usuario: Usuario;
}

interface EventoEmocao {
    id: number;
    paciente: Paciente;
    data: string;
    hora: string;
    tipoEmocao: {
        nome: string;
        icone: string;
    };
    sentimento: string;
    notas: string;
}

export default function CalendarioEmocoes() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [menuAberto, setMenuAberto] = useState(false);
    const [dataBase, setDataBase] = useState(new Date());
    const [mesLateral, setMesLateral] = useState(new Date());
    const [visualizacao, setVisualizacao] = useState<View>("week");
    const [eventoSelecionado, setEventoSelecionado] = useState<EventoEmocao | null>(null);
    const [paciente, setPaciente] = useState<Paciente>({ usuario: { nome: "", email: "" } });
    const [eventos, setEventos] = useState<Array<{
        start: Date;
        end: Date;
        emocao: string;
        original: EventoEmocao;
    }>>([]);

    // Buscar paciente
    useEffect(() => {
        if (!id) return;
        axios.get(`http://localhost:8080/pacientes/${id}`).then(res => {
            setPaciente({ usuario: res.data.usuario });
        });
    }, [id]);

    // Buscar eventos emocionais do paciente
    useEffect(() => {
        if (!id) return;
        if (!paciente.usuario.nome) return;  // espera paciente carregado

        axios.get(`http://localhost:8080/api/emocoes/paciente/${id}`).then(res => {
            console.log('Resposta bruta da API:', res.data);
            const eventosTransformados = res.data.map((e: any) => {
                console.log('Evento recebido:', e);
                // parse datas
                const [ano, mes, dia] = e.data.split('-').map(Number);
                const [hora, minuto] = e.hora.split(':').map(Number);

                const inicio = new Date(ano, mes - 1, dia, hora, minuto);
                const fim = new Date(inicio.getTime() + 60 * 60 * 1000);

                console.log("Evento montado:", {
                    id: e.id,
                    start: inicio.toString(),
                    iso: inicio.toISOString(),
                    data: e.data,
                    hora: e.hora
                });


                // monta evento usando paciente do estado
                const evento: EventoEmocao = {
                    id: e.id,
                    paciente: paciente,  // usa o paciente atual
                    data: e.data,
                    hora: e.hora,
                    tipoEmocao: {
                        nome: e.tipoEmocaoNome,
                        icone: e.tipoEmocaoNome,
                    },
                    sentimento: e.sentimento,
                    notas: e.notas
                };

                return {
                    start: inicio,
                    end: fim,
                    emocao: e.tipoEmocaoNome.toLowerCase(),
                    original: evento,
                };
            });
            setEventos(eventosTransformados);
        });
    }, [id, paciente]);

    // Função de clique em evento do calendário
    const aoSelecionarEvento = (event: any) => {
        const e = event.original;
        setEventoSelecionado(e);
    };

    {/* Ajustar menu lateral internoabrindo e fechando */}
    type BotaoLateralProps = {
        icone: React.ReactNode;
        texto: string;
        visivel: boolean;
        ativo?: boolean;
        onClick?: () => void;
    };

    const BotaoLateral: React.FC<BotaoLateralProps> = ({ icone, texto, visivel, ativo = false, onClick }) => {
        return (
            <button
                onClick={onClick}
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
        sessionStorage.removeItem("sessionData");
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
                                            {paciente?.usuario?.nome || ""}
                                        </h2>
                                        <p className="text-xs text-[#5A607F]">{paciente?.usuario?.email || ""}</p>
                                        <p className="text-xs text-gray-400">Última consulta - 12/02/2025</p>
                                    </>
                                )}
                            </div>

                            {/* Menu de botões */}
                            <div className="mt-6 flex flex-col gap-3 w-full">
                                <BotaoLateral
                                    onClick={() => navigate(`/psicologo/pacientes/${id}`)}
                                    icone={<PersonIcon style={{ color: "#858EBD" }} />}
                                    texto="Informações Pessoais"
                                    visivel={menuAberto}
                                />
                                <BotaoLateral
                                    onClick={() => navigate(`/psicologo/gestaoRegistros/${id}`)}
                                    icone={<HistoryIcon style={{ color: "#858EBD" }} />}
                                    texto="Histórico de Consultas"
                                    visivel={menuAberto}
                                />
                                <BotaoLateral
                                    onClick={() => navigate(`/psicologo/estatisticasEmocoes/${id}`)}
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
                                    onSelectEvent={(event) => {
                                        setEventoSelecionado(event.original);
                                    }}
                                />
                            </div>
                        </div>
                        {eventoSelecionado && (
                            <PainelLateralEmocao
                                evento={eventoSelecionado}
                                onClose={() => setEventoSelecionado(null)}
                            />
                        )}

                    </div>
                </div>
            </div>
        </Main>
    )
}