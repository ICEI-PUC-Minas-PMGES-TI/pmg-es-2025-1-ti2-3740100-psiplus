import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import IconPesquisar from "../../../public/assets/IconPesquisar.png"
import ExitIcon from "../../../public/assets/ExitIcon.png"
import {ChevronLeft, ChevronRight} from "lucide-react"
import BotaoPadrao from "~/componentes/BotaoPadrao";
import { useState } from "react";

type Consulta = {
  paciente: string;
  dia: string;
  hora: string;
};

type Indisponivel = {
  dia: string;
  hora: string;
};

const consultas: Consulta[] = [
  { paciente: "Fernando Oliveira", dia: "Qua", hora: "09:00" },
  { paciente: "Diego Cardoso", dia: "Qua", hora: "10:00" },
  { paciente: "Bruno Moreira", dia: "Qua", hora: "11:00" },
  { paciente: "Patrícia Mendes", dia: "Sex", hora: "10:00" },
  { paciente: "Rafael Nogueira", dia: "Qua", hora: "14:00" },
  { paciente: "Tatiane Ribeiro", dia: "Qua", hora: "16:00" },
  { paciente: "Fábio Torres", dia: "Qui", hora: "15:00" },
  { paciente: "Vanessa Carvalho", dia: "Qui", hora: "16:00" },
  { paciente: "Caroline Batista", dia: "Qua", hora: "18:00" },
  { paciente: "Leandro Barros", dia: "Sáb", hora: "14:00" },
  { paciente: "Natália Freitas", dia: "Sáb", hora: "15:00" },
];

const indisponiveis: Indisponivel[] = [
  { dia: "Sáb", hora: "09:00" },
  { dia: "Sáb", hora: "18:00" }
];

export function Agenda() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const horas = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const obterConsulta = (dia: string, hora: string) =>
      consultas.find((c) => c.dia === dia && c.hora === hora);

  const estaIndisponivel = (dia: string, hora: string) =>
      indisponiveis.some((i) => i.dia === dia && i.hora === hora);

  return (
      <Main>
        <div className="flex h-screen bg-white">
          <MenuLateralPsicólogo telaAtiva={"agenda"} />
          <div className="w-px bg-gray-300" />
          <div className="m-5 w-4/5">
            <div className="flex">
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
            <hr className="border-t-2 border-[#DFE5F1] my-5" />
            <h1 className="font-semibold text-black mx-4 text-[20px]">Gestão da Agenda</h1>
            <p className="text-gray-600 text-sm mx-4 mt-2 mb-4">
              Selecione um card para editar, deixar <span className="font-bold">indisponível</span> ou agendar um <span className="text-orange-500">paciente</span>.
            </p>

            <div className="flex-1 flex gap-6 overflow-y-auto mt-5">
              <div className="flex-1 bg-[#F9FAFC] rounded-xl p-6 shadow overflow-auto">
                <div className="flex justify-between mb-4 items-center">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentWeek((prev) => prev - 1)} className="p-1 hover:bg-gray-100 rounded text-black">
                      <ChevronLeft size={30} />
                    </button>
                    <span className="text-sm text-gray-900">02 - 08 Março</span>
                    <button onClick={() => setCurrentWeek((prev) => prev + 1)} className="p-1 hover:bg-gray-100 rounded text-black">
                      <ChevronRight size={30} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-sm">
                  <div className="col-start-2 col-span-6 grid grid-cols-6 gap-2 mb-2">
                    {dias.map((dia, index) => (
                        <div key={index} className="bg-cyan-50 p-1 text-center font-semibold rounded text-black">
                          {dia}
                        </div>
                    ))}
                  </div>

                  {horas.map((hora, i) => (
                      <>
                        <div key={`hora-${i}`} className="bg-cyan-50 p-1 text-xs font-medium text-center text-black">
                          {hora}
                        </div>
                        {dias.map((dia, j) => {
                          const consulta = obterConsulta(dia, hora);
                          const indispo = estaIndisponivel(dia, hora);
                          return (
                              <div
                                  key={`celula-${i}-${j}`}
                                  className={`rounded p-1 h-20 text-xs flex items-center justify-start 
                            ${indispo ? "bg-[#F9FAFC] text-gray-500 justify-center font-semibold" : "bg-white border hover:bg-gray-50 cursor-pointer"}`}
                              >
                                {indispo ? (
                                    <div
                                        className="bg-gray-300 border-l-4 border-gray-400 p-2 text-xs rounded shadow text-gray-600 w-full text-center">
                                      <strong>Indisponível</strong><br/>
                                      {hora}
                                    </div>
                                ) : (
                                    consulta && (
                                        <div
                                            className="bg-orange-100 border-l-4 border-orange-400 p-2 text-xs rounded shadow text-orange-900 w-full">
                                          <strong>{consulta.paciente}</strong><br/>
                                          {consulta.hora}
                                        </div>
                                    )
                                )}
                              </div>
                          );
                        })}
                      </>
                  ))}
                </div>
              </div>

              <div className="w-[280px] bg-white border border-gray-200 rounded-xl p-4 shadow">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Defina seus horários</h2>
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">Tempo do Expediente</p>
                  <div className="flex gap-2">
                    <InputPadrao placeholder="09:00" classNameInput="text-sm text-center" />
                    <span className="text-sm text-gray-500 mt-1">às</span>
                    <InputPadrao placeholder="18:00" classNameInput="text-sm text-center" />
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">Horário de Almoço</p>
                  <div className="flex gap-2">
                    <InputPadrao placeholder="12:00" classNameInput="text-sm text-center" />
                    <span className="text-sm text-gray-500 mt-1">às</span>
                    <InputPadrao placeholder="13:30" classNameInput="text-sm text-center" />
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">Tempo entre sessões</p>
                  <InputPadrao placeholder="10 min" classNameInput="text-sm text-center" />
                </div>
                <div className="mb-1">
                  <p className="text-sm text-gray-600 mb-1">Duração da Consulta</p>
                  <InputPadrao placeholder="01:00 horas" classNameInput="text-sm text-center" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main>
  );
}
