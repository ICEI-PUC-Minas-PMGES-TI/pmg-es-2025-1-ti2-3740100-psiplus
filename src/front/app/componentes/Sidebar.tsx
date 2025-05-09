import React from "react";
import './sidebar.css'; 
const Sidebar: React.FC = () => {
  return (
    <aside className="main-sidebar">
      <div>
        <div className="logo">
          <img src="https://via.placeholder.com/40" alt="Logo" />
          <span>Psi+</span>
        </div>

        <div className="user-info">
          <img src="https://via.placeholder.com/40" alt="Dr. Lucas Almeida" />
          <div>
            <div className="name">Dr. Lucas Almeida</div>
            <div className="role">Psicólogo</div>
          </div>
        </div>

        <div className="menu-section">
          <div className="menu-item">📅 Agenda</div>
          <div className="menu-item active">👤 Pacientes</div>
        </div>
      </div>

      <div className="actions">
        <button className="btn paciente">➕ Novo Paciente</button>
        <button className="btn consulta">➕ Nova Consulta</button>
      </div>
    </aside>
  );
};

export default Sidebar;
