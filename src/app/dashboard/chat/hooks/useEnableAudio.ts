// hooks/useEnableAudio.ts
import { useEffect } from 'react';

export function useEnableAudio() {
  useEffect(() => {
    const handler = () => {
      const audio = new Audio('/sounds/newMessage.wav');
      audio.volume = 0;          // volumen 0 → “silencioso”
      audio.play().finally(() => {
        audio.pause();           // detenerlo inmediatamente
        audio.currentTime = 0;   // volver al inicio
      });
      window.removeEventListener('pointerdown', handler);
    };

    window.addEventListener('pointerdown', handler, { once: true });
    // pointerdown capta clics y toques en todos los navegadores
  }, []);
}
