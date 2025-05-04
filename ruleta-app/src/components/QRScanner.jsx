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
          const parts = decodedText.split('p=');
          if (parts.length < 2) throw new Error("No se encontró 'p='");

          const json = JSON.parse(atob(parts[1]));
          if (!json.nroCmp) throw new Error("No se encontró nroCmp");

          setTicket(json.nroCmp.toString());
          scanner.clear(); // ✔️ Detener al encontrar
        } catch (e) {
          alert('❌ QR inválido o no es de un ticket fiscal');
          console.error(e);
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
