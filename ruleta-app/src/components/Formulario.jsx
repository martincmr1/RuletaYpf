import { useState, useEffect } from 'react';

function Formulario({ ticket, dni, setDni, apies, setApies, onDatosCompletos }) {
  const [mensajeError, setMensajeError] = useState('');
  const [mostrarBotonCerrar, setMostrarBotonCerrar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [ticketVerificado, setTicketVerificado] = useState(false);
  const [verificandoTicket, setVerificandoTicket] = useState(true);

  useEffect(() => {
    const verificarTicket = async () => {
      if (!ticket.includes('mifactura.napse.global')) {
        setMensajeError('❌ Ticket inválido. Por favor vuelva a escanear un ticket válido.');
        setMostrarBotonCerrar(true);
        setVerificandoTicket(false);
        return;
      }

      setCargando(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_SCRIPT_URL}?ticket=${ticket}`);
        const text = await response.text();

        if (text.trim() === 'DUPLICADO') {
          setMensajeError('❌ El ticket ya fue usado. Por favor escanee uno nuevo.');
          setMostrarBotonCerrar(true);
          return;
        }

        if (text.trim() !== 'OK') {
          setMensajeError(`⚠️ Error del servidor: ${text}`);
          setMostrarBotonCerrar(true);
          return;
        }

        setTicketVerificado(true);
      } catch (error) {
        console.error(error);
        setMensajeError('⚠️ Error de red al verificar el ticket. Intente de nuevo.');
        setMostrarBotonCerrar(true);
      } finally {
        setCargando(false);
        setVerificandoTicket(false);
      }
    };

    verificarTicket();
  }, [ticket]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dni.length < 7) {
      setMensajeError('Ingrese un DNI válido');
      return;
    }

    onDatosCompletos();
  };

  const handleCerrar = () => {
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {verificandoTicket && (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-light mb-2" role="status" />
          <div className="text-white">Verificando ticket...</div>
        </div>
      )}

      {mensajeError && (
        <div className="alert alert-danger text-center">
          {mensajeError}
          {mostrarBotonCerrar && (
            <div className="mt-3">
              <button type="button" className="btn btn-secondary" onClick={handleCerrar}>
                Volver
              </button>
            </div>
          )}
        </div>
      )}

      {!mensajeError && ticketVerificado && !verificandoTicket && (
        <>
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
        </>
      )}
    </form>
  );
}

export default Formulario;
