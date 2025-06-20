import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from "react";
import {
    Edit2,
    Lock,
    CheckCircle
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import ExitIcon from "../../../public/assets/ExitIcon.png"
import InfoPaciente from "~/componentes/InfoPaciente";

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

export default function GestaoPacientes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [modoEdicao, setModoEdicao] = useState(false);

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

    useEffect(() => {
        if (!id) return;
        carregarPaciente(id);
    }, [id]);

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

    const alternarModoEdicao = () => {
        setModoEdicao((prev) => !prev);
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
        return valor.replace(/\D/g, ""); // remove tudo que não for dígito
    };

    const formatarDataParaISO = (data: string) => {
        const [dia, mes, ano] = data.split('/');
        return `${ano}-${mes}-${dia}`;
    };

    const formatarDataParaBrasileira = (dataISO: string) => {
        const [ano, mes, dia] = dataISO.split("-");
        return `${dia}/${mes}/${ano}`;
    };

    const salvarEdicao = () => {
        const pacienteAtualizado = {
            ...paciente,
            usuario: {
                ...paciente.usuario,
                id: paciente.usuario.id,
                telefone: removerMascaraTelefone(paciente.usuario.telefone || ""),
                dataNascimento: formatarDataParaISO(paciente.usuario.dataNascimento || ""),
                senha: paciente.usuario.senha || "senha123",
            },
            notas: paciente.notas || ""
        };
        console.log("Enviando para o backend:", pacienteAtualizado);

        axios
            .put(`http://localhost:8080/pacientes/${id}`, pacienteAtualizado)
            .then(() => {
                carregarPaciente(id); // atualiza e aplica máscara novamente
                setModoEdicao(false);
            })
            .catch((err) => {
                console.error("Erro ao salvar paciente:", err);
            });
    };

    const cancelarEdicao = () => {
        carregarPaciente(id); // descarta alterações e recarrega do backend
        setModoEdicao(false);
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
                <InfoPaciente abaAtiva={"info"} />

                {/* FORMULÁRIO */}
                <div className="w-3/4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase">Informações Pessoais</h2>
                    <div className="flex gap-2">
                      {!modoEdicao ? (
                          <BotaoPadrao
                              texto="Editar Dados"
                              handleClick={() => setModoEdicao(true)}
                              className="group bg-transparent !border-none !shadow-none !text-[#F79824] flex items-center gap-1 hover:!text-[#d97706] text-base font-bold transition-colors"
                              icone={
                                  <Edit2
                                      className="text-[#F79824] transition-colors group-hover:text-[#d97706]"
                                      size={18}
                                  />
                              }
                          />
                      ) : (
                          <>
                            <BotaoPadrao
                                texto="Salvar"
                                handleClick={salvarEdicao}
                                className="group bg-transparent !border-none !shadow-none !text-[#0088A3] flex items-center gap-1 hover:!text-[#006e85] text-base font-bold transition-colors"
                                icone={
                                    <CheckCircle
                                        size={20}
                                        className="text-[#0088A3] transition-colors hover:text-[#006e85]"
                                    />
                                }
                            />
                            <BotaoPadrao
                                texto="Cancelar"
                                handleClick={cancelarEdicao}
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
                    {/* Nome Completo */}
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Nome Completo*</label>
                      <InputPadrao
                          name="nome"
                          value={paciente?.usuario?.nome ?? ""}
                          onChange={handleInputChange}
                          classNameInput="!px-5 !py-2 rounded-lg !text-[#858EBD] !border-[#DAE0F2]"
                          disabled={!modoEdicao}
                      />
                    </div>

                    {/* CPF */}
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">CPF</label>
                      <InputPadrao
                          name="cpfCnpj"
                          value={paciente.usuario.cpfCnpj ?? ""}
                          onChange={handleInputChange}
                          icon={<Lock color="#BBC6D9" />}
                          classNameInput="!px-5 !pl-10 !py-2 rounded-lg !text-[#858EBD] !border-[#DAE0F2] !bg-[#F3F4F9]"
                          disabled={true}
                      />
                    </div>

                    {/* Sexo */}
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

                    {/* Data de nascimento */}
                    <div>
                      <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Data de nascimento</label>
                        <input
                            type="text"
                            value={paciente.usuario.dataNascimento || ""}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "").slice(0, 8); // mantém no máximo 8 dígitos
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
                            disabled={!modoEdicao}
                            className="w-full border rounded-lg px-4 py-2 text-sm !text-[#858EBD] !border-[#DAE0F2]"
                        />
                    </div>

                    {/* E-mail */}
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

                    {/* Telefone */}
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

                  {/* Endereço */}
                  <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase mt-3 mb-2">Endereço Residencial</h2>
                  <div className="grid grid-cols-2 gap-x-4 gap-y--3">
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

                  {/* Notas */}
                  <h2 className="font-bold text-[16px] text-[#3A3F63] uppercase mt-3 mb-2">Informações Complementares</h2>
                  <div>
                    <label className="block text-sm font-regular mb-1 text-[#3A3F63]">Notas</label>
                    <textarea
                        name="notas"
                        value={paciente.notas}
                        onChange={(e) =>
                            setPaciente((prev) => ({ ...prev, notas: e.target.value }))
                        }
                        disabled={!modoEdicao}
                        className="w-full border border-[#DAE0F2] rounded-lg px-4 py-2 pt-3 text-sm text-[#858EBD]"
                        rows={4}
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