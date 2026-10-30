// js/validaciones.js

export function validarMarca(valor) {
  return valor !== "" ? null : "Elegí una marca";
}

export function validarModelo(valor) {
  if (!valor || valor.trim().length < 2 || valor.trim().length > 40) {
    return "Ingresá el modelo del equipo";
  }
  return null;
}

export function validarValor(valor) {
  const num = Number(valor);
  if (!valor || isNaN(num) || num < 100000 || num > 2500000) {
    return "El valor debe estar entre $100.000 y $2.500.000";
  }
  return null;
}

export function validarNombre(valor) {
  // Mínimo 2 letras, solo letras y espacios
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
  return regex.test(valor || "") ? null : "Ingresá tu nombre / apellido";
}

export function validarDni(valor) {
  const regex = /^\d{7,8}$/;
  return regex.test(valor || "") ? null : "El DNI debe tener 7 u 8 números";
}

export function validarFechaNacimiento(valor) {
  if (!valor) return "Tenés que ser mayor de edad";
  const fechaNac = new Date(valor);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad >= 18 ? null : "Tenés que ser mayor de edad";
}

export function validarEmail(valor) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(valor || "") ? null : "Ingresá un email válido";
}

export function validarCelular(valor) {
  // Si valor no es un string (es null o undefined), lo convertimos a vacío
  const texto = typeof valor === 'string' ? valor : '';
  const limpio = texto.replace(/[\s-]/g, '');
  return /^\d{10}$/.test(limpio) ? null : "Ej.: 11 5555-1234";
}

export function validarTerminos(checked) {
  return checked ? null : "Tenés que aceptar los términos";
}

export function validarTarjeta(valor) {
  const texto = typeof valor === 'string' ? valor : '';
  const limpio = texto.replace(/\s/g, '');
  return /^\d{16}$/.test(limpio) ? null : "Número de tarjeta inválido";
}

export function validarVencimiento(valor) {
  const texto = typeof valor === 'string' ? valor : '';
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!regex.test(texto)) return "Vencimiento inválido";
  
  const [mes, anio] = texto.split('/').map(Number);
  const hoy = new Date();
  const anioActual = hoy.getFullYear() % 100;
  const mesActual = hoy.getMonth() + 1;
  
  if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
    return "Vencimiento inválido";
  }
  return null;
}

export function validarCvv(valor) {
  const texto = typeof valor === 'string' ? valor : '';
  return /^\d{3}$/.test(texto) ? null : "CVV inválido";
}