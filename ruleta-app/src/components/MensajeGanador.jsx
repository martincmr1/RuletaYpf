function MensajeGanador({ premio, dni, ticket }) {
    const id = `${dni}-${ticket}-${Date.now()}`;
  
    // Enviar datos a Google Sheets si deseás:
    // fetch('https://script.google.com/macros/s/XXXXX/exec', {
    //   method: 'POST',
    //   body: new URLSearchParams({ dni, ticket, premio, id }),
    // });
  
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
  