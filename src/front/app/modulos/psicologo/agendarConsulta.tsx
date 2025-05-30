import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import { useState, useEffect } from "react";
import axios from "axios";
import TimeSlotSelector from "~/componentes/TimeSlotSelector";

export default function AgendarConsulta() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState("2025-03-16");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/pacientes/resumo")
      .then((res) => setPatients(res.data))
      .catch((err) => {
        setPatients([]);
        console.error("Erro ao buscar pacientes:", err);
      });
  }, []);

  useEffect(() => {
    const date = new Date(selectedDate);
    if (
      date &&
      date.getDate() === 16 &&
      date.getMonth() === 2 &&
      date.getFullYear() === 2025
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
    } else if (date) {
      setAvailableTimeSlots(["09:00", "11:00", "14:00", "16:00", "17:00"]);
    } else {
      setAvailableTimeSlots([]);
    }
    setSelectedTimeSlot(null);
  }, [selectedDate, selectedPatient]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handlePacienteChange = (e) => {
    const selected = patients.find((p) => p.nome === e.target.value);
    setSelectedPatient(selected || { nome: e.target.value });
  };

  const handleTimeSlotSelect = (time) => {
    setSelectedTimeSlot(time);
  };

  const handleScheduleAppointment = () => {
    if (selectedPatient && selectedDate && selectedTimeSlot) {
      alert(`Consulta agendada para:
        Paciente: ${selectedPatient.nome}
        Data: ${new Date(selectedDate).toLocaleDateString("pt-BR")}
        Horário: ${selectedTimeSlot}`);
    } else {
      alert("Por favor, selecione um paciente, uma data e um horário.");
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <MenuLateralPsicólogo />
      <Main>
        <div className="flex flex-col items-center p-10 gap-6 w-full">
          <h1 className="text-2xl font-bold text-[#303030]">Agendar Consulta</h1>

          {/* Campo do paciente */}
          <div className="w-full max-w-md">
            <label htmlFor="paciente" className="block text-sm mb-1 text-[#666]">
              Selecione um Paciente
            </label>
            <select
              id="paciente"
              value={selectedPatient?.nome || ""}
              onChange={handlePacienteChange}
              className="w-full p-3 rounded-md bg-[#F4F6F8] text-sm text-gray-600 placeholder:text-gray-400 border border-gray-300 focus:outline-none"
            >
              <option value="" disabled hidden>
                Nome do Paciente
              </option>
              {patients.map((p) => (
                <option key={p.id} value={p.nome}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Campo de data */}
          <div className="w-full max-w-md">
            <label htmlFor="data" className="block text-sm mb-1 text-[#666]">
              Selecione uma Data
            </label>
            <input
              type="date"
              id="data"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full p-3 rounded-md bg-[#F4F6F8] text-sm text-gray-600 border border-gray-300 focus:outline-none"
            />
          </div>

          {/* Horários disponíveis */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-md mt-6">
            {availableTimeSlots.map((hora) => (
              <button
                key={hora}
                onClick={() => handleTimeSlotSelect(hora)}
                className={`border-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all
                  ${
                    selectedTimeSlot === hora
                      ? "bg-[#0088A3] text-white border-[#0088A3]"
                      : "text-[#0088A3] border-[#0088A3] hover:bg-[#e0f7fb]"
                  }`}
              >
                {hora}
              </button>
            ))}
          </div>

          {/* Botão Agendar */}
          <div className="w-full max-w-md flex justify-end mt-4">
            <BotaoPadrao
              texto="Agendar Consulta"
              onClick={handleScheduleAppointment}
              className="flex items-center gap-2 bg-[#0088A3] hover:bg-[#00718a] text-white px-6 py-3 rounded-md"
            />
          </div>
        </div>
      </Main>
    </div>
  );
}
