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
  const [mesLateral, setMesLateral] = useState(new Date());

  useEffect(() => {
    axios.get("http://localhost:8080/pacientes/resumo")
      .then((res) => setPatients(res.data))
      .catch((err) => {
        setPatients([]);
        console.error("Erro ao buscar pacientes:", err);
      });
  }, []);

  useEffect(() => {
    if (
      selectedDate.getDate() === 16 &&
      selectedDate.getMonth() === 2 &&
      selectedDate.getFullYear() === 2025
    ) {
      setAvailableTimeSlots([
        "08:00", "10:00", "13:00", "15:00", "17:00", "18:00", "19:00"
      ]);
    } else {
      setAvailableTimeSlots(["09:00", "11:00", "14:00", "16:00", "17:00"]);
    }
    setSelectedTimeSlot(null);
  }, [selectedDate]);

  const diasDoMes = (() => {
    const start = startOfWeek(startOfMonth(mesLateral), { locale: ptBR });
    const end = endOfWeek(endOfMonth(mesLateral), { locale: ptBR });
    const days = [];
    for (let day = start; day <= end; day = addDays(day, 1)) {
      days.push(day);
    }
    return days;
  })();
  useEffect(() => {
    axios.get("http://localhost:8080/pacientes/resumo")
      .then((res) => setPatients(res.data))
      .catch((err) => {
        setPatients([]);
        console.error("Erro ao buscar pacientes:", err);
      });
  }, []);

  useEffect(() => {
    const fetchTimeSlots = () => {
      if (
        selectedDate &&
        selectedDate.getDate() === 16 &&
        selectedDate.getMonth() === 2 &&
        selectedDate.getFullYear() === 2025
      ) {
        setAvailableTimeSlots([
          "08:00",
          "10:00",
          "13:00",
          "15:00",
          "17:00",
          "18:00",
          "19:00",
        ]);
      } else if (selectedDate) {
        setAvailableTimeSlots([
          "09:00",
          "11:00",
          "14:00",
          "16:00",
          "17:00",
        ]);
      } else {
        setAvailableTimeSlots([]);
      }
    };
    fetchTimeSlots();
    setSelectedTimeSlot(null);
  }, [selectedDate, selectedPatient]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (time) => {
    setSelectedTimeSlot(time);
  };

  const handleScheduleAppointment = () => {
    if (selectedPatient && selectedDate && selectedTimeSlot) {
      alert(`Consulta agendada para:
        Paciente: ${selectedPatient.nome}
        Data: ${selectedDate.toLocaleDateString("pt-BR")}
        Horário: ${selectedTimeSlot}`);
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
            value={selectedPatient || ""}
            onChange={(e) => {
              const selected = patients.find((p) => p.nome === e.target.value);
              setSelectedPatient(selected);
            }}
            className="w-full p-3 rounded-md bg-[#F4F6F8] text-sm text-gray-600 border border-gray-300 focus:outline-none"
          >
            <option value="" disabled hidden>Nome do Paciente</option>
            {patients.map((p) => (
              <option key={p.id} value={p.nome}>{p.nome}</option>
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
            <div className="grid grid-cols-2 gap-3">
              {availableTimeSlots.map((hora) => (
                <button
                  key={hora}
                  onClick={() => setSelectedTimeSlot(hora)}
                  className={`border-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all
                    ${
                      selectedTimeSlot === hora
                        ? 'bg-[#0088A3] text-white border-[#0088A3]'
                        : 'text-[#0088A3] border-[#0088A3] hover:bg-[#f0fdff]'
                    }`}
                >
                  {hora}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botão de Agendar */}
        <div className="w-full flex justify-end mt-8 pr-10">
          <BotaoPadrao
            texto="Agendar Consulta"
            handleClick={() => {
              if (selectedPatient && selectedDate && selectedTimeSlot) {
                alert(`Consulta agendada para:\nPaciente: ${selectedPatient.nome}\nData: ${selectedDate.toLocaleDateString("pt-BR")}\nHorário: ${selectedTimeSlot}`);
              } else {
                alert("Por favor, selecione um paciente, uma data e um horário.");
              }
            }}
            className="bg-[#0088A3] hover:bg-[#00718a] text-white px-6 py-3 rounded-md"
          />
        </div>
      </div>

      </div>
    </Main>
  );
}