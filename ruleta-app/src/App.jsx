import { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
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
        backgroundColor: '#003b75', // color de base azul oscuro
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

      {/* Escáner de código de barras si aún no hay ticket */}
      {!ticket && <BarcodeScanner setTicket={setTicket} />}

      {/* Mostrar formulario después de escanear */}
      {ticket && !mostrarRuleta && (
        <Formulario
          ticket={ticket}
          dni={dni}
          setDni={setDni}
          onDatosCompletos={handleDatosCompletos}
        />
      )}

      {/* Mostrar ruleta si DNI fue completado */}
      {mostrarRuleta && !premio && <Ruleta onPremio={handlePremio} />}

      {/* Mostrar mensaje ganador */}
      {premio && (
        <MensajeGanador premio={premio} dni={dni} ticket={ticket} />
      )}
    </div>
  );
}

export default App;
