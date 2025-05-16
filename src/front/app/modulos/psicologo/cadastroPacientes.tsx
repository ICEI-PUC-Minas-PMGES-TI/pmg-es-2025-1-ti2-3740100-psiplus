import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import { useState } from "react";

export default function CadastroPacientes() {
  return (
      <Main>
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar usando o componente MenuLateralPsicólogo */}
      <MenuLateralPsicólogo telaAtiva="pacientes"/>
      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Cadastro de Paciente</h1>
          <BotaoPadrao texto="Salvar" className="bg-teal-500" />
        </header>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Informações Pessoais</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <InputPadrao placeholder="Nome Completo" />
            <InputPadrao placeholder="CPF" />
            <InputPadrao placeholder="Sexo" />
            <div className="flex gap-2">
              <InputPadrao placeholder="Dia" />
              <InputPadrao placeholder="Mês" />
              <InputPadrao placeholder="Ano" />
            </div>
            <InputPadrao placeholder="E-mail" />
            <InputPadrao placeholder="Telefone" />
          </div>
          <h2 className="text-lg font-semibold mb-4">Endereço Residencial</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <InputPadrao placeholder="Endereço" />
            <InputPadrao placeholder="Cidade" />
            <InputPadrao placeholder="País" />
            <InputPadrao placeholder="CEP" />
          </div>
          <h2 className="text-lg font-semibold mb-4">Informações Complementares</h2>
          <InputPadrao placeholder="Notas" />
        </div>
      </div>
    </div>
      </Main>
  );
}