import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
    },
};

const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

const data = {
    labels,
    datasets: [
        {
            label: 'Percentual de Novos Cadastros',
            data: [], // valores fictícios
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.4,
        },
    ],
};

export default function GraficoCrescimento() {
    return (
        <div className="max-w-[600px] mx-auto p-4 bg-white ">
            <Line options={options} data={data} />
        </div>
    );
}