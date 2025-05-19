import { useEffect, useRef } from 'react';

function MensajeGanador({ premio, dni, ticket, apies }) {
  const id = `${dni}-${Date.now()}`;
  const enviadoRef = useRef(false);

  // Extraer PV desde el ticket (ej: "3002-03-460470")
  

  useEffect(() => {
    if (enviadoRef.current) return;
    enviadoRef.current = true;

    // Enviar datos al script de Google
    fetch(import.meta.env.VITE_SCRIPT_URL, {
      method: 'POST',
      body: new URLSearchParams({
        id,
        dni,
        ticket,
        premio,
        apies,
        
      }),
    });
  }, [id, dni, ticket, premio, apies]);

  const esGanador = premio !== 'No Ganó';

  return (
    <div
      className="alert mt-4"
      style={{
        backgroundColor: esGanador ? '#28a745' : '#ffc107',
        color: 'white',
        borderRadius: '12px',
        fontWeight: 'bold',
      }}
    >
      <h4 className="alert-heading d-flex justify-content-center align-items-center">
        <span
          style={{
            filter: 'drop-shadow(1px 1px 2px black)',
            fontSize: '1.5rem',
            marginRight: '0.5rem',
          }}
        >
          {esGanador ? '🎉' : '❌'}
        </span>
        {esGanador ? '¡Felicitaciones!' : '¡Seguí participando!'}
      </h4>

      <p>
        {esGanador ? (
          <>
            Ganaste: <strong>{premio}</strong>
          </>
        ) : (
          'Seguí cargando para más chances'
        )}
      </p>

      <hr />
      <p className="mb-0" style={{ fontWeight: 'normal' }}>
        <small>ID de validación:</small>
        <br />
        <code
          style={{
            color: '#000000',
            background: '#ffffff',
            padding: '4px 8px',
            borderRadius: '6px',
          }}
        >
          {id}
        </code>
      </p>

      <div className="mt-3 text-center">
        <button
          className="btn btn-light"
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            color: '#333',
            fontWeight: 'bold',
            marginTop: '12px',
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default MensajeGanador;
