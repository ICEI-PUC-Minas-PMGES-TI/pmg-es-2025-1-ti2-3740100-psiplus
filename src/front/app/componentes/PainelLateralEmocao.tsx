import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventoEmocao {
    id: number;
    paciente: any;
    tipoEmocao: {
        nome: string;
        icone: string;
    };
    data: string; // formato ISO: "2025-06-09"
    hora: string; // formato: "14:30:00"
    sentimento: string;
    notas: string;
}

interface PainelLateralEmocaoProps {
    evento: EventoEmocao | null;
}

export default function PainelLateralEmocao({ evento }: PainelLateralEmocaoProps) {
    const dataHoraFormatada =
        evento?.data && evento?.hora
            ? format(new Date(`${evento.data}T${evento.hora}`), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
            : "Data ou hora não disponível";

    if (!evento) {
        return <div className="p-4">Nenhum evento selecionado.</div>;
    }

    return (
        <div className="p-4 w-full max-w-md bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Detalhes da Emoção</h2>

            <div className="flex items-center space-x-4 mb-4">
                {/* Ícone da emoção */}
                {evento.tipoEmocao?.icone ? (
                    <img
                        src={`/icones-emocoes/${evento.tipoEmocao.icone}_preenchido.svg`}
                        alt={evento.tipoEmocao.nome}
                        className="w-12 h-12"
                    />
                ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-sm text-white">
                        ?
                    </div>
                )}
                <div>
                    <p className="text-lg font-semibold">{evento.tipoEmocao.nome}</p>
                    <p className="text-sm text-gray-500">{dataHoraFormatada}</p>
                </div>
            </div>

            <hr className="border-gray-200 mb-4" />

            <div className="mb-4">
                <h3 className="font-semibold mb-1">Sentimento</h3>
                <p className="text-gray-700">{evento.sentimento || "Não informado."}</p>
            </div>

            <hr className="border-gray-200 mb-4" />

            <div>
                <h3 className="font-semibold mb-1">Observações</h3>
                <p className="text-gray-700">{evento.notas || "Nenhuma observação adicionada."}</p>
            </div>
        </div>
    );
}
