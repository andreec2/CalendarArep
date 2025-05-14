import { useEffect, useState } from 'react';
import "../styles/CalendarView.css";
import GraficasView from './GraficasView';

function CalendarView() {
  const [events, setEvents] = useState([]);
  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
  const [actividadJson, setActividadJson] = useState(null);

  const mockData = {
    "daily": {
      "2025-05-25": {
        "actividades": {
        "reuniones": 0.1667,
          "trabajo": 0.0,
          "ocio": 0.25,
          "descanso": 0.5833,
          "estudio": 0.0
      },
        "recomendacion": "Prioriza descanso más temprano para mejorar tu energía semanal."
      },
      "2025-05-26": {
        "actividades": {
          "reuniones": 4.17,
          "trabajo": 0,
          "ocio": 6.25,
          "descanso": 89.58,
          "estudio": 0
        },
        "recomendacion": "Evita reuniones en horarios de madrugada para mantener el ritmo de sueño."
      },
      "2025-05-27": {
        "actividades": {
          "reuniones": 0,
          "trabajo": 0,
          "ocio": 6.25,
          "descanso": 93.75,
          "estudio": 0
        },
        "recomendacion": "Puedes aprovechar más la tarde para tareas productivas."
      },
      "2025-05-28": {
        "actividades": {
          "reuniones": 0,
          "trabajo": 0,
          "ocio": 6.25,
          "descanso": 93.75,
          "estudio": 0
        },
        "recomendacion": "Mantén una rutina constante para sostener el hábito saludable."
      },
      "2025-05-29": {
        "actividades": {
          "reuniones": 0,
          "trabajo": 0,
          "ocio": 6.25,
          "descanso": 93.75,
          "estudio": 0
        },
        "recomendacion": "Considera alternar el ocio con tiempo de estudio o lectura."
      },
      "2025-05-30": {
        "actividades": {
          "reuniones": 0,
          "trabajo": 0,
          "ocio": 6.25,
          "descanso": 93.75,
          "estudio": 0
        },
        "recomendacion": "Podrías incluir alguna meta personal o laboral ligera."
      }
    },
    "weekly": {
      "reuniones": 2.68,
      "trabajo": 0,
      "ocio": 5.65,
      "descanso": 91.67,
      "estudio": 0
    }
  };


  useEffect(() => {
    listEvents();
  }, [weekStart]);

  function getStartOfWeek(date) {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay()); // Domingo
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getEndOfWeek(date) {
    const d = new Date(date);
    d.setDate(d.getDate() + 6); // Sábado
    d.setHours(23, 59, 59, 999);
    return d;
  }

  const listEvents = async () => {
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: weekStart.toISOString(),
        timeMax: getEndOfWeek(weekStart).toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
      });
      setEvents(response.result.items || []);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(weekStart);
    nextWeek.setDate(weekStart.getDate() + 7);
    setWeekStart(nextWeek);
  };

  const goToPreviousWeek = () => {
    const prevWeek = new Date(weekStart);
    prevWeek.setDate(weekStart.getDate() - 7);
    setWeekStart(prevWeek);
  };

  const mapEventsToSimpleFormat = (events) => {
    return events.map(event => {
      const isAllDay = !event.start.dateTime && !event.end.dateTime;
  
      const startDateTime = event.start.dateTime;
      const endDateTime = event.end.dateTime;
  
      const date = isAllDay
        ? event.start.date
        : new Date(startDateTime).toISOString().split('T')[0];
  
      const startTime = isAllDay
        ? null
        : new Date(startDateTime).toISOString().split('T')[1].substring(0, 5);
  
      const endTime = isAllDay
        ? null
        : new Date(endDateTime).toISOString().split('T')[1].substring(0, 5);
  
      return {
        allDay: isAllDay,
        endTime,
        startTime,
        date,
        title: event.summary || 'Sin título'  
      };
    });
  };
  

  const goToBack = async () => {
    try {
      const simplifiedEvents = mapEventsToSimpleFormat(events);
      console.log(simplifiedEvents);
  
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(simplifiedEvents)
      });
  
      if (response.ok) {
        console.log('Eventos enviados exitosamente');
        const data = await response.json();
        setActividadJson(data);
        console.log('Respuesta del backend:', data);
      } else {
        console.error('Error al enviar eventos:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar eventos:', error);
    }
  };
  

  return (
    <div className='principal-container'>
      <div className="calendar-container">
        <h2>Eventos de la semana</h2>
        <button onClick={goToPreviousWeek}>← Semana anterior</button>
        <button onClick={goToBack}>Analizar rendimiento de esta semana</button>
        <button onClick={goToNextWeek}>Semana siguiente →</button>
  
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.summary}</strong> - {event.start?.dateTime || event.start?.date}
            </li>
          ))}
        </ul>
      </div>
  
      <div className="graficas-container">
        <GraficasView
          data={mockData}
          onParsed={(parsed) => {
            console.log('Datos parseados:', parsed);
          }}
        />
      </div>
    </div>
  );
  
};
    
    
  export default CalendarView;