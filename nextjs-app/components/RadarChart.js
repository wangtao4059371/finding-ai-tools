'use client';
import { useEffect, useRef } from 'react';

export default function RadarChart({ labels, datasets }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      if (chartRef.current) chartRef.current.destroy();
      const ctx = canvas.getContext('2d');
      chartRef.current = new window.Chart(ctx, {
        type: 'radar',
        data: { labels, datasets },
        options: {
          responsive: true,
          scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20, font: { size: 14 } }, pointLabels: { font: { size: 14 } } } },
          plugins: { legend: { display: datasets.length > 1, position: 'bottom', labels: { font: { size: 14 } } } },
        },
      });
    };

    if (window.Chart) {
      draw();
    } else {
      const done = false;
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      script.onload = draw;
      document.head.appendChild(script);
    }
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [labels, datasets]);

  return <canvas ref={canvasRef} height={420} />;
}