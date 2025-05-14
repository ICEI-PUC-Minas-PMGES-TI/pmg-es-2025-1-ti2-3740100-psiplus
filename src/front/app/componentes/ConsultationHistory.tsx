import React, { useState } from "react";

interface NoteProps {
  date: string;
  doctor: string;
  notes?: string;
}

const consultations: NoteProps[] = [
  {
    date: "01/04/2025 17:30 - 18:30",
    doctor: "Dr. Lucas Almeida"
  },
  {
    date: "12/03/2025 09:30 - 10:30",
    doctor: "Dr. Lucas Almeida",
    notes: `
      Apresentação inicial: O paciente iniciou a sessão relatando sensação constante de inquietação...
      Intervenções realizadas: Durante a conversa, o paciente mencionou pensamentos recorrentes...
      Evolução: O paciente relatou sentir-se mais calmo ao final da sessão...
      Plano: Será revisada a prática da respiração diafragmática...
    `
  },
  {
    date: "25/02/2025 11:00 - 12:00",
    doctor: "Dr. Lucas Almeida"
  },
  {
    date: "01/02/2025 09:30 - 10:30",
    doctor: "Dr. Lucas Almeida"
  }
];

const ConsultationHistory: React.FC = () => {
  const [showNotesIndex, setShowNotesIndex] = useState<number | null>(null);

  const toggleNotes = (index: number) => {
    setShowNotesIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[20px] font-bold text-[#1c1c1c]">HISTÓRICO DE CONSULTAS</h2>
        <div className="text-sm font-semibold text-[#0097a7] cursor-pointer flex items-center gap-1">
          Adicionar anotações <strong className="text-[18px]">+</strong>
        </div>
      </div>

      {consultations.map((c, index) => (
        <div key={index} className="bg-white rounded-xl p-5 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#00695c] rounded-md flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <div className="text-sm font-semibold text-[#1c1c1c]">
                {c.date}
                <span className="block font-normal text-[#666]">{c.doctor}</span>
              </div>
            </div>

            <button
              className="text-sm font-semibold bg-[#f0f1f6] px-3 py-2 rounded-md text-[#333] cursor-pointer hover:bg-[#e0e2eb] transition-colors duration-200"
              onClick={() => toggleNotes(index)}
            >
              {showNotesIndex === index ? "Ocultar anotações" : "Exibir anotações"}
            </button>
          </div>

          {showNotesIndex === index && (
            <div className="mt-2 pt-2 border-t border-[#eee] text-sm leading-relaxed text-[#333] whitespace-pre-line">
              {c.notes ? c.notes : "Nenhuma anotação registrada."}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConsultationHistory;
