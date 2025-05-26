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
  const [endereco, setEndereco] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [cpf, setCpf] = useState("");

  function continuarCadastro(e?: React.MouseEvent<HTMLButtonElement>) {
    e?.preventDefault();
    setEtapa(2);
  }

  function salvarDadosPsicologo() {

      axios.post("http://localhost:8080/psicologos", {
        usuario: {
          nome,
          email,
          senha,
          cpfCnpj: cpf,
          telefone: "+5511999999999",
          dataNascimento,
          sexo,
        },
        endereco: null,
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
    endereco.trim() !== "" &&
    dataNascimento.trim() !== "" &&
    sexo.trim() !== "" &&
    cpf.trim() !== "";

  return (
    <Main>
      <div className="flex h-screen">
        {/* Lado esquerdo com gradiente */}
        <HomeLogo />
        {/* Lado direito com formulário */}
        <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-cyan-700 mb-2">
              {etapa === 1 ? "Crie sua conta!" : "Informações básicas"}
            </h2>
            <p className="text-gray-600">
              {etapa === 1
                ? "Gerencie seus pacientes gratuitamente"
                : "Preencha os dados pessoais para continuar"}
            </p>
          </div>

          <FormPadrao>
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
                <InputPadrao
                  placeholder="Endereço"
                  icon={<MapPin />}
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
                <InputPadrao
                  placeholder="Data de nascimento"
                  type="date"
                  icon={<Calendar />}
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
                <InputPadrao
                  placeholder="Sexo"
                  icon={<VenetianMask />}
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                />
                <InputPadrao
                  placeholder="CPF"
                  icon={<Fingerprint />}
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
                <BotaoPadrao
                  texto="Cadastrar"
                  fullWidth
                  handleClick={salvarDadosPsicologo}
                  disabled={!podeCadastrar}
                />
                <BotaoPadrao
                  texto="Voltar"
                  fullWidth
                  handleClick={() => setEtapa(1)}
                  className="mt-4"
                  icone={<ArrowLeft />}
                  color="bg-slate-400"
                  hoverColor="bg-slate-500"
                />
              </>
            )}
          </FormPadrao>
        </div>
      </div>
    </Main>
  );
}
