# 🛡️ Cubrí Seguros - Flujo de Contratación Digital

Trabajo Práctico N°5 para la cátedra **Diseño UX/UI** (Licenciatura en Sistemas de Información - UADER FCyT).

Este proyecto consiste en el desarrollo del **front-end de un checkout de contratación de seguros** para celulares. El usuario puede cotizar, elegir un plan, cargar sus datos, pagar (simulado) y recibir su número de póliza.

## 🚀 Demo
Podés ver el sitio funcionando en vivo acá: 
👉 **[https://kecleon20.github.io/tp5/](https://kecleon20.github.io/tp5/)**

## 📸 Capturas de Pantalla

*(Reemplazá estas imágenes con las capturas reales de tu proyecto)*

### Mobile (390px)
| Inicio | Cotizar | Planes |
| :---: | :---: | :---: |
| ![Inicio](ruta/a/tu/captura1.png) | ![Cotizar](ruta/a/tu/captura2.png) | ![Planes](ruta/a/tu/captura3.png) |

| Datos | Pago | Éxito |
| :---: | :---: | :---: |
| ![Datos](ruta/a/tu/captura4.png) | ![Pago](ruta/a/tu/captura5.png) | ![Éxito](ruta/a/tu/captura6.png) |

### Desktop (1440px)
![Vista Desktop](ruta/a/tu/captura-desktop.png)

## 🛠️ Tecnologías utilizadas
- **HTML5** semántico.
- **Tailwind CSS v4** (vía CDN) para layout y estilos utilitarios.
- **Basecoat UI** (vía CDN) para componentes base.
- **JavaScript Vanilla** (Módulos ES6) sin frameworks.
- **LocalStorage** para persistencia de datos del flujo.

## 📂 Estructura del proyecto
```text
/
├── index.html          # Estructura de las 7 pantallas y layout responsive
├── data/
│   └── planes.json     # Datos de los planes (Básico, Plus, Premium)
├── js/
│   ├── app.js          # Orquestador, eventos, validaciones y navegación
│   ├── estado.js       # Objeto único 'solicitud' y persistencia en localStorage
│   ├── render.js       # Renderizado dinámico (pantallas, planes, resumen)
│   ├── validaciones.js # Reglas de negocio puras para cada campo
│   ├── cotizador.js    # Lógica de cálculo de cuotas y formateo de moneda
│   └── pago.js         # Simulación de pago (Promesa con setTimeout)
└── README.md           # Este archivo
