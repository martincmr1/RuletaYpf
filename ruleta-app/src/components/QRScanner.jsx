 // src/components/BarcodeScanner.jsx
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useEffect } from 'react';

function BarcodeScanner({ setTicket }) {
  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        const selectedDeviceId = videoInputDevices[0]?.deviceId;

        if (!selectedDeviceId) {
          alert('❌ No se detectó una cámara disponible');
          return;
        }

        codeReader.decodeFromVideoDevice(selectedDeviceId, 'barcode-reader', (result, err) => {
          if (result) {
            const barcodeValue = result.getText();
            console.log('📦 Código de barras leído:', barcodeValue);
            setTicket(barcodeValue); // Envía el valor leído
            codeReader.reset(); // Detener escaneo tras lectura
          }

          if (err && !(err.name === 'NotFoundException')) {
            console.error('❌ Error escaneando:', err);
          }
        });
      })
      .catch((err) => {
        console.error('❌ Error al listar dispositivos de video:', err);
      });

    return () => {
      codeReader.reset();
    };
  }, [setTicket]);

  return (
    <div className="mb-4 text-center">
      <p className="text-white">📷 Escaneá el código de barras de tu ticket</p>
      <video id="barcode-reader" style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }} />
    </div>
  );
}

export default BarcodeScanner;
