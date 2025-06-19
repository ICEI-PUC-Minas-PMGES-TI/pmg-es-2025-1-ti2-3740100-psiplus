import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import ExitIcon from "../../../public/assets/ExitIcon.png"
import { EstatisticasEmocoesCard } from "~/componentes/EstatisticasEmocoesCard";
import InfoPaciente from "~/componentes/InfoPaciente";


interface Usuario {
    id?: number;
    nome: string;
    email: string;
}

interface Paciente {
    usuario: Usuario;
}

export function EstatisticasEmocoes() {
    const navigate = useNavigate();
    const { id: pacienteId } = useParams();

    {/* Dados do paciente */}
    const [paciente, setPaciente] = useState<Paciente>({
        usuario: {
            id: undefined,
            nome: "",
            email: "",

        },
    });

    useEffect(() => {
        if (!pacienteId) return;

        const carregarDados = async () => {
            try {
                const pacienteRes = await axios.get(`http://localhost:8080/pacientes/${pacienteId}`);

                const dataPaciente = pacienteRes.data;

                setPaciente({
                    usuario: {
                        id: pacienteId,
                        nome: dataPaciente.usuario?.nome || "",
                        email: dataPaciente.usuario?.email || "",
                    },
                });
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            }
        };

        carregarDados();
    }, [pacienteId]);

    {/* Parte de estatística */}
    const [filtroTempo, setFiltroTempo] = useState("semana");

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
                            icone={<img className=" w-[26px] " src={ExitIcon} alt="Sair"/>}
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
                        <InfoPaciente
                            abaAtiva="estatisticas"
                        />

                        {/* Seção das estatísticas */}
                        <div className="flex-1">
                            <EstatisticasEmocoesCard />
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    )
}