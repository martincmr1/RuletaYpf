import { useEffect, useState } from 'react';

function EditorStockPremios() {
  const [datos, setDatos] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false); // nuevo estado para el spinner

  const sheetId = '1G3mhWD-eCQ2b9AbaIsUGaPIYCagN44u8XHNQWuCvujs';
  const gid = '2090690457';
  const urlCSV = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(urlCSV);
        const text = await res.text();
        const rows = text.split('\n').map(row => row.split(','));

        const cabeceras = rows[0].map(h => h.trim().replace(/^"|"$/g, ''));
        const cuerpo = rows.slice(1).filter(row => row.length >= cabeceras.length);

        setHeaders(cabeceras);
        setDatos(cuerpo);
        setLoading(false);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setMensaje('❌ Error al cargar la hoja');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStockChange = (index, nuevoStock) => {
    const nuevosDatos = [...datos];
    nuevosDatos[index][1] = nuevoStock;
    setDatos(nuevosDatos);
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje('');
    try {
      for (let i = 0; i < datos.length; i++) {
        const premio = encodeURIComponent(datos[i][0].replace(/^"|"$/g, ''));
        const nuevoStock = encodeURIComponent(datos[i][1].replace(/^"|"$/g, ''));

        await fetch(import.meta.env.VITE_SCRIPT_URL + `?accion=editarStock&premio=${premio}&stock=${nuevoStock}`);
      }
      setMensaje('✅ Cambios guardados exitosamente');
    } catch (err) {
      console.error('Error al guardar:', err);
      setMensaje('❌ Error al guardar cambios');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p>Cargando hoja de premios...</p>;

  return (
    <div className="container mt-4">
      <h5>Editor de Stock</h5>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      <table className="table table-bordered table-sm mt-3 bg-white">
        <thead className="table-light">
          <tr>
            {headers.map((h, idx) => (
              <th key={idx}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila, i) => (
            <tr key={i}>
              {fila.map((celda, j) => (
                j === 1 ? (
                  <td key={j}>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={celda.replace(/^"|"$/g, '')}
                      onChange={(e) => handleStockChange(i, e.target.value)}
                    />
                  </td>
                ) : (
                  <td key={j}>{celda.replace(/^"|"$/g, '')}</td>
                )
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="btn btn-primary"
        onClick={handleGuardar}
        disabled={guardando}
      >
        {guardando ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Guardando...
          </>
        ) : (
          'Guardar cambios'
        )}
      </button>
    </div>
  );
}

export default EditorStockPremios;
