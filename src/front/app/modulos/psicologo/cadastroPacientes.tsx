import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import IconPesquisar from "../../../public/assets/IconPesquisar.png"
import ExitIcon from "../../../public/assets/ExitIcon.png"
import {ChevronLeft, ChevronRight} from "lucide-react"
import BotaoPadrao from "~/componentes/BotaoPadrao";
import { useState } from "react";


export default function CadastroPaciente() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="text-2xl font-bold text-blue-600">Psi+</div>
        </div>
        <nav>
          <p className="text-gray-700 font-semibold mb-2">Agenda</p>
          <p className="text-blue-600 font-semibold">Pacientes</p>
        </nav>
        <div className="mt-8 space-y-2">
          <Button className="w-full">+ Novo Paciente</Button>
          <Button className="w-full">+ Nova Consulta</Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Cadastro de Paciente</h1>
          <Button className="bg-teal-500">Salvar</Button>
        </header>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Informações Pessoais</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Input placeholder="Nome Completo" />
              <Input placeholder="CPF" />
              <Select>
                <SelectTrigger><SelectValue placeholder="Sexo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Select placeholder="Dia" />
                <Select placeholder="Mês" />
                <Select placeholder="Ano" />
              </div>
              <Input placeholder="E-mail" />
              <Input placeholder="Telefone" />
            </div>
            <h2 className="text-lg font-semibold mb-4">Endereço Residencial</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Input placeholder="Endereço" />
              <Input placeholder="Cidade" />
              <Input placeholder="País" />
              <Input placeholder="CEP" />
            </div>
            <h2 className="text-lg font-semibold mb-4">Informações Complementares</h2>
            <Input placeholder="Notas" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
