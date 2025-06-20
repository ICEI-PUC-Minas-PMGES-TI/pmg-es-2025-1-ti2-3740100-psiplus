import React, { useState, useMemo, useEffect } from 'react';
import InputPadrao from "~/componentes/InputPadrao";
import IconPesquisar from "../../public/assets/IconPesquisar.png";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import Filtro from "../../public/assets/Filtro.png";
import IconArquivado from "../../public/assets/IconArquivado.png";
import { ArrowLeft } from "lucide-react";

interface Column {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
}

interface TabelaPadraoProps {
    data: any[];
    onRowClick?: (paciente: any) => void;
    onArquivar?: (pacientesArquivados: any[]) => void;
    onDesarquivar?: (pacientesDesarquivados: any[]) => void;
}

export default function TabelaPadrao({ data, onRowClick, onArquivar, onDesarquivar }: TabelaPadraoProps) {
    const columns: Column[] = [
        { id: 'nome', label: 'Nome' },
        { id: 'cpf', label: 'CPF', align: 'left' },
        { id: 'email', label: 'E-mail', align: 'left' },
        { id: 'telefone', label: 'Telefone', align: 'center' },
        { id: 'nascimento', label: 'Nascimento', align: 'center' },
    ];

    const [tabelaData, setTabelaData] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [orderBy, setOrderBy] = useState<string>('pacienteId');
    const [orderAsc, setOrderAsc] = useState(false);
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [ordenacaoRecente, setOrdenacaoRecente] = useState(true);
    const [mostrandoArquivados, setMostrandoArquivados] = useState(false);

    useEffect(() => {
        setTabelaData(data);
    }, [data]);

    const alternarOrdenacao = () => {
        if (ordenacaoRecente) {
            setOrderBy("nome");
            setOrderAsc(true);
        } else {
            setOrderBy("pacienteId");
            setOrderAsc(false);
        }
        setOrdenacaoRecente(!ordenacaoRecente);
    };

    const handleSort = (columnId: string) => {
        if (orderBy === columnId) {
            setOrderAsc(!orderAsc);
        } else {
            setOrderBy(columnId);
            setOrderAsc(true);
        }
    };

    const dadosVisiveis = useMemo(() => {
        return tabelaData.filter(p =>
            mostrandoArquivados ? p.arquivado : !p.arquivado
        );
    }, [mostrandoArquivados, tabelaData]);

    const filteredData = useMemo(() => {
        return dadosVisiveis.filter((row) =>
            ['pacienteId', ...columns.map(c => c.id)].some((colId) =>
                row[colId]?.toString().toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, dadosVisiveis, columns]);

    const sortedData = useMemo(() => {
        if (!orderBy) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[orderBy];
            const bVal = b[orderBy];

            if (aVal === bVal) return 0;
            if (aVal === undefined) return 1;
            if (bVal === undefined) return -1;

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return orderAsc ? aVal - bVal : bVal - aVal;
            }

            return orderAsc
                ? aVal.toString().localeCompare(bVal.toString())
                : bVal.toString().localeCompare(aVal.toString());
        });
    }, [filteredData, orderBy, orderAsc]);

    const paginatedData = useMemo(() => {
        const start = page * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, page]);

    const pageCount = Math.ceil(filteredData.length / rowsPerPage);
    const pacientesSize = filteredData.length;

    const getSelectedRows = () => {
        return Array.from(selectedRows).map(i => sortedData[i]);
    };

    const arquivarPaciente = () => {
        const pacientesParaArquivar = getSelectedRows();
        const idsArquivados = pacientesParaArquivar.map(p => p.pacienteId);

        const atualizados = tabelaData.map(p =>
            idsArquivados.includes(p.pacienteId)
                ? { ...p, arquivado: true }
                : p
        );

        onArquivar?.(idsArquivados);
        setTabelaData(atualizados);
        setSelectedRows(new Set());
        setPage(0);
    };

    const desarquivarPaciente = () => {
        const pacientesParaDesarquivar = getSelectedRows();
        const idsDesarquivados = pacientesParaDesarquivar.map(p => p.pacienteId);

        const atualizados = tabelaData.map(p =>
            idsDesarquivados.includes(p.pacienteId)
                ? { ...p, arquivado: false }
                : p
        );

        onDesarquivar?.(idsDesarquivados);
        setTabelaData(atualizados);
        setSelectedRows(new Set());
        setPage(0);
    };

    const toggleArquivados = () => {
        setMostrandoArquivados(!mostrandoArquivados);
        setSelectedRows(new Set());
        setSearch('');
        setPage(0);
    };

    return (
        <div className="w-full p-4">
            <div className="mb-4 flex mt-5 w-full">
                <div className="w-[70%]">
                    <InputPadrao
                        placeholder="Pesquisar paciente"
                        classNameInput="border-0 font-medium text-[16px]"
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<img className="w-[25px]" src={IconPesquisar} alt="pesquisar" />}
                    />
                </div>

                {!mostrandoArquivados && (
                    <BotaoPadrao
                        color="bg-white"
                        className="text-[14px] !font-normal ml-5 !text-[#6A74A5]"
                        texto={ordenacaoRecente ? "Ordem Alfabética" : "Mais Recentes"}
                        icone={<img className="w-[21px]" src={Filtro} alt="Ordenar" />}
                        handleClick={alternarOrdenacao}
                    />
                )}

                <BotaoPadrao
                    color="bg-white"
                    className="text-[14px] !font-normal ml-1 !text-[#6A74A5]"
                    texto={
                        mostrandoArquivados
                            ? selectedRows.size > 0
                                ? "Desarquivar"
                                : "Voltar"
                            : selectedRows.size > 0
                                ? "Arquivar"
                                : "Arquivados"
                    }
                    icone={
                        mostrandoArquivados && selectedRows.size === 0
                            ? <ArrowLeft className="w-[20px] h-[20px]" />
                            : <img className="w-[21px]" src={IconArquivado} alt="Arquivados" />
                    }
                    handleClick={
                        selectedRows.size > 0
                            ? (mostrandoArquivados ? desarquivarPaciente : arquivarPaciente)
                            : toggleArquivados
                    }
                />
            </div>

            <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 w-4"></th>
                        {columns.map((col) => (
                            <th
                                key={col.id}
                                className={`px-4 py-3 font-medium text-gray-700 cursor-pointer text-${col.align || 'left'}`}
                                onClick={() => handleSort(col.id)}
                            >
                                {col.label}
                                {orderBy === col.id && (orderAsc ? ' ▲' : ' ▼')}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="text-gray-700">
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row, idx) => {
                            const rowIndex = page * rowsPerPage + idx;
                            const isChecked = selectedRows.has(rowIndex);

                            return (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => {
                                                const updated = new Set(selectedRows);
                                                if (e.target.checked) updated.add(rowIndex);
                                                else updated.delete(rowIndex);
                                                setSelectedRows(updated);
                                            }}
                                        />
                                    </td>
                                    {columns.map((col) => (
                                        <td key={col.id} className={`px-4 py-3 text-${col.align || 'left'}`}>
                                            {col.id === "nome" ? (
                                                <button
                                                    className="hover:font-medium cursor-pointer"
                                                    onClick={() => onRowClick?.(row.pacienteId)}
                                                >
                                                    {row[col.id] ?? '-'}
                                                </button>
                                            ) : (
                                                row[col.id] ?? '-'
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-gray-400 italic">
                                Nenhum dado disponível.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex place-content-between">
                <div className="text-sm text-gray-500 m-3">
                    Página {page + 1} de {pageCount || 1}
                </div>
                <div className="text-sm text-gray-500 m-3 mr-6">
                    {pacientesSize} Resultados
                </div>
            </div>

            <div className="mt-4 flex justify-end items-center gap-2">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                    className="cursor-pointer px-3 py-1 text-sm border rounded disabled:opacity-40"
                >
                    Anterior
                </button>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, pageCount - 1))}
                    disabled={page >= pageCount - 1}
                    className="cursor-pointer px-3 py-1 text-sm border rounded disabled:opacity-40"
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}
