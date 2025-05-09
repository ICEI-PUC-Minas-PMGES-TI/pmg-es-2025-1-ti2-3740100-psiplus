import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import IconPesquisar from "../../../public/assets/IconPesquisar.png"
import ExitIcon from "../../../public/assets/ExitIcon.png"
import IconArquivado from "../../../public/assets/IconArquivado.png"
import Filtro from "../../../public/assets/Filtro.png"
import BotaoPadrao from "~/componentes/BotaoPadrao";
import TabelaPadrao from "~/componentes/TabelaPadrao";
import PerfilUser from "../../../public/assets/PerfilUser.jpg";
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { IoIosArrowDown } from "react-icons/io";

export function GestaoPacientes(){
  return (
      <Main>
        <div className="flex h-screen bg-white ">
          {/* Lado esquerdo com menu do psicólogo*/}
          <MenuLateralPsicólogo telaAtiva={"pacientes"} />
          <div className="w-px bg-gray-300"></div>
          <div className="m-5 w-4/5">
            <div className="flex">
              <InputPadrao
                  placeholder="Pesquisar"
                  classNameInput="border-0 font-semibold text-[14px]"
                  icon={<img className="w-[25px]" src={IconPesquisar} alt="pesquisar" />}
              />
              <BotaoPadrao
                  color="bg-white"
                  className="text-[16px] !font-medium  ml-auto !text-black "
                  texto="Sair"
                  icone={<img className=" w-[26px] " src={ExitIcon} alt="Sair" />}
              />
            </div>
            <hr className="border-t-2 border-[#DFE5F1] my-5"/>
            <h1 className="font-semibold text-black mx-4 text-[20px]">Gestão de Pacientes</h1>

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
                      <PhotoCameraIcon style={{ color: "#858EBD", fontSize: 20 }} />
                    </button>
                  </div>
                  <h2 className="mt-2 font-semibold text-lg text-[#3A3F63]">Isabelle Stanley</h2>
                  <p className="text-sm text-[#5A607F]">isabeleStanley@gmail.com</p>
                  <p className="text-sm text-gray-400">Última consulta - 12/02/2025</p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {/* Botão ativo */}
                  <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white shadow-md w-full">
                    <div className="bg-[#0088A3] rounded-md p-1">
                      <PersonIcon style={{ color: "white" }} />
                    </div>
                    <span className="text-sm font-medium text-[#2B2F42]">Informações Pessoais</span>
                  </button>

                  {/* Botões inativos */}
                  <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-[#2B2F42] w-full">
                    <div className="bg-[#F4F7FF] rounded-md p-1">
                      <HistoryIcon style={{ color: "#858EBD" }} />
                    </div>
                    <span className="text-sm font-regular">Histórico de Consultas</span>
                  </button>

                  <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-[#2B2F42] w-full">
                    <div className="bg-[#F4F7FF] rounded-md p-1">
                      <BarChartIcon style={{ color: "#858EBD" }} />
                    </div>
                    <span className="text-sm font-regular">Estatísticas das Emoções</span>
                  </button>

                  <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-[#2B2F42] w-full">
                    <div className="bg-[#F4F7FF] rounded-md p-1">
                      <SentimentSatisfiedAltIcon style={{ color: "#858EBD" }} />
                    </div>
                    <span className="text-sm font-regular">Calendário de Emoções</span>
                  </button>
                </div>
              </div>

              {/* FORMULÁRIO */}
              <div className="w-3/4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase">Informações Pessoais</h2>
                  <BotaoPadrao
                      texto="Salvar"
                      type="submit"
                      color="bg-teal-600"
                      hoverColor="bg-teal-700"
                      className="!px-8 !py-2 !text-[16px] font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y--3">
                  <div>
                    <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Nome Completo*</label>
                    <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                  </div>
                  <div>
                    <label className="block text-sm font-regular mb-1 text-[#3A3F63]">CPF</label>
                    <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-regular mb-1 text-slate-700">Sexo</label>
                    <select className="w-full border border-[#DAE0F2] rounded-lg px-3 py-2.5 text-sm text-[#3A3F63] appearance-none pr-10">
                      <option value="">Selecione</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Outro">Outro</option>
                    </select>
                    <IoIosArrowDown className="absolute right-3 top-2/4 transform -translate-y-1/4 text-2xl text-[#858EBD] pointer-events-none" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Dia</label>
                      <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                    </div>
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Mês</label>
                      <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                    </div>
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Ano</label>
                      <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-regular mb-1 text-[#3A3F63]">E-mail*</label>
                    <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                  </div>
                  <div>
                    <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Telefone</label>
                    <div className="flex gap-2 items-end">
                      <div className="relative">
                        <select className="w-[80px] h-[44px] border border-[#DAE0F2] rounded-lg px-3 py-2 text-sm text-[#3A3F63] appearance-none">
                          <option>+11</option>
                          <option>+21</option>
                          <option>+31</option>
                          <option>+55</option>
                          <option>+61</option>
                        </select>
                        <IoIosArrowDown className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-500 text-xl pointer-events-none" />
                      </div>
                      <div className="flex-1">
                        <InputPadrao placeholder="" classNameInput="w-full border-[#DAE0F2] rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase mt-3 mb-2">Endereço Residencial</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y--3">
                  <div>
                    <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Endereço</label>
                    <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                  </div>
                  <div>
                    <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Cidade</label>
                    <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                  </div>
                  <div>
                    <label className="block text-sm font-regular mb-1 text-[#3A3F63]">País</label>
                    <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                  </div>
                  <div>
                    <label className="block text-sm font-regular mb-1 text-[#3A3F63]">CEP</label>
                    <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                  </div>
                </div>

                <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase mt-3 mb-2">Informações Complementares</h2>
                <div>
                  <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Notas</label>
                  <textarea
                      className="w-full border border-[#DAE0F2] rounded-lg px-3 py-2 text-sm text-[#858EBD]" rows="4"
                      placeholder="Insira alguma nota sobre esse paciente"
                  ></textarea>
                </div>

              </div>
            </div>
          </div>
        </div>
      </Main>
  )
}
