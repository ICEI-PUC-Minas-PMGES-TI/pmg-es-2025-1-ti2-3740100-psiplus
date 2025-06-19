import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import ConsultationHistory from "~/componentes/ConsultationHistory";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import PerfilUser from "../../../public/assets/PerfilUser.jpg";
import {
  User,
  History,
  BarChart3,
  Camera,
  Smile
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import ExitIcon from "../../../public/assets/ExitIcon.png"
import InfoPaciente from "~/componentes/InfoPaciente";


interface Anotacao {
  data: string;
  hora: string;
  conteudo: string;
}

interface Usuario {
  id?: number;
  nome: string;
  email: string;
}

interface Paciente {
  usuario: Usuario;
  historicoClinico?: Anotacao[];
}

export function GestaoRegistros() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [paciente, setPaciente] = useState<Paciente>({
    usuario: {
      id: undefined,
      nome: "",
      email: "",

    },
    historicoClinico: [],
  });

  useEffect(() => {
    if (!id) return;

    const carregarDados = async () => {
      try {
        const pacienteRes = await axios.get(`http://localhost:8080/pacientes/${id}`);
        const registrosRes = await axios.get(`http://localhost:8080/registros/${id}`);

        const dataPaciente = pacienteRes.data;
        const registros = registrosRes.data.map((reg: any) => ({
          data: reg.data_registro,
          hora: reg.hora_registro,
          conteudo: reg.anotacao
        }));

        setPaciente({
          usuario: {
            id: dataPaciente.usuario?.usuarioId,
            nome: dataPaciente.usuario?.nome || "",
            email: dataPaciente.usuario?.email || "",
          },
          historicoClinico: registros,
        });
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };

    carregarDados();
  }, [id]);

  function leave() {
    sessionStorage.removeItem("sessaoPsicologo");
    sessionStorage.removeItem("sessaoPaciente");
    sessionStorage.removeItem("sessionData");
    navigate("/")
  }

  return (
      <Main>
        <div className="flex min-h-screen bg-white ">
          {/* Lado esquerdo com menu do psicólogo*/}
          <MenuLateralPsicólogo telaAtiva={"pacientes"}/>
          <div className="w-px bg-gray-300"></div>
          <div className="m-5 w-4/5">
            <div className="flex">
              <BotaoPadrao
                  texto="Sair"
                  icone={<img className=" w-[26px] " src={ExitIcon} alt="Sair" />}
                  color="bg-white"
                  textoColor="text-gray-600"
                  className="ml-auto hover:text-black transition-colors duration-200 font-medium cursor-pointer"
                  handleClick={leave}
              />
            </div>
            <hr className="border-t-2 border-[#DFE5F1] my-2"/>
            <h1 className="font-semibold text-black mx-4 text-[20px] mt-5">Gestão de Pacientes</h1>

            <div className="mx-1 mt-4 flex gap-7">
              {/* Painel Lateral do Paciente */}
              <InfoPaciente abaAtiva={"historico"} />

              {/* Registros */}
              <div className="flex-1">
                <ConsultationHistory
                    pacienteId={Number(id)}
                    historicoClinico={paciente.historicoClinico || []}
                />
              </div>
            </div>
          </div>
        </div>
      </Main>
  )
}
