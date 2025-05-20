 import { useState } from 'react';

function ConsultarPremio() {
  const [dni, setDni] = useState('');
  const [codigoVendedor, setCodigoVendedor] = useState('');
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [premio, setPremio] = useState('');
  const [apies, setApies] = useState('');
  const [idOperacion, setIdOperacion] = useState('');
  const [fechaHora, setFechaHora] = useState('');
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
    setApies('');
    setIdOperacion('');
    setFechaHora('');
    setCanjeado(false);
    setMostrarCodigo(false);

    try {
      const res = await fetch(url);
      const text = await res.text();
      const rows = text.split(/\r?\n/).map(line => line.split(','));

      const headers = rows[0].map(h => h.trim().replace(/"/g, '').toLowerCase());
      const dniIdx = headers.indexOf('dni');
      const premioIdx = headers.indexOf('premio');
      const entregadoIdx = headers.indexOf('premioentregado');
      const apiesIdx = headers.indexOf('apies');
      const idIdx = headers.indexOf('id');
      const fechaIdx = headers.indexOf('fechadeentrega');

      if (dniIdx === -1 || premioIdx === -1 || entregadoIdx === -1) {
        setMensaje('⚠️ Error: encabezados incorrectos en la hoja.');
        return;
      }

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row[dniIdx]) continue;

        const valorDni = row[dniIdx]?.replace(/"/g, '').trim();
        const valorPremio = row[premioIdx]?.replace(/"/g, '').trim();
        const valorEntregado = row[entregadoIdx]?.replace(/"/g, '').trim().toLowerCase();
        const valorApies = apiesIdx !== -1 ? row[apiesIdx]?.replace(/"/g, '').trim() : '';
        const valorId = idIdx !== -1 ? row[idIdx]?.replace(/"/g, '').trim() : '';
        const valorFecha = fechaIdx !== -1 ? row[fechaIdx]?.replace(/"/g, '').trim() : '';

        if (
          valorDni === dni &&
          valorPremio.toLowerCase() !== 'no ganó' &&
          valorEntregado !== 'sí' &&
          valorEntregado !== 'si'
        ) {
          setPremio(valorPremio);
          setApies(valorApies);
          setIdOperacion(valorId);
          setFechaHora(valorFecha);
          return;
        }
      }

      setMensaje('❌ No tenés canjes disponibles.');
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

  const descargarComprobante = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Marca de agua tipo mosaico
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = 'rgba(0, 59, 117, 0.07)';
    for (let x = 0; x < canvas.width; x += 120) {
      for (let y = 0; y < canvas.height; y += 80) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText('YPF', 0, 0);
        ctx.restore();
      }
    }

    const logo = new Image();
    logo.src = '/Designer.png';
    logo.onload = () => {
      ctx.drawImage(logo, 20, 20, 100, 40);

      ctx.fillStyle = '#003b75';
      ctx.font = '20px Arial';
      ctx.fillText('Comprobante de Canje', 150, 50);

      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';

      const now = new Date();
      const fallbackFecha = `${now.getDate().toString().padStart(2, '0')}/${
        (now.getMonth() + 1).toString().padStart(2, '0')
      }/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      ctx.fillText(`DNI: ${dni}`, 40, 100);
      ctx.fillText(`Premio: ${premio}`, 40, 130);
      ctx.fillText(`Apies: ${apies}`, 40, 160);
      ctx.fillText(`Vendedor: ${vendedorNombre}`, 40, 190);
      ctx.fillText(`ID operación: ${idOperacion || '(no disponible)'}`, 40, 220);
      ctx.fillText(`Fecha de entrega: ${fechaHora || fallbackFecha}`, 40, 250);

      const link = document.createElement('a');
      link.download = `comprobante-${dni}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
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
                type="number"
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
          Premio <strong>{premio}</strong> canjeado exitosamente<br />
          Apies <strong>{apies}</strong><br />
          DNI <strong>{dni}</strong><br />
          ID <strong>{idOperacion}</strong><br />
          Fecha <strong>{fechaHora || '(hora local)'}</strong><br />
          Vendedor <strong>{vendedorNombre}</strong><br />
          <button className="btn btn-light mt-3" onClick={descargarComprobante}>📥 Descargar comprobante</button>
        </div>
      )}
    </div>
  );
}

export default ConsultarPremio;
