import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import { useState } from "react";

//imports de icons
import { ChevronLeft, ChevronRight } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";

//Imports da agenda
import localizer from "~/utils/calendarConfig";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "~/estilos/customCalendar.css";
import CustomToolbar from "~/componentes/CustomToolbar";
import { format, startOfWeek, endOfWeek} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { HeaderProps } from './Header';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, isSameMonth, isToday } from "date-fns";
import type { View } from "react-big-calendar";


export default function Agenda() {
    const [dataBase, setDataBase] = useState(new Date());
    const [mesLateral, setMesLateral] = useState(new Date()); // NOVO: controla o mês no calendário lateral

    // Funções para mudar de semana
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
        {
            title: "Fernanda Oliveira",
            start: new Date(2025, 4, 26, 9, 0),
            end: new Date(2025, 4, 26, 10, 0),
        },
        {
            title: "Diego Cardoso",
            start: new Date(2025, 4, 30, 10, 0),
            end: new Date(2025, 4, 30, 11, 0),
        },
        {
            title: "Ana Carolina",
            start: new Date(2025, 4, 27, 8, 0),
            end: new Date(2025, 4, 27, 9, 0),
        },
        {
            title: "Pedro Coimbra",
            start: new Date(2025, 4, 27, 15, 0),
            end: new Date(2025, 4, 27, 16, 0),
        },
    ];


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

    const MeuEvento = ({ event }) => (
        <div>{event.title}</div> // Exibe só o nome
    );


    //Calendário lateral
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [visualizacao, setVisualizacao] = useState<View>("week");

    const diasDoMes = eachDayOfInterval({
        start: startOfWeek(startOfMonth(mesLateral), { weekStartsOn: 0 }), // Domingo anterior ou do dia 1
        end: endOfWeek(endOfMonth(mesLateral), { weekStartsOn: 0 }), // Sábado após ou do último dia do mês
    });

    // Consultas do dia selecionado
    const consultasDoDia = eventos.filter((evento) =>
        isSameDay(evento.start, dataSelecionada)
    );



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
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#8C9BB0] ml-2">
                                {formatarIntervaloSemana(dataBase)}
                            </span>

                            <div className="flex gap-1">
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

                        {/* Direita: Botão editar */}
                        <button className="bg-[#ADD9E2] text-[#0088A3] cursor-pointer
                        px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 hover:brightness-95">
                            <EditIcon style={{ fontSize: 18, color: "#0088A3" }} />
                            Editar agenda
                        </button>
                    </div>

                    {/* Grade da agenda */}
                    <div className="rounded-xl bg-[#FAFAFC] pb-7 pl-5 pr-6">
                        {/* BOTÃO PARA VOLTAR À VISUALIZAÇÃO SEMANAL */}
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
                            startAccessor="start"
                            endAccessor="end"
                            defaultView={Views.WEEK}
                            views={["week", "day", "agenda"]}
                            style={{ height: "78vh" }}
                            components={{
                                toolbar: CustomToolbar,
                                header: CustomHeader,
                                event: MeuEvento
                            }}
                            messages={{
                                week: "Semana",
                                day: "Dia",
                                agenda: "Agenda",
                                today: "Hoje",
                                previous: "Anterior",
                                next: "Próxima",
                            }}
                            date={dataBase} //Controla a semana visível
                            onNavigate={(novaData) => setDataBase(novaData)}
                            view={visualizacao}
                            onView={(view) => setVisualizacao(view)}
                        />

                    </div>
                </div>

                {/* Painel lateral (Resumo Diário com calendário e atendimentos) */}
                <div className="w-[300px] border-l border-gray-200 bg-white shadow px-4 py-6 relative flex flex-col">

                    {/* Botão Sair no canto superior direito */}
                    <button className="absolute top-6 right-6 flex items-center gap-2 text-gray-600 hover:text-black cursor-pointer">
                        <img className="w-[20px]" src={ExitIcon} alt="Sair" />
                        <span className="text-sm font-medium">Sair</span>
                    </button>

                    {/* Calendário dinâmico */}
                    <div className="mt-15">
                        <div className="flex items-center justify-between text-lg font-semibold text-[#7D8DA6] mb-4 px-1">
                            <span>{(() => {
                                const mes = format(mesLateral, "MMMM yyyy", { locale: ptBR });
                                return mes.charAt(0).toUpperCase() + mes.slice(1);
                            })()}</span>
                            <div className="flex gap-1 mb-4">
                                <button
                                    className="p-1 hover:text-[#161736] cursor-pointer"
                                    onClick={() => setMesLateral(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    className="p-1 hover:text-[#161736] cursor-pointer"
                                    onClick={() => setMesLateral(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Dias da semana */}
                        <div className="grid grid-cols-7 gap-x-3 text-[12px] text-[#161736] font-semibold mb-1">
                            <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
                        </div>

                        {/* Dias do mês */}
                        <div className="grid grid-cols-7 text-[13px] font-medium gap-y-1.5 text-[#161736]">
                            {diasDoMes.map((dia, idx) => {
                                const isSelecionado = isSameDay(dia, dataSelecionada);
                                const isHoje = isToday(dia);

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setDataSelecionada(dia);
                                            setDataBase(dia); // também atualiza o calendário principal
                                        }}
                                        className={`py-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto transition cursor-pointer
                        ${isSelecionado ? 'bg-[#0088A3] text-white font-semibold' : isHoje ? 'text-[#F58020]' : ''}
                        ${!isSameMonth(dia, mesLateral) ? 'text-gray-400' : ''}
                    `}
                                    >
                                        {format(dia, 'd')}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Consultas do dia */}
                        <div className="mt-8">
                            <h2 className="text-base font-bold text-[#161736] mb-4">
                                Consultas do dia
                            </h2>

                            {consultasDoDia.length === 0 ? (
                                <p className="text-sm text-[#8C9BB0]">Nenhuma consulta</p>
                            ) : (
                                consultasDoDia.map((consulta, idx) => (
                                    <div key={idx} className="flex items-center bg-[#EDF0F5] rounded-lg px-3 py-2 mb-2">
                                        <div className="w-10 h-10 bg-[#ADD9E2] rounded-full mr-3 flex items-center justify-center font-bold text-[#0088A3]">
                                            {consulta.title.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-[#161736]">
                                                {consulta.title}
                                            </p>
                                            <p className="text-xs text-[#8C9BB0] flex items-center gap-1">
                                                <span className="w-2 h-2 bg-[#F79824] rounded-full inline-block"></span>
                                                {format(consulta.start, "HH:mm")}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
        </Main>
    );
}