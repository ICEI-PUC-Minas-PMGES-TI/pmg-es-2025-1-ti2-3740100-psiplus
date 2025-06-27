import Main from "~/componentes/Main";
import MenuLateralPaciente from "~/componentes/MenuLateralPaciente";
import InputPadrao from "~/componentes/InputPadrao";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import PerfilUser from "../../../public/assets/PerfilUser.jpg";
import { IoIosArrowDown } from "react-icons/io";
import React, {useState, useEffect, useRef} from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import { Camera, CircleCheck, Lock, Pen, User } from "lucide-react";
import {useUltimaConsulta} from "~/utils/ultimaConsulta";
import {format, parseISO} from "date-fns";
// import { toast } from "react-toastify";

interface Endereco {
  rua: string;
  numero: string | number;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
}

interface Usuario {
  id?: number;
  nome: string;
  cpfCnpj: string;
  email: string;
  sexo: string;
  telefone?: string;
  dataNascimento?: string;
  senha?: string;
  endereco: Endereco;
}

interface Paciente {
  usuario: Usuario;
  notas?: string;
}

export default function PerfilPaciente() {
  const navigate = useNavigate();
  const [modoEdicao, setModoEdicao] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pacienteId, setPacienteId] = useState(null);
  const ultimaConsulta = useUltimaConsulta(pacienteId);
  const [psicologoId, setPsicologoId] = useState(null);
  const [paciente, setPaciente] = useState<Paciente>({
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
  const [modalAberto, setModalAberto] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoSelecionada, setFotoSelecionada] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAbrirModal(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setFotoSelecionada(arquivo);
    setFotoPreview(URL.createObjectURL(arquivo));
    setModalAberto(true);
  }

  function handleBotaoClick() {
    inputRef.current?.click();
  }

  function handleCancelar() {
    setModalAberto(false);
    setFotoSelecionada(null);
    setFotoPreview(null);
  }

  function handleConfirmar() {
    if (fotoSelecionada) {
      handleSalvarFoto();
      setModalAberto(false);
      setFotoSelecionada(null);
      setFotoPreview(null);
    }
  }

  function handleSalvarFoto() {
    if (!fotoSelecionada || !paciente.usuario.id) return;

    const leitor = new FileReader();
    leitor.onloadend = () => {
      const base64 = leitor.result?.toString();
      if (base64) {
        axios.put(`http://localhost:8080/usuarios/${paciente.usuario.id}/foto`, {
          fotoPerfil: base64,
        })
            .then(() => {
              setModalAberto(false);
              carregarPaciente(pacienteId);
            })
            .catch(() => alert("Erro ao enviar a foto"));
      }
    };

    leitor.readAsDataURL(fotoSelecionada);
  }

  useEffect(() => {
    const sessao = JSON.parse(sessionStorage.getItem("sessaoPaciente") || "{}");
    if (sessao?.usuarioId) {
      setPacienteId(sessao.usuarioId);
      carregarPaciente(sessao.usuarioId)


      // Troque aqui para o endpoint com-psicologo
      fetch(`http://localhost:8080/pacientes/${sessao.usuarioId}/com-psicologo`)
          .then(res => res.json())
          .then(data => {
            if (data.psicologoId) {
              setPsicologoId(data.psicologoId);
            } else {
              setPsicologoId(null);
            }
          });
    }
  }, []);

  function carregarPaciente(pacienteId: string) {
    setIsLoading(true);
    axios
      .get(`http://localhost:8080/pacientes/${pacienteId}`)
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
            fotoPerfil: data.usuario?.fotoPerfil || undefined,
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
        setErrorMessage(null);
      })
      .catch((err) => {
        console.error("Erro ao buscar paciente:", err);
        setErrorMessage("Erro ao carregar dados do paciente. Tente novamente.");
      })
      .finally(() => setIsLoading(false));
  }

  const salvarEdicao = () => {

    if (!paciente.usuario.email.match(/^[A-Za-z0-9+_.-]+@(.+)$/)) {
      setErrorMessage("Por favor, insira um e-mail válido.");
      return;
    }

    setIsLoading(true);
    const pacienteAtualizado = {
      usuario: {
        usuarioId: paciente.usuario.id,
        cpfCnpj: paciente.usuario.cpfCnpj,
        nome: paciente.usuario.nome,
        dataNascimento: formatarDataParaISO(paciente.usuario.dataNascimento || ""),
        email: paciente.usuario.email,
        sexo: paciente.usuario.sexo,
        telefone: removerMascaraTelefone(paciente.usuario.telefone || ""),
        endereco: {
          ...paciente.usuario.endereco,
          id: paciente.usuario.endereco?.id,
        },
        senha: "",
      },
      notas: paciente.notas || "",
    };

    axios
        .put(`http://localhost:8080/pacientes/${pacienteId}`, pacienteAtualizado)
        .then(() => {
          carregarPaciente(pacienteId);
          setModoEdicao(false);
          setErrorMessage(null);
        })
        .catch((err) => {
          console.error("Erro ao salvar paciente:", err);
          const errorMsg = err.response?.data?.erro || "Erro ao salvar perfil. Tente novamente.";
          setErrorMessage(errorMsg);
        })
        .finally(() => setIsLoading(false));
  }

    const alternarModoEdicao = () => {
    setModoEdicao((prev) => !prev);
    setErrorMessage(null);
  };

  const formatarTelefone = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    if (apenasNumeros.length <= 10) {
      return apenasNumeros.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      return apenasNumeros.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
  };

  const removerMascaraTelefone = (valor: string) => {
    return valor.replace(/\D/g, "");
  };

  const formatarDataParaBrasileira = (dataISO: string) => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const formatarDataParaISO = (data: string) => {
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setPaciente((prev) => ({
      ...prev,
      usuario: {
        ...prev.usuario,
        telefone: valorFormatado,
      },
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaciente((prev) => ({
      ...prev,
      usuario: {
        ...prev.usuario,
        [name]: value,
      },
    }));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaciente((prev) => ({
      ...prev,
      usuario: {
        ...prev.usuario,
        endereco: {
          ...prev.usuario.endereco,
          [name]: value,
        },
      },
    }));
  };

  const cancelarEdicao = () => {
    carregarPaciente(pacienteId);
    setModoEdicao(false);
  };

  function leave() {
    sessionStorage.removeItem("sessaoPsicologo");
    sessionStorage.removeItem("sessaoPaciente");
    sessionStorage.removeItem("sessionData");
    navigate("/paciente/login");
  }

  return (
<Main>
  <div className="flex flex-col md:flex-row min-h-screen bg-white">
    <MenuLateralPaciente telaAtiva="perfil" />
    <div className="hidden md:block w-px bg-gray-300"></div>
    <div className="m-2 md:m-5 w-full">
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}
      <div className="flex">
        <BotaoPadrao
          texto="Sair"
          icone={<img className="w-[26px]" src={ExitIcon} alt="Sair" />}
          color="bg-white"
          textoColor="text-gray-600"
          className="ml-auto hover:text-black transition-colors duration-200 font-medium cursor-pointer"
          handleClick={leave}
        />
      </div>
      <hr className="border-t-2 border-[#DFE5F1] my-2" />
      <h1 className="font-semibold text-black mx-4 text-[20px] mt-5">Perfil do Paciente</h1>

      <div className="mx-1 mt-4 flex flex-col lg:flex-row gap-7">
        {/* Lado esquerdo: foto e menu */}
        <div className="w-full md:w-1/3 lg:w-1/4 px-2 py-3 mb-4 md:mb-0">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={fotoPreview || paciente.usuario.fotoPerfil || PerfilUser}
                alt="Foto do Paciente"
                className="rounded-full w-24 h-24 object-cover"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={inputRef}
                onChange={handleAbrirModal}
              />
              <button
                type="button"
                onClick={handleBotaoClick}
                className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer"
                aria-label="Alterar foto de perfil"
              >
                <Camera style={{ color: "#858EBD", fontSize: 20 }} />
              </button>

              {modalAberto && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg max-w-sm w-full">
                    <h2 className="font-bold mb-4">Confirme sua nova foto</h2>
                    <img src={fotoPreview ?? undefined} alt="Preview" className="w-full rounded mb-4" />
                    <div className="flex justify-end gap-2">
                      <button
                        className="cursor-pointer bg-gray-300 px-4 py-2 rounded"
                        onClick={handleCancelar}
                      >
                        Cancelar
                      </button>
                      <button
                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={handleConfirmar}
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
            <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white shadow-md w-full">
              <div className="bg-[#0088A3] rounded-md p-1">
                <User style={{ color: "white" }} />
              </div>
              <span className="text-sm font-medium text-[#2B2F42]">Informações Pessoais</span>
            </button>
          </div>
        </div>

        {/* Lado direito: formulário */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2">
            <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase">Informações Pessoais</h2>
            <div className="flex gap-2">
              {!modoEdicao ? (
                <BotaoPadrao
                  texto="Editar Dados"
                  handleClick={alternarModoEdicao}
                  className="group bg-transparent !border-none !shadow-none !text-[#F79824] flex items-center gap-1 hover:!text-[#d97706] text-base font-bold transition-colors"
                  icone={
                    <Pen
                      className="text-[#F79824] transition-colors group-hover:text-[#d97706]"
                      style={{ fontSize: 18 }}
                    />
                  }
                />
              ) : (
                <>
                  <BotaoPadrao
                    texto="Salvar"
                    handleClick={salvarEdicao}
                    disabled={isLoading}
                    className="group bg-transparent !border-none !shadow-none !text-[#0088A3] flex items-center gap-1 hover:!text-[#006e85] text-base font-bold transition-colors"
                    icone={<CircleCheck style={{ fontSize: 20, color: '#0088A3' }} />}
                  />
                  <BotaoPadrao
                    texto="Cancelar"
                    handleClick={cancelarEdicao}
                    disabled={isLoading}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Nome Completo*</label>
              <InputPadrao
                name="nome"
                value={paciente?.usuario?.nome ?? ""}
                onChange={handleInputChange}
                classNameInput="!px-5 !pl-10 !py-2 rounded-lg !text-[#858EBD] !border-[#DAE0F2] !bg-[#F3F4F9]"
                icon={<Lock style={{ color: "#BBC6D9" }} />}
                disabled={true}
              />
            </div>
            <div>
              <label className="block text-sm font-regular mb-1 text-[#3A3F63]">CPF</label>
              <InputPadrao
                name="cpfCnpj"
                value={paciente.usuario.cpfCnpj ?? ""}
                onChange={handleInputChange}
                icon={<Lock style={{ color: "#BBC6D9" }} />}
                classNameInput="!px-5 !pl-10 !py-2 rounded-lg !text-[#858EBD] !border-[#DAE0F2] !bg-[#F3F4F9]"
                disabled={true}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-regular mb-1 text-slate-700">Sexo</label>
              <select
                name="sexo"
                disabled={!modoEdicao}
                value={paciente?.usuario?.sexo || ""}
                onChange={(e) =>
                  setPaciente({
                    ...paciente,
                    usuario: {
                      ...paciente.usuario,
                      sexo: e.target.value,
                    },
                  })
                }
                className="px-5 w-full border rounded-lg py-2.5 text-sm appearance-none pr-10 !text-[#858EBD] !border-[#DAE0F2]"
              >
                <option value="">Selecione</option>
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
              </select>
              <IoIosArrowDown className="absolute right-3 top-[70%] transform -translate-y-1/2 text-2xl pointer-events-none !text-[#858EBD] !border-[#DAE0F2]" />
            </div>
            <div>
              <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Data de nascimento</label>
              <div className="relative">
                <input
                  type="text"
                  value={paciente.usuario.dataNascimento || ""}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "").slice(0, 8);
                    const partes = [];
                    if (value.length >= 2) partes.push(value.slice(0, 2));
                    if (value.length >= 4) partes.push(value.slice(2, 4));
                    if (value.length > 4) partes.push(value.slice(4));
                    const maskedValue = partes.join("/");

                    setPaciente((prev) => ({
                      ...prev,
                      usuario: {
                        ...prev.usuario,
                        dataNascimento: maskedValue,
                      },
                    }));
                  }}
                  placeholder="dd/mm/aaaa"
                  disabled={true}
                  className="w-full border rounded-lg px-4 py-2 text-sm !text-[#858EBD] !border-[#DAE0F2] !bg-[#F3F4F9] pl-10"
                />
                <Lock
                  style={{
                    color: "#BBC6D9",
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-regular mb-1 mt-3 text-[#3A3F63]">E-mail*</label>
              <InputPadrao
                name="email"
                value={paciente.usuario.email}
                onChange={handleInputChange}
                classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                disabled={!modoEdicao}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-regular mt-3 pb-1.5 text-[#3A3F63]">Telefone</label>
              <input
                type="text"
                value={paciente.usuario.telefone || ""}
                onChange={handleTelefoneChange}
                disabled={!modoEdicao}
                className="w-full border rounded-lg px-4 py-2 text-sm !text-[#858EBD] !border-[#DAE0F2]"
              />
            </div>
          </div>

          <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase mt-3 mb-2">Endereço Residencial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Rua</label>
              <InputPadrao
                name="rua"
                value={paciente?.usuario?.endereco?.rua ?? ""}
                onChange={handleEnderecoChange}
                classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                disabled={!modoEdicao}
              />
            </div>
            <div>
              <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Número</label>
              <InputPadrao
                name="numero"
                value={paciente?.usuario?.endereco?.numero ?? ""}
                onChange={handleEnderecoChange}
                classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                disabled={!modoEdicao}
              />
            </div>
            <div>
              <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Bairro</label>
              <InputPadrao
                name="bairro"
                value={paciente?.usuario?.endereco?.bairro ?? ""}
                onChange={handleEnderecoChange}
                classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                disabled={!modoEdicao}
              />
            </div>
            <div>
              <label className="block text-sm font-regular mb-1 text-[#3A3F63]">CEP</label>
              <InputPadrao
                name="cep"
                value={paciente?.usuario?.endereco?.cep ?? ""}
                onChange={handleEnderecoChange}
                classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                disabled={!modoEdicao}
              />
            </div>
            <div>
              <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Cidade</label>
              <InputPadrao
                name="cidade"
                value={paciente?.usuario?.endereco?.cidade ?? ""}
                onChange={handleEnderecoChange}
                classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                disabled={!modoEdicao}
              />
            </div>
            <div>
              <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Estado</label>
              <InputPadrao
                name="estado"
                value={paciente?.usuario?.endereco?.estado ?? ""}
                onChange={handleEnderecoChange}
                classNameInput="!px-5 !py-2 border-[#DAE0F2] rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                disabled={!modoEdicao}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</Main>
  );
}
