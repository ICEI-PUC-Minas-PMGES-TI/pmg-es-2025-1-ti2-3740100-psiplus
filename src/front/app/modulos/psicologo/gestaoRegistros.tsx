import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InfoPaciente from '~/componentes/InfoPaciente';
import InputPadrao from "~/componentes/InputPadrao";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import IconPesquisar from "../../../public/assets/IconPesquisar.png";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import ConsultationHistory from "~/componentes/ConsultationHistory";

export function GestaoRegistros() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Menu lateral */}
      <MenuLateralPsicólogo telaAtiva="pacientes" />

      {/* Separador */}
      <div className="w-px bg-gray-300" />

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 p-6">
        {/* Top bar */}
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

        {/* Corpo principal */}
        <div className="flex gap-7">
          <InfoPaciente
            nome="Isabelle Stanley"
            email="isabeleStanley@gmail.com"
            ultimaConsulta="12/02/2025"
            fotoPerfil="/path/to/foto-perfil.jpg"
            abaAtiva="historico"
          />

          {/* Componente de histórico de consultas */}
          <div className="flex-1">
            <ConsultationHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
