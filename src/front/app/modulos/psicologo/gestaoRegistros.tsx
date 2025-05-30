import React, { useEffect, useState } from "react";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InfoPaciente from "~/componentes/InfoPaciente";
import InputPadrao from "~/componentes/InputPadrao";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import IconPesquisar from "../../../public/assets/IconPesquisar.png";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import ConsultationHistory from "~/componentes/ConsultationHistory";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {useNavigate} from "react-router";

export function GestaoRegistros() {
  const [anotacoes, setAnotacoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("anotacoes");
    if (dadosSalvos) {
      setAnotacoes(JSON.parse(dadosSalvos));
    }
  }, []);

  function leave() {
    sessionStorage.removeItem("sessaoPsicologo");
    sessionStorage.removeItem("sessaoPaciente");
    navigate("/")
  }

  return (
    <div className="flex min-h-screen bg-white">
      <MenuLateralPsicólogo telaAtiva="pacientes" />
      <div className="w-px bg-gray-300" />

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center mb-6">
          <InputPadrao
            placeholder="Pesquisar"
            classNameInput="border-0 font-semibold text-[14px]"
            icon={<img className="w-[25px]" src={IconPesquisar} alt="pesquisar" />}
          />
          <div className="flex">
            <BotaoPadrao
                texto="Sair"
                icone={<ExitToAppIcon />}
                color="bg-white"
                textoColor="text-gray-600"
                className="ml-auto hover:text-black transition-colors duration-200 font-medium cursor-pointer"
                handleClick={leave}
            />
          </div>
        </div>

        <div className="flex gap-7">
          <InfoPaciente
            nome="Isabelle Stanley"
            email="isabeleStanley@gmail.com"
            ultimaConsulta="12/02/2025"
            fotoPerfil="../../public/assets/PerfilUser.jpg"
            abaAtiva="historico"
          />

          <div className="flex-1">
            <ConsultationHistory anotacoes={anotacoes} />
          </div>
        </div>
      </div>
    </div>
  );
}
