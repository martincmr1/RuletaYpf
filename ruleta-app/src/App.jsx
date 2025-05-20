import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import Formulario from './components/Formulario';
import Ruleta from './components/Ruleta';
import MensajeGanador from './components/MensajeGanador';
import ConsultarPremio from './components/ConsultarPremio';
import Admin from './components/Admin';
import Login from './components/Login';
import EditorStockPremios from './components/EditorStockPremios';

function PublicApp() {
  const [ticket, setTicket] = useState('');
  const [dni, setDni] = useState('');
  const [apies, setApies] = useState('');
  const [mostrarRuleta, setMostrarRuleta] = useState(false);
  const [premio, setPremio] = useState('');
  const [mostrarConsulta, setMostrarConsulta] = useState(false);

  useEffect(() => {
    if (!ticket) {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
    }
  }, [ticket]);

  const handleDatosCompletos = () => setMostrarRuleta(true);
  const handlePremio = (p) => setPremio(p);

  return (
    <div
      className="container p-4 text-center"
      style={{
        color: 'white',
        minHeight: '100vh',
        backgroundColor: '#003b75',
        backgroundImage: 'url("/background.png")',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
      }}
    >
      <img
        src="/Designer.png"
        alt="Logo YPF"
        style={{ width: '120px', marginBottom: '1rem' }}
      />
      <h3 className="mb-4">Cargá, jugá y ganá!!!</h3>

      {!ticket && (
        <>
          {!mostrarConsulta && (
            <>
              <BarcodeScanner setTicket={setTicket} />
              <button
                className="btn btn-outline-light mt-3"
                onClick={() => setMostrarConsulta(true)}
              >
                🎁 Consultar premio
              </button>
            </>
          )}

          {mostrarConsulta && (
            <>
              <ConsultarPremio />
              <button
                className="btn btn-secondary mt-3"
                onClick={() => setMostrarConsulta(false)}
              >
                Volver
              </button>
            </>
          )}
        </>
      )}

      {ticket && !mostrarRuleta && (
        <Formulario
          ticket={ticket}
          dni={dni}
          setDni={setDni}
          apies={apies}
          setApies={setApies}
          onDatosCompletos={handleDatosCompletos}
        />
      )}

      {mostrarRuleta && !premio && <Ruleta onPremio={handlePremio} />}

      {premio && (
        <MensajeGanador
          premio={premio}
          dni={dni}
          ticket={ticket}
          apies={apies}
        />
      )}
    </div>
  );
}

function App() {
  const [auth, setAuth] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicApp />} />
        <Route path="/admin" element={auth ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/prizes" element={<EditorStockPremios/>} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
      </Routes>
    </Router>
  );
}

export default App;
