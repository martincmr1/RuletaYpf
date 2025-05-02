import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

function QRScanner({ setTicket }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    });

    scanner.render(
      (decodedText) => {
        try {
          const base64 = decodedText.split('p=')[1];
          const json = JSON.parse(atob(base64));
          const nroCmp = json.nroCmp;
          if (nroCmp) {
            setTicket(nroCmp.toString());
            scanner.clear();
          }
        } catch (e) {
          alert('No se pudo leer el QR del ticket fiscal.');
        }
      },
      (error) => console.warn(error)
    );
  }, [setTicket]);

  return (
    <div className="mb-4">
      <p>📷 Escaneá el QR de tu ticket fiscal</p>
      <div id="reader" style={{ width: '100%' }}></div>
    </div>
  );
}

export default QRScanner;
