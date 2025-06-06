import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import TimeSlotSelector from "~/componentes/TimeSlotSelector"
import { 
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,      // <-- esta linha estava faltando!
  endOfWeek,
  addDays,
  isSameDay,
  isToday,
  isSameMonth
} from "date-fns";
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExitIcon from "../../../public/assets/ExitIcon.png";
import {IoIosArrowDown} from "react-icons/io";


export default function AgendarConsulta() {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [psicologoId, setPsicologoId] = useState<number | null>(null);
  const [mesLateral, setMesLateral] = useState(new Date());
  useEffect(() => {
    const sessao = JSON.parse(sessionStorage.getItem("sessaoPsicologo") || '{}');
    if (sessao?.usuarioId) {
      setPsicologoId(sessao.usuarioId);
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/pacientes/resumo")
        .then((res) => {
          console.log("Pacientes recebidos:", res.data);
          setPatients(res.data);
        })
        .catch((err) => {
          setPatients([]);
          console.error("Erro ao buscar pacientes:", err);
        });
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

  const handleScheduleAppointment = async () => {
    if (selectedPatient && selectedDate && selectedTimeSlot && psicologoId) {
      const dataStr = selectedDate.toISOString().split("T")[0];

      const horarioInicio = format(selectedTimeSlot.inicio, "HH:mm");
      const horarioFim = format(selectedTimeSlot.fim, "HH:mm");

      const data = {
        pacienteId: selectedPatient.pacienteId,
        psicologoId,
        data: dataStr,
        horarioInicio,
        horarioFim
      };

      try {
        await axios.post("http://localhost:8080/consultas/agendar", data);
        alert("Consulta agendada com sucesso!");

        // Atualiza os horários disponíveis após agendar
        await fetchAvailableSlots();

      } catch (err) {
        console.error("Erro ao agendar consulta:", err);
        alert("Erro ao agendar consulta.");
      }
    } else {
      alert("Por favor, selecione um paciente, uma data e um horário.");
    }
  };

  function leave() {
    sessionStorage.removeItem("sessaoPsicologo");
    sessionStorage.removeItem("sessaoPaciente");
    navigate("/")
  }

  return (
    <Main>
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
          <h1 className="pt-4 font-semibold text-[#161736] mx-2 text-[20px]">Agendar Consulta</h1>

          {/* Campo do paciente */}
          <div className="relative w-full max-w-lg ml-2">
            <label className="block text-sm mb-1 mt-5 text-[#828282]">
              Selecione um Paciente
            </label>
            <select
                value={selectedPatient?.pacienteId || ""}
                onChange={(e) => {
                  const idSelecionado = parseInt(e.target.value);
                  const paciente = patients.find((p) => p.pacienteId === idSelecionado);
                  setSelectedPatient(paciente);
                }}
                className="cursor-pointer px-5 w-full rounded-lg py-2.5 text-sm appearance-none pr-10 !text-[#7D8DA6] bg-[#EDF0F5]"
              >
                <option value="" disabled hidden>Nome do paciente</option>
                {patients.map((p) => (
                  <option key={p.pacienteId} value={p.pacienteId}>
                    {p.nome}
                  </option>
                ))}
            </select>
            <IoIosArrowDown className="absolute right-3 top-[70%] transform -translate-y-1/2 text-2xl pointer-events-none !text-[#858EBD] !border-[#DAE0F2]" />
          </div>

          {/* Calendário e horários */}
          <div className="flex w-full mt-12 ml-14 items-start">
            {/* Calendário Centralizado */}
            <div className="w-[420px]">
              <div className="flex items-center justify-between text-lg font-semibold text-[#7D8DA6] mb-10">
                <button onClick={() => setMesLateral(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                  <ChevronLeft size={24} />
                </button>
                <span className="text-[#7D8DA6] font-semibold">
                  {format(mesLateral, "MMMM yyyy", { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}
                </span>
                <button onClick={() => setMesLateral(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
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
                  const isSelecionado = isSameDay(dia, selectedDate);
                  const isHoje = isToday(dia);
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(dia)}
                      className={`cursor-pointer w-9 h-9 rounded-full flex items-center justify-center mx-auto transition
                        ${isSelecionado ? 'bg-[#0088A3] text-white' : isHoje ? 'text-[#F58020]' : ''}
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
            <div className="w-[300px] flex flex-col">
              <div className="text-center text-[#303030] font-semibold text-lg mb-5">
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
                    texto="Agendar Consulta"
                    handleClick={handleScheduleAppointment}
                    className="bg-[#0088A3] hover:bg-[#00718a] text-white px-6 py-3 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}