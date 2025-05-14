import React from 'react';
import { Person } from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from "@mui/icons-material/History";
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface InfoPacienteProps {
  nome: string;
  email: string;
  ultimaConsulta: string;
  fotoPerfil: string;
  abaAtiva: "info" | "historico" | "estatisticas" | "emocional";
}

export default function InfoPaciente({
  nome,
  fotoPerfil,
  email,
  ultimaConsulta,
  abaAtiva
}: InfoPacienteProps) {
  const botaoClasses = (ativo: boolean) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg w-full cursor-pointer transition-colors duration-150 ${
      ativo ? "bg-white shadow font-semibold" : "bg-[#F4F7FF] hover:bg-gray-100 font-medium"
    }`;

  const iconeWrapperClasses = (ativo: boolean) =>
    `rounded-md p-1 transition-colors duration-150 ${
      ativo ? "bg-[#0097a7] drop-shadow" : "bg-[#F4F7FF]"
    }`;

  const iconeColor = (ativo: boolean) => (ativo ? "#ffffff" : "#858EBD");

  return (
    <div className="w-[280px] p-4 bg-white rounded-xl shadow-sm relative">
      {/* Botão de três pontinhos */}
      <button className="absolute top-4 right-4 text-[#858EBD] hover:text-[#333]">
        <MoreVertIcon />
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={fotoPerfil}
            alt="Foto do Paciente"
            className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-md"
          />
          <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow border border-gray-300 cursor-pointer">
            <PhotoCameraIcon style={{ color: "#858EBD", fontSize: 18 }} />
          </button>
        </div>
        <h2 className="mt-2 font-semibold text-[16px] text-[#3A3F63]">{nome}</h2>
        <p className="text-sm text-[#5A607F]">{email}</p>
        <p className="text-sm text-gray-400">Última consulta - {ultimaConsulta}</p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button className={botaoClasses(abaAtiva === "info")}>
          <div className={iconeWrapperClasses(abaAtiva === "info")}>
            <PersonIcon style={{ color: iconeColor(abaAtiva === "info") }} />
          </div>
          <span className="text-sm text-[#2B2F42]">Informações Pessoais</span>
        </button>

        <button className={botaoClasses(abaAtiva === "historico")}>
          <div className={iconeWrapperClasses(abaAtiva === "historico")}>
            <HistoryIcon style={{ color: iconeColor(abaAtiva === "historico") }} />
          </div>
          <span className="text-sm text-[#2B2F42]">Histórico de Consultas</span>
        </button>

        <button className={botaoClasses(abaAtiva === "estatisticas")}>
          <div className={iconeWrapperClasses(abaAtiva === "estatisticas")}>
            <BarChartIcon style={{ color: iconeColor(abaAtiva === "estatisticas") }} />
          </div>
          <span className="text-sm text-[#2B2F42]">Estatísticas das Emoções</span>
        </button>

        <button className={botaoClasses(abaAtiva === "emocional")}>
          <div className={iconeWrapperClasses(abaAtiva === "emocional")}>
            <SentimentSatisfiedAltIcon style={{ color: iconeColor(abaAtiva === "emocional") }} />
          </div>
          <span className="text-sm text-[#2B2F42]">Calendário de Emoções</span>
        </button>
      </div>
    </div>
  );
}
