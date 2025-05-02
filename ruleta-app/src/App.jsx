import { useState } from 'react';
import QRScanner from './components/QRScanner';
import Formulario from './components/Formulario';
import Ruleta from './components/Ruleta';
import MensajeGanador from './components/MensajeGanador';
import './App.css';
import './index.css';

function App() {
  const [ticket, setTicket] = useState('');
  const [dni, setDni] = useState('');
  const [mostrarRuleta, setMostrarRuleta] = useState(false);
  const [premio, setPremio] = useState('');

  const handleDatosCompletos = () => {
    setMostrarRuleta(true);
  };

  const handlePremio = (premioGanado) => {
    setPremio(premioGanado);
  };

  return (
    <div
      className="container p-4 text-center"
      style={{
        color: 'white',
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #005baa, #007dc5, #005baa, #006fbf)',
        backgroundSize: '400% 400%',
        animation: 'ondaAzul 12s ease infinite',
      }}
    >
      <img
        src="/logo-ypf.png"
        alt="Logo YPF"
        style={{ width: '120px', marginBottom: '1rem' }}
      />
      <h3 className="mb-4">🎟️ Promo Ruleta YPF</h3>

      {!ticket && <QRScanner setTicket={setTicket} />}

      {ticket && !mostrarRuleta && (
        <Formulario
          ticket={ticket}
          dni={dni}
          setDni={setDni}
          onDatosCompletos={handleDatosCompletos}
        />
      )}

      {mostrarRuleta && !premio && <Ruleta onPremio={handlePremio} />}

      {premio && (
        <MensajeGanador premio={premio} dni={dni} ticket={ticket} />
      )}
    </div>
  );
}

export default App;
