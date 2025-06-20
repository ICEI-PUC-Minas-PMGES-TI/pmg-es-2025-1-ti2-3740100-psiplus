import React, { useEffect, useState } from 'react';
import {
  Smile, Camera, User, Clock,
  Menu, History, BarChart3
} from 'lucide-react';
import { useUltimaConsulta } from "~/utils/ultimaConsulta";
import { format, parseISO } from "date-fns";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import PerfilUser from "../../public/assets/PerfilUser.jpg";
import BotaoLateral from "~/componentes/BotaoLateral";

interface InfoPacienteProps {
  abaAtiva: "info" | "historico" | "estatisticas" | "emocional";
}

export default function InfoPaciente({ abaAtiva }: InfoPacienteProps) {
  const { id: pacienteId } = useParams();
  const [menuAberto, setMenuAberto] = useState(true);
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<any>({
    usuario: {
      nome: "",
      email: ""
    }
  });
  const ultimaConsulta = useUltimaConsulta(pacienteId);

  useEffect(() => {
    if (!pacienteId) return;
    carregarPaciente(pacienteId);
  }, [pacienteId]);

  function carregarPaciente(pacienteId: string) {
    axios.get(`http://localhost:8080/pacientes/${pacienteId}`)
        .then((res) => {
          setPaciente(res.data);
        })
        .catch((err) => {
          console.error("Erro ao buscar paciente:", err);
        });
  }

  return (
      <div className={`flex flex-col transition-all duration-300 px-2 py-3 ${menuAberto ? "w-64" : "w-20"}`}>
        {/* Botão de alternância */}
        <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="mb-4 self-end cursor-pointer mr-1"
            title="Expandir/recolher menu"
        >
          <Menu color="#858EBD" size={24} />
        </button>

        {/* Perfil */}
        <div className={`flex flex-col items-center ${menuAberto ? "text-left" : "text-center"}`}>
          <div className="relative">
            <img
                src={paciente.usuario.fotoPerfil || PerfilUser}
                alt="Foto do Paciente"
                className={`rounded-full object-cover transition-all duration-300 ${menuAberto ? "w-24 h-24" : "w-10 h-10"}`}
            />
          </div>

          {menuAberto && (
              <>
                <h2 className="mt-2 font-semibold text-lg text-[#3A3F63]">
                  {paciente?.usuario?.nome || ""}
                </h2>
                <p className="text-sm text-[#5A607F]">{paciente?.usuario?.email || ""}</p>
                <p className="text-xs text-gray-400">
                  {ultimaConsulta
                      ? `Última consulta - ${format(parseISO(ultimaConsulta.data), "dd/MM/yyyy")}`
                      : "Nenhuma consulta encontrada"}
                </p>
              </>
          )}
        </div>

        {/* Botões */}
        <div className="mt-6 flex flex-col gap-3 w-full">
          <BotaoLateral
              ativo={abaAtiva === "info"}
              visivel={menuAberto}
              onClick={() => navigate(`/psicologo/pacientes/${pacienteId}`)}
              icone={<User color={abaAtiva === "info" ? "white" : "#858EBD"} size={20} />}
              texto="Informações Pessoais"
          />
          <BotaoLateral
              ativo={abaAtiva === "historico"}
              visivel={menuAberto}
              onClick={() => navigate(`/psicologo/gestaoRegistros/${pacienteId}`)}
              icone={<History color={abaAtiva === "historico" ? "white" : "#858EBD"} size={20} />}
              texto="Histórico de Consultas"
          />
          <BotaoLateral
              ativo={abaAtiva === "estatisticas"}
              visivel={menuAberto}
              onClick={() => navigate(`/psicologo/estatisticasEmocoes/${pacienteId}`)}
              icone={<BarChart3 color={abaAtiva === "estatisticas" ? "white" : "#858EBD"} size={20} />}
              texto="Estatísticas das Emoções"
          />
          <BotaoLateral
              ativo={abaAtiva === "emocional"}
              visivel={menuAberto}
              onClick={() => navigate(`/psicologo/calendarioEmocoes/${pacienteId}`)}
              icone={<Smile color={abaAtiva === "emocional" ? "white" : "#858EBD"} size={20} />}
              texto="Calendário de Emoções"
          />
        </div>
      </div>
  );
}
