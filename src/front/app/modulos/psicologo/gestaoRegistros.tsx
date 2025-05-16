import React, { useEffect, useState } from "react";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InfoPaciente from "~/componentes/InfoPaciente";
import InputPadrao from "~/componentes/InputPadrao";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import IconPesquisar from "../../../public/assets/IconPesquisar.png";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import ConsultationHistory from "~/componentes/ConsultationHistory";

export function GestaoRegistros() {
  const [anotacoes, setAnotacoes] = useState([]);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("anotacoes");
    if (dadosSalvos) {
      setAnotacoes(JSON.parse(dadosSalvos));
    }
  }, []);

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
          <BotaoPadrao
            color="bg-white"
            className="text-[16px] !font-medium ml-auto !text-black"
            texto="Sair"
            icone={<img className="w-[26px]" src={ExitIcon} alt="Sair" />}
          />
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
