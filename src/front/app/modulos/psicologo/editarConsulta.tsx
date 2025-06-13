import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import {useState, useEffect, useMemo} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isToday, isSameMonth, startOfDay } from "date-fns";
import { ptBR } from 'date-fns/locale';
import {ChevronLeft, ChevronRight, Trash} from 'lucide-react';
import ExitIcon from "../../../public/assets/ExitIcon.png";
import Popup from "../../componentes/Popup";
import PerfilUser from "../../../public/assets/PerfilUser.jpg";
import CircularProgress from "@mui/material/CircularProgress";


export default function EditarConsulta() {

  const { id } = useParams();

  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [psicologoId, setPsicologoId] = useState<number | null>(null);
  const [mesLateral, setMesLateral] = useState(new Date());
  const [consulta, setConsulta] = useState(null);
  const [loadingConsulta, setLoadingConsulta] = useState(true);
  const [dataConsulta, setDataConsulta] = useState<Date | null>(null);

  const atualizarConsulta = () => {
    setLoadingConsulta(true);
    axios.get(`http://localhost:8080/consultas/${id}`)
        .then((res) => {
          if (res.data) {
            setConsulta(res.data);
          } else {
            navigate("/psicologo/agenda");
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar consulta:", err);
          navigate("/psicologo/agenda");
        })
        .finally(() => {
          setLoadingConsulta(false);
        });
  };

  useEffect(() => {
    atualizarConsulta();
  }, [id, navigate]);

  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [popupMensagem, setPopupMensagem] = useState("");
  const [popupTitulo, setPopupTitulo] = useState("");

  const reagendarConsulta = async () => {
    if (!selectedTimeSlot || !selectedDate || !id || !consulta?.psicologoId || !consulta?.pacienteId) {
      setPopupTitulo("Erro no reagendamento!");
      setPopupMensagem("Por favor, selecione uma data e um horário disponível.");
      setMostrarPopup(true);
      return;
    }

    const data = {
      pacienteId: consulta.pacienteId,
      psicologoId: consulta.psicologoId,
      data: format(selectedDate, "yyyy-MM-dd"),
      horarioInicio: format(selectedTimeSlot.inicio, "HH:mm"),
      horarioFim: format(selectedTimeSlot.fim, "HH:mm"),
    };

    try {
      const response = await axios.put(
          `http://localhost:8080/consultas/reagendar/${id}`,
          data
      );
      setPopupTitulo("Sucesso!");
      setPopupMensagem("Consulta reagendada com sucesso! Acompanhe seus agendamentos na página principal.");
      setMostrarPopup(true);
      atualizarConsulta();
      fetchAvailableSlots();
    } catch (error) {
      setPopupTitulo("Erro no reagendamento!");
      setPopupMensagem("Erro ao reagendar consulta. Tente novamente mais tarde.");
      setMostrarPopup(true);
    }
  };


  useEffect(() => {
    const sessao = JSON.parse(sessionStorage.getItem("sessaoPsicologo") || '{}');
    if (sessao?.usuarioId) {
      setPsicologoId(sessao.usuarioId);
    }
  }, []);

  const fetchAvailableSlots = async () => {
    if (!psicologoId || !selectedDate) return;

    try {
      const dataISO = selectedDate.toISOString().split("T")[0];
      const url = `http://localhost:8080/consultas/horarios-disponiveis?psicologoId=${psicologoId}&data=${dataISO}`;
      const response = await axios.get(url);

      const intervalosQuebrados = gerarIntervalosDeUmaHora(response.data);
      setAvailableTimeSlots(intervalosQuebrados);
      setSelectedTimeSlot(null);
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
      setAvailableTimeSlots([]);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDate, psicologoId]);


  function gerarIntervalosDeUmaHora(intervalos) {
    // intervalos: [{ inicio: "2025-06-07T04:00:00", fim: "2025-06-07T06:00:00" }, ...]
    const slots = [];

    intervalos.forEach(({ inicio, fim }) => {
      let start = new Date(inicio);
      const end = new Date(fim);

      while (start < end) {
        const next = new Date(start);
        next.setHours(next.getHours() + 1);

        if (next > end) {
          break;
        }

        const label = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${next.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        slots.push({
          inicio: new Date(start),
          fim: new Date(next),
          label
        });

        start = next;
      }
    });

    return slots;
  }

  const diasDoMes = (() => {
    const start = startOfWeek(startOfMonth(mesLateral), { locale: ptBR });
    const end = endOfWeek(endOfMonth(mesLateral), { locale: ptBR });
    const days = [];
    for (let day = start; day <= end; day = addDays(day, 1)) {
      days.push(day);
    }
    return days;
  })();

  function leave() {
    sessionStorage.removeItem("sessaoPsicologo");
    sessionStorage.removeItem("sessaoPaciente");
    sessionStorage.removeItem("sessionData");
    navigate("/")
  }

  const dataFormatada = useMemo(() => {
    if (!consulta) return "";

    const data = new Date(consulta.data)

    const dataUtc = new Date(consulta.data + "Z");
    const dataLocal = new Date(dataUtc.getTime() + dataUtc.getTimezoneOffset() * 60000);
    setDataConsulta(dataLocal);

    return data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC"
    });
  }, [consulta]);

  const horaFormatada = useMemo(() => {
    if (!consulta) return "";
    return consulta.horarioInicio.slice(0, 5) + " - " + consulta.horarioFim.slice(0, 5)
  }, [consulta]);

  return (
    <Main>
      {loadingConsulta ? (<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={50} sx={{ color: "#4A90E2" }} />
      </div>) : (
      <div className="flex min-h-screen bg-white">
        {/* Lado esquerdo com menu do psicólogo*/}
        <MenuLateralPsicólogo telaAtiva={"pacientes"}/>
        <div className="w-px bg-gray-300"></div>
        <div className="m-5 w-4/5">
          <div className="flex">
            <BotaoPadrao
                color="bg-white"
                textoColor="text-gray-600"
                className="ml-auto hover:text-black transition-colors duration-200 font-medium cursor-pointer"
                texto="Sair"
                icone={<img className=" w-[26px] " src={ExitIcon} alt="Sair" />}
                handleClick={leave}
            />
          </div>
          <hr className="border-t-2 border-[#DFE5F1] my-2"/>
          <h1 className="pt-4 font-semibold text-[#161736] mx-2 text-[20px]">Editar Consulta Agendada</h1>

          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Paciente */}
            <div className="flex items-center gap-4">
              <img className="w-12 h-12 rounded-full" src={PerfilUser} />
              <span className="text-lg font-medium text-gray-700">
            {consulta.pacienteNome || "Carregando..."}
          </span>
            </div>

            {/* Data e Hora */}
            <div className="text-center">
              <p className="text-sm text-gray-500">Consulta agendada para:</p>
              <p className="text-lg font-bold text-gray-800 capitalize">
                {dataFormatada}
              </p>
            </div>

            {/* Horário */}
            <div className="flex items-center gap-1 text-indigo-900 font-semibold flex-col">
              <span className="material-symbols-outlined">Consulta agendada para:</span>
              <span>{horaFormatada}</span>
            </div>

            {/* Botão cancelar */}
            <button
                onClick={() => console.log("Cancelar consulta", consulta.idConsulta)}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
            >
              <Trash/>
              Cancelar Consulta
            </button>
          </div>

          {/* Calendário e horários */}
          <div className="flex w-full mt-12 ml-14 items-start">
            {/* Calendário Centralizado */}
            <div className="w-[420px]">
              <div className="flex items-center justify-between text-lg font-semibold text-[#7D8DA6] mb-10">
                <button className="cursor-pointer"
                    onClick={() => setMesLateral(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                  <ChevronLeft size={24}/>
                </button>
                <span className="text-[#7D8DA6] font-semibold">
                  {format(mesLateral, "MMMM yyyy", { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}
                </span>
                <button className="cursor-pointer"
                    onClick={() => setMesLateral(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Dias da semana */}
              <div className="grid grid-cols-7 text-sm text-[#41435C] font-semibold text-center mb-2">
                <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
              </div>

              {/* Dias do mês */}
              <div className="grid grid-cols-7 text-sm text-[#303030] text-center gap-y-2 font-semibold">
                {diasDoMes.map((dia, idx) => {
                  const dataConsultaDia = dataConsulta ? startOfDay(new Date(dataConsulta)) : null;

                  const isSelecionado = isSameDay(dia, selectedDate);
                  const isHoje = isToday(dia);
                  const isDataConsulta = dataConsultaDia && isSameDay(dia, dataConsultaDia);

                  return (
                      <button
                          key={idx}
                          onClick={() => setSelectedDate(dia)}
                          className={`cursor-pointer w-9 h-9 rounded-full flex items-center justify-center mx-auto transition
          ${isSelecionado ? 'bg-[#0088A3] text-white' :
                              isDataConsulta ? 'bg-[#F58020] text-white' :
                                  isHoje ? 'text-[#F58020]' : ''}
          ${!isSameMonth(dia, mesLateral) ? 'text-gray-300' : ''}
        `}
                      >
                        {format(dia, "d")}
                      </button>
                  );
                })}
              </div>

            </div>

            {/* Linha vertical divisória */}
            <div className="w-[1px] h-auto bg-[#DFE5F1] mx-29 self-stretch" />

            {/* Horários disponíveis */}
            <div className={"flex flex-col"}>
            <label className="block text-sm mb-5 mt-5 text-[#828282]">
              Alterar Horário:
            </label>
            <div className="w-[300px] flex flex-col">
              <div className="text-center text-[#161736] font-semibold text-lg mb-5">
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </div>
              {availableTimeSlots.length === 0 ? (
                  <p className="text-center text-gray-500">Nenhum horário disponível para este dia.</p>
              ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {availableTimeSlots.map((slot, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`cursor-pointer border-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all
              ${
                                selectedTimeSlot?.inicio?.toISOString() === slot.inicio.toISOString()
                                    ? 'bg-[#0088A3] text-white border-[#0088A3]'
                                    : 'text-[#0088A3] border-[#0088A3] hover:bg-[#f0fdff]'
                            }`}
                        >
                          {slot.label}
                        </button>
                    ))}
                  </div>
              )}
              {/* Botão de Agendar */}
              <div className="w-full flex justify-end mt-10 pr-10">
                <BotaoPadrao
                    texto="Reagendar Consulta"
                    handleClick={reagendarConsulta}
                    disabled={selectedTimeSlot == null}
                    className="bg-[#0088A3] hover:bg-[#00718a] text-white px-6 py-3 rounded-md"
                />
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
        )}
      {/* Popup */}
      {mostrarPopup && (
          <Popup
              titulo={popupTitulo}
              mensagem={popupMensagem}
              onClose={() => {
                setMostrarPopup(false);
                if (popupTitulo === "Sucesso") {
                  navigate("/psicologo/agenda");
                }
              }}
          />
      )}
    </Main>
  );
}