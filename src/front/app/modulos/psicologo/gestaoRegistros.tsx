import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import ConsultationHistory from "~/componentes/ConsultationHistory";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import PerfilUser from "../../../public/assets/PerfilUser.jpg";
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import ExitIcon from "../../../public/assets/ExitIcon.png"
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';


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
          data: reg.dataRegistro,
          hora: reg.horaRegistro,
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
              <div className="w-1/4 px-2 py-3">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <img
                        src={PerfilUser}
                        alt="Foto do Paciente"
                        className="rounded-full w-24 h-24 object-cover"
                    />
                    <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
                      <PhotoCameraIcon style={{color: "#858EBD", fontSize: 20}}/>
                    </button>
                  </div>
                  <h2 className="mt-2 font-semibold text-lg text-[#3A3F63]">{paciente?.usuario?.nome || ""}</h2>
                  <p className="text-sm text-[#5A607F]">{paciente?.usuario?.email || ""}</p>
                  <p className="text-sm text-gray-400">Última consulta - 12/02/2025</p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {/* Botão inativo */}
                  <button
                      onClick={() => navigate(`/psicologo/pacientes/${id}`)}
                      className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-[#2B2F42] w-full">
                    <div className="bg-[#F4F7FF] rounded-md p-1">
                      <PersonIcon style={{color: "#858EBD"}}/>
                    </div>
                    <span className="text-sm font-regular whitespace-nowrap">Informações Pessoais</span>
                  </button>

                  {/* Botão ativo */}
                  <button className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg bg-white shadow-md w-full">
                    <div className="bg-[#0088A3] rounded-md p-1">
                      <HistoryIcon style={{color: "white"}}/>
                    </div>
                    <span className="text-sm font-medium text-[#2B2F42]">Histórico de Consultas</span>
                  </button>

                  {/* Botões inativos */}
                  <button
                      className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-[#2B2F42] w-full">
                    <div className="bg-[#F4F7FF] rounded-md p-1">
                      <BarChartIcon style={{color: "#858EBD"}}/>
                    </div>
                    <span className="text-sm font-regular whitespace-nowrap">Estatísticas das Emoções</span>
                  </button>

                  <button
                      className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-[#2B2F42] w-full">
                    <div className="bg-[#F4F7FF] rounded-md p-1">
                      <SentimentVerySatisfiedIcon style={{color: "#858EBD"}}/>
                    </div>
                    <span className="text-sm font-regular whitespace-nowrap">Calendário de Emoções</span>
                  </button>
                </div>
              </div>

              {/* Registros */}
              <div className="flex-1">
                <ConsultationHistory />
              </div>
            </div>
          </div>
        </div>
      </Main>
  )
}
