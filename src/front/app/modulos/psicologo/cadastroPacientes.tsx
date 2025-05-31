import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import { useNavigate } from "react-router";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import Popup from "../../componentes/Popup";

export default function CadastroPacientes() {
  const navigate = useNavigate(); // <-- E isso
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [sexo, setSexo] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [notas, setNotas] = useState("");
  const [mostrarPopup, setMostrarPopup] = useState(false);

  const handleSubmit = async () => {
    const paciente = {
      usuario: {
        cpfCnpj: cpfCnpj,
        nome: nome,
        email: email,
        senha: cpfCnpj, // usar o CPF como senha
        telefone: telefone.replace(/\D/g, ""), // remove máscara
        dataNascimento: formatarParaISO(dataNascimento), // "YYYY-MM-DD"
        sexo: sexo,
        endereco: {
          rua: rua,
          numero: parseInt(numero),
          bairro: bairro,
          cep: cep,
          cidade: cidade,
          estado: estado
        }
      },
      historicoClinico: null,
      notas: notas || null
    };

    try {
      await axios.post("http://localhost:8080/pacientes", paciente);
      setMostrarPopup(true);
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
      alert("Erro ao cadastrar paciente.");
    }

  };

  const formatarParaISO = (data: string): string => {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  function formatTelefone(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (!match) return value;
    let result = "";
    if (match[1]) result += `(${match[1]}`;
    if (match[1] && match[1].length === 2) result += `) `;
    if (match[2]) result += match[2];
    if (match[3]) result += `-${match[3]}`;
    return result;
  }

  function formatData(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 8);
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
    if (!match) return value;
    let result = "";
    if (match[1]) result += match[1];
    if (match[2]) result += `/${match[2]}`;
    if (match[3]) result += `/${match[3]}`;
    return result;
  }

  function leave() {
    sessionStorage.removeItem("sessaoPsicologo");
    sessionStorage.removeItem("sessaoPaciente");
    navigate("/");
  }

  return (
      <Main>
        <div className="flex min-h-screen bg-white">
          <MenuLateralPsicólogo telaAtiva="pacientes" />
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
            <hr className="border-t-2 border-[#DFE5F1] my-2" />
            <h1 className="font-semibold text-[#3A3F63] mx-4 text-[20px] mt-5">
              Cadastro de Paciente
            </h1>

            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase">Informações Pessoais</h2>
                <div className="flex gap-2">
                  <BotaoPadrao
                      texto="Salvar"
                      icone={null}
                      color="bg-[#0088A3]"
                      textoColor="text-white"
                      className="hover:brightness-90 transition-colors duration-200 font-medium border !rounded-3xl"
                      handleClick={handleSubmit}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y--3">
                {/* Nome Completo */}
                <div>
                  <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Nome Completo*</label>
                  <InputPadrao name="nome"
                               value={nome}
                               onChange={(e) => setNome(e.target.value)}
                               classNameInput="!px-5 !py-2 rounded-lg !text-[#858EBD] !border-[#DAE0F2]" />
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm font-regular mb-1 text-[#3A3F63]">CPF*</label>
                  <InputPadrao
                      name="cpf"
                      value={cpfCnpj}
                      onChange={(e) => setCpfCnpj(e.target.value)}
                      classNameInput="!px-5 !py-2 rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                  />
                </div>

                {/* Sexo */}
                <div className="relative">
                  <label className="block text-sm font-regular mb-1 text-slate-700">Sexo</label>
                  <select
                      name="sexo"
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
                      className="px-5 w-full border rounded-lg py-2.5 text-sm appearance-none pr-10 !text-[#858EBD] !border-[#DAE0F2]"
                  >
                    <option value="">Selecione</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Outro</option>
                  </select>
                  <IoIosArrowDown className="absolute right-3 top-[70%] transform -translate-y-1/2 text-2xl pointer-events-none !text-[#858EBD] !border-[#DAE0F2]" />
                </div>

                {/* Data de nascimento */}
                <div>
                  <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Data de nascimento*</label>
                  <input
                      type="text"
                      placeholder="DD/MM/AAAA"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(formatData(e.target.value))}
                      className="w-full !border !rounded-lg px-4 py-2 text-sm !text-[#858EBD] !border-[#DAE0F2]"
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label className="block text-sm font-regular mb-1 mt-3 text-[#3A3F63]">E-mail*</label>
                  <InputPadrao
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                  />
                </div>

                {/* Telefone */}
                <div className="mb-4">
                  <label className="block text-sm font-regular mt-3 pb-1.5 text-[#3A3F63]">Telefone*</label>
                  <input
                      type="text"
                      placeholder="(00) 00000-0000"
                      value={telefone}
                      onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                      className="w-full border rounded-lg px-4 py-2 text-sm !text-[#858EBD] !border-[#DAE0F2]"
                  />
                </div>
              </div>

              {/* Endereço */}
              <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase mt-3 mb-2">Endereço Residencial</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y--3">
                <div>
                  <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Rua</label>
                  <InputPadrao
                      name="endereco"
                      value={rua} onChange={(e) => setRua(e.target.value)}
                      classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Número</label>
                  <InputPadrao
                      name="numero"
                      value={numero} onChange={(e) => setNumero(e.target.value)}
                      classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Bairro</label>
                  <InputPadrao
                      name="bairro"
                      value={bairro} onChange={(e) => setBairro(e.target.value)}
                      classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-regular mb-1 text-[#3A3F63]">CEP</label>
                  <InputPadrao
                      name="cep"
                      value={cep} onChange={(e) => setCep(e.target.value)}
                      classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Cidade</label>
                  <InputPadrao
                      name="cidade"
                      value={cidade} onChange={(e) => setCidade(e.target.value)}
                      classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Estado</label>
                  <InputPadrao
                      name="estado"
                      value={estado} onChange={(e) => setEstado(e.target.value)}
                      classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                  />
                </div>
              </div>

              {/* Notas */}
              <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase mt-3 mb-2">Informações Complementares</h2>
              <div>
                <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Notas</label>
                <textarea
                    name="notas"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    className="w-full border border-[#DAE0F2] rounded-lg px-4 py-2 pt-3 text-sm text-[#858EBD]"
                    rows={4}
                    placeholder="Insira alguma nota sobre esse paciente"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        {/* Popup */}
        {mostrarPopup && (
            <Popup
                titulo="Paciente cadastrado com sucesso!"
                mensagem="Um e-mail será enviado automaticamente ao paciente com seu usuário e senha."
                onClose={() => {
                  setMostrarPopup(false);
                  navigate("/psicologo/agenda");
                }}
            />
        )}
      </Main>
  );
}