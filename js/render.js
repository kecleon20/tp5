// js/render.js
import { solicitud } from './estado.js';
import { calcularCuota, formatearMoneda } from './cotizador.js';

// 1. Manejo de pantallas y footers
export function renderPaso() {
  // Ocultar todas las pantallas
  document.querySelectorAll('.step-section').forEach(s => s.classList.add('hidden'));
  // Mostrar la actual
  const pantallaActual = document.querySelector(`.step-section[data-paso="${solicitud.paso}"]`);
  if (pantallaActual) pantallaActual.classList.remove('hidden');
  
  // Ocultar todos los footers
  document.querySelectorAll('.footer-content').forEach(f => f.classList.add('hidden'));
  // Mostrar el actual
  const footerActual = document.getElementById(`footer-${solicitud.paso}`);
  if (footerActual) footerActual.classList.remove('hidden');
  
  // Ocultar el resumen lateral en el paso 5 (Éxito) y 6 (Error)
  const aside = document.getElementById('resumen-desktop');
  if (aside) {
    if (solicitud.paso === 5 || solicitud.paso === 6) {
      aside.classList.add('hidden');
    } else {
      aside.classList.remove('hidden');
    }
  }
}

// 2. Renderizar planes
export function renderPlanes(planes) {
  const contenedor = document.getElementById('contenedor-planes');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  planes.forEach(plan => {
    const cuota = calcularCuota(plan);
    const isSelected = solicitud.plan?.id === plan.id;
    
    const card = document.createElement('div');
    // Usamos estilos de Tailwind para el estado seleccionado
    card.className = `relative border rounded-2xl p-5 cursor-pointer transition-all ${
      isSelected ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' : 'border-slate-200 bg-white hover:border-indigo-300'
    }`;
    
    let listaCoberturas = '';
    const todasLasCoberturas = ["Robo con violencia", "Rotura de pantalla", "Hurto / pérdida"];
    
    todasLasCoberturas.forEach(cob => {
      const tieneCob = plan.coberturas.includes(cob);
      const icon = tieneCob ? '<span class="text-emerald-500 font-bold">✓</span>' : '<span class="text-slate-400 font-bold">×</span>';
      const textClass = tieneCob ? 'text-slate-700' : 'text-slate-400';
      listaCoberturas += `<li class="flex items-center gap-2 text-sm ${textClass}">${icon} ${cob}</li>`;
    });

    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <div>
          <span class="font-bold text-lg">${plan.nombre}</span>
          ${plan.recomendado ? '<span class="ml-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">Recomendado</span>' : ''}
        </div>
        <div class="w-5 h-5 rounded-full border-2 ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'} flex items-center justify-center">
          ${isSelected ? '<div class="w-2 h-2 bg-white rounded-full"></div>' : ''}
        </div>
      </div>
      <div class="text-2xl font-extrabold mb-4">${formatearMoneda(cuota)} <span class="text-sm font-normal text-slate-500">/ mes</span></div>
      <ul class="space-y-1.5">${listaCoberturas}</ul>
    `;

    card.addEventListener('click', () => {
      solicitud.plan = plan;
      renderPlanes(planes); // Re-renderizar para pintar el seleccionado
      actualizarResumenFooter();
      renderResumen(); // Actualizar aside de desktop
    });

    contenedor.appendChild(card);
  });
}

// 3. Resumen unificado (Regla de oro: un solo lugar)
export function renderResumen() {
  // Si no hay plan seleccionado, no dibujamos nada
  if (!solicitud.plan) {
    const contenido = document.getElementById('resumen-contenido');
    if (contenido) contenido.innerHTML = '<p class="text-slate-500 text-sm">Seleccioná un plan para ver el resumen.</p>';
    return;
  }
  
  const cuota = calcularCuota(solicitud.plan);
  
  // HTML único que se inyecta en ambos lados
  const html = `
    <div class="flex justify-between py-1 text-sm">
      <span class="text-slate-500">Seguro</span> 
      <strong class="text-right">Celular - Plan ${solicitud.plan.nombre}</strong>
    </div>
    <div class="flex justify-between py-1 text-sm">
      <span class="text-slate-500">Equipo</span> 
      <strong class="text-right">${solicitud.equipo.marca} ${solicitud.equipo.modelo}</strong>
    </div>
    <div class="flex justify-between py-1 text-sm">
      <span class="text-slate-500">Titular</span> 
      <strong class="text-right">${solicitud.titular.nombre || 'Completá tus datos'} ${solicitud.titular.apellido || ''}</strong>
    </div>
    <div class="flex justify-between py-2 mt-2 border-t border-slate-200 text-base">
      <span class="font-bold">Total mensual</span> 
      <strong class="text-indigo-600">${formatearMoneda(cuota)}</strong>
    </div>
  `;

  // 1. Inyectar en Desktop (Aside)
  const resDesktop = document.getElementById('resumen-contenido');
  if (resDesktop) resDesktop.innerHTML = html;
  
  // 2. Inyectar en Mobile (Si existe ese div en el paso 4)
  const resMobile = document.getElementById('resumen-mobile');
  if (resMobile) {
    resMobile.innerHTML = `
      <div class="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-4">
        <h4 class="font-bold text-indigo-900 mb-2 text-sm">Resumen de tu compra</h4>
        ${html}
      </div>
    `;
  }
}

// 4. Actualizar barra del Footer en el paso 2 (Planes)
export function actualizarResumenFooter() {
  const resumenIzq = document.getElementById('resumen-izq');
  const resumenDer = document.getElementById('resumen-der');
  const btnContinuar = document.getElementById('btn-continuar-paso2');

  if (solicitud.plan && resumenIzq && resumenDer) {
    const cuota = calcularCuota(solicitud.plan);
    resumenIzq.textContent = `Plan ${solicitud.plan.nombre} - ${solicitud.equipo.modelo}`;
    resumenDer.textContent = `${formatearMoneda(cuota)}/mes`;
    
    // Habilitar botón Continuar
    if (btnContinuar) {
      btnContinuar.disabled = false;
      btnContinuar.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }
}

// 5. Pantalla de Éxito
export function renderExito() {
  document.getElementById('exito-nombre').textContent = `¡Listo, ${solicitud.titular.nombre}!`;
  document.getElementById('exito-email').textContent = solicitud.titular.email;
  document.getElementById('exito-poliza').textContent = solicitud.poliza;
  
  const cuota = calcularCuota(solicitud.plan);
  const hoy = new Date();
  const vencimiento = new Date(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate());
  
  // Si tenés estos IDs en el HTML de Éxito, se llenarán:
  if (document.getElementById('exito-plan')) document.getElementById('exito-plan').textContent = solicitud.plan.nombre;
  if (document.getElementById('exito-vigencia')) document.getElementById('exito-vigencia').textContent = vencimiento.toLocaleDateString('es-AR');
  if (document.getElementById('exito-cuota')) document.getElementById('exito-cuota').textContent = formatearMoneda(cuota);
}