 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [filtros, setFiltros] = useState([]);
  const [columnaPvIndex, setColumnaPvIndex] = useState(null);

  const navigate = useNavigate();

  const sheetId = '1G3mhWD-eCQ2b9AbaIsUGaPIYCagN44u8XHNQWuCvujs';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

  useEffect(() => {
    let intervalId;

    const fetchData = () => {
      fetch(url)
        .then(res => res.text())
        .then(text => {
          const rows = text
            .split('\n')
            .map(row => row.split(','))
            .filter(row => row.length > 1);

          const headers = rows[0].map(h => h.replace(/^"|"$/g, '').toLowerCase());
          const indexPv = headers.indexOf('pv');

          setColumnaPvIndex(indexPv);
          setData(rows);
          setFiltros((prev) =>
            prev.length === 0 ? new Array(rows[0].length).fill('') : prev
          );
          setLoading(false);
        })
        .catch(err => {
          console.error('Error al cargar los datos', err);
          setLoading(false);
        });
    };

    if (auth) {
      fetchData();
      intervalId = setInterval(fetchData, 30000); // cada 30 segundos
    }

    return () => clearInterval(intervalId);
  }, [auth]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (usuario === 'opessa' && clave === 'opessa') {
      setAuth(true);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const handleFiltroChange = (valor, index) => {
    const nuevosFiltros = [...filtros];
    nuevosFiltros[index] = valor;
    setFiltros(nuevosFiltros);
  };

  const filtrarFilas = (fila) => {
    return fila.every((celda, i) =>
      celda.toLowerCase().includes(filtros[i]?.toLowerCase() || '')
    );
  };

  const entregarPremio = (ticket) => {
    alert(`Premio entregado para el ticket: ${ticket}`);
    // Aquí va el fetch() real en el futuro
  };

  if (!auth) {
    return (
      <div style={{ padding: '2rem' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Ingreso al Panel de Administración
        </h3>
        <form
          onSubmit={handleLogin}
          style={{
            maxWidth: '300px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={{ fontSize: '14px', padding: '0.5rem' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            style={{ fontSize: '14px', padding: '0.5rem' }}
          />
          <button
            type="submit"
            style={{ padding: '0.5rem', fontSize: '14px' }}
            className="btn btn-primary"
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Panel de Administración</h3>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
              minWidth: '600px',
              backgroundColor: '#1f1f1f',
              color: 'white',
            }}
          >
            <thead style={{ backgroundColor: '#343a40' }}>
              <tr>
                {data[0].map((col, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '8px',
                      border: '1px solid #555',
                      minWidth: '100px',
                      verticalAlign: 'top',
                    }}
                  >
                    <div>{i === columnaPvIndex ? 'Premio Entregado' : col.replace(/^"|"$/g, '')}</div>
                    <input
                      type="text"
                      placeholder="Filtrar..."
                      value={filtros[i]}
                      onChange={(e) => handleFiltroChange(e.target.value, i)}
                      style={{
                        width: '100%',
                        marginTop: '4px',
                        fontSize: '12px',
                        padding: '4px',
                        boxSizing: 'border-box',
                        backgroundColor: '#2c2c2c',
                        color: 'white',
                        border: '1px solid #666',
                      }}
                    />
                  </th>
                ))}
                
              </tr>
            </thead>
            <tbody>
              {data
                .slice(1)
                .filter(filtrarFilas)
                .map((fila, i) => (
                  <tr key={i}>
                    {fila.map((celda, j) => {
                      const contenido = celda.replace(/^"|"$/g, '');
                      const esUrl = /^https?:\/\//.test(contenido);
                      return (
                        <td
                          key={j}
                          style={{
                            padding: '8px',
                            border: '1px solid #555',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                            color: 'white',
                          }}
                        >
                          {esUrl ? (
                            <a
                              href={contenido}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#4da3ff', textDecoration: 'underline' }}
                            >
                              Ver ticket
                            </a>
                          ) : (
                            contenido
                          )}
                        </td>
                      );
                    })}
                    {/* Columna de acción */}
                    
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button
          onClick={() => navigate('/')}
          className="btn btn-danger"
          style={{ padding: '0.5rem 1rem', fontSize: '14px' }}
        >
          Salir
        </button>
      </div>
    </div>
  );
}

export default Admin;
