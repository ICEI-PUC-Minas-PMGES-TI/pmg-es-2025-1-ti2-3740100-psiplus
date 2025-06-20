import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router";

interface Psicologo {
  id: number;
  nome: string;
  crp?: string;
}

interface AgendamentoModalPacienteProps {
  open: boolean;
  onClose: () => void;
  dataSelecionada: { start: Date; end: Date } | null;
  onAgendado: (psicologo: Psicologo) => void;
  psicologoId: number | null;
  psicologoNome: string;
}

export default function AgendamentoModalPaciente({
  open,
  onClose,
  dataSelecionada,
  onAgendado,
  psicologoId,
  psicologoNome,
}: AgendamentoModalPacienteProps) {
  const [isSalvando, setIsSalvando] = useState(false);
  const navigate = useNavigate();

  const sessao = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("sessaoPaciente") || "{}") : {};
  const pacienteId = sessao?.usuarioId || null;

  const psicologo: Psicologo | null = psicologoId
    ? { id: psicologoId, nome: psicologoNome }
    : null;

  if (!open || !dataSelecionada || !dataSelecionada.start || !dataSelecionada.end) {
    return null;
  }

  if (!pacienteId) {
    alert("Paciente não está logado!");
    navigate("/login");
    return null;
  }

  // Não exibe mais "Carregando dados do psicólogo"
  if (!psicologo) {
    onClose();
    alert("Horário indisponível para agendamento.");
    return null;
  }

  const diaSemana = dataSelecionada.start.toLocaleDateString("pt-BR", {
    weekday: "long",
  });

  const dataFormatada = dataSelecionada.start.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const salvarAgendamento = async () => {
    setIsSalvando(true);

    const data = dataSelecionada.start.toISOString().split("T")[0];
    const horarioInicio = dataSelecionada.start.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const horarioFim = dataSelecionada.end.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const body = {
      pacienteId: pacienteId,
      psicologoId: psicologo.id,
      data,
      horarioInicio,
      horarioFim,
    };

    try {
      const response = await axios.post("http://localhost:8080/consultas/agendar", body);

      if (response.status === 200) {
        onAgendado(psicologo);
        onClose();
      } else {
        const erroData = response.data;
        alert(`Erro ao agendar: ${erroData.message || "Tente novamente."}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setIsSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-50 bg-black backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-lg w-full max-w-xl min-h-[300px] p-8 z-50">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-black font-bold pb-5"
          >
            X Cancelar
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm mb-1">
            Agendar consulta com: <strong>{psicologo.nome}</strong>
          </p>
          <p className="text-sm mb-3">Confirme os dados para agendar a consulta</p>
          <p className="text-sm text-gray-600 capitalize font-bold">
            <strong>{diaSemana}</strong>, {dataFormatada}
          </p>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (isSalvando) return;
              salvarAgendamento();
            }}
            className={`inline-flex items-center px-4 py-2 rounded text-blue-500 ${
              isSalvando ? "opacity-50 cursor-not-allowed" : "hover:text-blue-700"
            }`}
          >
            {isSalvando ? "Salvando..." : "Agendar"}
            <FaCheck className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}