import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";

const CLIENT_ID = '429235230798-aqq5cu5rvju2l9hitlpnsgrt1nhqdoip.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAguoF1TR7u1YTAct2VoWviQoTFQcPPXqo';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
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
          navigate('/calendar'); // Redirigir a la vista del calendario
        }
      },
    });
  };

  const handleLogin = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    }
  };

  return (
    <div className="center-text">
      <div className="login-container">
        <h2>Iniciar sesión para ver tu calendario</h2>
        <button onClick={handleLogin}>Login con Google</button>
      </div>
    </div>
  );    
}

export default Login;
