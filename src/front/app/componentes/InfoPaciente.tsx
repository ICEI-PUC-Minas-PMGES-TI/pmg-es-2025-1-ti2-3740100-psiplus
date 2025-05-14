import React from 'react';
import { Person } from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from "@mui/icons-material/History";

interface InfoPacienteProps {
  nome: string;
  email: string;
  ultimaConsulta: string;
  fotoPerfil: string;
}

export default function InfoPaciente({ nome, fotoPerfil, email, ultimaConsulta }: InfoPacienteProps) {
  return (
    <div className="w-[280px] p-4 bg-white rounded-xl shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={fotoPerfil}
            alt="Foto do Paciente"
            className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-md"
          />
          <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow border border-gray-300">
            <PhotoCameraIcon style={{ color: "#858EBD", fontSize: 18 }} />
          </button>
        </div>
        <h2 className="mt-2 font-semibold text-[16px] text-[#3A3F63]">{nome}</h2>
        <p className="text-sm text-[#5A607F]">{email}</p>
        <p className="text-sm text-gray-400">Última consulta - {ultimaConsulta}</p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#F4F7FF] border-l-4 border-[#0088A3] shadow-sm w-full">
          <div className="bg-[#0088A3] rounded-md p-1">
            <PersonIcon style={{ color: "white" }} />
          </div>
          <span className="text-sm font-semibold text-[#2B2F42]">Informações Pessoais</span>
        </button>

        <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 w-full">
          <div className="bg-[#F4F7FF] rounded-md p-1">
            <HistoryIcon style={{ color: "#858EBD" }} />
          </div>
          <span className="text-sm font-medium text-[#2B2F42]">Histórico de Consultas</span>
        </button>

        <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 w-full">
          <div className="bg-[#F4F7FF] rounded-md p-1">
            <BarChartIcon style={{ color: "#858EBD" }} />
          </div>
          <span className="text-sm font-medium text-[#2B2F42]">Estatísticas das Emoções</span>
        </button>

        <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 w-full">
          <div className="bg-[#F4F7FF] rounded-md p-1">
            <SentimentSatisfiedAltIcon style={{ color: "#858EBD" }} />
          </div>
          <span className="text-sm font-medium text-[#2B2F42]">Calendário de Emoções</span>
        </button>
      </div>
    </div>
  );
}
