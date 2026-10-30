// js/cotizador.js
import { solicitud } from './estado.js';

// Factores según antigüedad
const FACTORES_ANTIGUEDAD = {
  "menos1": 1.00,
  "1a2": 1.10,
  "mas2": 1.25
};

// Fórmula: cuota = Math.round(valor * tasaAnual / 12 * factorAntiguedad)
export function calcularCuota(plan) {
  const valor = solicitud.equipo.valor || 0;
  const antiguedad = solicitud.equipo.antiguedad;
  const factor = FACTORES_ANTIGUEDAD[antiguedad] || 1.00;
  
  if (valor === 0) return 0;
  
  const cuota = Math.round(valor * plan.tasaAnual / 12 * factor);
  return cuota;
}

// Formateador de moneda para mostrar en pantalla ($ 3.000)
export function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(valor);
}