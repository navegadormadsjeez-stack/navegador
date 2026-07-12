export const APP_VERSION = '0.1.0';

export const NAV_LINKS = [
  { href: '#funciones', label: 'Funciones' },
  { href: '#comparacion', label: 'Comparación' },
  { href: '#seguridad', label: 'Seguridad' },
  { href: '#faq', label: 'Preguntas frecuentes' },
] as const;

export const TRUST_ITEMS = [
  { key: 'marketplaces', label: 'MercadoLibre y marketplaces' },
  { key: 'https', label: 'Navegación HTTPS estándar' },
  { key: 'chromium', label: 'Motor Chromium (CefSharp)' },
  { key: 'updates', label: 'Verificación de actualizaciones' },
] as const;

export const BENTO_FEATURES = [
  {
    id: 'workspaces',
    title: 'Espacios de trabajo',
    description: 'Perfiles separados por marca con URLs de inicio y color propios.',
    span: 'lg:col-span-2',
  },
  {
    id: 'favorites',
    title: 'Favoritos en la nube',
    description: 'Guardá publicaciones clave y accedé desde la barra lateral.',
    span: 'lg:col-span-1',
  },
  {
    id: 'ai',
    title: 'IA integrada',
    description: 'Generá respuestas y contenido sin salir del navegador.',
    span: 'lg:col-span-1',
  },
  {
    id: 'products',
    title: 'Catálogo conectado',
    description: 'Gestioná productos vinculados a tu cuenta y workspace.',
    span: 'lg:col-span-1',
  },
  {
    id: 'seller',
    title: 'Hecho para vendedores',
    description: 'Flujos pensados para operar publicaciones y consultas diarias.',
    span: 'lg:col-span-1',
  },
  {
    id: 'profiles',
    title: 'Personalización',
    description: 'Identidad visual por perfil: Maqjeez, Materia Natural y más.',
    span: 'lg:col-span-2',
  },
] as const;

export const DEMO_TABS = [
  { id: 'browse', label: 'Navegación' },
  { id: 'workspaces', label: 'Perfiles' },
  { id: 'ai', label: 'IA' },
  { id: 'products', label: 'Productos' },
] as const;

export type DemoTabId = (typeof DEMO_TABS)[number]['id'];

/** Solo características verificables en el producto actual. */
export const COMPARISON_ROWS = [
  {
    feature: 'Perfiles por marca / workspace',
    madsjeez: true,
    chrome: false,
    brave: false,
  },
  {
    feature: 'Favoritos sincronizados en la nube',
    madsjeez: true,
    chrome: true,
    brave: true,
  },
  {
    feature: 'IA integrada para vendedores',
    madsjeez: true,
    chrome: false,
    brave: false,
  },
  {
    feature: 'Gestión de productos en el navegador',
    madsjeez: true,
    chrome: false,
    brave: false,
  },
  {
    feature: 'Motor Chromium',
    madsjeez: true,
    chrome: true,
    brave: true,
  },
  {
    feature: 'Bloqueo de anuncios integrado',
    madsjeez: false,
    chrome: false,
    brave: true,
  },
  {
    feature: 'Tienda de extensiones Chrome',
    madsjeez: false,
    chrome: true,
    brave: true,
  },
  {
    feature: 'Windows desktop (v0.1.0)',
    madsjeez: true,
    chrome: true,
    brave: true,
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: '¿Para quién está pensado Madsjeez Seller Browser?',
    a: 'Para vendedores y equipos que operan en MercadoLibre y otros marketplaces latinoamericanos. Centraliza navegación, favoritos, IA y catálogo en un solo lugar.',
  },
  {
    q: '¿Qué necesito para instalarlo?',
    a: 'Windows 10 u 11 de 64 bits. El instalador incluye todo lo necesario (no hace falta instalar .NET por separado). Asistente gráfico estándar: confirmás y el navegador se abre al terminar.',
  },
  {
    q: 'Windows muestra "protegió su PC" al instalar. ¿Es seguro?',
    a: 'Es SmartScreen: avisa cuando el instalador aún no tiene reputación en Microsoft. Nuestros builds firmados con SignPath Foundation (certificado gratuito para open source) reducen ese aviso. Si aparece, clic en Más información → Ejecutar de todas formas.',
  },
  {
    q: '¿Es compatible con extensiones de Chrome?',
    a: 'No en la versión actual. Usa CefSharp (Chromium embebido) sin soporte para la tienda de extensiones de Chrome.',
  },
  {
    q: '¿Mis datos se sincronizan entre dispositivos?',
    a: 'Favoritos, workspaces y configuración se guardan en la nube al iniciar sesión. Hoy la app desktop está disponible solo para Windows.',
  },
  {
    q: '¿La IA funciona sin configuración?',
    a: 'Requiere que el administrador configure AI_API_KEY en el servidor. Sin esa clave, el desktop puede usar respuestas demo locales limitadas.',
  },
  {
    q: '¿Cómo actualizo a una nueva versión?',
    a: 'El navegador consulta la API de actualizaciones al iniciar. Cuando hay una versión nueva, podés descargarla desde el enlace provisto por la app.',
  },
] as const;

export const TESTIMONIAL_PLACEHOLDERS = [
  {
    quote: '[Placeholder] Reemplazar con testimonio real de un vendedor.',
    name: '[Nombre]',
    role: '[Rol / Empresa]',
  },
  {
    quote: '[Placeholder] Reemplazar con caso de uso verificable.',
    name: '[Nombre]',
    role: '[Rol / Empresa]',
  },
  {
    quote: '[Placeholder] Reemplazar con feedback de cliente beta.',
    name: '[Nombre]',
    role: '[Rol / Empresa]',
  },
] as const;
