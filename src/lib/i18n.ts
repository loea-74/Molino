export type Lang = "es" | "en";

export const L = {
  es: {
    // Nav
    nav: ["Productos", "Historia", "Recetas", "Visítanos"],
    navCta: "Pedir por WhatsApp",
    langToggle: "EN",

    // Catálogo por categorías
    catalogoEyebrow: "02 · Catálogo",
    catalogoTitle: "Todo lo que sale del molino",
    catalogoBody: "Más de mil productos entre harinas, especias, chiles, frutos secos, salsas y abarrotes. Abajo va una muestra de cada categoría.",
    catalogoServicios: "Lo que hacemos aquí mismo",
    catalogoServiciosBody: "Traes el grano y te lo molemos al punto que pidas.",
    catalogoMas: "y {n} más",
    catalogoUno: "y 1 más",
    catalogoPrecios: "Pregúntanos precios y existencias por WhatsApp.",
    catalogoProductos: "productos",

    // Products
    productsEyebrow: "02 · Catálogo",
    productsTitle: "Lo que sale del molino",
    productsBody: "Producto fresco, molido el mismo día. Pedidos por WhatsApp para llevar o recoger en tienda.",
    productsOrder: "Pedir",
    productsMore: "Ver catálogo completo",

    // History
    historyEyebrow: "03 · Historia",

    // Recipes
    recipesEyebrow: "04 · Recetas y noticias",
    recipesTitle: "Cómo se usa bien nuestro maíz",
    recipesKicker: "Desliza · últimas entradas",
    recipesAll: "Ver todas las entradas",
    recipesPrev: "Anterior",
    recipesNext: "Siguiente",

    // Testimonials
    testimonialsEyebrow: "05 · Clientes",

    // Visit
    visitEyebrow: "06 · Visítanos",
    visitDirections: "Cómo llegar",
    visitAddressL: "Dirección",
    visitHoursL: "Horario",

    // Footer
    footerTag: "Molino artesanal — CDMX",
    footerSite: "Sitio",
    footerFollow: "Síguenos",
    footerRights: "© 2026 Molino la Gran Jalisciense · Todos los derechos reservados",
    footerLocation: "CDMX · MÉX",
  },
  en: {
    // Nav
    nav: ["Products", "History", "Recipes", "Visit us"],
    navCta: "Order on WhatsApp",
    langToggle: "ES",

    // Catálogo por categorías
    catalogoEyebrow: "02 · Catalogue",
    catalogoTitle: "Everything the mill carries",
    catalogoBody: "Over a thousand products: flours, spices, chillies, nuts, sauces and groceries. Below is a sample from each category.",
    catalogoServicios: "What we mill here",
    catalogoServiciosBody: "Bring your grain and we grind it just how you want it.",
    catalogoMas: "and {n} more",
    catalogoUno: "and 1 more",
    catalogoPrecios: "Ask us for prices and stock on WhatsApp.",
    catalogoProductos: "products",

    // Products
    productsEyebrow: "02 · Catalogue",
    productsTitle: "What comes out of the mill",
    productsBody: "Fresh product, milled the same day. WhatsApp orders for pickup or delivery.",
    productsOrder: "Order",
    productsMore: "See full catalogue",

    // History
    historyEyebrow: "03 · History",

    // Recipes
    recipesEyebrow: "04 · Recipes & news",
    recipesTitle: "Getting the most out of our corn",
    recipesKicker: "Swipe · latest entries",
    recipesAll: "See all entries",
    recipesPrev: "Previous",
    recipesNext: "Next",

    // Testimonials
    testimonialsEyebrow: "05 · Customers",

    // Visit
    visitEyebrow: "06 · Visit",
    visitDirections: "Get directions",
    visitAddressL: "Address",
    visitHoursL: "Hours",

    // Footer
    footerTag: "Artisan mill — Mexico City",
    footerSite: "Site",
    footerFollow: "Follow us",
    footerRights: "© 2026 Molino la Gran Jalisciense · All rights reserved",
    footerLocation: "CDMX · MEX",
  },
} as const;

export type Strings = typeof L.es;
