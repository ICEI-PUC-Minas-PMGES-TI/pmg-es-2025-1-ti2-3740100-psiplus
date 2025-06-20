import Main from "~/componentes/Main";
import MenuLateralPaciente from "~/componentes/MenuLateralPaciente";
import ExitIcon from "../../../public/assets/ExitIcon.png"
import BotaoPadrao from "~/componentes/BotaoPadrao";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { Smile, Frown, Angry, Meh, Edit2 } from 'lucide-react';
import PainelLateralCriarEmocao from "~/componentes/PainelLateralCriarEmocao";
import PainelLateralEditarEmocao from "~/componentes/PainelLateralEditarEmocao";

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


export function CalendarioEmocoesPaciente (){

    const navigate = useNavigate();
    const [dataBase, setDataBase] = useState(new Date());
    const [mesLateral, setMesLateral] = useState(new Date());
    const [visualizacao, setVisualizacao] = useState<View>("week");
    const [eventoSelecionado, setEventoSelecionado] = useState<EventoEmocao | null>(null);
    const [eventoCriado, setEventoCriado] = useState<EventoEmocao | null>(null);
    const [pacienteId, setPacienteId] = useState<number | null>(null);
    const [eventos, setEventos] = useState<Array<{
        start: Date;
        end: Date;
        emocao: string;
        original: EventoEmocao;
    }>>([]);
    const [mostrar, setMostrar] = useState(false);

    useEffect(() => {
        const sessao = JSON.parse(sessionStorage.getItem("sessaoPaciente") || "{}");
        if (sessao?.usuarioId) {
            setPacienteId(sessao.usuarioId);
        }
    }, []);

    async function carregarEventosEmocao(pacienteId: number): Promise<any[]> {
        if (!pacienteId) return [];

        try {
            const res = await axios.get(`http://localhost:8080/api/emocoes/paciente/${pacienteId}`);
            console.log("Resposta bruta da API:", res.data);

            const eventosTransformados = res.data.map((e: any) => {
                console.log("Evento recebido:", e);

                const [ano, mes, dia] = e.data.split("-").map(Number);
                const [hora, minuto] = e.hora.split(":").map(Number);
                const inicio = new Date(ano, mes - 1, dia, hora, minuto);
                const fim = new Date(inicio.getTime() + 60 * 60 * 1000); // +1 hora

                const evento: EventoEmocao = {
                    id: e.id,
                    pacienteId: pacienteId,
                    data: e.data,
                    hora: e.hora,
                    tipoEmocao: {
                        nome: e.tipoEmocaoNome,
                        icone: e.tipoEmocaoNome,
                    },
                    sentimento: e.sentimento,
                    notas: e.notas,
                };

                return {
                    start: inicio,
                    end: fim,
                    emocao: e.tipoEmocaoNome.toLowerCase(),
                    original: evento,
                    tipo: "emocao",
                };
            });

            return eventosTransformados;
        } catch (err) {
            console.error("Erro ao carregar emoções:", err);
            return [];
        }
    }

    const carregar = async () => {
        if (!pacienteId) return;
        const eventosCarregados = await carregarEventosEmocao(pacienteId);
        setEventos(eventosCarregados);
    };

    useEffect(() => {
        carregar();
    }, [pacienteId]);

    // Função de clique em evento do calendário
    const aoSelecionarEvento = (event: any) => {
        const e = event.original;
        setEventoSelecionado(e);
        setMostrar(false)
    };

    {/* Ajustar menu lateral interno abrindo e fechando */}
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
                Icone = <Smile color="white" size={20} />;
                corFundo = "bg-[#4E9B1E]";
                break;
            case "triste":
                Icone = <Frown color="white" size={20} />;
                corFundo = "bg-[#55B3EE]";
                break;
            case "neutro":
                Icone = <Meh color="white" size={20} />;
                corFundo = "bg-yellow-400";
                break;
            case "raiva":
                Icone = <Angry color="white" size={20} />;
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

    const estiloEvento = (event: Event) => {
        if (event.tipo === "emocao") {
            return {
                className: "rbc-event emocao",
            };
        }
        return {
            className: "rbc-event",
        };
    };

    function arredondarHora(data: Date) {
        const novaData = new Date(data);
        novaData.setMinutes(0, 0, 0);
        return novaData;
    }

    const aoSelecionarSlot = ({ start }: { start: Date }) => {
        const dataEvento = format(start, "yyyy-MM-dd", { locale: ptBR });
        const horaEvento = format(arredondarHora(start), "HH:mm", { locale: ptBR });

        const novoEvento = {
            id: 0,
            paciente: {
                pacienteId
            },
            data: dataEvento,
            hora: horaEvento,
            tipoEmocao: { nome: "feliz", icone: "feliz" }, // default
            sentimento: "",
            notas: "",
        };

        setEventoCriado(novoEvento);
        setMostrar(true);
        setEventoSelecionado(null)
    };

    return (
    <Main>
        <div className="flex h-screen bg-white ">
            {/* Lado esquerdo com menu do psicólogo*/}
            <MenuLateralPaciente telaAtiva={"emoçoes"}/>
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
                <h1 className="pt-4 font-semibold text-black mx-2 text-[20px]">Minhas Emoções</h1>

                <div className="mx-1 mt-4 flex gap-7">

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
                            <button className="bg-[#ADD9E2] text-[#0088A3] cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 hover:brightness-95"
                                    onClick={() => {setMostrar(true); setEventoSelecionado(null)}}>
                                <Edit2 color="#0088A3" size={18} />
                                Adicionar emoção

                            </button>
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
                                style={{ height: "70vh" }}
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
                                onSelectEvent={aoSelecionarEvento}
                                onSelectSlot={aoSelecionarSlot}
                                selectable={true}
                                eventPropGetter={estiloEvento}
                            />
                        </div>
                    </div>
                    {mostrar && (
                        <PainelLateralCriarEmocao
                            evento={eventoCriado}
                            pacienteId={pacienteId}
                            atualizarEventos={carregar}
                            onClose={() => setMostrar(false)
                        }
                        />
                    )}
                    {eventoSelecionado && (
                        <PainelLateralEditarEmocao
                            evento={eventoSelecionado}
                            atualizarEventos={carregar}
                            pacienteId={pacienteId}
                            onClose={() => setEventoSelecionado(null)}
                        />
                    )}

                </div>
            </div>
        </div>
    </Main>
    );
}