import React from "react";
import Logo from "./FotoPerfil.png";
import './cssGest/PatientInfoSidebar.css'; 

const PatientInfoSidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="section-title">Gestão de Paciente</div>

      <div className="profile">
       <img src={Logo} alt="Foto da paciente" />
        <h3>Isabelle Stanley</h3>
        <p>
          stanley.i@hotmail.com<br />
          <small>Última consulta - 12/02/2025</small>
        </p>
      </div>

      <div className="menu">
        <div className="menu-item">
          <div className="icon">👤</div>
          Informações Pessoais
        </div>
        <div className="menu-item active">
          <div className="icon">➕</div>
          Histórico de Consultas
        </div>
        <div className="menu-item">
          <div className="icon">🏠</div>
          Estatísticas das Emoções
        </div>
        <div className="menu-item">
          <div className="icon">😊</div>
          Calendário de Emoções
        </div>
      </div>
    </div>
  );
};

export default PatientInfoSidebar;
