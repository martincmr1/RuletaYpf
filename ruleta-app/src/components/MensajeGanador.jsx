import { useEffect, useRef } from 'react';

function MensajeGanador({ premio, dni, ticket }) {
  const id = `${dni}-${ticket}-${Date.now()}`;
  const enviadoRef = useRef(false);

  useEffect(() => {
    if (enviadoRef.current) return;
    enviadoRef.current = true;

    fetch('https://script.google.com/macros/s/AKfycbwqjRJW6aJoaVoQL7iRe28nnFtZPcDoA8Pugqd6YJbbtDTxHcJRCnSdMlOHe_LobovA/exec', {
      method: 'POST',
      body: new URLSearchParams({
        id,
        dni,
        ticket,
        premio,
      }),
    });
  }, [id, dni, ticket, premio]);

  return (
    <div className="alert alert-success mt-4">
      <h4 className="alert-heading">🎉 ¡Felicitaciones!</h4>
      <p>Ganaste: <strong>{premio}</strong></p>
      <hr />
      <p className="mb-0"><small>ID de validación:</small><br /><code>{id}</code></p>
    </div>
  );
}

export default MensajeGanador;
