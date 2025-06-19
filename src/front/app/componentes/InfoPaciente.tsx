import React, {useEffect, useState} from 'react';
import {BarChart, Smile, Camera, User, Clock, MoreVertical, BarChart2, Menu, History, BarChart3} from 'lucide-react';
import {useUltimaConsulta} from "~/utils/ultimaConsulta";
import {format, parseISO} from "date-fns";
import axios from "axios";
import BotaoLateral from "~/componentes/BotaoLateral";
import {useNavigate, useParams} from "react-router";
import PerfilUser from "../../public/assets/PerfilUser.jpg";

interface InfoPacienteProps {
  abaAtiva: "info" | "historico" | "estatisticas" | "emocional";
}

export default function InfoPaciente({
  abaAtiva
}: InfoPacienteProps) {
  const { id: pacienteId } = useParams();
  const [menuAberto, setMenuAberto] = useState(true);
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<any>({
    usuario: {
      id: undefined,
      nome: "",
      cpfCnpj: "",
      email: "",
      sexo: "",
      telefone: "",
      dataNascimento: "",
      endereco: {
        id: undefined,
        rua: "",
        numero: "",
        bairro: "",
        cep: "",
        cidade: "",
        estado: "",
      },
    },
    notas: "",
  });
  const ultimaConsulta = useUltimaConsulta(pacienteId);

  useEffect(() => {
    const sessao = JSON.parse(sessionStorage.getItem("sessaoPaciente") || "{}");
    if (sessao?.usuarioId) {
      carregarPaciente(sessao.usuarioId);
    }
  }, []);

  useEffect(() => {
    if (!pacienteId) return;
    carregarPaciente(pacienteId);
  }, [pacienteId]);

  function carregarPaciente(pacienteId: string) {
    axios.get(`http://localhost:8080/pacientes/${pacienteId}`)
        .then((res) => {
          const data = res.data;

          setPaciente({
            notas: data.notas || "",
            usuario: {
              id: data.usuario?.usuarioId ?? undefined,
              nome: data.usuario?.nome || "",
              cpfCnpj: data.usuario?.cpfCnpj || "",
              email: data.usuario?.email || "",
              sexo: data.usuario?.sexo || "",
              telefone: formatarTelefone(data.usuario?.telefone || ""),
              dataNascimento: data.usuario?.dataNascimento
                  ? formatarDataParaBrasileira(data.usuario.dataNascimento)
                  : "",
              endereco: {
                id: data.usuario?.endereco?.id ?? undefined,
                rua: data.usuario?.endereco?.rua || "",
                numero: data.usuario?.endereco?.numero?.toString() || "",
                bairro: data.usuario?.endereco?.bairro || "",
                cep: data.usuario?.endereco?.cep || "",
                cidade: data.usuario?.endereco?.cidade || "",
                estado: data.usuario?.endereco?.estado || "",
              },
            },
          });
        })
        .catch((err) => {
          console.error("Erro ao buscar paciente:", err);
        });
  }

  const formatarTelefone = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");

    if (apenasNumeros.length <= 10) {
      return apenasNumeros.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      return apenasNumeros.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
  };

  const formatarDataParaISO = (data: string) => {
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
  };

  const formatarDataParaBrasileira = (dataISO: string) => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
      <div className="w-1/4 px-2 py-3">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <img
                src={PerfilUser}
                alt="Foto do Paciente"
                className="rounded-full w-24 h-24 object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
              <Camera color="#858EBD" size={20} />
            </button>
          </div>
          <h2 className="mt-2 font-semibold text-lg text-[#3A3F63]">
            {paciente?.usuario?.nome || ""}
          </h2>
          <p className="text-sm text-[#5A607F]">{paciente?.usuario?.email || ""}</p>
          <p className="text-xs text-gray-400">
            {ultimaConsulta
                ? `Última consulta - ${format(parseISO(ultimaConsulta.data), "dd/MM/yyyy")}`
                : "Nenhuma consulta encontrada"}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
              onClick={() => navigate(`/psicologo/pacientes/${pacienteId}`)}
              className={`cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg w-full
            ${abaAtiva === "info" ? "bg-white shadow-md text-[#2B2F42]" : "hover:bg-gray-100 text-[#2B2F42]"}`}
          >
            <div
                className={`rounded-md p-1 ${
                    abaAtiva === "info" ? "bg-[#0088A3]" : "bg-[#F4F7FF]"
                }`}
            >
              <User color={abaAtiva === "info" ? "white" : "#858EBD"} size={20} />
            </div>
            <span className={`text-sm whitespace-nowrap ${abaAtiva === "info" ? "font-medium" : "font-regular"}`}>
            Informações Pessoais
          </span>
          </button>

          <button
              onClick={() => navigate(`/psicologo/gestaoRegistros/${pacienteId}`)}
              className={`cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg w-full
            ${abaAtiva === "historico" ? "bg-white shadow-md text-[#2B2F42]" : "hover:bg-gray-100 text-[#2B2F42]"}`}
          >
            <div
                className={`rounded-md p-1 ${
                    abaAtiva === "historico" ? "bg-[#0088A3]" : "bg-[#F4F7FF]"
                }`}
            >
              <History color={abaAtiva === "historico" ? "white" : "#858EBD"} size={20} />
            </div>
            <span className={`text-sm whitespace-nowrap ${abaAtiva === "historico" ? "font-medium" : "font-regular"}`}>
            Histórico de Consultas
          </span>
          </button>

          <button
              onClick={() => navigate(`/psicologo/estatisticasEmocoes/${pacienteId}`)}
              className={`cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg w-full
            ${abaAtiva === "estatisticas" ? "bg-white shadow-md text-[#2B2F42]" : "hover:bg-gray-100 text-[#2B2F42]"}`}
          >
            <div
                className={`rounded-md p-1 ${
                    abaAtiva === "estatisticas" ? "bg-[#0088A3]" : "bg-[#F4F7FF]"
                }`}
            >
              <BarChart3 color={abaAtiva === "estatisticas" ? "white" : "#858EBD"} size={20} />
            </div>
            <span className={`text-sm whitespace-nowrap ${abaAtiva === "estatisticas" ? "font-medium" : "font-regular"}`}>
            Estatísticas das Emoções
          </span>
          </button>

          <button
              onClick={() => navigate(`/psicologo/calendarioEmocoes/${pacienteId}`)}
              className={`cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg w-full
            ${abaAtiva === "emocional" ? "bg-white shadow-md text-[#2B2F42]" : "hover:bg-gray-100 text-[#2B2F42]"}`}
          >
            <div
                className={`rounded-md p-1 ${
                    abaAtiva === "emocional" ? "bg-[#0088A3]" : "bg-[#F4F7FF]"
                }`}
            >
              <Smile color={abaAtiva === "emocional" ? "white" : "#858EBD"} size={20} />
            </div>
            <span className={`text-sm whitespace-nowrap ${abaAtiva === "emocional" ? "font-medium" : "font-regular"}`}>
            Calendário de Emoções
          </span>
          </button>
        </div>
      </div>
  );
}
