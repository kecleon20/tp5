// js/pago.js
import { solicitud } from './estado.js';

export function simularPago() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const limpio = solicitud.pago.tarjeta.replace(/\s/g, '');
      if (limpio === '4000000000000002') {
        resolve({ ok: false, motivo: 'Tarjeta rechazada' });
      } else {
        // Generación de póliza con formato POL-AAAA-NNNNNN
        const anio = new Date().getFullYear();
        const numRandom = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
        solicitud.poliza = `POL-${anio}-${numRandom}`;
        resolve({ ok: true });
      }
    }, 1500);
  });
}