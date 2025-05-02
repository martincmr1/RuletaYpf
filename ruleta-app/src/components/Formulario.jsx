function Formulario({ ticket, dni, setDni, onDatosCompletos }) {
    const handleSubmit = (e) => {
      e.preventDefault();
      if (dni.length >= 7) {
        onDatosCompletos();
      } else {
        alert('Ingrese un DNI válido');
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Número de Ticket</label>
          <input
            type="text"
            className="form-control text-center fw-bold"
            value={ticket}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">DNI</label>
          <input
            type="number"
            placeholder="Ingrese su DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">🎰 Validar y Girar</button>
      </form>
    );
  }
  
  export default Formulario;
  