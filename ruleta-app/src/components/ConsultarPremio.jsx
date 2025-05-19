import { useState } from 'react';

function ConsultarPremio() {
  const [dni, setDni] = useState('');
  const [codigoVendedor, setCodigoVendedor] = useState('');
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [premio, setPremio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [canjeado, setCanjeado] = useState(false);
  const [vendedorNombre, setVendedorNombre] = useState('');
  const [loadingCanje, setLoadingCanje] = useState(false);

  const scriptUrl = import.meta.env.VITE_SCRIPT_URL?.trim().replace(/\/$/, '');
  const sheetId = '1G3mhWD-eCQ2b9AbaIsUGaPIYCagN44u8XHNQWuCvujs';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

  const handleConsultar = async () => {
    if (dni.length < 7) {
      setMensaje('⚠️ Ingrese un DNI válido.');
      return;
    }

    setLoading(true);
    setMensaje('');
    setPremio('');
    setCanjeado(false);
    setMostrarCodigo(false);

    try {
      const res = await fetch(url);
      const text = await res.text();
      const lines = text.split(/\r?\n/);
      const rows = lines.map((line) => line.split(','));

      const headers = rows[0].map((h) => h.trim().replace(/"/g, '').toLowerCase());
      const dniIdx = headers.indexOf('dni');
      const premioIdx = headers.indexOf('premio');
      const entregadoIdx = headers.indexOf('premioentregado');

      if (dniIdx === -1 || premioIdx === -1 || entregadoIdx === -1) {
        setMensaje('⚠️ Error: encabezados incorrectos en la hoja.');
        return;
      }

      let premioEncontrado = '';

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row[dniIdx]) continue;
        const valorDni = row[dniIdx].replace(/"/g, '').trim();
        const valorPremio = row[premioIdx]?.replace(/"/g, '').trim().toLowerCase();
        const valorEntregado = row[entregadoIdx]?.replace(/"/g, '').trim().toLowerCase();

        if (valorDni === dni && valorPremio !== 'no ganó' && valorEntregado !== 'sí' && valorEntregado !== 'si') {
          premioEncontrado = valorPremio;
          break;
        }
      }

      if (premioEncontrado) {
        setPremio(premioEncontrado);
      } else {
        setMensaje('❌ No tenés canjes disponibles.');
      }
    } catch (err) {
      console.error('Error al consultar:', err);
      setMensaje('⚠️ Error al consultar.');
    } finally {
      setLoading(false);
    }
  };

  const handleMostrarInputCanje = () => {
    setMostrarCodigo(true);
    setMensaje('');
  };

  const handleCanjear = async () => {
    if (!codigoVendedor.trim()) {
      setMensaje('⚠️ Debe ingresar el código del vendedor.');
      return;
    }

    try {
      if (!scriptUrl) {
        setMensaje('❌ Error: la URL del script no está configurada.');
        return;
      }

      setLoadingCanje(true);

      const fullUrl = `${scriptUrl}?accion=canjear&dni=${encodeURIComponent(dni)}&entregadoPor=${encodeURIComponent(codigoVendedor)}`;
      const res = await fetch(fullUrl);
      const result = await res.text();
      const respuesta = result.trim();

      if (respuesta.toLowerCase().startsWith('ok')) {
        const nombre = respuesta.split(' - ')[1] || 'Vendedor';
        setVendedorNombre(nombre);
        setMensaje('');
        setCanjeado(true);
        setPremio('');
        setMostrarCodigo(false);
      } else {
        setMensaje(`⚠️ Falló el canje: ${respuesta}`);
      }
    } catch (error) {
      console.error('Error al intentar canjear:', error);
      setMensaje('⚠️ Error al intentar canjear.');
    } finally {
      setLoadingCanje(false);
    }
  };

  return (
    <div className="mt-4">
      <h5 className="text-white mb-3">Consultar Premio</h5>

      {!canjeado && (
        <>
          {!mostrarCodigo && (
            <>
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Ingrese su DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />

              <button className="btn btn-primary w-100 mb-3" onClick={handleConsultar} disabled={loading}>
                {loading ? 'Consultando...' : 'Consultar'}
              </button>
            </>
          )}

          {premio && !mostrarCodigo && (
            <div className="alert alert-success text-center fw-bold">
              🎁 Premio: <strong>{premio}</strong>
              <div className="mt-3">
                <button className="btn btn-light" onClick={handleMostrarInputCanje}>Canjear</button>
              </div>
            </div>
          )}

          {mostrarCodigo && (
            <div className="mt-3 text-center">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Código del vendedor"
                value={codigoVendedor}
                onChange={(e) => setCodigoVendedor(e.target.value)}
              />
              <button className="btn btn-success w-100 mb-2" onClick={handleCanjear} disabled={loadingCanje}>
                {loadingCanje ? 'Canjeando...' : 'Confirmar Canje'}
              </button>
            </div>
          )}

          {mensaje && <div className="alert alert-warning text-center fw-bold mt-3">{mensaje}</div>}
        </>
      )}

      {canjeado && (
        <div className="text-white text-center p-5 rounded" style={{ backgroundColor: '#28a745', fontSize: '1.5rem' }}>
          <div style={{ fontSize: '3rem' }}>✅</div>
          Canjeado exitosamente por <strong>{vendedorNombre}</strong>
        </div>
      )}
    </div>
  );
}

export default ConsultarPremio;
