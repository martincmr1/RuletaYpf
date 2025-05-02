import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';

const data = [
  { option: '10% Descuento', style: { backgroundColor: '#28a745' } },
  { option: 'No Ganó', style: { backgroundColor: '#dc3545' } },
  { option: 'Gorra YPF', style: { backgroundColor: '#ffc107' } },
  { option: 'Lubricante Gratis', style: { backgroundColor: '#17a2b8' } },
  { option: '50% Servicio', style: { backgroundColor: '#6f42c1' } },
  { option: 'No Ganó', style: { backgroundColor: '#dc3545' } },
];

function Ruleta({ onPremio }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  useEffect(() => {
    const index = Math.floor(Math.random() * data.length);
    setPrizeNumber(index);
    setMustSpin(true);
  }, []);

  const handleStopSpinning = () => {
    onPremio(data[prizeNumber].option);
  };

  return (
    <div className="mt-4">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={['#f8f9fa', '#dee2e6']}
        textColors={['#212529']}
        onStopSpinning={handleStopSpinning}
        fontSize={16}
        spinDuration={0.5}
      />
      <p className="mt-3">🎡 Girando la ruleta...</p>
    </div>
  );
}

export default Ruleta;
