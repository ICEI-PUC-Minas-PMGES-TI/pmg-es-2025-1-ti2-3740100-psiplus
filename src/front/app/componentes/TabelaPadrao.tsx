import React, { useState, useMemo } from 'react';
import InputPadrao from "~/componentes/InputPadrao";
import IconPesquisar from "../../public/assets/IconPesquisar.png";
import BotaoPadrao from "~/componentes/BotaoPadrao";
import Filtro from "../../public/assets/Filtro.png";
import IconArquivado from "../../public/assets/IconArquivado.png";

interface Column {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
}

interface RowData {
    [key: string]: string | number;
}

interface TabelaPadraoProps {
    data: any[];
    onRowClick?: (paciente: any) => void;
}

export default function TabelaPadrao({ data, onRowClick }: TabelaPadraoProps) {
    const columns: Column[] = [
        { id: 'nome', label: 'Nome' },
        { id: 'cpf', label: 'CPF', align: 'left' },
        { id: 'email', label: 'E-mail', align: 'left' },
        { id: 'telefone', label: 'Telefone', align: 'center' },
        { id: 'nascimento', label: 'Nascimento', align: 'center' },
    ];

    // const data: RowData[] = []; // Dados Mockados

    const [search, setSearch] = useState('');
    const [orderBy, setOrderBy] = useState<string>('');
    const [orderAsc, setOrderAsc] = useState(true);
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;

    const handleSort = (columnId: string) => {
        if (orderBy === columnId) {
            setOrderAsc(!orderAsc);
        } else {
            setOrderBy(columnId);
            setOrderAsc(true);
        }
    };

    const filteredData = useMemo(() => {
        return data.filter((row) =>
            columns.some((col) =>
                row[col.id]?.toString().toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, data, columns]);

    const sortedData = useMemo(() => {
        if (!orderBy) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[orderBy];
            const bVal = b[orderBy];
            if (aVal === bVal) return 0;
            if (aVal === undefined) return 1;
            if (bVal === undefined) return -1;
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

    return (
        <div className="w-full p-4">
            <div className="mb-4 flex mt-12 w-full">
                <div className="w-[70%]">
                    <InputPadrao
                        placeholder="Pesquisar paciente"
                        classNameInput="border-0 font-medium text-[16px]"
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<img className="w-[25px]" src={IconPesquisar} alt="pesquisar" />}
                    />
                </div>
                    <BotaoPadrao
                        color="bg-white"
                        className="text-[14px] !font-normal  ml-5 !text-[#6A74A5] "
                        texto="Mais Recentes"
                        icone={<img className=" w-[21px] " src={Filtro} alt="MaisRecentes" />}
                    />
                    <BotaoPadrao
                        color="bg-white"
                        className="text-[14px] !font-normal ml-1 !text-[#6A74A5] "
                        texto="Arquivados"
                        icone={<img className=" w-[21px] " src={IconArquivado} alt="Arquivados" />}
                    />
            </div>

            <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                    <thead className=" rounded-tl-lg bg-gray-100">
                    <tr>
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
                        paginatedData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                {columns.map((col) => (
                                    <td key={col.id} className={`px-4 py-3 text-${col.align || 'left'}`}>
                                        {col.id === "nome" ? (
                                            <button
                                                className="hover:font-medium-mediam cursor-pointer"
                                                onClick={() => {
                                                    console.log("Paciente clicado:", row); // Verificando se `row` tem ID
                                                    onRowClick?.(row.id);
                                                }}
                                            >
                                                {row[col.id] ?? '-'}
                                            </button>
                                        ) : (
                                            row[col.id] ?? '-'
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-6 text-center text-gray-400 italic"
                            >
                                Nenhum dado disponível.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <div className="text-sm text-gray-500">
                Página {page + 1} de {pageCount || 1}
            </div>
            <div className="mt-4 flex justify-end items-center gap-2">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-40"
                >
                    Anterior
                </button>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, pageCount - 1))}
                    disabled={page >= pageCount - 1}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-40"
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}
