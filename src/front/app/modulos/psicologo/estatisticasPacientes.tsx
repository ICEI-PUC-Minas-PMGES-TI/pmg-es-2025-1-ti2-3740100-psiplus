import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import { useNavigate } from "react-router";
import {useEffect, useState} from "react";
import GraficoCrescimento from "~/componentes/GraficoCrescimento";

export default function EstatisticasPacientes(){
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState([]);
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    function leave() {
        sessionStorage.removeItem("sessaoPsicologo");
        sessionStorage.removeItem("sessaoPaciente");
        sessionStorage.removeItem("sessionData");
        navigate("/");
    }
    useEffect(() => {
        fetch("http://localhost:8080/pacientes/dadosCadastro")
            .then((res) => res.json())
            .then((data) => {
                console.log("Dados brutos recebidos da API:", data);

                const datasDeCadastro = data.map((paciente) => paciente.dataCadastro);
                console.log("Datas de cadastro extraídas:", datasDeCadastro);

                setPacientes(datasDeCadastro);
            })
            .catch((err) => console.error("Erro ao buscar pacientes:", err));
    }, []);

    

    const cadastrosMes = (datas) =>{
        const cadastrosMensais = datas.filter((data) =>{
            const dataFormatada = new Date(data);
            return(
                dataFormatada.getMonth() === mesAtual &&
                dataFormatada.getFullYear() === anoAtual
            );
        });

        return cadastrosMensais.length;
    };

    const PercentualCadastrosMes = (dadosMes, dadosTotal) => {
        const foraDoMes = dadosTotal - dadosMes;
        if (foraDoMes === 0) {
            return 100;
        }
        return Number(((dadosMes / foraDoMes) * 100).toFixed(2));
    };

    const totalDoMes = cadastrosMes(pacientes);
    const percentualMes = PercentualCadastrosMes(totalDoMes, pacientes.length);

    return(
        <Main>
            <div className="flex min-h-screen bg-white">
                <MenuLateralPsicólogo telaAtiva="estatistica" />
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
                    <h1 className="pt-4 px-3 font-semibold text-[#161736] mx-2 text-[30px]">ESTATÍSTICAS</h1>
                    <div className="mt-10 bg-white rounded-xl shadow-md mx-5 p-4 relative">
                        <h1 className="pt-4 font-semibold text-[#161736] mx-2 text-[25px]">Novos cadastros - Mês </h1>
                        <h2 className="pt-4 text-[#161736] mx-2 text-[20px]"> {totalDoMes} novo(s) usuário(s). </h2>
                        <h1 className="pt-4 font-semibold ml-25 text-[#161736] mx-2 text-[65px]"> {percentualMes}% </h1>
                        <GraficoCrescimento />
                    </div>
                    <div className="mt-10 bg-white rounded-xl shadow-md mx-5 p-4 relative">
                        <h1 className="pt-4 font-semibold text-[#161736] mx-2 text-[25px]">
                            Atendimentos Efetivados
                        </h1>

                        {/* Percentual centralizado no topo dos dados */}
                        <div className="flex flex-col items-center mt-6">
                            <span className="font-semibold text-[#161736] text-[80px] leading-none">79%</span>
                            <div className="w-16 h-1 bg-[#16a34a] rounded-full mt-2 mb-10"></div>
                        </div>

                        {/* Dados principais */}
                        <div className="flex justify-between items-center mt-6 px-2">
                            {/* Coluna 1: Atendimentos Agendados */}
                            <div className="flex flex-col items-center w-1/2 border-r border-gray-300 pr-4">
                                <span className="pt-4 font-semibold text-[#161736] mx-2 text-[65px]">120</span>
                                <span className="text-gray-500 mt-2">Consultas agendadas</span>
                            </div>

                            {/* Coluna 2: Atendimentos Realizados */}
                            <div className="flex flex-col items-center w-1/2 pl-4">
                                <span className="pt-4 font-semibold mx-2 text-[65px] text-[#16a34a]">95</span>
                                <span className="text-gray-500 mt-2">Consultas realizadas</span>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </Main>
    );

}