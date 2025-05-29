import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import { useState, useEffect } from "react";

export default function AgendarConsulta() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 16));
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const patients = [
    { id: 1, name: 'João Silva' },
    { id: 2, name: 'Maria Souza' },
    { id: 3, name: 'Carlos Santos' },
    { id: 4, name: 'Ana Oliveira' },
    { id: 5, name: 'Pedro Costa' },
  ];

  const handleSearchPatient = (query) => {

  };

  useEffect(() => {
    const fetchTimeSlots = () => {
     
      if (selectedDate && selectedDate.getDate() === 16 && selectedDate.getMonth() === 2 && selectedDate.getFullYear() === 2025) {
        setAvailableTimeSlots([
          '08:00', '10:00', '13:00', '15:00', '17:00', '18:00', '19:00'
        ]);
      } else if (selectedDate) {

        setAvailableTimeSlots(['09:00', '11:00', '14:00', '16:00', '17:00']);
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
        Paciente: ${selectedPatient.name}
        Data: ${selectedDate.toLocaleDateString('pt-BR')}
        Horário: ${selectedTimeSlot}`);
    } else {
      alert('Por favor, selecione um paciente, uma data e um horário.');
    }
  };

  return (
    <Main>
      <div className="flex h-screen bg-gray-100"> 
        <MenuLateralPsicólogo telaAtiva="agendamento" />
        <div className="flex-1 p-8 overflow-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-black text-2xl font-bold">Agendar Consulta</h1> 
            <BotaoPadrao
              texto="X Cancelar"
              className="bg-transparent text-gray-600 hover:bg-gray-200"
              onClick={() => console.log('Cancelar agendamento')}
            />
          </header>

          <div className="flex flex-col gap-6"> 
            <div className="bg-white text-black shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Selecione um Paciente</h2>
              
              {selectedPatient && (
                <p className="mt-4 text-gray-700">Paciente selecionado: <span className="font-medium text-blue-600">{selectedPatient.name}</span></p>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-white text-black p-6 rounded-lg shadow-md flex-1">
            
              </div>

              <div className="bg-white text-black p-6 rounded-lg shadow-md w-full md:w-96">
                <TimeSlotSelector
                  selectedDate={selectedDate}
                  timeSlots={availableTimeSlots}
                  onSelectTimeSlot={handleTimeSlotSelect}
                  selectedTimeSlot={selectedTimeSlot}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <BotaoPadrao
                texto="Agendar Consulta"
                className="bg-[#0088A3] hover:bg-[#00708C] px-8 py-3 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleScheduleAppointment}
                disabled={!selectedPatient || !selectedDate || !selectedTimeSlot}
              />
            </div>
          </div> 
        </div>
      </div>
    </Main>
  );
}