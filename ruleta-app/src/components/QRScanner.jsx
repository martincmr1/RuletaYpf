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
            setTicket(barcodeValue);
            codeReader.reset();
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
    <div className="mb-3 text-center" style={{ padding: 0 }}>
      <p className="text-white mb-2">📷 Escaneá el código de barras de tu ticket</p>
      <video
        id="barcode-reader"
        style={{
          width: '100%',
          maxWidth: '320px',
          height: '180px', // Altura reducida
          objectFit: 'cover',
          margin: '0 auto',
          borderRadius: '8px',
          border: '2px solid #ccc'
        }}
      />
    </div>
  );
}

export default BarcodeScanner;
