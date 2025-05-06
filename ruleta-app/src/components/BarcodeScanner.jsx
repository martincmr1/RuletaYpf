import { useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

function BarcodeScanner({ setTicket }) {
  const [errorCamara, setErrorCamara] = useState('');

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!devices || devices.length === 0) {
          setErrorCamara('⚠️ No se detectó ninguna cámara en el dispositivo.');
          return;
        }

        // Buscar una cámara trasera (si está disponible)
        const camaraTrasera = devices.find((cam) =>
          cam.label.toLowerCase().includes('back')
        );

        const cameraId = camaraTrasera ? camaraTrasera.id : devices[0].id;

        const scanner = new Html5QrcodeScanner('reader', {
          fps: 10,
          qrbox: 250,
          rememberLastUsedCamera: true,
        });

        scanner.render(
          (decodedText) => {
            try {
              const partes = decodedText.split('/');
              const base64 = partes[partes.length - 1];
              const textoPlano = atob(base64); // → "OPESSA_03002_03_6_460470"

              const secciones = textoPlano.split('_');
              if (secciones.length >= 5) {
                const puntoVenta = secciones[1].substring(1);
                const tipoComprobante = secciones[2];
                const numeroComprobante = secciones[4];
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
      })
      .catch((err) => {
        console.error('Error al acceder a la cámara:', err);
        setErrorCamara('⚠️ No se pudo acceder a la cámara. Verificá los permisos.');
      });
  }, [setTicket]);

  return (
    <div className="mb-4 text-center">
      <p className="text-white">📷 Escaneá el QR del ticket fiscal</p>
      {errorCamara ? (
        <div className="alert alert-warning">{errorCamara}</div>
      ) : (
        <div id="reader" style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}></div>
      )}
    </div>
  );
}

export default BarcodeScanner;
