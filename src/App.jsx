import { useEffect, useState } from 'react';

const CLIENT_ID = '429235230798-aqq5cu5rvju2l9hitlpnsgrt1nhqdoip.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAguoF1TR7u1YTAct2VoWviQoTFQcPPXqo';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Cargar la librería GAPI al inicio
    const loadGapi = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => gapi.load('client', initializeGapiClient);
      document.body.appendChild(script);
    };

    const loadGis = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadGapi();
    loadGis();
  }, []);

  const initializeGapiClient = async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });

    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          gapi.client.setToken({ access_token: tokenResponse.access_token });
          listEvents();
        }
      },
    });
  };

  const handleLogin = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    }
  };

  const listEvents = async () => {
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: 'startTime',
      });

      const events = response.result.items || [];
      setEvents(events);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Mis eventos de Google Calendar</h1>
      <button onClick={handleLogin}>Iniciar sesión con Google</button>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.summary}</strong> -{' '}
            {event.start?.dateTime || event.start?.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
