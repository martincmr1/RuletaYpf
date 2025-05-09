import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function BarcodeScanner({ setTicket }) {
  const [errorCamara, setErrorCamara] = useState('');
  const [scanner, setScanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const iniciarScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();

        if (!devices || devices.length === 0) {
          setErrorCamara('⚠️ No se detectó ninguna cámara en el dispositivo.');
          setLoading(false);
          return;
        }

        const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

        let cameraId = devices.find((cam) => cam.label.toLowerCase().includes('back'))?.id;
        if (!cameraId) cameraId = isFirefox && devices[1] ? devices[1].id : devices[0].id;

        const html5Qr = new Html5Qrcode("reader");
        setScanner(html5Qr);

        await html5Qr.start(
          cameraId,
          {
            fps: 10,
            qrbox: 250,
          },
          async (decodedText) => {
            console.log('✅ QR leído:', decodedText);
            try {
              // 🔐 Fuerza el cierre de TODAS las cámaras activas
              const mediaDevices = await navigator.mediaDevices.enumerateDevices();
              const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');

              for (const device of videoDevices) {
                const tempStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } });
                tempStream.getTracks().forEach((track) => track.stop());
              }

              await html5Qr.stop();
              await html5Qr.clear();
              setTicket(decodedText);
            } catch (err) {
              console.error('❌ Error forzando el cierre de cámara:', err);
             
            }
          },
          (error) => {
            console.warn('📷 Esperando lectura...');
          }
        );

        setLoading(false);
      } catch (err) {
        console.error('❌ Error accediendo a la cámara:', err);
        setErrorCamara('⚠️ No se pudo acceder a la cámara. Verificá los permisos o cambiá de navegador.');
        setLoading(false);
      }
    };

    iniciarScanner();

    return () => {
      if (scanner) {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
      }
    };
  }, [setTicket]);

  return (
    <div className="mb-4 text-center">
      <p className="text-white">📷 Escaneá el QR del ticket fiscal</p>
      {errorCamara ? (
        <div className="alert alert-warning">{errorCamara}</div>
      ) : (
        <div id="reader" style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}></div>
      )}
      {loading && <p className="text-white mt-2">🔄 Cargando cámara...</p>}
    </div>
  );
}

export default BarcodeScanner;
