import { useState } from 'react';

function Formulario({ ticket, dni, setDni, apies, setApies, onDatosCompletos }) {
  const [mensajeError, setMensajeError] = useState('');
  const [mostrarBotonCerrar, setMostrarBotonCerrar] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMostrarBotonCerrar(false);
    setCargando(true);

    if (dni.length < 7) {
      setMensajeError('Ingrese un DNI válido');
      setMostrarBotonCerrar(true);
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbwa6i9Mwz9jhk2reAhrOzIFhl6akgw8WpA2yMCAdmoe1XTKhB_HlCbPpOkJ3tc2olzKMw/exec?ticket=${ticket}`
      );

      const text = await response.text();

      if (text.trim() === 'DUPLICADO') {
        setMensajeError('❌ El ticket ya fue usado. Por favor escanee uno nuevo.');
        setMostrarBotonCerrar(true);
        setCargando(false);
        return;
      }

      if (text.trim() !== 'OK') {
        setMensajeError(`⚠️ Error del servidor: ${text}`);
        setMostrarBotonCerrar(true);
        setCargando(false);
        return;
      }

      onDatosCompletos();
    } catch (error) {
      console.error(error);
      setMensajeError('⚠️ Error de red al verificar el ticket. Intente de nuevo.');
      setMostrarBotonCerrar(true);
    } finally {
      setCargando(false);
    }
  };

  const handleCerrar = () => {
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-3 text-success text-center fw-bold d-flex align-items-center justify-content-center">
        ✅ Ticket capturado
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

      <div className="mb-3">
        <label className="form-label">Número de Estación (APIES)</label>
        <input
          type="number"
          placeholder="Ej: 3002"
          value={apies}
          onChange={(e) => setApies(e.target.value.slice(0, 5))}
          className="form-control"
          required
        />
      </div>

      {mensajeError && (
        <div className="alert alert-danger text-center">
          {mensajeError}
          <div className="mt-3">
            <button type="button" className="btn btn-secondary" onClick={handleCerrar}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {!mostrarBotonCerrar && (
        <button
          type="submit"
          className="btn btn-success w-100 d-flex justify-content-center align-items-center"
          disabled={cargando}
        >
          {cargando ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status" />
              Verificando...
            </>
          ) : (
            <>
              <span className="me-2">🎲</span>Jugar
            </>
          )}
        </button>
      )}
    </form>
  );
}

export default Formulario;
