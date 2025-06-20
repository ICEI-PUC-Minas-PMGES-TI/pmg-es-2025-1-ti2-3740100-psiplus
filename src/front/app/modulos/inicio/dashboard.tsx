import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import ExitIcon from "../../../public/assets/ExitIcon.png"
import BotaoPadrao from "~/componentes/BotaoPadrao";
import TabelaPadrao from "~/componentes/TabelaPadrao";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export function Dashboard() {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState([]);
    const [search, setSearch] = useState("");
    const columns = [
        { id: "nome", label: "Nome" },
        { id: "email", label: "Email" },
        { id: "telefone", label: "Telefone" }
    ];

    useEffect(() => {
        fetch("http://localhost:8080/pacientes/resumo")
            .then(res => res.json())
            .then(data => {
                console.log("Dados recebidos:", data);
                setPacientes(data.map(paciente => ({
                    id: paciente.pacienteId,
                    ...paciente
                })));
            })
            .catch(err => console.error("Erro ao buscar pacientes:", err));
    }, []);

    const irParaGestaoPaciente = (idPaciente: number) => {
        navigate(`/psicologo/pacientes/${idPaciente}`);
    };

    const filteredData = useMemo(() => {
        if (!pacientes) {
            console.error("Erro: `pacientes` está indefinido!");
            return [];
        }
        return pacientes.filter(row =>
            columns.some(col =>
                row[col.id]?.toString().toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, pacientes, columns]);

    function leave() {
        sessionStorage.removeItem("sessaoPsicologo");
        sessionStorage.removeItem("sessaoPaciente");
        navigate("/");
    }

    const arquivarPacientes = async (idsArquivados: number[]) => {
        try {
            await axios.put("http://localhost:8080/pacientes/arquivar", idsArquivados);
            console.log("Pacientes arquivados com sucesso!");
        } catch (error) {
            console.error("Erro ao arquivar pacientes:", error);
        }
    };

    const desarquivarPacientes = async (idsDesarquivados: number[]) => {
        console.log("IDs para desarquivar:", idsDesarquivados, typeof idsDesarquivados[0]);
        try {
            await axios.put("http://localhost:8080/pacientes/acao/desarquivar", idsDesarquivados);
            console.log("Pacientes desarquivados com sucesso!");
        } catch (error) {
            console.error("Erro ao desarquivar pacientes:", error);
        }
    };

    const handleArquivar = async (idsArquivados: number[]) => {
        await arquivarPacientes(idsArquivados);
        setPacientes(prev =>
            prev.map(p =>
                idsArquivados.includes(p.id)
                    ? { ...p, arquivado: true }
                    : p
            )
        );
    };

    const handleDesarquivar = async (idsDesarquivados: number[]) => {
        await desarquivarPacientes(idsDesarquivados);
        setPacientes(prev =>
            prev.map(p =>
                idsDesarquivados.includes(p.id)
                    ? { ...p, arquivado: false }
                    : p
            )
        );
    };

    return (
        <Main>
            <div className="flex h-screen bg-white">
                {/* Lado esquerdo com menu do psicólogo */}
                <MenuLateralPsicólogo telaAtiva={"pacientes"} />
                <div className="w-px bg-gray-300"></div>
                <div className="m-5 w-4/5">
                    <div className="flex">
                        <BotaoPadrao
                            color="bg-white"
                            textoColor="text-gray-600"
                            className="ml-auto hover:text-black transition-colors duration-200 font-medium cursor-pointer"
                            texto="Sair"
                            icone={<img className="w-[26px]" src={ExitIcon} alt="Sair" />}
                            handleClick={leave}
                        />
                    </div>
                    <hr className="border-t-2 border-[#DFE5F1] my-2" />
                    <h1 className="pt-4 font-semibold text-black mx-2 text-[20px]">Pacientes</h1>
                    <TabelaPadrao
                        data={filteredData}
                        onArquivar={handleArquivar}
                        onDesarquivar={handleDesarquivar}
                        columns={columns}
                        onRowClick={irParaGestaoPaciente}
                        renderItem={(paciente) => (
                            <tr key={paciente.id} className="hover:bg-gray-50">
                                <td>
                                    <button
                                        className="hover:font-medium-mediam cursor-pointer"
                                        onClick={() => console.log("Paciente clicado:", paciente.id)}
                                    >
                                        {paciente.nome}
                                    </button>
                                </td>
                                <td>{paciente.email}</td>
                                <td>{paciente.telefone}</td>
                            </tr>
                        )}
                    />
                </div>
            </div>
        </Main>
    );
}

