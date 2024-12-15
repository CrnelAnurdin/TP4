import React from 'react';
import { Bar } from 'react-chartjs-2';

const LiquidityChart = ({ liquidityData }) => {
    const data = {
        labels: ['Token A', 'Token B'],
        datasets: [
            {
                label: 'Liquidez',
                data: [liquidityData.tokenA, liquidityData.tokenB],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
            },
        ],
    };

    return (
        <div style={{ width: '300px', height: '300px' }}>
            <Bar data={data} />
        </div>
    );
};

export default LiquidityChart;