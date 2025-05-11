import React from 'react';
import Sidebar from '~/componentes/Sidebar';
import PatientInfoSidebar from '~/componentes/PatientInfoSidebar';
import ConsultationHistory from '~/componentes/ConsultationHistory';
import Header from '~/componentes/HeaderGesRes';


export function GestaoRegistros(){
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar lateral esquerda */}
      <Sidebar />

      {/* Sidebar lateral direita com informações do paciente */}
      <PatientInfoSidebar />

      {/* Área principal com header e conteúdo */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Cabeçalho */}
        <Header />

        {/* Conteúdo principal (ConsultationHistory) */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <ConsultationHistory />
        </div>
      </main>
    </div>
  );
};

