import React, { useState } from "react";
import { CircleCheck, Plus } from 'lucide-react';
import BotaoPadrao from "~/componentes/BotaoPadrao";
import InfoPaciente from "~/componentes/InfoPaciente";
import InputPadrao from "~/componentes/InputPadrao";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import IconPesquisar from "../../../public/assets/IconPesquisar.png";
import ExitIcon from "../../../public/assets/ExitIcon.png";
import Main from "~/componentes/Main";
import {useNavigate} from "react-router";

export function RegistroAnotacoes() {
  const navigate = useNavigate();
  const [dia, setDia] = useState("04");
  const [mes, setMes] = useState("01");
  const [ano, setAno] = useState("2025");
  const [horaInicio, setHoraInicio] = useState("09:00");
  const [horaFim, setHoraFim] = useState("10:00");
  const [notas, setNotas] = useState("");

  const handleSalvar = () => {
    const data = `${dia}/${mes}/${ano}`;
    console.log({ data, horaInicio, horaFim, notas });
  };

  function leave() {
    sessionStorage.removeItem("sessaoPsicologo");
    sessionStorage.removeItem("sessaoPaciente");
    navigate("/")
  }

  return (
      <Main>
    <div className="flex min-h-screen bg-white">
      <MenuLateralPsicólogo telaAtiva="pacientes" />
      <div className="w-px bg-gray-200" />
      <div className="flex flex-col flex-1 p-6">
        {/* Top bar */}
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
            fotoPerfil="/path/to/foto.jpg"
            abaAtiva="historico"
          />

          {/* Registro de Sessão */}
          <div className="flex-1 relative">
            {/* Botão Salvar */}
            <button
              onClick={handleSalvar}
              className="absolute top-0 right-0 text-sky-500 font-semibold hover:underline flex items-center gap-1"
            >
              <CircleCheck className="w-5 h-5" /> Salvar
            </button>

            <div className="bg-white rounded-lg p-2 w-full">
              <h2 className="text-[15px] font-bold text-gray-800 mb-6">REGISTRO DE SESSÃO</h2>

              {/* Campos de Data e Hora */}
              <div className="flex justify-between mb-6 text-gray-500">
                {/* Data */}
                <div>
                  <label className="block text-sm text-gray-500 font-semibold mb-1">Data da Consulta</label>
                  <div className="flex gap-2 ">
                    <input
                      className="w-[50px] p-2 rounded-md bg-gray-100 text-center "
                      value={dia}
                      onChange={(e) => setDia(e.target.value)}
                    />
                    <input
                      className="w-[50px] p-2 rounded-md bg-gray-100 text-center"
                      value={mes}
                      onChange={(e) => setMes(e.target.value)}
                    />
                    <input
                      className="w-[70px] p-2 rounded-md bg-gray-100 text-center"
                      value={ano}
                      onChange={(e) => setAno(e.target.value)}
                    />
                  </div>
                </div>

                {/* Hora */}
                <div>
                  <label className="block text-sm text-gray-500 font-semibold mb-1">Horário da Consulta</label>
                  <div className="flex items-center gap-2">
                    <input
                      className="w-[80px] p-2 rounded-md bg-gray-100 text-center"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                    />
                    <span className="text-gray-500">às</span>
                    <input
                      className="w-[80px] p-2 rounded-md bg-gray-100 text-center"
                      value={horaFim}
                      onChange={(e) => setHoraFim(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm text-gray-500 font-semibold mb-1">Notas</label>
                <textarea
                  className="w-full h-[300px] p-4 border rounded-md placeholder:text-sky-400 text-gray-500"
                  placeholder="Insira alguma nota sobre esse paciente"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                />
              </div>

              {/* Botão Adicionar Anotações */}
              <div className="flex justify-end mt-2">
                <button className="text-sky-500 text-sm font-semibold flex items-center gap-1 hover:underline">
                  Adicionar anotações <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </Main>
  );
}
