import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import ExitIcon from "../../../public/assets/ExitIcon.png"
import BotaoPadrao from "~/componentes/BotaoPadrao";
import PerfilUser from "../../../public/assets/PerfilUser.jpg";
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from "react-router";


export function GestaoPacientes() {
    const [modoEdicao, setModoEdicao] = useState(false);
    const [dataNascimento, setDataNascimento] = useState("");
    const [telefone, setTelefone] = useState("");
    const navigate = useNavigate();


  const alternarModoEdicao = () => {
      setModoEdicao((prev) => !prev);
    };

  const formatarTelefone = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length <= 10) {
      return apenasNumeros
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return apenasNumeros
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setTelefone(valorFormatado);
  };

  function leave() {
    sessionStorage.removeItem("sessaoPsicologo");
    sessionStorage.removeItem("sessaoPaciente");
    navigate("/");
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
                    icone={<img className="w-[26px]" src={ExitIcon} alt="Sair" />}
                    color="bg-white"
                    textoColor="text-gray-600"
                    className="ml-auto hover:text-black transition-colors duration-200 font-medium"
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
                    <h2 className="mt-2 font-semibold text-lg text-[#3A3F63]">Isabelle Stanley</h2>
                    <p className="text-sm text-[#5A607F]">isabeleStanley@gmail.com</p>
                    <p className="text-sm text-gray-400">Última consulta - 12/02/2025</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    {/* Botão ativo */}
                    <button className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg bg-white shadow-md w-full">
                      <div className="bg-[#0088A3] rounded-md p-1">
                        <PersonIcon style={{color: "white"}}/>
                      </div>
                      <span className="text-sm font-medium text-[#2B2F42]">Informações Pessoais</span>
                    </button>

                    {/* Botões inativos */}
                    <button className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-[#2B2F42] w-full">
                      <div className="bg-[#F4F7FF] rounded-md p-1">
                        <HistoryIcon style={{color: "#858EBD"}}/>
                      </div>
                      <span className="text-sm font-regular whitespace-nowrap">Histórico de Consultas</span>
                    </button>

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
                        <SentimentSatisfiedAltIcon style={{color: "#858EBD"}}/>
                      </div>
                      <span className="text-sm font-regular whitespace-nowrap">Calendário de Emoções</span>
                    </button>
                  </div>
                </div>

                {/* FORMULÁRIO */}
                <div className="w-3/4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase">Informações Pessoais</h2>
                    <div className="flex gap-2">
                      {!modoEdicao ? (
                          <BotaoPadrao
                              texto="Editar Dados"
                              handleClick={alternarModoEdicao}
                              className="group bg-transparent !border-none !shadow-none !text-[#F79824] flex items-center gap-1 hover:!text-[#d97706] text-base font-bold transition-colors"
                              icone={
                                <EditIcon
                                    className="text-[#F79824] transition-colors group-hover:text-[#d97706]"
                                    style={{ fontSize: 18 }}
                                />
                              }
                          />
                      ) : (
                          <>
                            <BotaoPadrao
                                texto="Salvar"
                                handleClick={() => {
                                  // Aqui você pode adicionar lógica de validação ou envio antes de sair do modo edição
                                  alternarModoEdicao();
                                }}
                                className="group bg-transparent !border-none !shadow-none !text-[#0088A3] flex items-center gap-1 hover:!text-[#006e85] text-base font-bold transition-colors"
                                icone={
                                  <CheckCircleIcon className="h-5 w-5 text-[#0088A3] group-hover:text-[#006e85] transition-colors" />
                                }
                            />
                            <BotaoPadrao
                                texto="Cancelar"
                                handleClick={alternarModoEdicao}
                                className="group bg-transparent !border-none !shadow-none !text-gray-500 flex items-center gap-1 hover:!text-gray-700 text-base font-bold transition-colors"
                                icone={
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                }
                            />
                          </>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y--3">
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Nome Completo*</label>
                      <InputPadrao name="nome"
                                   placeholder=""
                                   classNameInput="border-[#DAE0F2] rounded-lg"
                                   disabled={!modoEdicao}/>
                    </div>
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">CPF</label>
                      <InputPadrao name="cpf"
                                   placeholder=""
                                   classNameInput="border-[#DAE0F2] rounded-lg"
                                   disabled={!modoEdicao}/>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-regular mb-1 text-slate-700">Sexo</label>
                      <select name="sexo"
                              disabled={!modoEdicao}
                              className="w-full border border-[#DAE0F2] rounded-lg px-3 py-2.5 text-sm text-[#3A3F63] appearance-none pr-10">
                        <option value="">Selecione</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Outro">Outro</option>
                      </select>
                      <IoIosArrowDown
                          className="absolute right-3 top-2/4 transform -translate-y-1/4 text-2xl text-[#858EBD] pointer-events-none"/>
                    </div>

                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Data de nascimento</label>
                      <input
                          type="text"
                          value={dataNascimento}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ''); // remove tudo que não for número
                            if (value.length > 8) value = value.slice(0, 8);

                            const parts = [];
                            if (value.length >= 2) parts.push(value.slice(0, 2));
                            if (value.length >= 4) parts.push(value.slice(2, 4));
                            if (value.length > 4) parts.push(value.slice(4));
                            else if (value.length > 2) parts.push(value.slice(2));

                            const maskedValue = parts.join('/');
                            setDataNascimento(maskedValue);
                          }}
                          disabled={!modoEdicao}
                          placeholder="dd/mm/aaaa"
                          className="w-full border border-[#DAE0F2] rounded-lg px-3 py-2 text-sm text-[#3A3F63]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-regular mb-1 mt-3 text-[#3A3F63]">E-mail*</label>
                      <InputPadrao name="email"
                                   placeholder=""
                                   classNameInput="border-[#DAE0F2] rounded-lg"
                                   disabled={!modoEdicao}/>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-regular mt-3 pb-1 text-[#3A3F63]">Telefone</label>
                        <input
                            type="text"
                            name="telefone"
                            value={telefone}
                            onChange={handleTelefoneChange}
                            maxLength={15}
                            placeholder="(99) 99999-9999"
                            disabled={!modoEdicao}
                            className="w-full pl-3 pr-4 py-2 border border-[#DAE0F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                        />
                    </div>

                  </div>

                  <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase mt-3 mb-2">Endereço Residencial</h2>
                  <div className="grid grid-cols-2 gap-x-4 gap-y--3">
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Rua</label>
                      <InputPadrao name="endereco"
                                   placeholder=""
                                   classNameInput="border-[#DAE0F2] rounded-lg"
                                   disabled={!modoEdicao}/>
                    </div>
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Número</label>
                      <InputPadrao name="cidade"
                                   placeholder="" classNameInput="border-[#DAE0F2] rounded-lg"
                                   disabled={!modoEdicao}/>
                    </div>
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Bairro</label>
                      <InputPadrao name="pais"
                                   placeholder=""
                                   classNameInput="border-[#DAE0F2] rounded-lg"
                                   disabled={!modoEdicao}/>
                    </div>
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">CEP</label>
                      <InputPadrao name="cep"
                                   placeholder=""
                                   classNameInput="border-[#DAE0F2] rounded-lg"
                                   disabled={!modoEdicao}/>
                    </div>
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Cidade</label>
                      <InputPadrao name="pais"
                                   placeholder=""
                                   classNameInput="border-[#DAE0F2] rounded-lg"
                                   disabled={!modoEdicao}/>
                    </div>
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Estado</label>
                      <InputPadrao name="cep"
                                   placeholder=""
                                   classNameInput="border-[#DAE0F2] rounded-lg"
                                   disabled={!modoEdicao}/>
                    </div>
                  </div>

                  <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase mt-3 mb-2">Informações
                    Complementares</h2>
                  <div>
                    <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Notas</label>
                    <textarea
                        name="notas"
                        disabled={!modoEdicao}
                        className="w-full border border-[#DAE0F2] rounded-lg px-3 py-2 text-sm text-[#3A3F63]" rows={4}
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