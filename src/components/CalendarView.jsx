import { useEffect, useState } from 'react';
import "../styles/CalendarView.css";
import GraficasView from './GraficasView';

function CalendarView() {
  const [events, setEvents] = useState([]);
  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
  const [actividadJson, setActividadJson] = useState(null);
  const currentWeekNumber = getWeekNumber(weekStart);

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
  
      const response = await fetch('http://localhost:8080/api/agenda/analizar', {
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

  function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear + 86400000) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
  }
  
  

  return (
    <div className='principal-container'>
      <div className="calendar-container">
        <h2>Eventos de la semana (Semana {currentWeekNumber})</h2>
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
          data={actividadJson}
          onParsed={(parsed) => {
            console.log('Datos parseados:', parsed);
          }}
        />
      </div>
    </div>
  );
  
};
    
    
  export default CalendarView;