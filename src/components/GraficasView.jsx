import React, { useState, useEffect } from 'react';
import MiGrafico from './Graficas'; // Asegúrate de importar tu componente de gráfica

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

  // Función para convertir actividades en formato para MiGrafico
  const convertirADataGrafico = (actividades) =>
    Object.entries(actividades).map(([nombre, valor]) => ({
      name: nombre,
      value: valor,
    }));

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {dailyData.map((dia, index) => (
        <MiGrafico
          key={index}
          titulo={`Día ${dia.date}`}
          data={convertirADataGrafico(dia.actividades)}
        />
      ))}

      {weeklyData && (      
        <MiGrafico
          titulo="Resumen Semanal"
          data={convertirADataGrafico(weeklyData)}
        />
      )}
    </div>
  );
};

export default GraficasView;
