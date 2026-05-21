'use client';
import { useEffect, useRef } from 'react';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ labels, datasets }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvas.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: { labels, datasets },
      options: {
        responsive: true,
        scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20, font: { size: 14 } }, pointLabels: { font: { size: 14 } } } },
        plugins: { legend: { display: datasets.length > 1, position: 'bottom', labels: { font: { size: 14 } } } },
      },
    });

    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [labels, datasets]);

  return <canvas ref={canvasRef} height={420} />;
}