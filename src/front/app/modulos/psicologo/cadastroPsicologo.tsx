import Main from "~/componentes/Main";
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  Calendar,
  MapPin,
  Fingerprint,
  VenetianMask,
} from "lucide-react";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import FormPadrao from "~/componentes/FormPadrao";
import InputPadrao from "~/componentes/InputPadrao";
import { useState } from "react";
import axios from "axios";
import HomeLogo from "~/componentes/HomeLogo";
import {useNavigate} from "react-router";
import HomeLogoCadastro from "~/componentes/HomeLogoCadastro";
import SelectPadrao from "~/componentes/SelectPadrão";
import {IoIosArrowDown} from "react-icons/io";
export function CadastroPsicologo() {
  const [etapa, setEtapa] = useState(1);
  const navigate = useNavigate();

  // Etapa 1
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);

  // Etapa 2
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [cpf, setCpf] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  function continuarCadastro(e?: React.MouseEvent<HTMLButtonElement>) {
    e?.preventDefault();
    if (!email.includes("@")) {
      alert("O e-mail deve conter um @ válido.");
      return;
    }
    setEtapa(2);
  }

  function salvarDadosPsicologo() {

      axios.post("http://localhost:8080/psicologos", {
        usuario: {
          nome,
          email,
          senha,
          cpfCnpj: cpf,
          telefone: telefone.replace(/\D/g, ""), // remove máscara
          dataNascimento,
          sexo,
          endereco: {
            rua: rua,
            numero: parseInt(numero),
            bairro: bairro,
            cep: cep,
            cidade: cidade,
            estado: estado
          }
        },
      })
        .then((response) => {
          const tempoDeSessao = 30 * 60 * 1000; // 30 minutos

          const dadosSessao = {
            usuarioId: response.data.usuario.usuarioId,
            expiraEm: Date.now() + tempoDeSessao,
          };

          localStorage.setItem("sessaoPsicologo", JSON.stringify(dadosSessao));
          navigate("/psicologo/paginaPrincipal");
      })
      .catch((error) => {
        console.error("Erro ao salvar os dados no backend:", error);
        alert("Houve um erro ao salvar os dados.");
      });
  }

  const podeContinuar =
    nome.trim() !== "" &&
    email.trim() !== "" &&
    senha.trim() !== "" &&
    confirmarSenha.trim() !== "" &&
    senha === confirmarSenha &&
    aceitouTermos;

  const podeCadastrar =
      rua.trim() !== "" &&
      numero.trim() !== "" &&
      bairro.trim() !== "" &&
      estado.trim() !== "" &&
      cep.trim() !== "" &&
      cidade.trim() !== "" &&
    dataNascimento.trim() !== "" &&
    sexo.trim() !== "" &&
    cpf.trim() !== "";

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

  return (
    <Main>

      <div className="flex h-screen">
      {/* Lado esquerdo com gradiente */}
      {etapa === 1 ? <HomeLogo /> : <HomeLogoCadastro />}
        {/* Lado direito com formulário */}
        <div className={`${etapa === 1 ? 'w-1/2' : 'w-3/4'} flex flex-col justify-center items-center bg-white p-8`}>
          <div className={`text-center mb-6`}>
            <h2 className="text-4xl font-bold text-[#034B57] mb-2 ">
              {etapa === 1 ? "Crie sua conta!" : "Informações básicas"}
            </h2>
            <p className="text-gray-600">
              {etapa === 1
                ? "Gerencie seus pacientes gratuitamente"
                : "Por favor, complete com suas informações básicas."}
            </p>
          </div>

          <FormPadrao className={etapa === 1 ? "max-w-sm" : "max-w-3xl"}>
            {etapa === 1 ? (
              <>
                <InputPadrao
                  placeholder="Nome"
                  icon={<User />}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                <InputPadrao
                  type="email"
                  placeholder="E-mail"
                  icon={<Mail />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputPadrao
                  type="password"
                  placeholder="Senha"
                  icon={<Lock />}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <InputPadrao
                  type="password"
                  placeholder="Confirme a senha"
                  icon={<Lock />}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
                <div className="flex items-center mb-6">
                  <input
                    id="termos"
                    type="checkbox"
                    className="mr-2 accent-cyan-600"
                    checked={aceitouTermos}
                    onChange={(e) => setAceitouTermos(e.target.checked)}
                  />
                  <label htmlFor="termos" className="text-gray-700 text-sm">
                    Aceito os{" "}
                    <span className="underline cursor-pointer text-cyan-700">
                      termos e condições
                    </span>
                  </label>
                </div>
                <BotaoPadrao
                  texto="Continuar"
                  fullWidth
                  handleClick={continuarCadastro}
                  disabled={!podeContinuar}
                />
                <p className="text-gray-600 text-sm mt-4">
                  Já tem uma conta?{" "}
                  <span className="text-cyan-700 cursor-pointer hover:underline">
                    <a href="/psicologo/login" className="underline">
                      Faça login
                    </a>
                  </span>
                </p>
                <p className="text-gray-600 text-sm mt-4">
                  Não é psicólogo?{" "}
                  <span className="text-cyan-700 cursor-pointer hover:underline">
                    <a href="/paciente/login" className="underline">
                      Faça login como paciente
                    </a>
                  </span>
                </p>
              </>
            ) : (
              <>
                <div className=" flex gap-4">
                  <div className="relative w-full">
                    <InputPadrao
                        placeholder="CPF/CNPJ"
                        label = "CPF/CNPJ *"
                        value={cpf}
                        required
                        onChange={(e) => setCpf(e.target.value)}
                    />
                  </div>
                  <div className="relative w-full">
                    <InputPadrao
                        type="text"
                        label="Telefone *"
                        placeholder="(00) 00000-0000"
                        value={telefone}
                        onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                        required
                    />
                  </div>
                </div>
                <div className="flex gap-4 pb-4">
                  <div className=" relative w-full">
                    <InputPadrao
                        placeholder="Data de nascimento"
                        label="Data de Nascimento *"
                        type="date"
                        value={dataNascimento}
                        required
                        onChange={(e) => setDataNascimento(e.target.value)}
                    />
                  </div>
                  <div className="relative w-full">
                    <label className="block text-sm font-regular mb-1 text-slate-700">Sexo *</label>
                    <select name="sexo"
                            onChange={(e) => setSexo(e.target.value)}
                            value={sexo}
                            required
                            className="w-full border border-[#DAE0F2] rounded-lg px-3 py-2.5 text-sm !text-[#858EBD] appearance-none pr-10">
                      <option value="">Selecione</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Outro">Outro</option>
                    </select>
                    <IoIosArrowDown
                        className="absolute right-3 top-2/4 transform -translate-y-1/4 text-2xl !text-[#858EBD] pointer-events-none"/>
                  </div>
                </div>
                <h3 className="block text-base font-semibold text-[#7E7E7E] mb-4">Endereço:</h3>
                <div className=" flex gap-4">
                  <div className="relative w-full">
                    <InputPadrao
                        label="Rua *"
                        value={rua}
                        required
                        onChange={(e) => setRua(e.target.value)}
                    />
                  </div>
                  <div className="relative w-full">
                    <InputPadrao
                        label="Número *"
                        required
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                    />
                  </div>
                </div>
                <div className=" flex gap-4">
                  <div className="relative w-full">
                    <InputPadrao
                        label="Bairro *"
                        required
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                    />
                  </div>
                  <div className="relative w-full">
                    <InputPadrao
                        label="Estado *"
                        required
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    />
                  </div>
                </div>
                <div className=" flex gap-4">
                  <div className="relative w-full">
                    <InputPadrao
                        label="CEP *"
                        type="numeric"
                        required
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                    />
                  </div>
                  <div className="relative w-full">
                    <InputPadrao
                        label="Cidade *"
                        value={cidade}
                        required
                        onChange={(e) => setCidade(e.target.value)}
                    />
                  </div>
                </div>
                <div className=" flex gap-4 pt-5">
                  <div className="relative w-full">
                    <BotaoPadrao
                        texto="Voltar"
                        fullWidth
                        handleClick={() => setEtapa(1)}
                        icone={<ArrowLeft />}
                        color="bg-slate-400"
                        hoverColor="bg-slate-500"
                    />
                  </div>
                  <div className="relative w-full">
                    <BotaoPadrao
                        texto="Cadastre-se"
                        fullWidth
                        handleClick={salvarDadosPsicologo}
                        disabled={!podeCadastrar}
                    />
                  </div>
                </div>
              </>
            )}
          </FormPadrao>
        </div>
      </div>
    </Main>
  );
}
