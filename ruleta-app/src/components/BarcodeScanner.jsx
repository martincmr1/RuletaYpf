 // src/components/BarcodeScanner.jsx
// src/components/BarcodeScanner.jsx
import { useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

function BarcodeScanner({ setTicket }) {
  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    const videoElementId = 'barcode-reader';

    codeReader.decodeFromVideoDevice(null, videoElementId, (result, err) => {
      if (result) {
        console.log('Código leído:', result.getText());
        setTicket(result.getText());
        codeReader.reset(); // Detiene la cámara
      }
    });

    return () => {
      codeReader.reset(); // Limpieza al desmontar
    };
  }, [setTicket]);

  return (
    <div className="mb-4 text-center">
      <p className="text-white">📷 Escaneá el código de barras del ticket</p>
      <video id="barcode-reader" style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }} />
    </div>
  );
}

export default BarcodeScanner;
