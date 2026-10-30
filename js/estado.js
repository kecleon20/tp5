// js/estado.js

const estadoInicial = {
  paso: 0,
  equipo: { marca: "", modelo: "", valor: null, antiguedad: "menos1" },
  plan: null,
  titular: { nombre: "", apellido: "", dni: "", nacimiento: "", email: "", celular: "", terminos: false },
  pago: { metodo: "credito", tarjeta: "", vencimiento: "", cvv: "", titular: "" },
  poliza: null
};

// Intentar recuperar de localStorage o iniciar vacío
const datosGuardados = localStorage.getItem('cubri_solicitud');
export const solicitud = datosGuardados ? JSON.parse(datosGuardados) : estadoInicial;

// Función para guardar el estado actual (para el bonus)
export function guardarEstado() {
  localStorage.setItem('cubri_solicitud', JSON.stringify(solicitud));
}

// Función para navegar y avisar a app.js que cambie de pantalla
export function irAPaso(nuevoPaso) {
  solicitud.paso = nuevoPaso;
  guardarEstado();
  document.dispatchEvent(new CustomEvent('pasoCambiado', { detail: nuevoPaso }));
}