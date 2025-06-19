import Main from "~/componentes/Main";
import MenuLateralPaciente from "~/componentes/MenuLateralPaciente";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import localizer from "~/utils/calendarConfig";
import { Calendar, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "~/estilos/customCalendar.css";
import CustomToolbar from "~/componentes/CustomToolbar";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, isSameMonth, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import axios from "axios";
import AgendamentoModalPaciente from "../../componentes/AgendamentoModalPaciente";

interface Evento {
  id?: number;
  title: string;
  start: Date;
  end: Date;
  tipo?: string;
  className?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export function AgendaPaciente() {
  const navigate = useNavigate();

  const [dataBase, setDataBase] = useState(new Date());
  const [mesLateral, setMesLateral] = useState(new Date());
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [consultas, setConsultas] = useState<Evento[]>([]);
  const [disponiveis, setDisponiveis] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState<{ start: Date; end: Date } | null>(null);
  const [visualizacao, setVisualizacao] = useState<"week" | "day" | "agenda">(Views.WEEK); // Added missing state
  const [psicologoId, setPsicologoId] = useState<number | null>(null);
  const [psicologoNome, setPsicologoNome] = useState<string>("");

  useEffect(() => {
  const sessao = JSON.parse(sessionStorage.getItem("sessaoPaciente") || "{}");
  if (sessao?.usuarioId) {
    setPacienteId(sessao.usuarioId);

    // Troque aqui para o endpoint com-psicologo
    fetch(`http://localhost:8080/pacientes/${sessao.usuarioId}/com-psicologo`)
      .then(res => res.json())
      .then(data => {
        if (data.psicologoId) {
          setPsicologoId(data.psicologoId);
          setPsicologoNome(data.psicologoNome || "Psicólogo não informado");

        } else {
          setPsicologoId(null);
          setPsicologoNome("Psicólogo não informado");
        }
      });
  }
}, []);

  useEffect(() => {
    if (!pacienteId) return;

    const carregarEventosCalendario = async () => {
      try {
        const { data: consultasBackend } = await axios.get(`http://localhost:8080/consultas/paciente/${pacienteId}`);
        consultasBackend.sort((a: any, b: any) => {
          if (a.pacienteId !== b.pacienteId) return a.pacienteId - b.pacienteId;
          if (a.data !== b.data) return a.data.localeCompare(b.data);
          return a.horarioInicio.localeCompare(b.horarioInicio);
        });

        const gruposUnificados: any[] = [];
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

        const eventosConsultas: Evento[] = gruposUnificados.map((consulta) => ({
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

  const handleAgendado = (psicologo: any) => {
    const carregarEventosCalendario = async () => {
      try {
        const { data: consultasBackend } = await axios.get(`http://localhost:8080/consultas/paciente/${pacienteId}`);
        consultasBackend.sort((a: any, b: any) => {
          if (a.pacienteId !== b.pacienteId) return a.pacienteId - b.pacienteId;
          if (a.data !== b.data) return a.data.localeCompare(b.data);
          return a.horarioInicio.localeCompare(b.horarioInicio);
        });

        const gruposUnificados: any[] = [];
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

        const eventosConsultas: Evento[] = gruposUnificados.map((consulta) => ({
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
  };

  const disponiveisFormatados = React.useMemo(() => {
    const eventos: Evento[] = [];
    const agora = new Date();

    Object.entries(disponiveis).forEach(([dataStr, horarios]: [string, any[]]) => {
      horarios.forEach(horario => {
        const inicio = new Date(horario.inicio);
        const fim = new Date(horario.fim);

        if (fim <= agora) return;

        eventos.push({
          title: "Disponível",
          start: inicio,
          end: fim,
          className: "rbc-event.evento-disponivel",
          tipo: "disponivel",
          recorrente: horario.recorrente || false,
        });
      });
    });

    return eventos;
  }, [disponiveis]);

  const gerarDisponibilidadesRecorrentesSemana = React.useCallback(() => {
    const inicioSemana = startOfWeek(dataBase, { weekStartsOn: 1 });
    const eventos: Evento[] = [];

    const intervaloSeCruzam = (start1: Date, end1: Date, start2: Date, end2: Date) => {
      return start1 < end2 && start2 < end1;
    };

    const fatiarIntervalo = (dispStart: Date, dispEnd: Date, consultas: Evento[]) => {
      const sorted = [...consultas].sort((a, b) => a.start.getTime() - b.start.getTime());
      const livres = [];
      let cursor = dispStart;

      for (const cons of sorted) {
        if (cursor < cons.start) {
          livres.push({ start: cursor, end: cons.start });
        }
        if (cons.end > cursor) {
          cursor = cons.end;
        }
      }

      if (cursor < dispEnd) {
        livres.push({ start: cursor, end: dispEnd });
      }

      return livres;
    };

    Object.entries(disponiveis).forEach(([_, horarios]) => {
      horarios.forEach((disp: any) => {
        if (!disp.recorrente) return;

        const [ano, mes, dia, horaI, minutoI] = disp.inicio.split(/[-T:]/).map(Number);
        const [, , , horaF, minutoF] = disp.fim.split(/[-T:]/).map(Number);

        const dataReferencia = new Date(ano, mes - 1, dia); // correta e sem timezone bug
        const diaSemana = dataReferencia.getDay(); // 0 = dom, 1 = seg...

        const dataAlvo = new Date(inicioSemana);
        dataAlvo.setDate(inicioSemana.getDate() + ((diaSemana + 7 - inicioSemana.getDay()) % 7));

        const startDisp = new Date(dataAlvo);
        startDisp.setHours(horaI, minutoI, 0, 0);

        const endDisp = new Date(dataAlvo);
        endDisp.setHours(horaF, minutoF, 0, 0);

        if (endDisp < new Date()) return;

        const consultasNoIntervalo = consultas.filter(c =>
            intervaloSeCruzam(startDisp, endDisp, c.start, c.end)
        );

        const intervalosLivres = fatiarIntervalo(startDisp, endDisp, consultasNoIntervalo);

        intervalosLivres.forEach(({ start, end }) => {
          if (start < end) {
            eventos.push({
              start,
              end,
              title: "Disponível",
              tipo: "disponivel",
              className: "rbc-event.evento-disponivel",
              recorrente: true,
            });
          }
        });
      });
    });

    return eventos;
  }, [dataBase, disponiveis, consultas]);

  const disponiveisRecorrentesSemana = gerarDisponibilidadesRecorrentesSemana();

  const agendaEventos = React.useMemo(() => {
    return [
      ...disponiveisFormatados.filter(e => !e.recorrente),
      ...disponiveisRecorrentesSemana,
      ...consultas,
    ];
  }, [disponiveisFormatados, disponiveisRecorrentesSemana, consultas]);

  const consultasDoMes = React.useMemo(() => {
    return agendaEventos
      .filter((evento) => !evento.tipo) // Only include consultations (not "disponivel")
      .filter((evento) => isSameMonth(evento.start, mesLateral));
  }, [agendaEventos, mesLateral]);

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

  const CustomHeader: React.FC<any> = ({ date }) => {
    const weekday = format(date, "EEE", { locale: ptBR });
    const dayNumber = format(date, "d", { locale: ptBR });
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

  const EventoCalendario = ({ event }: { event: Evento }) => {
    const horaInicio = event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const horaFim = event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return (
      <div className="flex flex-col text-sm">
        <span className="font-semibold">{event.title}</span>
        <span className="text-gray-600 text-xs">{horaInicio} - {horaFim}</span>
      </div>
    );
  };

  const estiloEvento = (event: Evento) => {
    if (event.tipo === "disponivel") {
      return {
        className: "rbc-event evento-disponivel",
      };
    }
    return {
      className: "rbc-event consulta",
    };
  };

  const handleSelectEvent = (event: Evento) => {
  if (event.tipo === "disponivel") {
    if (psicologoId && psicologoNome) {
      setDataSelecionada({ start: event.start, end: event.end });
      setModalOpen(true);
    } else {
      alert("Não foi possível identificar o psicólogo para agendamento.");
    }
  }
};



  const diasDoMes = eachDayOfInterval({
    start: startOfWeek(startOfMonth(mesLateral), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(mesLateral), { weekStartsOn: 0 }),
  });

  function leave() {
    sessionStorage.removeItem("sessaoPsicologo");
    sessionStorage.removeItem("sessaoPaciente");
    sessionStorage.removeItem("sessionData");
    navigate("/");
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
              onSelectEvent={handleSelectEvent}
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
                event: EventoCalendario,
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
              date={dataBase}
              onNavigate={(novaData) => setDataBase(novaData)}
              view={visualizacao}
              onView={(view) => setVisualizacao(view)}
            />
          </div>
        </div>

        <div className="w-[300px] border-l border-gray-200 bg-white shadow px-4 py-6 relative flex flex-col">
          <div className="flex">
            <BotaoPadrao
              texto="Sair"
              icone={<img className="w-[26px]" src={ExitIcon} alt="Sair" />}
              color="bg-white"
              textoColor="text-gray-600"
              className="ml-auto hover:text-black transition-colors duration-200 font-medium cursor-pointer"
              handleClick={leave}
            />
          </div>

          <div className="mt-15">
            <div className="flex items-center justify-between text-lg font-semibold text-[#7D8DA6] mb-4 px-1">
              <span>
                {(() => {
                  const mes = format(mesLateral, "MMMM yyyy", { locale: ptBR });
                  return mes.charAt(0).toUpperCase() + mes.slice(1);
                })()}
              </span>
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

            <div className="grid grid-cols-7 gap-x-3 text-[12px] text-[#161736] font-semibold mb-1">
              <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
            </div>

            <div className="grid grid-cols-7 text-[13px] font-medium gap-y-1.5 text-[#161736]">
              {diasDoMes.map((dia, idx) => {
                const isSelecionado = dataSelecionada && isSameDay(dia, dataSelecionada.start);
                const isHoje = isToday(dia);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setDataBase(dia);
                      setVisualizacao("day");
                    }}
                    className={`py-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto transition cursor-pointer
                      ${isSelecionado ? "bg-[#0088A3] text-white font-semibold" : isHoje ? "text-[#F58020]" : ""}
                      ${!isSameMonth(dia, mesLateral) ? "text-gray-400" : ""}`}
                  >
                    {format(dia, "d")}
                  </button>
                );
              })}
            </div>
          </div>

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

        <AgendamentoModalPaciente
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            dataSelecionada={dataSelecionada}
            onAgendado={handleAgendado}
            psicologoId={psicologoId}
            psicologoNome={psicologoNome}
        />
      </div>
    </Main>
  );
}