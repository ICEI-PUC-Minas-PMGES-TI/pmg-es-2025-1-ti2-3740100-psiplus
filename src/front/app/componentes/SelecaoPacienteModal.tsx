import { useState } from "react";
import { FaCheck } from "react-icons/fa";

interface Paciente {
  id: number;
  nome: string;
  cpf?: string;
}

interface SelecaoPacienteModalProps {
  open: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  onSelecionar: (paciente: Paciente) => void;
}

function SelecaoPacienteModal({
  open,
  onClose,
  pacientes,
  onSelecionar,
}: SelecaoPacienteModalProps) {
  const [pacienteSelecionado, setPacienteSelecionado] = useState<number | null>(null);

  const handleConfirmar = () => {
    const paciente = pacientes.find((p) => p.id === pacienteSelecionado);
    if (paciente) {
      onSelecionar(paciente);
      onClose();
    } else {
      alert("Selecione um paciente!");
    }
  };

  if (!open || !pacientes?.length) {
    return null;
  }

  // Verificar duplicatas de IDs
  const ids = pacientes.map((p) => p.id);
  const idsUnicos = new Set(ids);
  if (ids.length !== idsUnicos.size) {
    console.warn("SelecaoPacienteModal: IDs duplicados encontrados:", pacientes);
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-50 bg-black backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-lg w-full max-w-md p-6 z-60">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black font-bold"
          >
            X Cancelar
          </button>
        </div>
        <h2 className="text-lg font-semibold text-[#161736] mb-4">
          Múltiplos pacientes encontrados
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Selecione o paciente correto para o agendamento:
        </p>
        <div className="max-h-[300px] overflow-y-auto mb-4">
          {pacientes.map((paciente) => (
            <div
              key={paciente.id}
              className={`flex items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
                pacienteSelecionado === paciente.id ? "bg-gray-100" : ""
              }`}
              onClick={() => setPacienteSelecionado(paciente.id)}
            >
              <input
                type="radio"
                name="paciente"
                value={paciente.id}
                checked={pacienteSelecionado === paciente.id}
                onChange={() => setPacienteSelecionado(paciente.id)}
                className="mr-3"
              />
              <div>
                <p className="text-sm font-medium text-[#161736]">
                  {paciente.nome}
                </p>
                <p className="text-xs text-gray-600">
                  CPF: {paciente.cpf || "Não informado"}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleConfirmar();
            }}
            className={`inline-flex items-center px-4 py-2 rounded text-blue-500 ${
              !pacienteSelecionado ? "opacity-50 cursor-not-allowed" : "hover:text-blue-700"
            }`}
          >
            Confirmar
            <FaCheck className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default SelecaoPacienteModal;