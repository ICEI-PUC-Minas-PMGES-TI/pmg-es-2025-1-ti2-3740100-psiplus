import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    Cell
} from 'recharts';
import { useEffect, useState } from 'react';

const GraficoCrescimento = () => {
    const [datasCadastro, setDatasCadastro] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/pacientes/dadosCadastro")
            .then((res) => res.json())
            .then((data) => {
                const datas = data.map((paciente) => paciente.dataCadastro);
                console.log("Datas recebidas:", datas);
                setDatasCadastro(datas);
            })
            .catch((err) => console.error("Erro ao buscar pacientes:", err));
    }, []);

    const anoAtual = new Date().getFullYear();
    const mesAtual = new Date().getMonth();

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const data = meses.map((mes, index) => {
        const quantidade = datasCadastro.filter((data) => {
            const dataFormatada = new Date(data);
            return (
                dataFormatada.getMonth() === index &&
                dataFormatada.getFullYear() === anoAtual
            );
        }).length;

        return {
            nome: mes,
            quantidade: quantidade,
            cor: index === mesAtual ? '#FF5733' : '#0088A3'
        };
    });

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="nome"
                        interval={0}
                        type="category"
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend
                        formatter={() => (
                            <span style={{ color: '#000', fontWeight: 'semi-bold' }}>
                                Cadastros realizados
                            </span>
                        )}
                    />
                    <Bar
                        dataKey="quantidade"
                        barSize={15}
                        fill="#0088A3"
                    >
                        {
                            data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.cor}
                                />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraficoCrescimento;
