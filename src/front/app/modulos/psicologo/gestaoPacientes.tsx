import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import IconPesquisar from "../../../public/assets/IconPesquisar.png"
import ExitIcon from "../../../public/assets/ExitIcon.png"
import IconArquivado from "../../../public/assets/IconArquivado.png"
import Filtro from "../../../public/assets/Filtro.png"
import BotaoPadrao from "~/componentes/BotaoPadrao";
import TabelaPadrao from "~/componentes/TabelaPadrao";
export function GestaoPacientes(){
  return (
      <Main>
        <div className="flex h-screen bg-white ">
          {/* Lado esquerdo com menu do psicólogo*/}
          <MenuLateralPsicólogo/>
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

            <div className="mx-4 mt-6 flex gap-6">
              {/* Painel Lateral do Paciente */}
              <div className="w-1/4 px-6 py-4">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="Foto do Paciente"
                        className="rounded-full w-24 h-24 object-cover"
                    />
                    <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
                      <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828L18 10.828m-3-3L9 13"
                        />
                      </svg>
                    </button>
                  </div>
                  <h2 className="mt-2 font-semibold text-lg">Isabelle Stanley</h2>
                  <p className="text-sm text-gray-500">stanley.iq@hotmail.com</p>
                  <p className="text-sm text-gray-400">Última consulta - 12/02/2025</p>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-cyan-700">
                    <span className="material-icons">person</span>
                    Informações Pessoais
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-cyan-700 hover:bg-gray-100">
                    <span className="material-icons">history</span>
                    Histórico de Consultas
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-cyan-700 hover:bg-gray-100">
                    <span className="material-icons">bar_chart</span>
                    Estatísticas das Emoções
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-cyan-700 hover:bg-gray-100">
                    <span className="material-icons">calendar_today</span>
                    Calendário de Emoções
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Nome Completo*</label>
                    <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                  </div>
                  <div>
                    <label className="block text-sm font-regular mb-1 text-[#3A3F63]">CPF</label>
                    <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                  </div>
                  <div>
                    <label className="block text-sm font-regular mb-1 text-slate-700">Sexo</label>
                    <select className="w-full border border-[#DAE0F2] rounded px-3 py-2 text-sm text-slate-700">
                      <option value="">Selecione</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Outro">Outro</option>
                    </select>
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
                      <select className="border border-[#DAE0F2] rounded px-3 py-2 text-sm text-slate-700">
                        <option>+11</option>
                        <option>+21</option>
                        <option>+31</option>
                        <option>+55</option>
                        <option>+61</option>
                      </select>
                      <InputPadrao placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"/>
                    </div>
                  </div>

                </div>

                <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase mt-3 mb-2">Endereço Residencial</h2>
                <div className="grid grid-cols-2 gap-4">
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
