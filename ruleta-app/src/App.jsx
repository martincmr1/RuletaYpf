import { useState, useEffect } from 'react';
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
  const [esMovil, setEsMovil] = useState(false);

  useEffect(() => {
    setEsMovil(window.innerWidth < 576); // detectar si es móvil
  }, []);

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
        paddingTop: !ticket && esMovil ? '19px' : '0px', // espaciado solo si escaneando en móvil
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

      {!ticket && <BarcodeScanner setTicket={setTicket} />}

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
