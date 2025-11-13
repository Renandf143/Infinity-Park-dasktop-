import { useEffect, useRef } from 'react';

interface PixQRCodeProps {
  value: string;
  size?: number;
}

export function PixQRCode({ value, size = 300 }: PixQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    // Usar uma biblioteca de QR Code simples ou API externa
    // Por enquanto, vamos usar uma API pública
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
      };
      img.src = qrCodeUrl;
    }
  }, [value, size]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border-4 border-gray-200 rounded-xl shadow-lg"
      />
    </div>
  );
}
