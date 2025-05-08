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
              // ✅ Guardar directamente la URL completa como ticket
              console.log('URL capturada:', decodedText);
              setTicket(decodedText);
              scanner.clear();
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
