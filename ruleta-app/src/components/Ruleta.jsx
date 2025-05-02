import { useEffect } from 'react';
import { Winwheel } from 'winwheel';

function Ruleta({ onPremio }) {
  useEffect(() => {
    const ruleta = new Winwheel({
      canvasId: 'ruletaCanvas',
      numSegments: 6,
      segments: [
        { fillStyle: '#28a745', text: '10% Descuento' },
        { fillStyle: '#dc3545', text: 'No Ganó' },
        { fillStyle: '#ffc107', text: 'Gorra YPF' },
        { fillStyle: '#17a2b8', text: 'Lubricante Gratis' },
        { fillStyle: '#6f42c1', text: '50% Servicio' },
        { fillStyle: '#dc3545', text: 'No Ganó' },
      ],
      animation: {
        type: 'spinToStop',
        duration: 5,
        spins: 8,
        callbackFinished: (segment) => onPremio(segment.text),
      }
    });

    ruleta.startAnimation();
  }, [onPremio]);

  return (
    <div className="mt-4">
      <p>🎡 ¡Girando la ruleta!</p>
      <canvas id="ruletaCanvas" width="300" height="300"></canvas>
    </div>
  );
}

export default Ruleta;
