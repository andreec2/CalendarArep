import { useEffect, useState } from 'react';
import "../styles/CalendarView.css";

function CalendarView() {
  const [events, setEvents] = useState([]);
  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));

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

  const goToBack = () => {

  };

    return (
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
    );
  }
  
  export default CalendarView;