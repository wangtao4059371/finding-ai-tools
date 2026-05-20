'use client';
import { useEffect, useState } from 'react';

export default function RadarChart({ data, options }) {
  const [loaded, setLoaded] = useState(false);
  const [Radar, setRadar] = useState(null);

  useEffect(() => {
    Promise.all([
      import('chart.js'),
      import('react-chartjs-2')
    ]).then(([chartjs, rctj2]) => {
      const { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } = chartjs;
      Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
      setRadar(() => rctj2.Radar);
      setLoaded(true);
    });
  }, []);

  if (!loaded || !Radar) return <div className="h-[400px] flex items-center justify-center text-gray-400">Loading chart...</div>;
  return <Radar data={data} options={options} />;
}