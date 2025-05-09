import React, { useState } from "react";
import './css';  

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
  const [showNotes, setShowNotes] = useState<number | null>(null);

  return (
    <div className="container">
      <div className="header">
        <h2>HISTÓRICO DE CONSULTAS</h2>
        <div className="add-note">Adicionar anotações <strong>+</strong></div>
      </div>

      {consultations.map((c, index) => (
        <div key={index} className="appointment">
          <div className="appointment-header">
            <div className="left">
              <div className="checkmark" />
              <div className="info">
                {c.date} <span>{c.doctor}</span>
              </div>
            </div>
            {c.notes && (
              <button
                className="toggle-button"
                onClick={() => setShowNotes(showNotes === index ? null : index)}
              >
                {showNotes === index ? "Ocultar anotações" : "Exibir anotações"}
              </button>
            )}
          </div>
          {showNotes === index && c.notes && (
            <div className="notes">{c.notes}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConsultationHistory;
