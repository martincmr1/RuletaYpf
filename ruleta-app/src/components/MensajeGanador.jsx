import { useEffect, useRef } from 'react';

function MensajeGanador({ premio, dni, ticket }) {
  const id = `${dni}-${ticket}-${Date.now()}`;
  const enviadoRef = useRef(false);

  // Extraer apies y pv desde ticket tipo "3002-03-460470"
  let apies = '';
  let pv = '';
  const partes = ticket.split('-');
  if (partes.length >= 3) {
    apies = partes[0]; // Ej: 3002
    pv = partes[1];    // Ej: 03
  }

  useEffect(() => {
    if (enviadoRef.current) return;
    enviadoRef.current = true;

    // Mostrar valores enviados
    alert(`Enviando a Google Sheets:\n\nID: ${id}\nDNI: ${dni}\nTicket: ${ticket}\nPremio: ${premio}\nAPIES: ${apies}\nPV: ${pv}`);

    fetch('https://script.google.com/macros/s/AKfycbyWC9Tklo0ALdFnAooNs3XhO7mnscWZ3Pj0TPP_GkNd0zQGCSLeudL4Xju-6Nc-1l960g/exec', {
      method: 'POST',
      body: new URLSearchParams({
        id,
        dni,
        ticket,
        premio,
        apies,
        pv,
      }),
    })
    .then(res => res.text())
    .then(text => {
      console.log('Respuesta del script:', text);
    })
    .catch(err => {
      console.error('Error al enviar al script:', err);
    });
  }, [id, dni, ticket, premio, apies, pv]);

  return (
    <div className="alert alert-success mt-4">
      <h4 className="alert-heading">🎉 ¡Felicitaciones!</h4>
      <p>Ganaste: <strong>{premio}</strong></p>
      <hr />
      <p className="mb-0">
        <small>ID de validación:</small><br />
        <code>{id}</code>
      </p>
    </div>
  );
}

export default MensajeGanador;
