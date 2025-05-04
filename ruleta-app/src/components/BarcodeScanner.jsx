 // src/components/BarcodeScanner.jsx
// src/components/BarcodeScanner.jsx
import { useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

function BarcodeScanner({ setTicket }) {
  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    const videoElementId = 'barcode-reader';

    codeReader.decodeFromVideoDevice({ facingMode: 'environment' }, videoElementId, (result, err) => {
      if (result) {
        console.log('Código leído:', result.getText());
        setTicket(result.getText());
        codeReader.reset();
      }
    });

    return () => {
      codeReader.reset();
    };
  }, [setTicket]);

  return (
    <div className="mb-4 text-center position-relative" style={{ maxWidth: '320px', margin: '0 auto' }}>
      <p className="text-white">📷 Escaneá el código de barras del ticket</p>

      {/* Video de la cámara */}
      <video
        id="barcode-reader"
        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
        muted
        playsInline
      />

      {/* Marco guía (overlay rectangular) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '80%',
        height: '30%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid lime',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,255,0,0.6)',
        pointerEvents: 'none'
      }}></div>
    </div>
  );
}

export default BarcodeScanner;
