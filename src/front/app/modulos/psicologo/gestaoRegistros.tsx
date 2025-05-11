import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InfoPaciente from '~/componentes/InfoPaciente';

export function GestaoRegistros() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Lado esquerdo com menu do psicólogo */}
      <MenuLateralPsicólogo telaAtiva="pacientes" />
      <div className="w-px bg-gray-300" />

      {/* Conteúdo principal */}
      <div className="flex flex-1">
      <div className="mx-1 mt-4 flex gap-7">
        <InfoPaciente
          nome="Isabelle Stanley"
          email="isabeleStanley@gmail.com"
          ultimaConsulta="12/02/2025"
          fotoPerfil="/path/to/foto-perfil.jpg" // Substitua pelo caminho da imagem
        />
      </div>
    </div>
    </div>
  );
}
