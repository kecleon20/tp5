// js/app.js
import { solicitud, irAPaso, guardarEstado } from './estado.js';
import { renderPaso, renderPlanes, renderExito, renderResumen } from './render.js';
import { calcularCuota } from './cotizador.js';
import * as val from './validaciones.js';
import { simularPago } from './pago.js';

let planesData = [];

function addEvent(id, event, callback) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, callback);
}

document.addEventListener('DOMContentLoaded', async () => {
  renderPaso();
  renderStepper();
  
  try {
    const response = await fetch('./data/planes.json');
    planesData = await response.json();
  } catch (error) {
    console.error("Error cargando los planes:", error);
  }
  restaurarFormularios();
});

document.addEventListener('pasoCambiado', (e) => {
  renderPaso();
  renderStepper();
  if (e.detail === 2) renderPlanes(planesData);
  if (e.detail === 3) { restaurarFormularios(); validarFormularioPaso3(); }
  if (e.detail === 4) { renderResumen(); restaurarFormularios(); validarFormularioPaso4(); }
  if (e.detail === 5) renderExito();
});

function renderStepper() {
  const container = document.getElementById('stepper-container');
  if (!container) return;

  if (solicitud.paso === 0) {
    container.innerHTML = '';
    container.classList.add('hidden');
    return;
  } else {
    container.classList.remove('hidden');
  }

  const pasos = ['Cotizar', 'Plan', 'Datos', 'Pago'];
  let html = '<div class="flex items-center justify-between mb-2">';

  pasos.forEach((nombre, index) => {
    const pasoNum = index + 1;
    let estado = 'inactivo';
    if (solicitud.paso === pasoNum) estado = 'activo';
    if (solicitud.paso > pasoNum) estado = 'completado';

    let circleClass = 'bg-slate-200 text-slate-500';
    if (estado === 'activo') circleClass = 'bg-indigo-600 text-white';
    if (estado === 'completado') circleClass = 'bg-emerald-500 text-white';

    html += `
      <div class="flex flex-col items-center gap-1 z-10">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${circleClass}">
          ${estado === 'completado' ? '✓' : pasoNum}
        </div>
        <span class="text-[10px] font-semibold ${estado === 'inactivo' ? 'text-slate-400' : 'text-slate-900'}">${nombre}</span>
      </div>
    `;

    if (index < pasos.length - 1) {
      const lineClass = solicitud.paso > pasoNum ? 'bg-emerald-500' : 'bg-slate-200';
      html += `<div class="flex-1 h-0.5 ${lineClass} -mt-4 mx-1"></div>`;
    }
  });

  html += '</div>';
  container.innerHTML = html;
}

function restaurarFormularios() {
  if (solicitud.equipo.marca && document.getElementById('marca')) document.getElementById('marca').value = solicitud.equipo.marca;
  if (solicitud.equipo.modelo && document.getElementById('modelo')) document.getElementById('modelo').value = solicitud.equipo.modelo;
  if (solicitud.equipo.valor && document.getElementById('valor')) document.getElementById('valor').value = solicitud.equipo.valor;
  
  document.querySelectorAll('.radio-btn').forEach(btn => {
    if(btn.dataset.value === solicitud.equipo.antiguedad) {
      document.querySelectorAll('.radio-btn').forEach(b => {
        b.classList.remove('selected', 'bg-indigo-50', 'border-indigo-600', 'text-indigo-600');
      });
      btn.classList.add('selected', 'bg-indigo-50', 'border-indigo-600', 'text-indigo-600');
    }
  });

  const p3 = solicitud.titular;
  if (document.getElementById('nombre')) {
    if(p3.nombre) document.getElementById('nombre').value = p3.nombre;
    if(p3.apellido) document.getElementById('apellido').value = p3.apellido;
    if(p3.dni) document.getElementById('dni').value = p3.dni;
    if(p3.nacimiento) document.getElementById('nacimiento').value = p3.nacimiento;
    if(p3.email) document.getElementById('email').value = p3.email;
    if(p3.celular) document.getElementById('celular').value = p3.celular;
    if(p3.terminos) document.getElementById('terminos').checked = true;
  }

  const p4 = solicitud.pago;
  if (document.getElementById('tarjeta')) {
    if(p4.tarjeta) document.getElementById('tarjeta').value = p4.tarjeta;
    if(p4.vencimiento) document.getElementById('vencimiento').value = p4.vencimiento;
    if(p4.cvv) document.getElementById('cvv').value = p4.cvv;
    if(p4.titular) document.getElementById('titular-tarjeta').value = p4.titular;
  }
}

// 5. NAVEGACIÓN
addEvent('btn-empezar', 'click', () => irAPaso(1));
addEvent('btn-atras-paso1', 'click', () => irAPaso(0));
addEvent('btn-atras-paso2', 'click', () => irAPaso(1));
addEvent('btn-atras-paso3', 'click', () => irAPaso(2));
addEvent('btn-atras-paso4', 'click', () => irAPaso(3));
addEvent('btn-reintentar', 'click', () => irAPaso(4));
addEvent('btn-cambiar-medio', 'click', () => irAPaso(4));
addEvent('btn-volver-inicio', 'click', () => { localStorage.removeItem('cubri_solicitud'); location.reload(); });

// 6. PASO 1: COTIZAR
const btnVerPlanes = document.getElementById('btn-ver-planes');
const inputMarca = document.getElementById('marca');
const inputModelo = document.getElementById('modelo');
const inputValor = document.getElementById('valor');

function validarFormularioPaso1() {
  let isValid = true;
  const check = (input, errorId, validacion) => {
    if (!input) return;
    
    // Limpiamos el valor si es el input de valor para que no falle con el Number()
    const valorParaValidar = input.id === 'valor' ? input.value.replace(/\D/g, '') : input.value;
    const err = validacion(valorParaValidar);
    const errEl = document.getElementById(errorId);
    
    if (err) {
      if (errEl) errEl.classList.remove('hidden');
      input.setAttribute('aria-invalid', 'true');
      input.classList.add('border-red-500', 'bg-red-50');
      isValid = false;
    } else {
      if (errEl) errEl.classList.add('hidden');
      input.setAttribute('aria-invalid', 'false');
      input.classList.remove('border-red-500', 'bg-red-50');
    }
  };

  check(inputMarca, 'error-marca', val.validarMarca);
  check(inputModelo, 'error-modelo', val.validarModelo);
  check(inputValor, 'error-valor', val.validarValor);

  // Habilitar o deshabilitar el botón
  if (btnVerPlanes) {
    btnVerPlanes.disabled = !isValid;
    btnVerPlanes.classList.toggle('opacity-50', !isValid);
    btnVerPlanes.classList.toggle('cursor-not-allowed', !isValid);
  }
  
  return isValid;
}

// ESCUCHAMOS LOS CAMBIOS EN LOS INPUTS PARA VALIDAR EN TIEMPO REAL
[inputMarca, inputModelo, inputValor].forEach(input => {
  if (input) {
    input.addEventListener('input', validarFormularioPaso1);
    input.addEventListener('change', validarFormularioPaso1);
    input.addEventListener('blur', validarFormularioPaso1);
  }
});

// Escuchamos los radios de antigüedad
document.querySelectorAll('input[name="antiguedad"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    solicitud.equipo.antiguedad = e.target.value;
  });
});

const form1 = document.getElementById('form-paso1');
if (form1) {
  form1.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validarFormularioPaso1()) {
      solicitud.equipo.marca = inputMarca.value;
      solicitud.equipo.modelo = inputModelo.value;
      // Evitamos el NaN convirtiendo a número limpio
      solicitud.equipo.valor = Number(inputValor.value.replace(/\D/g, '')); 
      guardarEstado();
      irAPaso(2);
    }
  });
}

// 7. PASO 2: PLANES
addEvent('btn-continuar-paso2', 'click', () => {
  if (solicitud.plan) irAPaso(3);
});

// 8. PASO 3: DATOS PERSONALES
const btnContinuarPaso3 = document.getElementById('btn-continuar-paso3');
const inputsPaso3 = {
  nombre: document.getElementById('nombre'),
  apellido: document.getElementById('apellido'),
  dni: document.getElementById('dni'),
  nacimiento: document.getElementById('nacimiento'),
  email: document.getElementById('email'),
  celular: document.getElementById('celular'),
  terminos: document.getElementById('terminos'),
};

function validarFormularioPaso3() {
  let isValid = true;
  const check = (input, errorId, validacion) => {
    if (!input) return;
    const err = validacion(input.value || input.checked);
    const errEl = document.getElementById(errorId);
    
    if (err) {
      if (errEl) errEl.classList.remove('hidden');
      if (input.type !== 'checkbox') {
        input.setAttribute('aria-invalid', 'true');
        input.classList.add('border-red-500', 'bg-red-50');
      }
      isValid = false;
    } else {
      if (errEl) errEl.classList.add('hidden');
      if (input.type !== 'checkbox') {
        input.setAttribute('aria-invalid', 'false');
        input.classList.remove('border-red-500', 'bg-red-50');
      }
    }
  };

  check(inputsPaso3.nombre, 'error-nombre', val.validarNombre);
  check(inputsPaso3.apellido, 'error-apellido', val.validarNombre);
  check(inputsPaso3.dni, 'error-dni', val.validarDni);
  check(inputsPaso3.nacimiento, 'error-nacimiento', val.validarFechaNacimiento);
  check(inputsPaso3.email, 'error-email', val.validarEmail);
  check(inputsPaso3.celular, 'error-celular', val.validarCelular);
  check(inputsPaso3.terminos, 'error-terminos', val.validarTerminos);

  if (btnContinuarPaso3) {
    btnContinuarPaso3.disabled = !isValid;
    btnContinuarPaso3.classList.toggle('opacity-50', !isValid);
    btnContinuarPaso3.classList.toggle('cursor-not-allowed', !isValid);
  }
  return isValid;
}

Object.values(inputsPaso3).forEach(input => {
  if (input) {
    input.addEventListener('input', validarFormularioPaso3);
    input.addEventListener('blur', validarFormularioPaso3);
    input.addEventListener('change', validarFormularioPaso3);
  }
});

const form3 = document.getElementById('form-paso3');
if (form3) {
  form3.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validarFormularioPaso3()) {
      solicitud.titular.nombre = inputsPaso3.nombre.value;
      solicitud.titular.apellido = inputsPaso3.apellido.value;
      solicitud.titular.dni = inputsPaso3.dni.value;
      solicitud.titular.nacimiento = inputsPaso3.nacimiento.value;
      solicitud.titular.email = inputsPaso3.email.value;
      solicitud.titular.celular = inputsPaso3.celular.value;
      solicitud.titular.terminos = inputsPaso3.terminos.checked;
      guardarEstado();
      irAPaso(4);
    }
  });
}

// 9. PASO 4: PAGO
const btnPagar = document.getElementById('btn-pagar');
const inputsPaso4 = {
  tarjeta: document.getElementById('tarjeta'),
  vencimiento: document.getElementById('vencimiento'),
  cvv: document.getElementById('cvv'),
  titular: document.getElementById('titular-tarjeta')
};

if (inputsPaso4.tarjeta) {
  inputsPaso4.tarjeta.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = v;
  });
}
if (inputsPaso4.vencimiento) {
  inputsPaso4.vencimiento.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
    e.target.value = v;
  });
}

function validarFormularioPaso4() {
  let isValid = true;
  const check = (input, errorId, validacion) => {
    if (!input) return;
    const err = validacion(input.value);
    const errEl = document.getElementById(errorId);
    
    if (err) {
      if (errEl) errEl.classList.remove('hidden');
      input.setAttribute('aria-invalid', 'true');
      input.classList.add('border-red-500', 'bg-red-50');
      isValid = false;
    } else {
      if (errEl) errEl.classList.add('hidden');
      input.setAttribute('aria-invalid', 'false');
      input.classList.remove('border-red-500', 'bg-red-50');
    }
  };

  check(inputsPaso4.tarjeta, 'error-tarjeta', val.validarTarjeta);
  check(inputsPaso4.vencimiento, 'error-vencimiento', val.validarVencimiento);
  check(inputsPaso4.cvv, 'error-cvv', val.validarCvv);
  check(inputsPaso4.titular, 'error-titular-tarjeta', val.validarNombre);

  if (btnPagar) {
    btnPagar.disabled = !isValid;
    btnPagar.classList.toggle('opacity-50', !isValid);
    btnPagar.classList.toggle('cursor-not-allowed', !isValid);
  }
  return isValid;
}

Object.values(inputsPaso4).forEach(input => {
  if (input) {
    input.addEventListener('input', validarFormularioPaso4);
    input.addEventListener('blur', validarFormularioPaso4);
  }
});

const form4 = document.getElementById('form-paso4');
if (form4) {
  form4.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (validarFormularioPaso4()) {
      solicitud.pago.tarjeta = inputsPaso4.tarjeta.value;
      solicitud.pago.vencimiento = inputsPaso4.vencimiento.value;
      solicitud.pago.cvv = inputsPaso4.cvv.value;
      solicitud.pago.titular = inputsPaso4.titular.value;
      guardarEstado();

      if (btnPagar) {
        btnPagar.textContent = "Procesando...";
        btnPagar.disabled = true;
      }

      const resultado = await simularPago();

      if (resultado.ok) {
        irAPaso(5);
      } else {
        irAPaso(6);
      }
      
      if (btnPagar) {
        btnPagar.textContent = "Pagar y contratar";
        validarFormularioPaso4();
      }
    }
  });
}

// 10. DESCARGAR PÓLIZA
addEvent('btn-descargar-poliza', 'click', () => {
  const contenido = `
    =========================================
    PÓLIZA DE SEGURO - CUBRÍ
    =========================================
    Número de Póliza: ${solicitud.poliza}
    Titular: ${solicitud.titular.nombre} ${solicitud.titular.apellido}
    DNI: ${solicitud.titular.dni}
    Equipo: ${solicitud.equipo.marca} ${solicitud.equipo.modelo}
    Plan: ${solicitud.plan.nombre}
    Cuota Mensual: $${new Intl.NumberFormat('es-AR').format(calcularCuota(solicitud.plan))}
    =========================================
  `;

  const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Poliza_${solicitud.poliza}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});