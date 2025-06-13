import Main from "~/componentes/Main";
import MenuLateralPaciente from "~/componentes/MenuLateralPaciente";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import React, {useEffect, useState} from "react";

//imports de icons
import { ChevronLeft, ChevronRight } from "lucide-react";

//Imports da agenda
import localizer from "~/utils/calendarConfig";
import {Calendar, Views, momentLocalizer, type HeaderProps} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "~/estilos/customCalendar.css";
import CustomToolbar from "~/componentes/CustomToolbar";
import { format, startOfWeek, endOfWeek} from "date-fns";
import { ptBR } from "date-fns/locale";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, isSameMonth, isToday } from "date-fns";
import type { View } from "react-big-calendar";
import {useNavigate} from "react-router";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import {listarExcecoesDisponibilidade} from "~/lib/disponibilidadeExcecoes";
import axios from "axios";

export function AgendaPaciente(){

    const navigate = useNavigate();

    const [dataBase, setDataBase] = useState(new Date());
    const [mesLateral, setMesLateral] = useState(new Date());
    const [excecoes, setExcecoes] = useState<any[]>([]);
    const [pacienteId, setPacienteId] = useState<number | null>(null);
    const [consultas, setConsultas] = useState([]);
    const [disponiveis, setDisponiveis] = useState([]);

    useEffect(() => {
        const sessao = JSON.parse(sessionStorage.getItem("sessaoPaciente") || "{}");
        if (sessao?.usuarioId) {
            setPacienteId(sessao.usuarioId);
        }
    }, []);

    useEffect(() => {
        if (!pacienteId) return;

        const carregarEventosCalendario = async () => {
            try {
                const { data: consultasBackend } = await axios.get(`http://localhost:8080/consultas/paciente/${pacienteId}`);
                consultasBackend.sort((a, b) => {
                    if (a.pacienteId !== b.pacienteId) return a.pacienteId - b.pacienteId;
                    if (a.data !== b.data) return a.data.localeCompare(b.data);
                    return a.horarioInicio.localeCompare(b.horarioInicio);
                });

                const gruposUnificados = [];
                for (let i = 0; i < consultasBackend.length; i++) {
                    const atual = consultasBackend[i];
                    const [hIni, mIni] = atual.horarioInicio.split(":").map(Number);
                    const [hFim, mFim] = atual.horarioFim.split(":").map(Number);
                    const [ano, mes, dia] = atual.data.split("-").map(Number);
                    const inicio = new Date(ano, mes - 1, dia, hIni, mIni);
                    const fim = new Date(ano, mes - 1, dia, hFim, mFim);

                    const ultimo = gruposUnificados[gruposUnificados.length - 1];
                    const mesmaPessoa = ultimo && ultimo.pacienteId === atual.pacienteId;
                    const mesmaData = ultimo && ultimo.data === atual.data;
                    const continua = ultimo && ultimo.horarioFim === atual.horarioInicio;

                    if (mesmaPessoa && mesmaData && continua) {
                        ultimo.horarioFim = atual.horarioFim;
                        ultimo.end = fim;
                    } else {
                        gruposUnificados.push({
                            id: atual.id,
                            pacienteId: atual.pacienteId,
                            data: atual.data,
                            horarioInicio: atual.horarioInicio,
                            horarioFim: atual.horarioFim,
                            start: inicio,
                            end: fim,
                        });
                    }
                }

                const eventosConsultas = gruposUnificados.map((consulta) => ({
                    id: consulta.id,
                    title: "Consulta",
                    start: consulta.start,
                    end: consulta.end,
                    backgroundColor: "#FECACA",
                    borderColor: "#DC2626",
                }));

                setConsultas(eventosConsultas);

                const { data: disponibilidadeMensal } = await axios.get(`http://localhost:8080/consultas/disponibilidade-mensal?pacienteId=${pacienteId}`);
                setDisponiveis(disponibilidadeMensal);

            } catch (error) {
                console.error("Erro ao carregar calendário:", error);
            }
        };

        carregarEventosCalendario();

    }, [pacienteId]);

    const disponiveisFormatados = React.useMemo(() => {
        const eventos = [];

        Object.entries(disponiveis).forEach(([dataStr, horarios]) => {
            horarios.forEach(horario => {
                const inicio = new Date(horario.inicio);
                const fim = new Date(horario.fim);

                eventos.push({
                    title: "Disponível",
                    start: inicio,
                    end: fim,
                    className: "rbc-event.evento-disponivel",
                    tipo: "disponivel",
                });
            });
        });

        return eventos;
    }, [disponiveis]);



    const agendaEventos = React.useMemo(() => {
        return [...disponiveisFormatados, ...consultas];
    }, [consultas, disponiveisFormatados]);

    const semanaAnterior = () => {
        const novaData = new Date(dataBase);
        novaData.setDate(novaData.getDate() - 7);
        setDataBase(novaData);
    };

    const proximaSemana = () => {
        const novaData = new Date(dataBase);
        novaData.setDate(novaData.getDate() + 7);
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

    const EventoCalendario = ({ event }: any) => {
        const horaInicio = event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const horaFim = event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <div className="flex flex-col text-sm">
                <span className="font-semibold">{event.title}</span>
                <span className="text-gray-600 text-xs">{horaInicio} - {horaFim}</span>
            </div>
        );
    };

    const estiloEvento = (event) => {
        if (event.tipo === "disponivel") {
            return {
                className: "rbc-event evento-disponivel",
                style: {
                    minHeight: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '2px 4px',
                    fontSize: '0.75rem',
                    backgroundColor: '#D1FAE5',
                    borderLeft: '4px solid #10B981',
                    color: '#065F46',
                    fontWeight: '600',
                    boxShadow: 'none',
                    borderRadius: '0',
                    border: 'none',
                }
            };
        }
        return {
            className: "rbc-event",
            style: {
                minHeight: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '2px 4px',
                fontSize: '0.75rem',
                backgroundColor: '#FFF4E9',       // seu fundo padrão das consultas
                borderLeft: '4px solid #F79824',  // borda laranja
                color: '#F79824',
                fontWeight: '500',
                boxShadow: 'none',
                borderRadius: '0',
                border: 'none',
            }
        };
    };



    //Calendário lateral
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [visualizacao, setVisualizacao] = useState<View>("week");

    const consultasDoMes = agendaEventos
        .filter(evento => !evento.tipo) // só os eventos que não são "disponivel" (assumindo que consultas não têm tipo)
        .filter(evento => isSameMonth(evento.start, dataSelecionada));


    const diasDoMes = eachDayOfInterval({
        start: startOfWeek(startOfMonth(mesLateral), { weekStartsOn: 0 }), // Domingo anterior ou do dia 1
        end: endOfWeek(endOfMonth(mesLateral), { weekStartsOn: 0 }), // Sábado após ou do último dia do mês
    });

    function leave() {
        sessionStorage.removeItem("sessaoPsicologo");
        sessionStorage.removeItem("sessaoPaciente");
        sessionStorage.removeItem("sessionData");
        navigate("/")
    }
    return (
        <Main>
            <div className="flex min-h-screen bg-white">
                <MenuLateralPaciente telaAtiva="agenda" />
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
                                event: EventoCalendario
                            }}
                            events={agendaEventos}
                            eventPropGetter={estiloEvento}
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

                    <div className="flex">
                        <BotaoPadrao
                            texto="Sair"
                            icone={<img className=" w-[26px] " src={ExitIcon} alt="Sair" />}
                            color="bg-white"
                            textoColor="text-gray-600"
                            className="ml-auto hover:text-black transition-colors duration-200 font-medium cursor-pointer"
                            handleClick={leave}
                        />

                    </div>

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

                    {/* Consultas do mês */}
                    <div className="mt-8">
                        <h2 className="text-base font-bold text-[#161736] mb-4">Consultas do mês</h2>
                        {consultasDoMes.length === 0 ? (
                            <p className="text-sm text-[#8C9BB0]">Nenhuma consulta</p>
                        ) : (
                            consultasDoMes.map((consulta, idx) => (
                                <div key={idx} className="flex items-center bg-[#EDF0F5] rounded-lg px-3 py-2 mb-2">
                                    <div className="w-10 h-10 bg-[#ADD9E2] rounded-full mr-3 flex items-center justify-center font-bold text-[#0088A3]">
                                        {consulta.title.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-[#161736]">{consulta.title} {format(consulta.start, "dd/MM")}</p>
                                        <p className="text-xs text-[#8C9BB0] flex items-center gap-1">
                                            <span className="w-2 h-2 bg-[#F79824] rounded-full inline-block"></span>
                                            {format(consulta.start, "dd/MM")} - {format(consulta.start, "HH:mm")} às {format(consulta.end, "HH:mm")}
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