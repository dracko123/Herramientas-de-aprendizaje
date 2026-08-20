const GENERAL_DATA = {
  programa: "Microsoft Word",
  categoria: "Procesador de textos",
  proposito: "Crear, editar, dar formato e imprimir documentos.",
  importancia: "Microsoft Word es una herramienta fundamental para la elaboración de documentos académicos, laborales y personales. Su interfaz organizada permite a los usuarios crear, editar y dar formato a documentos de manera eficiente, facilitando la comunicación escrita y la gestión de información digital.",
  competencia: "Reconoce e identifica correctamente las partes de la interfaz de Microsoft Word, utilizando adecuadamente sus herramientas para la creación, edición y presentación de documentos digitales."
};

const WORD_PARTS_DATA = [
  {
    id: "barra_de_titulo",
    num: 1,
    nombre: "Barra de título",
    icono: "🏷️",
    color: "#1e40af", // Azul Marino
    categoria: "superior",
    descripcion: "Se encuentra en la parte superior. Muestra el nombre del documento abierto y el programa. Incluye los botones de control de ventana.",
    funcion: "Identificar el documento y controlar la ventana.",
    detalles: "Muestra 'Documento1 - Word', estado de inicio de sesión y la barra de búsqueda '¿Qué desea hacer?'.",
    pista: "Franja superior de color azul oscuro en el centro de la ventana.",
    badgePos: { top: "3.5%", left: "49%" },
    areaPos: { top: "0%", left: "20%", width: "54%", height: "7.5%" }
  },
  {
    id: "barra_acceso_rapido",
    num: 2,
    nombre: "Barra de herramientas de acceso rápido",
    icono: "⚡",
    color: "#16a34a", // Verde
    categoria: "superior",
    descripcion: "Ubicada en la esquina superior izquierda. Contiene comandos frecuentes como Guardar, Deshacer y Rehacer. Es personalizable según las necesidades del usuario.",
    funcion: "Acceder rápidamente a las herramientas más utilizadas.",
    detalles: "Iconos de Guardar (Ctrl+G), Deshacer (Ctrl+Z), Rehacer (Ctrl+Y) y personalizador desplegable.",
    pista: "Esquina superior izquierda con iconos pequeños para guardar y deshacer.",
    badgePos: { top: "3.5%", left: "11%" },
    areaPos: { top: "0%", left: "0%", width: "20%", height: "7.5%" }
  },
  {
    id: "cinta_de_opciones",
    num: 3,
    nombre: "Cinta de opciones",
    icono: "📑",
    color: "#7c3aed", // Morado
    categoria: "cinta",
    descripcion: "Franja principal de herramientas organizada en pestañas: Archivo, Inicio, Insertar, Diseño, Referencias, Correspondencia, Revisar, Vista y Ayuda.",
    funcion: "Facilitar el acceso a todas las herramientas de edición y formato.",
    detalles: "La fila de pestañas superior que da acceso a los comandos del procesador.",
    pista: "La fila de pestañas que inicia en 'Archivo' e 'Inicio' hasta 'Vista/Ayuda'.",
    badgePos: { top: "10.5%", left: "44%" },
    areaPos: { top: "7.5%", left: "0%", width: "74%", height: "5.5%" }
  },
  {
    id: "grupos_de_comandos",
    num: 4,
    nombre: "Grupos de comandos",
    icono: "📦",
    color: "#ea580c", // Naranja
    categoria: "cinta",
    descripcion: "Dentro de cada pestaña se encuentran conjuntos de herramientas. Por ejemplo, en la pestaña Inicio: Portapapeles, Fuente, Párrafo, Estilos y Edición.",
    funcion: "Organizar los comandos según su utilidad específica.",
    detalles: "Reúne botones relacionados como Negrita, Cursiva, Alineación, Viñetas y Estilos predefinidos.",
    pista: "Toda la barra ancha de herramientas con botones divididos por categorías.",
    badgePos: { top: "18%", left: "76%" },
    areaPos: { top: "13%", left: "0%", width: "100%", height: "13.5%" }
  },
  {
    id: "area_de_trabajo",
    num: 5,
    nombre: "Área de trabajo o página del documento",
    icono: "📄",
    color: "#d97706", // Amarillo / Dorado
    categoria: "documento",
    descripcion: "Espacio central donde se escribe y edita el contenido. Permite insertar texto, imágenes, tablas, gráficos, formas y todo tipo de elementos.",
    funcion: "Crear y modificar documentos.",
    detalles: "Representa el lienzo o la hoja de papel física en blanco para redactar.",
    pista: "La gran superficie blanca central enmarcada que simula la hoja de papel.",
    badgePos: { top: "68%", left: "48%" },
    areaPos: { top: "33%", left: "14%", width: "71%", height: "56%" }
  },
  {
    id: "regla_horizontal_vertical",
    num: 6,
    nombre: "Regla horizontal y vertical",
    icono: "📏",
    color: "#db2777", // Fucsia / Rosa
    categoria: "documento",
    descripcion: "Aparecen en la parte superior y en el lado izquierdo de la hoja de trabajo. Sirven para calibrar y ajustar márgenes, sangrías y alinear texto y objetos.",
    funcion: "Ajustar márgenes, sangrías y alinear texto y objetos con precisión.",
    detalles: "Muestra escalas numéricas graduadas (1, 2, 3, 4...) en centímetros o pulgadas.",
    pista: "Las franjas con números y marcas sobre y a la izquierda de la hoja de papel.",
    badgePos: { top: "28.5%", left: "8%" },
    areaPos: { top: "26.5%", left: "0%", width: "95%", height: "4%" }
  },
  {
    id: "barras_desplazamiento",
    num: 7,
    nombre: "Barras de desplazamiento",
    icono: "↕️",
    color: "#0d9488", // Turquesa
    categoria: "documento",
    descripcion: "Vertical y horizontal (la horizontal aparece cuando el zoom o ancho del documento lo hace necesario).",
    funcion: "Desplazarse por el documento para visualizar diferentes secciones.",
    detalles: "Permite navegar fluidamente hacia arriba, abajo y a los lados de la página.",
    pista: "La barra delgada ubicada en el extremo lateral derecho con deslizador y flechas.",
    badgePos: { top: "52%", left: "91%" },
    areaPos: { top: "27%", left: "95.5%", width: "4.5%", height: "65%" }
  },
  {
    id: "barra_de_estado",
    num: 8,
    nombre: "Barra de estado",
    icono: "ℹ️",
    color: "#2563eb", // Azul brillante
    categoria: "inferior",
    descripcion: "Se localiza en la parte inferior. Muestra información como: Número de página, Cantidad de palabras, Idioma del documento y Estado de revisión.",
    funcion: "Proporcionar información en tiempo real sobre el documento activo.",
    detalles: "Informa 'Página 1 de 1', '0 palabras', 'Español (México)' y el icono de verificación.",
    pista: "La franja inferior izquierda con los contadores de páginas y palabras.",
    badgePos: { top: "94.5%", left: "18%" },
    areaPos: { top: "93.5%", left: "0%", width: "48%", height: "6.5%" }
  },
  {
    id: "botones_de_vista",
    num: 9,
    nombre: "Botones de vista",
    icono: "👁️",
    color: "#0284c7", // Azul cielo
    categoria: "inferior",
    descripcion: "Ubicados en la parte inferior derecha. Permiten alternar entre tres modalidades de visualización: Modo lectura, Diseño de impresión y Diseño web.",
    funcion: "Visualizar el documento de distintas maneras según la necesidad.",
    detalles: "Iconos de libro (Lectura), hoja de impresión (predeterminado) y globo terráqueo (Web).",
    pista: "Los tres pequeños botones de vista (📖 📄 🌐) situados antes del deslizador de zoom.",
    badgePos: { top: "94.5%", left: "81%" },
    areaPos: { top: "93.5%", left: "77.5%", width: "8.5%", height: "6.5%" }
  },
  {
    id: "control_de_zoom",
    num: 10,
    nombre: "Control de zoom",
    icono: "🔎",
    color: "#e11d48", // Rojo anaranjado
    categoria: "inferior",
    descripcion: "Se encuentra en el extremo inferior derecho. Contiene botones de disminución (-), aumento (+), barra deslizante y el porcentaje actual (ej. 100%).",
    funcion: "Acercar o alejar la vista del documento en pantalla.",
    detalles: "Permite ajustar la escala visual del papel de forma rápida y personalizada.",
    pista: "Extremo inferior derecho con los botones '-', '+' y el indicador '100%'.",
    badgePos: { top: "94.5%", left: "93%" },
    areaPos: { top: "93.5%", left: "86.5%", width: "13.5%", height: "6.5%" }
  },
  {
    id: "botones_control_ventana",
    num: 11,
    nombre: "Botones de control de ventana",
    icono: "🗖",
    color: "#dc2626", // Rojo
    categoria: "superior",
    descripcion: "Ubicados en la esquina superior derecha. Incluyen: Minimizar (envía a barra de tareas), Maximizar/Restaurar (ajusta a pantalla completa) y Cerrar (cierra Word).",
    funcion: "Controlar el tamaño y la visualización de la ventana de la aplicación.",
    detalles: "Los botones de guion (—), recuadro (🗖) y la X de cierre (✕).",
    pista: "Esquina superior derecha enmarcada en rojo con los botones de minimizar y cerrar.",
    badgePos: { top: "3.5%", left: "85%" },
    areaPos: { top: "0%", left: "75%", width: "25%", height: "7.5%" }
  },
  {
    id: "punto_de_insercion",
    num: 12,
    nombre: "Punto de inserción (Cursor)",
    icono: "🖊️",
    color: "#4f46e5", // Índigo / Púrpura azulado
    categoria: "documento",
    descripcion: "Línea vertical parpadeante ubicada en el área de trabajo que indica la posición exacta donde aparecerá el siguiente texto o carácter al escribir en el teclado.",
    funcion: "Señalar la posición activa de escritura, edición e inserción en la página.",
    detalles: "Parpadea continuamente en la esquina superior izquierda del área de escritura.",
    pista: "La línea vertical parpadeante dentro de la hoja de trabajo en blanco.",
    badgePos: { top: "35%", left: "28%" }, // Ubicada cerca del cursor parpadeante
    areaPos: { top: "32%", left: "16%", width: "13%", height: "8.5%" }
  },
  {
    id: "pestana_inicio",
    num: 13,
    nombre: "Pestaña Inicio",
    icono: "🏠",
    color: "#0891b2", // Cian / Azul Turquesa
    categoria: "cinta",
    descripcion: "Pestaña principal y predeterminada de la Cinta de Opciones. Reúne los comandos esenciales más utilizados para dar formato al texto, párrafo, estilos y edición rápida.",
    funcion: "Contener y dar acceso directo a los grupos Portapapeles, Fuente, Párrafo, Estilos y Edición.",
    detalles: "Se encuentra seleccionada y activa por defecto al abrir un documento de Microsoft Word.",
    pista: "La pestaña destacada con el nombre 'Inicio' junto a 'Archivo' e 'Insertar'.",
    badgePos: { top: "10.5%", left: "12%" },
    areaPos: { top: "7.5%", left: "6.5%", width: "7.5%", height: "5.5%" }
  }
];

/**
 * Función utilitaria para mezclar aleatoriamente elementos (Algoritmo Fisher-Yates)
 */
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
