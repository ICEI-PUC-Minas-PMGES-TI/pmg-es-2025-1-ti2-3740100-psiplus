import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import React, {useEffect, useState} from "react";

//imports de icons
import { ChevronLeft, ChevronRight } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";

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


export default function Agenda() {
    const navigate = useNavigate();

    const [dataBase, setDataBase] = useState(new Date());
    const [mesLateral, setMesLateral] = useState(new Date());
    const [excecoes, setExcecoes] = useState<any[]>([]);
    const [psicologoId, setPsicologoId] = useState<number | null>(null);
    const [consultas, setConsultas] = useState([]);

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

    useEffect(() => {
        const sessao = JSON.parse(sessionStorage.getItem("sessaoPsicologo") || '{}');
        if (sessao?.usuarioId) {
            setPsicologoId(sessao.usuarioId);
        }
    }, []);

    useEffect(() => {
        if (!psicologoId) return;

        const carregarExcecoes = async () => {
            try {
                const data = await listarExcecoesDisponibilidade(psicologoId);
                const excecoesFormatadas = data.map((excecao: any) => ({
                    ...excecao,
                    psicologoId,
                    id: excecao.id,
                    start: new Date(excecao.dataHoraInicio),
                    end: new Date(excecao.dataHoraFim),
                    motivo: excecao.motivo ?? null,
                    recorrenteRelacionadaId: excecao.recorrenteRelacionada
                        ? excecao.recorrenteRelacionada.recorrenteId
                        : null
                }));
                setExcecoes(excecoesFormatadas);
            } catch (error) {
                console.error('Erro ao carregar exceções:', error);
            }
        };

        async function carregarConsultas() {
            try {
                const { data: consultasBackend } = await axios.get(`http://localhost:8080/consultas/psicologo/${psicologoId}`);

                // Primeiro, ordena por paciente + data + horário de início
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

                    const dataPartes = atual.data.split("-");
                    const dataConsulta = new Date(
                        Number(dataPartes[0]),
                        Number(dataPartes[1]) - 1,
                        Number(dataPartes[2])
                    );

                    const inicio = new Date(dataConsulta);
                    inicio.setHours(hIni, mIni, 0, 0);
                    const fim = new Date(dataConsulta);
                    fim.setHours(hFim, mFim, 0, 0);

                    // Se for a primeira, ou não for continuação, cria novo grupo
                    const ultimoGrupo = gruposUnificados[gruposUnificados.length - 1];
                    const mesmaPessoa = ultimoGrupo && ultimoGrupo.pacienteId === atual.pacienteId;
                    const mesmaData = ultimoGrupo && ultimoGrupo.data === atual.data;
                    const continua = ultimoGrupo && ultimoGrupo.horarioFim === atual.horarioInicio;

                    if (mesmaPessoa && mesmaData && continua) {
                        // Estende o horário final do grupo anterior
                        ultimoGrupo.horarioFim = atual.horarioFim;
                        ultimoGrupo.end = fim;
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

                // Agora, buscar os nomes dos pacientes
                const consultasComNome = await Promise.all(gruposUnificados.map(async (consulta) => {
                    try {
                        const resPaciente = await axios.get(`http://localhost:8080/pacientes/${consulta.pacienteId}`);
                        const nomePaciente = resPaciente.data.usuario.nome;

                        return {
                            id: consulta.id,
                            title: "Consulta: " + nomePaciente,
                            start: consulta.start,
                            end: consulta.end,
                        };
                    } catch (error) {
                        console.error(`Erro ao buscar nome do paciente ${consulta.pacienteId}:`, error);
                        return null;
                    }
                }));

                const filtradas = consultasComNome.filter(Boolean);
                setConsultas(filtradas);
            } catch (error) {
                console.error("Erro ao buscar consultas:", error);
            }
        }



        carregarExcecoes();
        carregarConsultas();

    }, [psicologoId]);

    const gerarExcecoesFormatadas = React.useCallback(() => {
        const indisponiveisFormatados = excecoes
            .filter(e => e.tipo !== "DISPONIVEL")
            .map(e => ({
                start: new Date(e.start),
                end: new Date(e.end),
                id: e.id,
                psicologoId: e.psicologoId,
                title: e.motivo || "Indisponível",
                tipo: "indisponivel-excecao",
                backgroundColor: "#FECACA",
                borderColor: "#EF4444",
            }));

        return [...indisponiveisFormatados];
    }, [excecoes]);

    function formatarIntervaloSemana(data: Date) {
        const inicio = startOfWeek(data, { weekStartsOn: 1 });
        const fim = endOfWeek(data, { weekStartsOn: 1 });

        const diaInicio = format(inicio, "dd", { locale: ptBR });
        const diaFim = format(fim, "dd", { locale: ptBR });
        const mes = format(fim, "MMMM", { locale: ptBR });

        const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);

        return `${diaInicio} - ${diaFim} de ${mesCapitalizado}`;
    }


    function editaragenda() {
        navigate("/psicologo/agenda/editar")
    }

    const agendaEventos = React.useMemo(() => {
        return [
            ...gerarExcecoesFormatadas(),
            ...consultas
        ];
    }, [excecoes, consultas]);

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

    const estiloEvento = () => {
        return {
            style: {
                minHeight: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '2px 4px',
                fontSize: '0.75rem',
            }
        };
    };

    //Calendário lateral
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [visualizacao, setVisualizacao] = useState<View>("week");

    const diasDoMes = eachDayOfInterval({
        start: startOfWeek(startOfMonth(mesLateral), { weekStartsOn: 0 }), // Domingo anterior ou do dia 1
        end: endOfWeek(endOfMonth(mesLateral), { weekStartsOn: 0 }), // Sábado após ou do último dia do mês
    });

    // Consultas do dia selecionado
    const consultasDoDia = agendaEventos.filter((evento) =>
        isSameDay(evento.start, dataSelecionada)
    );

    function leave() {
        sessionStorage.removeItem("sessaoPsicologo");
        sessionStorage.removeItem("sessaoPaciente");
        navigate("/")
    }

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
                        px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 hover:brightness-95" onClick={editaragenda}>
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
                            events={agendaEventos}
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

                    {/* Consultas do dia */}
                        <div className="mt-8">
                            <h2 className="text-base font-bold text-[#161736] mb-4">
                                Eventos do dia
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
                                                {format(consulta.start, "HH:mm")} - {format(consulta.end, "HH:mm")}
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