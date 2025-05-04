import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScanner({ setTicket }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        try {
          console.log('QR leído:', decodedText);

          // Verificamos si es una URL AFIP con parámetro p=
          const match = decodedText.match(/p=([A-Za-z0-9\-_]+)/);
          if (!match || !match[1]) throw new Error("No se encontró el parámetro 'p='");

          const jsonString = atob(match[1]);
          const data = JSON.parse(jsonString);

          const nroCmp = data.nroCmp || data.nroComprobante || data.nro; // intentos alternativos

          if (!nroCmp) throw new Error('No se encontró nroCmp en el JSON');

          setTicket(nroCmp.toString());
          scanner.clear(); // ✔️ Detener escaneo
        } catch (error) {
          alert('❌ No se pudo leer un ticket fiscal válido.');
          console.error(error);
        }
      },
      (error) => {
        console.warn('Error escaneando:', error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [setTicket]);

  return (
    <div className="mb-4 text-center">
      <p className="text-white">📷 Escaneá el QR de tu ticket fiscal</p>
      <div id="reader" style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}></div>
    </div>
  );
}

export default QRScanner;
