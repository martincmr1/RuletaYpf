import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function BarcodeScanner({ setTicket }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        try {
          const partes = decodedText.split('/');
          const base64 = partes[partes.length - 1];
          const textoPlano = atob(base64); // → "OPESSA_03002_03_6_460470"

          const secciones = textoPlano.split('_');
          if (secciones.length >= 5) {
            // Extraemos partes específicas
            const puntoVenta = secciones[1].substring(1); // "03002" → "3002"
            const tipoComprobante = secciones[2]; // "03"
            const numeroComprobante = secciones[4]; // "460470"

            const nroTicket = `${puntoVenta}-${tipoComprobante}-${numeroComprobante}`;
            console.log('Ticket procesado:', nroTicket);
            setTicket(nroTicket);
            scanner.clear();
          } else {
            throw new Error('Formato desconocido');
          }
        } catch (e) {
          alert('QR inválido o no corresponde a un ticket fiscal.');
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
      <p className="text-white">📷 Escaneá el QR del ticket fiscal</p>
      <div id="reader" style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}></div>
    </div>
  );
}

export default BarcodeScanner;
