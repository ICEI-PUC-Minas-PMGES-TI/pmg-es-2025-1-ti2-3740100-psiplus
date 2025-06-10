import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import SelecaoPacienteModal from "./SelecaoPacienteModal";
import axios from "axios";

interface Paciente {
  id: number;
  nome: string;
  cpf?: string;
}

interface AgendamentoModalProps {
  open: boolean;
  onClose: () => void;
  dataSelecionada: { start: Date; end: Date } | null;
  pacientes: Paciente[];
  onAgendado: (paciente: Paciente) => void;
}

export default function AgendamentoModal({
  open,
  onClose,
  dataSelecionada,
  pacientes,
  onAgendado,
}: AgendamentoModalProps) {
  const [pacienteNome, setPacienteNome] = useState("");
  const [isSalvando, setIsSalvando] = useState(false);
  const [selecaoModalAberto, setSelecaoModalAberto] = useState(false);
  const [pacientesEncontrados, setPacientesEncontrados] = useState<Paciente[]>([]);

  const sessao = JSON.parse(sessionStorage.getItem("sessaoPsicologo") || "{}");
  const psicologoId = sessao?.usuarioId || null;

  if (!open || !dataSelecionada || !dataSelecionada.start || !dataSelecionada.end) {
    console.warn("AgendamentoModal: Propriedades inválidas", { open, dataSelecionada });
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

  const buscarPacientesPorNome = async (nome: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/pacientes?nome=${encodeURIComponent(nome)}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      console.log("Resposta completa do backend (buscarPacientesPorNome):", response.data);
      return response.data.map((p: any) => {
        const cpf = p.cpf || p.usuario?.cpfCnpj || "Não informado";
        console.log(`Mapeando paciente ID ${p.pacienteId}:`, {
          nome: p.nome || p.usuario?.nome,
          cpf,
          raw: p,
        });
        return {
          id: p.pacienteId,
          nome: p.nome || p.usuario?.nome || "Nome não informado",
          cpf,
        };
      });
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      console.log("Usando fallback local com pacientes:", pacientes);
      return pacientes.filter((p) =>
        p.nome.toLowerCase().includes(nome.toLowerCase())
      );
    }
  };

  const salvarAgendamento = async (paciente: Paciente) => {
    if (!psicologoId) {
      alert("Psicólogo não está logado!");
      return;
    }

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
      pacienteId: paciente.id,
      psicologoId: psicologoId,
      data: data,
      horarioInicio: horarioInicio,
      horarioFim: horarioFim,
    };

    try {
      const response = await fetch("http://localhost:8080/consultas/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onAgendado(paciente);
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

  const handleAgendar = async () => {
    if (!pacienteNome.trim()) {
      alert("Digite o nome do paciente!");
      return;
    }

    const pacientesEncontrados = await buscarPacientesPorNome(pacienteNome.trim());
    console.log("Pacientes encontrados:", pacientesEncontrados);
    console.log("IDs dos pacientes:", pacientesEncontrados.map((p) => p.id));

    if (pacientesEncontrados.length === 0) {
      alert("Paciente não encontrado!");
      return;
    }

    if (pacientesEncontrados.length === 1) {
      salvarAgendamento(pacientesEncontrados[0]);
    } else {
      setPacientesEncontrados(pacientesEncontrados);
      setSelecaoModalAberto(true);
    }
  };

  return (
    <>
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
          <div className="relative mb-4">
            <p className="text-sm mb-1">Digite o nome do paciente</p>
            <input
              type="text"
              className="w-full p-2 pl-10 rounded text-gray-700 bg-gray-200"
              placeholder="Nome do paciente"
              value={pacienteNome}
              onChange={(e) => setPacienteNome(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-600 translate-y-[10px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M16.65 16.65A7 7 0 1010 3a7 7 0 006.65 13.65z"
                />
              </svg>
            </div>
          </div>

          <p className="mb-3 text-sm">Confirme os dados para agendar a consulta</p>
          <p className="text-sm text-gray-600 capitalize font-bold">
            <strong>{diaSemana}</strong>, {dataFormatada}
          </p>

          <div className="flex justify-end space-x-2 mt-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (isSalvando || !pacienteNome.trim() || !psicologoId) {
                  return;
                }
                handleAgendar();
              }}
              className={`inline-flex items-center px-4 py-2 rounded text-blue-500 ${
                isSalvando || !pacienteNome.trim() || !psicologoId
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-blue-700"
              }`}
            >
              {isSalvando ? "Salvando..." : "Agendar"}
              <FaCheck className="ml-2" />
            </a>
          </div>
        </div>
      </div>

      <SelecaoPacienteModal
        open={selecaoModalAberto}
        onClose={() => setSelecaoModalAberto(false)}
        pacientes={pacientesEncontrados}
        onSelecionar={salvarAgendamento}
      />
    </>
  );
}