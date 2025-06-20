import { useState, useEffect } from "react";
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
}

export default function AgendamentoModalPaciente({
  open,
  onClose,
  dataSelecionada,
  onAgendado,
}: AgendamentoModalPacienteProps) {
  const [isSalvando, setIsSalvando] = useState(false);
  const [psicologo, setPsicologo] = useState<Psicologo | null>(null);
  const navigate = useNavigate();

  // Acessar sessionStorage apenas no navegador
  const sessao = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("sessaoPaciente") || "{}") : {};
  const pacienteId = sessao?.usuarioId || null;

  // Buscar dados do paciente, incluindo o psicologoId
  useEffect(() => {
    const fetchPaciente = async () => {
      if (!pacienteId) return;

      try {
       const response = await axios.get(`http://localhost:8080/pacientes/${pacienteId}/dados-agendamento`, {
          headers: { "Cache-Control": "no-cache" },
        });
        const pacienteData = response.data;
        setPsicologo({
          id: pacienteData.psicologoId,
          nome: pacienteData.psicologoNome || "Psicólogo não informado",
          crp: pacienteData.psicologoCrp || "Não informado",
        });
      } catch (error) {
        console.error("Erro ao buscar dados do paciente:", error);
        alert("Erro ao carregar dados do psicólogo. Tente novamente.");
      }
    };

    fetchPaciente();
  }, [pacienteId]);

  if (!open || !dataSelecionada || !dataSelecionada.start || !dataSelecionada.end) {
    console.warn("AgendamentoModalPaciente: Propriedades inválidas", { open, dataSelecionada });
    return null;
  }

  if (!pacienteId) {
    alert("Paciente não está logado!");
    navigate("/login");
    return null;
  }

  if (!psicologo) {
    return <div>Carregando dados do psicólogo...</div>;
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
      data: data,
      horarioInicio: horarioInicio,
      horarioFim: horarioFim,
    };

    const handleSelectEvent = (event: Evento) => {
  console.log("Evento selecionado:", event);
  if (event.tipo === "disponivel") {
    // ...restante do código...
  }
};

    try {
      const response = await fetch("http://localhost:8080/consultas/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onAgendado(psicologo);
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Erro ao agendar: ${errorData.message || "Tente novamente."}`);
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
            className="text-gray-500 hover:text-black font-bold pb-5"
          >
            X Cancelar
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm mb-1">Agendar consulta com: <strong>{psicologo.nome}</strong></p>
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