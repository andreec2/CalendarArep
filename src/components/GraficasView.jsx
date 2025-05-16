import React, { useState, useEffect } from 'react';
import MiGrafico from './Graficas'; // Componente de gráfica

const GraficasView = ({ data, onParsed }) => {
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState(null);

  useEffect(() => {
    if (data) {
      const daily = Object.entries(data.daily).map(([date, value]) => ({
        date,
        actividades: value.actividades,
        recomendacion: value.recomendacion,
      }));
      const weekly = data.weekly;

      setDailyData(daily);
      setWeeklyData(weekly);

      if (onParsed) {
        onParsed({ dailyData: daily, weeklyData: weekly });
      }
    }
  }, [data]);

  const convertirADataGrafico = (actividades) =>
    Object.entries(actividades).map(([nombre, valor]) => ({
      name: nombre,
      value: valor,
    }));

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
      {dailyData.map((dia, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '300px',
            margin: '1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            background: '#f9f9f9'
          }}
        >
          <MiGrafico
            titulo={`Día ${dia.date}`}
            data={convertirADataGrafico(dia.actividades)}
          />
          <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#555' }}>
            {dia.recomendacion}
          </p>
        </div>
      ))}

      {weeklyData && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '300px',
            margin: '1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            background: '#f0f0ff'
          }}
        >
          <MiGrafico
            titulo="Resumen Semanal"
            data={convertirADataGrafico(weeklyData)}
          />
        </div>
      )}
    </div>
  );
};

export default GraficasView;
