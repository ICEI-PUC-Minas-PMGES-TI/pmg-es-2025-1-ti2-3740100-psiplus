import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import { useState, useEffect } from "react";
import axios from "axios";
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


export default function AgendarConsulta() {
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



  return (
    <Main>
      <div className="flex min-h-screen bg-white">
      <MenuLateralPsicólogo telaAtiva="pacientes" />
      <div className="p-10 w-full flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-[#303030]">Agendar Consulta</h1>

        {/* Campo do paciente */}
        <div className="w-full max-w-lg">
          <label className="block text-sm mb-1 text-[#666]">
            Selecione um Paciente
          </label>
          <select
  value={selectedPatient?.pacienteId || ""}
  onChange={(e) => {
    const idSelecionado = parseInt(e.target.value);
    const paciente = patients.find((p) => p.pacienteId === idSelecionado);
    setSelectedPatient(paciente);
  }}
  className="border rounded px-2 py-1"
>
  <option value="" disabled hidden>Selecione um paciente</option>
  {patients.map((p) => (
    <option key={p.pacienteId} value={p.pacienteId}>
      {p.nome}
    </option>
  ))}
</select>
        </div>

        {/* Calendário e horários */}
        <div className="flex w-full justify-between mt-8">
          {/* Calendário Centralizado */}
          <div className="w-[420px]">
            <div className="flex items-center justify-between text-lg font-semibold text-[#7D8DA6] mb-4">
              <button onClick={() => setMesLateral(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                <ChevronLeft size={24} />
              </button>
              <span className="text-[#7D8DA6]">
                {format(mesLateral, "MMMM yyyy", { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}
              </span>
              <button onClick={() => setMesLateral(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 text-sm text-[#303030] font-semibold text-center mb-2">
              <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
            </div>

            {/* Dias do mês */}
            <div className="grid grid-cols-7 text-sm text-[#303030] text-center gap-y-2">
              {diasDoMes.map((dia, idx) => {
                const isSelecionado = isSameDay(dia, selectedDate);
                const isHoje = isToday(dia);
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(dia)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto transition
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

          {/* Horários disponíveis */}
          <div className="w-[300px] flex flex-col">
            <div className="text-right text-[#303030] font-semibold text-lg mb-4">
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
                          className={`border-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all
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
          </div>


        </div>

        {/* Botão de Agendar */}
        <div className="w-full flex justify-end mt-8 pr-10">
         <BotaoPadrao
            texto="Agendar Consulta"
            handleClick={handleScheduleAppointment} // <-- Aqui você usa a função que envia pro backend
            className="bg-[#0088A3] hover:bg-[#00718a] text-white px-6 py-3 rounded-md"
          />
        </div>
      </div>

      </div>
    </Main>
  );
}