import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';

function Ruleta({ onPremio }) {
  const [data, setData] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);
  const [cargando, setCargando] = useState(true);

  const sheetId = '1G3mhWD-eCQ2b9AbaIsUGaPIYCagN44u8XHNQWuCvujs';
  const gid = '2090690457';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch(url);
        const text = await res.text();
        const rows = text.split('\n').map(row => row.split(','));

        const headers = rows[0].map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
        const idxPremio = headers.indexOf('premio');
        const idxStock = headers.indexOf('stock');
        const idxActivo = headers.indexOf('activo');

        if (idxPremio === -1 || idxStock === -1 || idxActivo === -1) {
          console.error("❌ Columnas requeridas no encontradas");
          return;
        }

        const colores = ['#28a745', '#ffc107', '#17a2b8', '#6f42c1', '#fd7e14', '#20c997'];
        const premios = [];

        for (let i = 1; i < rows.length; i++) {
          const nombre = rows[i][idxPremio]?.replace(/^"|"$/g, '').trim();
          const stock = parseInt(rows[i][idxStock]?.replace(/^"|"$/g, '').trim(), 10);
          const activo = rows[i][idxActivo]?.replace(/^"|"$/g, '').trim().toLowerCase();

          if (nombre && !isNaN(stock) && stock > 5 && (activo === 'si' || activo === 'sí')) {
            const color = colores[premios.length % colores.length];
            premios.push({
              option: nombre,
              style: { backgroundColor: color }
            });
          }
        }

        // ➕ Agregar 3 "No Ganó" intercalados
        const noGano = { option: 'No Ganó', style: { backgroundColor: '#dc3545' } };
        const total = premios.length;
        const insertados = [];

        if (total > 0) {
          // Insertar "No Ganó" cada N posiciones
          const posiciones = Math.ceil((total + 3) / 3);
          for (let i = 1; i <= 3; i++) {
            const idx = i * posiciones;
            premios.splice(Math.min(idx, premios.length), 0, { ...noGano });
          }
        }

        setData(premios);
      } catch (err) {
        console.error("❌ Error al cargar la hoja", err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    if (data.length > 0 && prizeNumber === null) {
      const index = Math.floor(Math.random() * data.length);
      setPrizeNumber(index);
    }
  }, [data]);

  useEffect(() => {
    if (prizeNumber !== null) {
      setMustSpin(true);
    }
  }, [prizeNumber]);

  const handleStopSpinning = () => {
    const premioGanado = data[prizeNumber]?.option || 'No Ganó';
    console.log('🎯 Premio seleccionado:', premioGanado);
    onPremio(premioGanado);
    setMustSpin(false);
  };

  if (cargando || prizeNumber === null || data.length === 0 || !data[prizeNumber]) {
    return <p className="text-center mt-4">🎡 Cargando premios disponibles...</p>;
  }

  return (
    <div className="mt-4">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={['#ffffff', '#eeeeee']}
        textColors={['#000000']}
        onStopSpinning={handleStopSpinning}
        fontSize={16}
        spinDuration={0.6}
      />
      <p className="mt-3">🎯 Girando la ruleta...</p>
    </div>
  );
}

export default Ruleta;
