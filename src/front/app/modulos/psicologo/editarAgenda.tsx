import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import React, { useState, useEffect } from "react";

// imports de icons
import {ChevronLeft, ChevronRight, Copy, Save, Trash2} from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";

// Imports da agenda
import localizer from "~/utils/calendarConfig";
import { Calendar, Views, type HeaderProps } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "~/estilos/customCalendar.css";
import {
    salvarDisponibilidadeRecorrente,
    deletarDisponibilidadeRecorrente,
    listarDisponibilidadesRecorrente, limparDisponibilidadesRecorrente
} from '~/lib/disponibilidadeRecorrente';
import { listarExcecoesDisponibilidade, salvarExcecaoDisponibilidade, deletarExcecaoDisponibilidade } from "~/lib/disponibilidadeExcecoes";
import CustomToolbar from "~/componentes/CustomToolbar";

interface ExcecaoDisponibilidade {
    excecaoDisponibilidadeId?: number;
    psicologoId: number;
    dataHoraInicio: string;
    dataHoraFim: string;
    motivo?: string;
    recorrenteRelacionadaId?: number;
    start?: Date;
    end?: Date;
}

type Sessao = {
    nome: string;
    expiraEm: number;
};

import {
    format,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    isSameDay,
    isSameMonth,
    isToday,
    setHours,
    setMinutes, getDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { View } from "react-big-calendar";
import { useNavigate } from "react-router";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import axios from "axios";

export default function EditarAgenda() {
    const navigate = useNavigate();

    const [dataBase, setDataBase] = useState(new Date());
    const [mesLateral, setMesLateral] = useState(new Date());
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [visualizacao, setVisualizacao] = useState<View>("week");
    const [temAlteracoes, setTemAlteracoes] = useState(false);
    const [excecoes, setExcecoes] = useState<any[]>([]);
    const [excecoesOriginais, setExcecoesOriginais] = useState<any[]>([]);
    const [disponibilidades, setDisponibilidades] = useState<any[]>([]);
    const [psicologoId, setPsicologoId] = useState<number | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [selecao, setSelecao] = useState({ start: null, end: null });
    const [tipoSelecionado, setTipoSelecionado] = useState("DISPONIVEL");
    const [motivo, setMotivo] = useState("");
    const [consultas, setConsultas] = useState([]);

    const [excecoesRemovidas, setExcecoesRemovidas] = useState<any[]>([]);

    useEffect(() => {
        const novasExcecoes = excecoes.some(e => !e.id);

        const excecoesRemovidas = excecoesOriginais.some(orig =>
            !excecoes.some(e => e.id === orig.id)
        );

        const excecoesModificadas = excecoes.some(e => {
            const original = excecoesOriginais.find(orig => orig.id === e.id);
            if (!original) return false;

            return (
                new Date(e.start).getTime() !== new Date(original.start).getTime() ||
                new Date(e.end).getTime() !== new Date(original.end).getTime() ||
                (e.motivo ?? "") !== (original.motivo ?? "")
            );
        });

        const houveAlteracoes =
            novasExcecoes ||
            excecoesRemovidas ||
            excecoesModificadas;

        setTemAlteracoes(houveAlteracoes);
    }, [excecoes, excecoesOriginais]);


    useEffect(() => {
        const sessao = JSON.parse(sessionStorage.getItem("sessaoPsicologo") || '{}');
        if (sessao?.usuarioId) {
            setPsicologoId(sessao.usuarioId);
        }
    }, []);

    useEffect(() => {
        if (!psicologoId) return;

        const carregarExcecoes = async () => {
            try {
                const data = await listarExcecoesDisponibilidade(psicologoId);
                const excecoesFormatadas = data.map((excecao: any) => ({
                    ...excecao,
                    psicologoId,
                    id: excecao.id,
                    start: new Date(excecao.dataHoraInicio),
                    end: new Date(excecao.dataHoraFim),
                    motivo: excecao.motivo ?? null,
                    recorrenteRelacionadaId: excecao.recorrenteRelacionada
                        ? excecao.recorrenteRelacionada.recorrenteId
                        : null
                }));
                setExcecoes(excecoesFormatadas);
                setExcecoesOriginais(excecoesFormatadas);
            } catch (error) {
                console.error('Erro ao carregar exceções:', error);
            }
        };

        const carregarDisponibilidadesRecorrente = async () => {
            try {
                const dados = await listarDisponibilidadesRecorrente(psicologoId);
                setDisponibilidades(dados);
            } catch (err) {
                alert('Erro ao carregar disponibilidades');
            }
        };

        async function carregarConsultas() {
            try {
                const { data: consultasBackend } = await axios.get(`http://localhost:8080/consultas/psicologo/${psicologoId}`);

                // Primeiro, ordena por paciente + data + horário de início
                consultasBackend.sort((a, b) => {
                    if (a.pacienteId !== b.pacienteId) return a.pacienteId - b.pacienteId;
                    if (a.data !== b.data) return a.data.localeCompare(b.data);
                    return a.horarioInicio.localeCompare(b.horarioInicio);
                });

                const gruposUnificados = [];

                for (let i = 0; i < consultasBackend.length; i++) {
                    const atual = consultasBackend[i];

                    const [hIni, mIni] = atual.horarioInicio.split(":").map(Number);
                    const [hFim, mFim] = atual.horarioFim.split(":").map(Number);

                    const dataPartes = atual.data.split("-");
                    const dataConsulta = new Date(
                        Number(dataPartes[0]),
                        Number(dataPartes[1]) - 1,
                        Number(dataPartes[2])
                    );

                    const inicio = new Date(dataConsulta);
                    inicio.setHours(hIni, mIni, 0, 0);
                    const fim = new Date(dataConsulta);
                    fim.setHours(hFim, mFim, 0, 0);

                    // Se for a primeira, ou não for continuação, cria novo grupo
                    const ultimoGrupo = gruposUnificados[gruposUnificados.length - 1];
                    const mesmaPessoa = ultimoGrupo && ultimoGrupo.pacienteId === atual.pacienteId;
                    const mesmaData = ultimoGrupo && ultimoGrupo.data === atual.data;
                    const continua = ultimoGrupo && ultimoGrupo.horarioFim === atual.horarioInicio;

                    if (mesmaPessoa && mesmaData && continua) {
                        // Estende o horário final do grupo anterior
                        ultimoGrupo.horarioFim = atual.horarioFim;
                        ultimoGrupo.end = fim;
                    } else {
                        gruposUnificados.push({
                            id: atual.id,
                            pacienteId: atual.pacienteId,
                            data: atual.data,
                            horarioInicio: atual.horarioInicio,
                            horarioFim: atual.horarioFim,
                            start: inicio,
                            end: fim,
                        });
                    }
                }

                // Agora, buscar os nomes dos pacientes
                const consultasComNome = await Promise.all(gruposUnificados.map(async (consulta) => {
                    try {
                        const resPaciente = await axios.get(`http://localhost:8080/pacientes/${consulta.pacienteId}`);
                        const nomePaciente = resPaciente.data.usuario.nome;

                        return {
                            id: consulta.id,
                            title: "Consulta: " + nomePaciente,
                            start: consulta.start,
                            end: consulta.end,
                        };
                    } catch (error) {
                        console.error(`Erro ao buscar nome do paciente ${consulta.pacienteId}:`, error);
                        return null;
                    }
                }));

                const filtradas = consultasComNome.filter(Boolean);
                setConsultas(filtradas);
            } catch (error) {
                console.error("Erro ao buscar consultas:", error);
            }
        }


        carregarExcecoes();
        carregarConsultas()
        carregarDisponibilidadesRecorrente();

    }, [psicologoId]);

    const onSelectSlotHandle = ({ start, end }) => {
        const excecaoClicada = excecoes.find(
            (ex) => start >= new Date(ex.start) && start < new Date(ex.end)
        );

        if (excecaoClicada) {
            setExcecoes((prev) => prev.filter((ex) => ex !== excecaoClicada));
            if (excecaoClicada.id) {
                setExcecoesRemovidas((prev) => [...prev, excecaoClicada]);
            }
            return;
        }

        const inicioDia = new Date(start);
        inicioDia.setHours(0, 0, 0, 0);
        const fimDia = new Date(start);
        fimDia.setHours(23, 59, 59, 999);
        if (start.getTime() <= inicioDia.getTime() && end.getTime() >= fimDia.getTime()) return;

        const haSobreposicao = excecoes.some((excecao) => {
            const inicio = new Date(excecao.start);
            const fim = new Date(excecao.end);
            return start < fim && inicio < end;
        });
        if (haSobreposicao) {
            alert("Esse horário entra em conflito com uma exceção existente.");
            return;
        }

        setSelecao({ start, end });
        setModalAberto(true);
    };


    const confirmarSelecao = () => {
        setExcecoes((prev) => [
            ...prev,
            {
                start: selecao.start,
                end: selecao.end,
                tipo: tipoSelecionado,
                motivo: motivo.trim() || (tipoSelecionado === "DISPONIVEL" ? "Disponível" : "Indisponível"),
            },
        ]);
        setModalAberto(false);
        setMotivo("");
        setTipoSelecionado("DISPONIVEL");
    };

    const cancelarSelecao = () => {
        setModalAberto(false);
        setMotivo("");
        setTipoSelecionado("DISPONIVEL");
    };


    const proximaSemana = () => {
        const novaData = new Date(dataBase);
        novaData.setDate(novaData.getDate() + 7);
        setDataBase(novaData);
    };

    const semanaAnterior = () => {
        const novaData = new Date(dataBase);
        novaData.setDate(novaData.getDate() - 7);
        setDataBase(novaData);
    };


    function formatarIntervaloSemana(data: Date) {
        const inicio = startOfWeek(data, { weekStartsOn: 1 });
        const fim = endOfWeek(data, { weekStartsOn: 1 });

        const diaInicio = format(inicio, "dd", { locale: ptBR });
        const diaFim = format(fim, "dd", { locale: ptBR });
        const mes = format(fim, "MMMM", { locale: ptBR });

        const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);

        return `${diaInicio} - ${diaFim} de ${mesCapitalizado}`;
    }

    function retornar() {
        navigate("/psicologo/agenda");
    }

    const gerarExcecoesFormatadas = React.useCallback(() => {
        const disponiveis = excecoes
            .filter(e => e.tipo === "DISPONIVEL")
            .map(e => ({
                ...e,
                start: new Date(e.start),
                end: new Date(e.end),
            }))
            .sort((a, b) => a.start.getTime() - b.start.getTime());

        const unidos: any[] = [];
        let atual = null;

        for (const disp of disponiveis) {
            if (!atual) {
                atual = { ...disp };
            } else if (disp.start.getTime() <= atual.end.getTime()) {
                atual.end = new Date(Math.max(atual.end.getTime(), disp.end.getTime()));
            } else {
                unidos.push(atual);
                atual = { ...disp };
            }
        }
        if (atual) unidos.push(atual);

        const disponiveisFormatados = unidos.map((e) => ({
            start: e.start,
            end: e.end,
            id: e.id,
            psicologoId: e.psicologoId,
            title: "Disponível (Exceção)",
            tipo: "disponivel-excecao",
            backgroundColor: "#D1FAE5",
            borderColor: "#10B981",
        }));

        const indisponiveisFormatados = excecoes
            .filter(e => e.tipo !== "DISPONIVEL")
            .map(e => ({
                start: new Date(e.start),
                end: new Date(e.end),
                id: e.id,
                psicologoId: e.psicologoId,
                title: e.motivo || "Indisponível",
                tipo: "indisponivel-excecao",
                backgroundColor: "#FECACA",
                borderColor: "#EF4444",
            }));

        return [...disponiveisFormatados, ...indisponiveisFormatados];
    }, [excecoes]);

    const gerarDisponibilidadesFormatadas = React.useCallback(() => {
        const inicioSemana = startOfWeek(dataBase, { weekStartsOn: 0 });

        const intervaloSeCruzam = (start1, end1, start2, end2) => {
            return start1 < end2 && start2 < end1;
        };

        const fatiarIntervalo = (dispStart, dispEnd, consultas) => {
            // Ordena consultas por start
            const sorted = consultas.sort((a, b) => a.start - b.start);
            const livres = [];
            let cursor = dispStart;

            for (const cons of sorted) {
                // Se o cursor está antes do começo da consulta, tem espaço livre
                if (cursor < cons.start) {
                    livres.push({ start: cursor, end: cons.start });
                }
                // Avança o cursor para o fim da consulta se estiver dentro da disponibilidade
                if (cons.end > cursor) {
                    cursor = cons.end;
                }
            }

            // Depois da última consulta, se sobrar espaço, adiciona também
            if (cursor < dispEnd) {
                livres.push({ start: cursor, end: dispEnd });
            }

            return livres;
        };

        let disponibilidadesComIntervalos = [];

        disponibilidades.forEach((disp) => {
            const dia = new Date(inicioSemana);
            dia.setDate(inicioSemana.getDate() + disp.diaSemana);

            const [horaI, minutoI] = disp.horaInicio.split(":").map(Number);
            const [horaF, minutoF] = disp.horaFim.split(":").map(Number);

            const startDisp = new Date(dia);
            startDisp.setHours(horaI, minutoI, 0, 0);

            const endDisp = new Date(dia);
            endDisp.setHours(horaF, minutoF, 0, 0);

            // Pega as consultas que se cruzam
            const consultasNoIntervalo = consultas.filter(c =>
                intervaloSeCruzam(startDisp, endDisp, c.start, c.end)
            );

            if (consultasNoIntervalo.length === 0) {
                // Disponibilidade inteira livre
                disponibilidadesComIntervalos.push({
                    start: startDisp,
                    end: endDisp,
                    psicologoId: disp.psicologoId,
                    title: "Disponível (Recorrente)",
                    tipo: "disponivel-recorrente",
                    backgroundColor: "#DBEAFE",
                    borderColor: "#3B82F6",
                });
            } else {
                // Divide o intervalo, removendo as consultas
                const intervalosLivres = fatiarIntervalo(startDisp, endDisp, consultasNoIntervalo);

                intervalosLivres.forEach(({ start, end }) => {
                    // Só adiciona se o intervalo for válido (ex: maior que zero)
                    if (start < end) {
                        disponibilidadesComIntervalos.push({
                            start,
                            end,
                            psicologoId: disp.psicologoId,
                            title: "Disponível (Recorrente)",
                            tipo: "disponivel-recorrente",
                            backgroundColor: "#DBEAFE",
                            borderColor: "#3B82F6",
                        });
                    }
                });
            }
        });

        return disponibilidadesComIntervalos;
    }, [dataBase, disponibilidades, consultas]);


    const agendaEventos = React.useMemo(() => {
        return [
            ...gerarExcecoesFormatadas(),
            ...gerarDisponibilidadesFormatadas(),
            ...consultas,
        ];
    }, [excecoes, disponibilidades, consultas, dataBase]);

    const consultasDoDia = agendaEventos.filter((evento) => isSameDay(evento.start, dataSelecionada));

    const CustomHeader: React.FC<HeaderProps> = ({ date }) => {
        const weekday = format(date, "EEE", { locale: ptBR });
        const dayNumber = format(date, "d", { locale: ptBR });
        const isCurrentDay = isToday(date);
        const textColor = isCurrentDay ? "#F58020" : "#858585";

        return (
            <div style={{ textAlign: "center", lineHeight: 1.2 }}>
                <div style={{ fontSize: "0.75rem", color: textColor, fontWeight: 600 }}>{weekday}</div>
                <div style={{ fontSize: "0.85rem", color: textColor, fontWeight: 600 }}>{dayNumber}</div>
            </div>
        );
    };

    async function salvarRecorrenteSemanal() {
        try {

            const semanaAtual = {
                inicio: startOfWeek(dataBase, { weekStartsOn: 1 }),
                fim: endOfWeek(dataBase, { weekStartsOn: 1 })
            };

            const excecoesNaSemanaAtual = excecoes.filter(ex =>
                ex.start >= semanaAtual.inicio && ex.start <= semanaAtual.fim
            );

            const recorrentesParaSalvar = excecoesNaSemanaAtual.map(ex => ({
                psicologoId,
                diaSemana: getDay(ex.start),
                horaInicio: ex.start.toTimeString().slice(0, 5),
                horaFim: ex.end.toTimeString().slice(0, 5),
                dataInicio: semanaAtual.inicio.toISOString().split('T')[0],
                dataFim: null
            }));

            for (const recorrente of recorrentesParaSalvar) {
                await salvarDisponibilidadeRecorrente(recorrente);
            }

            alert("Disponibilidade recorrente semanal salva com sucesso!");
            setTemAlteracoes(false);

            const novasDisponibilidades = await listarDisponibilidadesRecorrente(psicologoId);

            setDisponibilidades(novasDisponibilidades);

        } catch (error) {
            console.error("Erro ao salvar Recorrente semanal:", error);
            alert("Erro ao salvar o Recorrente semanal.");
        }
    }

    async function limparModeloRecorrente() {
        try {

            const confirmacao = confirm("Tem certeza que deseja excluir todo o modelo semanal?");
            if (!confirmacao) return;

            await limparDisponibilidadesRecorrente(psicologoId)


            const novasDisponibilidades = await listarDisponibilidadesRecorrente(psicologoId);

            setDisponibilidades(novasDisponibilidades);

            alert("Modelo semanal limpo com sucesso!");
        } catch (error) {
            console.error("Erro ao limpar modelo semanal:", error);
            alert("Erro ao limpar modelo semanal.");
        }
    }


    const salvarAlteracoes = async () => {
        try {
            const excecoesJaSalvas = await listarExcecoesDisponibilidade(psicologoId);
            const excecoesExistentes = excecoesJaSalvas.map((e: any) => ({
                id: e.excecaoDisponibilidadeId,
                start: new Date(e.dataHoraInicio).toISOString(),
                end: new Date(e.dataHoraFim).toISOString(),
                motivo: e.motivo ?? null,
                tipo: e.tipo ?? "INDISPONIVEL",
            }));

            const excecoesParaSalvar = excecoes.filter((excecao) => {
                const existe = excecoesExistentes.find((e) =>
                    e.start === excecao.start.toISOString() &&
                    e.end === excecao.end.toISOString() &&
                    e.motivo === excecao.motivo &&
                    e.tipo === excecao.tipo
                );
                return !existe;
            });

            const payloadsSalvar = excecoesParaSalvar.map((excecao) => ({
                psicologoId,
                start: excecao.start,
                end: excecao.end,
                motivo: excecao.motivo ?? null,
                tipo: excecao.tipo ?? "INDISPONIVEL",
                recorrenteRelacionadaId: excecao.recorrenteRelacionadaId ?? null,
            }));

            console.log("Salvando novos ou modificados:", payloadsSalvar);

            const promisesSalvar = payloadsSalvar.map((excecao) =>
                salvarExcecaoDisponibilidade(excecao)
            );

            const idsUnicos = Array.from(new Set(
                excecoesRemovidas
                    .filter(e => e.id)        // remove null/undefined
                    .map(e => e.id!)          // extrai apenas os IDs
            ));

            const promisesRemover = idsUnicos.map(id => deletarExcecaoDisponibilidade(id));

            console.log("Removendo:", excecoesRemovidas);

            await Promise.all([...promisesSalvar, ...promisesRemover]);

            const resposta = await listarExcecoesDisponibilidade(psicologoId);

            const novasExcecoes = resposta.map((excecao: any) => ({
                id: excecao.excecaoDisponibilidadeId,
                psicologoId,
                start: new Date(excecao.dataHoraInicio),
                end: new Date(excecao.dataHoraFim),
                motivo: excecao.motivo ?? null,
                tipo: excecao.tipo ?? "INDISPONIVEL",
                recorrenteRelacionadaId: excecao.recorrenteRelacionada
                    ? excecao.recorrenteRelacionada.recorrenteId
                    : null,
            }))

            setExcecoes(novasExcecoes);

            setExcecoesOriginais(novasExcecoes)

            setExcecoesRemovidas([]);

            setTemAlteracoes(false);

            alert("Alterações salvas com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            alert("Erro ao salvar alterações.");
        }
    };

    const EventoCalendario = ({ event }: any) => {
        const horaInicio = event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const horaFim = event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <div className="flex flex-col text-sm">
                <span className="font-semibold">{event.title}</span>
                <span className="text-gray-600 text-xs">{horaInicio} - {horaFim}</span>
            </div>
        );
    };

    const diasDoMes = eachDayOfInterval({
        start: startOfWeek(startOfMonth(mesLateral), { weekStartsOn: 0 }),
        end: endOfWeek(endOfMonth(mesLateral), { weekStartsOn: 0 }),
    });

    function leave() {
        sessionStorage.removeItem("sessaoPsicologo");
        sessionStorage.removeItem("sessaoPaciente");
        sessionStorage.removeItem("sessionData");
        navigate("/")
    }

    const onSelectEventHandle = (event) => {

        if (event.tipo === "disponivel") {
            const novasDisponibilidades = disponibilidades.filter(disp =>
                disp.start.getTime() !== event.start.getTime() ||
                disp.end.getTime() !== event.end.getTime()
            );
            setDisponibilidades(novasDisponibilidades);
        }

        else if (event.tipo === "disponivel-excecao" || event.tipo === "indisponivel-excecao") {
            setExcecoes((prev) => {

                const novas = prev.filter(excecao =>
                    excecao.start.getTime() !== event.start.getTime() ||
                    excecao.end.getTime() !== event.end.getTime()
                );

                if (event.id) {
                    setExcecoesRemovidas((prevRemovidas) => [...prevRemovidas, event]);
                }

                return novas;
            });
        }
    };

    return (
        <Main>
            <div className="flex min-h-screen bg-white">
                <MenuLateralPsicólogo telaAtiva="agenda" />
                <div className="w-px bg-gray-300"></div>

                <div className="flex-1 p-5 overflow-visible">
                    <div className="flex items-center justify-between mt-5 mb-4">
                        <h1 className="text-[20px] font-semibold text-[#161736] ml-1">Edição da Agenda</h1>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#8C9BB0] ml-2">
                                {formatarIntervaloSemana(dataBase)}
                            </span>

                            <div className="flex gap-1">
                                <button onClick={semanaAnterior} className="p-2 bg-[#F3F4F8] rounded-md cursor-pointer">
                                    <ChevronLeft size={20} className="text-[#858585]" />
                                </button>
                                <button onClick={proximaSemana} className="p-2 bg-[#F3F4F8] rounded-md cursor-pointer">
                                    <ChevronRight size={20} className="text-[#858585]" />
                                </button>
                            </div>
                        </div>
                        <div className={"flex gap-3"}>
                            <button
                                onClick={salvarRecorrenteSemanal}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition bg-[#ADD9E2] text-[#0088A3] hover:brightness-95 cursor-pointer`}>
                                <Copy style={{ fontSize: 18, color: "#0088A3" }} />
                                Salvar Modelo semanal
                            </button>

                            <button
                                onClick={limparModeloRecorrente}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition bg-[#f8d7da] text-[#8a1c1c] hover:brightness-95 cursor-pointer`}>
                                <Trash2 style={{ fontSize: 18, color: "#8a1c1c" }} />
                                Limpar Modelo semanal
                            </button>

                            <button
                                disabled={!temAlteracoes}
                                onClick={salvarAlteracoes}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition
        ${temAlteracoes ? 'bg-[#a5e8ad] text-[#056912] hover:brightness-95 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                                <Save style={{ fontSize: 18, color: temAlteracoes ? "#056912" : "#A0A0A0" }} />
                                Salvar Alterações
                            </button>

                        </div>
                        <button
                            onClick={retornar}
                            className="bg-[#ADD9E2] text-[#0088A3] px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 hover:brightness-95 cursor-pointer">
                            <ChevronLeft style={{ fontSize: 18, color: "#0088A3" }} />
                            Voltar à Agenda
                        </button>
                    </div>

                    <div className="rounded-xl bg-[#FAFAFC] pb-7 pl-5 pr-6">
                        {visualizacao === "day" && (
                            <button
                                onClick={() => {
                                    setVisualizacao("week");
                                    setDataBase(new Date());
                                }}
                                className="mt-3 text-sm text-[#0088A3]"
                            >
                                ← Voltar para a semana
                            </button>
                        )}

                        <Calendar
                            localizer={localizer}
                            culture="pt-BR"
                            step={60}
                            timeslots={1}
                            min={new Date(0, 0, 0, 0, 0)}
                            max={new Date(0, 0, 0, 23, 0)}
                            startAccessor="start"
                            endAccessor="end"
                            defaultView={Views.WEEK}
                            views={["week", "day"]}
                            style={{ height: "78vh" }}
                            components={{
                                toolbar: CustomToolbar,
                                header: CustomHeader,
                                event: EventoCalendario,
                            }}
                            messages={{
                                week: "Semana",
                                day: "Dia",
                                today: "Hoje",
                                previous: "Anterior",
                                next: "Próxima",
                            }}
                            date={dataBase}
                            onNavigate={(date) => setDataBase(date)}
                            onSelectEvent={onSelectEventHandle}
                            onSelectSlot={onSelectSlotHandle}
                            selectable
                            events={agendaEventos}
                            slotPropGetter={(date) => {
                                const temEvento = agendaEventos.some(
                                    (evento) => date >= evento.start && date < evento.end
                                );
                                return {
                                    style: {
                                        backgroundColor: temEvento ? undefined : "#fff",
                                        cursor: "pointer",
                                    },
                                };
                            }}

                            eventPropGetter={(event) => {
                                let style = {};
                                let className = "";

                                if (event.tipo === "disponivel-excecao") {
                                    style = {
                                        backgroundColor: "#fff",
                                        color: "#005F30",
                                        border: "1px solid #B0EAC1",
                                        borderRadius: "6px",
                                    };
                                    className = "rbc-event-disponivel";
                                } else {
                                    style = {
                                        backgroundColor: "#0088A3",
                                        color: "#fff",
                                    };
                                }

                                // Estilos fixos de layout e tipografia, que se somam aos anteriores
                                const baseStyle = {
                                    minHeight: '80px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    padding: '2px 4px',
                                    fontSize: '0.75rem',
                                };

                                // Mesclamos os estilos
                                const combinedStyle = { ...style, ...baseStyle };

                                return { style: combinedStyle, className };
                            }}


                        />
                    </div>
                </div>

                {/* Painel lateral (Resumo Diário com calendário e atendimentos) */}
                <div className="w-[300px] border-l border-gray-200 bg-white shadow px-4 py-6 relative flex flex-col">

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

                    {/* Calendário dinâmico */}
                    <div className="mt-15">
                        <div className="flex items-center justify-between text-lg font-semibold text-[#7D8DA6] mb-4 px-1">
                            <span>{(() => {
                                const mes = format(mesLateral, "MMMM yyyy", { locale: ptBR });
                                return mes.charAt(0).toUpperCase() + mes.slice(1);
                            })()}</span>
                            <div className="flex gap-1 mb-4">
                                <button
                                    className="p-1 hover:text-[#161736] cursor-pointer"
                                    onClick={() => setMesLateral(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    className="p-1 hover:text-[#161736] cursor-pointer"
                                    onClick={() => setMesLateral(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Dias da semana */}
                        <div className="grid grid-cols-7 gap-x-3 text-[12px] text-[#161736] font-semibold mb-1">
                            <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
                        </div>

                        {/* Dias do mês */}
                        <div className="grid grid-cols-7 text-[13px] font-medium gap-y-1.5 text-[#161736]">
                            {diasDoMes.map((dia, idx) => {
                                const isSelecionado = isSameDay(dia, dataSelecionada);
                                const isHoje = isToday(dia);

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setDataSelecionada(dia);
                                            setDataBase(dia);
                                        }}
                                        className={`py-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto transition cursor-pointer
                        ${isSelecionado ? 'bg-[#0088A3] text-white font-semibold' : isHoje ? 'text-[#F58020]' : ''}
                        ${!isSameMonth(dia, mesLateral) ? 'text-gray-400' : ''}
                    `}
                                    >
                                        {format(dia, 'd')}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Consultas do dia */}
                    <div className="mt-8">
                        <h2 className="text-base font-bold text-[#161736] mb-4">
                            Eventos do dia
                        </h2>

                        {consultasDoDia.length === 0 ? (
                            <p className="text-sm text-[#8C9BB0]">Nenhuma consulta</p>
                        ) : (
                            consultasDoDia.map((consulta, idx) => (
                                <div key={idx} className="flex items-center bg-[#EDF0F5] rounded-lg px-3 py-2 mb-2">
                                    <div className="w-10 h-10 bg-[#ADD9E2] rounded-full mr-3 flex items-center justify-center font-bold text-[#0088A3]">
                                        {consulta.title.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-[#161736]">
                                            {consulta.title}
                                        </p>
                                        <p className="text-xs text-[#8C9BB0] flex items-center gap-1">
                                            <span className="w-2 h-2 bg-[#F79824] rounded-full inline-block"></span>
                                            {format(consulta.start, "HH:mm")} - {format(consulta.end, "HH:mm")}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
            {/* Modal */}
            {modalAberto && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl border border-gray-200 flex flex-col gap-5 animate-fade-in">
                        <h2 className="text-lg font-semibold text-gray-800 text-center">Nova Exceção</h2>

                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">Escolha o tipo:</p>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="tipo"
                                        value="DISPONIVEL"
                                        checked={tipoSelecionado === "DISPONIVEL"}
                                        onChange={() => setTipoSelecionado("DISPONIVEL")}
                                        className="accent-green-600"
                                    />
                                    <span className="text-sm text-green-700">Disponível</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="tipo"
                                        value="INDISPONIVEL"
                                        checked={tipoSelecionado === "INDISPONIVEL"}
                                        onChange={() => setTipoSelecionado("INDISPONIVEL")}
                                        className="accent-red-600"
                                    />
                                    <span className="text-sm text-red-700">Indisponível</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="motivo" className="text-sm text-gray-600 mb-1">Motivo (opcional):</label>
                            <input
                                id="motivo"
                                type="text"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                placeholder="Ex: Feriado, Reunião..."
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 mt-2">
                            <button
                                onClick={cancelarSelecao}
                                className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarSelecao}
                                className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </Main>
    );
}
