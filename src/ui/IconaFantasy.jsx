// Icone tematiche per Tavolo dei Dadi: Formula Ibrida Perfetta
// - Game-Icons.net (SVG vettoriali puri) per Armi, Attacchi, Incantesimi, Difese e Oggetti.
// - Glifi Runici (Neon Arcani con bagliore esoterico) per Poteri del Patrono, Debito e Araldi del Segreto.

import React from 'react';
import { C } from './tema.js';

// --- GAME-ICONS.NET SVG DEFINITIONS (viewBox 0 0 24 24) ---
const SVG_GAME_ICONS = {
  // Spade e Lame pesanti (Spada lunga, Spadone, Spada a due mani)
  spadone: (
    <path d="M6.92 5L5 6.92L8.08 10L3 15.08V19H6.92L12 13.92L15.08 17L17 15.08L6.92 5M19 3L15.08 6.92L16.5 8.34L18.42 6.42L20.58 8.58L18.66 10.5L20.08 11.92L24 8L19 3M14.5 11.08L12.92 9.5L10.5 11.92L12.08 13.5L14.5 11.08Z" />
  ),
  // Spade fini e armi accurate (Stocco, Scimitarra, Spada corta)
  stocco: (
    <path d="M21.5 2.5L19 5L20 6L18 8L16.5 6.5L6.5 16.5L8 18L6 20L7 21L4.5 23.5L0.5 19.5L3 17L4 18L6 16L4.5 14.5L14.5 4.5L16 6L18 4L19 5L21.5 2.5Z" />
  ),
  // Pugnali e Lame corte (Daga, Pugnale)
  pugnale: (
    <path d="M4 2L2 4L8 10L6 12L8 14L10 12L12 14L14 12L12 10L14 8L12 6L10 8L4 2Z" />
  ),
  // Asce da guerra e bipenni (Ascia, Bipenne, Accetta)
  ascia: (
    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2M12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4M11 6V11H6V13H11V18H13V13H18V11H13V6H11Z" />
  ),
  // Martelli e Mazze (Maglio, Mazza, Martello da guerra)
  martello: (
    <>
      <polygon points="7,3 17,3 19,8 5,8" />
      <rect x="10.5" y="8" width="3" height="13" rx="1" />
    </>
  ),
  // Lance e Armi ad asta (Lancia, Picca, Alabarda, Falcione, Tridente)
  lancia: (
    <path d="M21 3L18 4L16 2L15 3L17 5L12 10L11 9L8 12L9 13L2 20L4 22L11 15L12 16L15 13L14 12L19 7L21 9L22 8L20 6L21 3Z" />
  ),
  // Archi (Arco lungo, Arco corto)
  arco: (
    <path d="M2 2V6C4.21 6 6 7.79 6 10C6 12.21 4.21 14 2 14V18C10.84 18 18 10.84 18 2H14C14 4.21 12.21 6 10 6C7.79 6 6 4.21 6 2H2M18 18L22 22M22 18L18 22" />
  ),
  // Balestre (Balestra pesante, Balestra leggera, Balestra a mano)
  balestra: (
    <path d="M12 2L1 21H23L12 2M12 6L19.5 19H4.5L12 6M11 10V14H13V10H11M11 16V18H13V16H11Z" />
  ),
  // Bastoni e Randelli (Randello, Bastone ferrato)
  bastone: (
    <path d="M19.07 4.93C17.12 2.98 13.96 2.98 12.01 4.93L3.53 13.41C2.55 14.39 2 15.7 2 17.09C2 18.48 2.55 19.79 3.53 20.77C4.51 21.75 5.82 22.3 7.21 22.3C8.6 22.3 9.91 21.75 10.89 20.77L19.37 12.29C21.32 10.34 21.32 7.18 19.37 5.23L19.07 4.93ZM5.65 19.35C5.26 18.96 5 18.44 5 17.89C5 17.34 5.26 16.82 5.65 16.43L13.42 8.66L15.54 10.78L7.77 18.55C7.38 18.94 6.86 19.2 6.31 19.2C6.07 19.2 5.85 19.14 5.65 19.05V19.35Z" />
  ),
  // Attacco generico / Spade incrociate (Mischia standard)
  spadeIncrociate: (
    <path d="M20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L13.84 6.41L11.72 4.29C11.33 3.9 10.68 3.9 10.29 4.29L8.17 6.41L4.63 2.87L2.5 5L6.04 8.54L3.92 10.66C3.53 11.05 3.53 11.7 3.92 12.09L6.04 14.21L2.92 17.33C2.53 17.72 2.53 18.37 2.92 18.76L5.26 21.1C5.65 21.49 6.3 21.49 6.69 21.1L9.81 17.98L11.93 20.1C12.32 20.49 12.97 20.49 13.36 20.1L15.48 17.98L19.02 21.52L21.14 19.4L17.6 15.86L19.72 13.74C20.11 13.35 20.11 12.7 19.72 12.31L17.6 10.19L20.72 7.07C21.1 6.67 21.1 6.02 20.71 5.63Z" />
  ),
  // Fuoco (Palla di fuoco, Dardo di fuoco, Mani brucianti)
  fuoco: (
    <path d="M12 2C11.5 5 9 7 9 10C9 12 11 13 11 15C11 17 9.5 18 8 18C11 22 17 21 17 15C17 11 14 8 14 5C14 3.5 13 2.5 12 2Z" />
  ),
  // Dardo Incantato / Magia infallibile / Dardi
  dardoMagico: (
    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
  ),
  // Gelo / Freddo (Raggio di gelo, Cono di freddo)
  gelo: (
    <path d="M12 2V22M2 12H22M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  ),
  // Fulmine / Tuono (Saetta, Fulmine, Onda tonante)
  fulmine: (
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  ),
  // Guarigione / Sacro (Cura ferite, Parola guaritrice)
  cura: (
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
  ),
  // Radioso / Luce (Luce sacra, Fiamma sacra)
  radioso: (
    <>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1V4M12 20V23M1 12H4M20 12H23M4.22 4.22L6.34 6.34M17.66 17.66L19.78 19.78M4.22 19.78L6.34 17.66M17.66 6.34L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  // Necrotico / Morte / Tocco gelido
  necrotico: (
    <path d="M12 2C7.58 2 4 5.58 4 10C4 13.15 5.82 15.88 8.5 17.2V20H15.5V17.2C18.18 15.88 20 13.15 20 10C20 5.58 16.42 2 12 2ZM9 9C9.83 9 10.5 9.67 10.5 10.5C10.5 11.33 9.83 12 9 12C8.17 12 7.5 11.33 7.5 10.5C7.5 9.67 8.17 9 9 9ZM15 12C14.17 12 13.5 11.33 13.5 10.5C13.5 9.67 14.17 9 15 9C15.83 9 16.5 9.67 16.5 10.5C16.5 11.33 15.83 12 15 12Z" />
  ),
  // Veleno / Acido / Spruzzo velenoso
  veleno: (
    <path d="M12 2.69L6 13.5C6 16.81 8.69 19.5 12 19.5C15.31 19.5 18 16.81 18 13.5L12 2.69Z" />
  ),
  // Incantesimo Arcano generico / Stella arcana / Trucchetto
  arcano: (
    <path d="M12 2L14.4 7.6L20.5 8.2L15.8 12.3L17.2 18.2L12 15.1L6.8 18.2L8.2 12.3L3.5 8.2L9.6 7.6L12 2Z" />
  ),
  // Libro / Grimorio / Rituale
  libro: (
    <path d="M4 3H18C19.1 3 20 3.9 20 5V19C20 20.1 19.1 21 18 21H4C2.9 21 2 20.1 2 19V5C2 3.9 2.9 3 4 3ZM6 7H16V9H6V7ZM6 11H14V13H6V11ZM6 15H12V17H6V15Z" />
  ),
  // Difesa / Scudo / Parata / Reazione
  scudo: (
    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" />
  ),
  // Oggetto / Pozione
  pozione: (
    <path d="M13 2H11V5H6V8L8 10V20C8 21.1 8.9 22 10 22H14C15.1 22 16 21.1 16 20V10L18 8V5H13V2M10 7H14V8L12.5 9.5L14 11V20H10V11L11.5 9.5L10 8V7Z" />
  ),
  // Pergamena / Papiro
  pergamena: (
    <path d="M19 3H7C4.79 3 3 4.79 3 7C3 8.35 3.67 9.54 4.71 10.28C4.26 11.11 4 12.03 4 13C4 16.31 6.69 19 10 19H17C19.21 19 21 17.21 21 15V5C21 3.89 20.11 3 19 3ZM6 7C6 6.45 6.45 6 7 6H18V8H7C6.45 8 6 7.55 6 7ZM10 17C7.79 17 6 15.21 6 13C6 11.9 6.45 10.9 7.18 10.18C7.44 10.24 7.72 10.28 8 10.28H18V15C18 16.1 17.1 17 16 17H10Z" />
  ),
  // Dado d20 / Tiro dei dadi
  dado: (
    <>
      <polygon points="12,2 21,7.5 21,16.5 12,22 3,16.5 3,7.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <polyline points="3,7.5 12,12 21,7.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <line x1="12" y1="12" x2="12" y2="22" stroke="currentColor" strokeWidth="1.8" />
      <polyline points="12,2 7,10 12,12 17,10 12,2" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </>
  ),
  // Teschio / Bersaglio sconfitto
  teschio: (
    <path d="M12 2C7.58 2 4 5.58 4 10C4 13.15 5.82 15.88 8.5 17.2V20H15.5V17.2C18.18 15.88 20 13.15 20 10C20 5.58 16.42 2 12 2ZM9 9C9.83 9 10.5 9.67 10.5 10.5C10.5 11.33 9.83 12 9 12C8.17 12 7.5 11.33 7.5 10.5C7.5 9.67 8.17 9 9 9ZM15 12C14.17 12 13.5 11.33 13.5 10.5C13.5 9.67 14.17 9 15 9C15.83 9 16.5 9.67 16.5 10.5C16.5 11.33 15.83 12 15 12Z" />
  ),
  // Cuore / Punti Ferita / Vita
  cuore: (
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
  ),
  // Zaino / Inventario
  zaino: (
    <path d="M18 6H16V4C16 2.9 15.1 2 14 2H10C8.9 2 8 2.9 8 4V6H6C4.9 6 4 6.9 4 8V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8C20 6.9 19.1 6 18 6ZM10 4H14V6H10V4ZM18 20H6V14H18V20ZM18 12H6V8H8V10H16V8H18V12Z" />
  ),
  // Lente / Cerca / Compendio
  lente: (
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
  ),
  // Nuvola / Cloud Sync
  nuvola: (
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM19 18H6C3.79 18 2 16.21 2 14C2 11.95 3.53 10.24 5.56 10.03L6.63 9.92L7.13 8.97C8.08 7.14 9.94 6 12 6C14.62 6 16.88 7.86 17.39 10.43L17.69 11.93L19.22 12.04C20.78 12.14 22 13.45 22 15C22 16.65 20.65 18 19 18Z" />
  ),
  // Mappa del mondo / Viaggio
  mappa: (
    <path d="M20.5 3L14 5.5L9.5 3.5L3.5 6V21L10 18.5L14.5 20.5L20.5 18V3ZM15 18.5L10 16.5V5.5L15 7.5V18.5Z" />
  ),
  // Campana / Notifiche
  campana: (
    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" />
  ),
  // Cestino / Elimina
  cestino: (
    <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" />
  ),
  // Level Up / Avanzamento di livello
  levelUp: (
    <path d="M12 3L4 9H9V17H15V9H20L12 3ZM4 19H20V21H4V19Z" />
  ),
  // Sole / Tema Chiaro
  sole: (
    <path d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM12 2C12.55 2 13 2.45 13 3V5C13 5.55 12.55 6 12 6C11.45 6 11 5.55 11 5V3C11 2.45 11.45 2 12 2ZM12 18C12.55 18 13 18.45 13 19V21C13 21.55 12.55 22 12 22C11.45 22 11 21.55 11 21V19C11 18.45 11.45 18 12 18ZM22 12C22 12.55 21.55 13 21 13H19C18.45 13 18 12.55 18 12C18 11.45 18.45 11 19 11H21C21.55 11 22 11.45 22 12ZM6 12C6 12.55 5.55 13 5 13H3C2.45 13 2 12.55 2 12C2 11.45 2.45 11 3 11H5C5.55 11 6 11.45 6 12Z" />
  ),
  // Luna / Tema Scuro
  luna: (
    <path d="M12.3 2C12.2 2 12.1 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 11.9 22 11.8 22 11.7C21.2 12.2 20.1 12.5 19 12.5C14.9 12.5 11.5 9.1 11.5 5C11.5 3.9 11.8 2.8 12.3 2Z" />
  ),
  // Eclissi / Tema Auto
  eclissi: (
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20V4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
  ),
  // Bestia / Zampa / Forma Selvatica
  bestia: (
    <path d="M4.5 9.5C5.3 9.5 6 8.8 6 8C6 7.2 5.3 6.5 4.5 6.5C3.7 6.5 3 7.2 3 8C3 8.8 3.7 9.5 4.5 9.5ZM8.5 6.5C9.3 6.5 10 5.8 10 5C10 4.2 9.3 3.5 8.5 3.5C7.7 3.5 7 4.2 7 5C7 5.8 7.7 6.5 8.5 6.5ZM15.5 6.5C16.3 6.5 17 5.8 17 5C17 4.2 16.3 3.5 15.5 3.5C14.7 3.5 14 4.2 14 5C14 5.8 14.7 6.5 15.5 6.5ZM19.5 9.5C20.3 9.5 21 8.8 21 8C21 7.2 20.3 6.5 19.5 6.5C18.7 6.5 18 7.2 18 8C18 8.8 18.7 9.5 19.5 9.5ZM17.3 12.3C16.5 11.5 15.4 11 12 11C8.6 11 7.5 11.5 6.7 12.3C5.6 13.4 5.2 15 6 16.5C7 18.5 9.5 20.5 12 20.5C14.5 20.5 17 18.5 18 16.5C18.8 15 18.4 13.4 17.3 12.3Z" />
  ),
  // Mago / Incantatore
  mago: (
    <path d="M12 2L9 8H15L12 2ZM3 19C4.5 17 8 16 12 16C16 16 19.5 17 21 19V21H3V19ZM12 9C10.5 9 8.5 9.5 8.5 11V14H15.5V11C15.5 9.5 13.5 9 12 9Z" />
  ),
  // Attrezzi
  attrezzi: (
    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.5 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
  ),
  // Stella
  stella: (
    <path d="M12 2L14.4 7.6L20.5 8.2L15.8 12.3L17.2 18.2L12 15.1L6.8 18.2L8.2 12.3L3.5 8.2L9.6 7.6L12 2Z" />
  ),
};

// --- RUNIC GLYPHS SVG (Glifi Esoterici per Patrono, Debito e Araldi del Segreto) ---
const SVG_RUNIC_GLYPHS = {
  // Runa del Disfacimento / Debito del Patrono: Esagono sacro con assi incisi
  debito: (
    <>
      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  // Sigillo dell'Occhio Onnisciente (Araldi del Segreto / Maschera / Visione)
  occhio: (
    <>
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  // Sigillo di Sangue / Patto Oscuro (Nodo runico con anello di contenimento)
  patto: (
    <>
      <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="1.8" />
      <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <polygon points="12,6 18,16 6,16" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </>
  ),
  // Salvezza Arcana / "Non Questa Volta" / Scudo Eldritch
  salvezza: (
    <>
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <polygon points="12,4 19,17 5,17" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12.5" r="2" fill="currentColor" />
    </>
  ),
};

/**
 * Seleziona la chiave dell'icona corretta per un attacco, incantesimo o azione.
 */
export function getChiaveIcona(nome = '', tipo = '', isSpell = false, cat = '') {
  const n = String(nome || '').toLowerCase();

  // 1. Spells (incantesimi o trucchetti)
  if (isSpell) {
    if (/fuoco|fiamma|infuoc|combust|braci/i.test(n)) return 'fuoco';
    if (/dardo.*incant|magic.*missile/i.test(n)) return 'dardoMagico';
    if (/gelo|freddo|ghiaccio|neve|brina|frost|cold/i.test(n)) return 'gelo';
    if (/fulmine|elettr|saetta|shock|tuono|lightning/i.test(n)) return 'fulmine';
    if (/cura|ferite|guarig|healp|riposo/i.test(n)) return 'cura';
    if (/radios|luce|guida|sacr|radiant|sun|sole/i.test(n)) return 'radioso';
    if (/necrot|morte|tomba|gelido|death|decompos/i.test(n)) return 'necrotico';
    if (/veleno|acido|poison|acid/i.test(n)) return 'veleno';
    if (/rituale|libro|studio|grimorio/i.test(n)) return 'libro';
    return 'arcano';
  }

  // 2. Reazioni e difese
  if (cat === 'Reazione' || /scudo|parata|schivata|difesa|reazione|intercetta/i.test(n)) {
    return 'scudo';
  }

  // 3. Armi e attacchi
  if (/spadone|spada a due mani|greatsword|claymore/i.test(n)) return 'spadone';
  if (/stocco|scimitarra|rapier|spada corta|shortsword/i.test(n)) return 'stocco';
  if (/pugnale|daga|coltello|dagger/i.test(n)) return 'pugnale';
  if (/ascia|bipenne|accetta|greataxe|battleaxe|handaxe/i.test(n)) return 'ascia';
  if (/martello|maglio|mazza|warhammer|maul|mace/i.test(n)) return 'martello';
  if (/lancia|picca|alabarda|falcione|tridente|spear|halberd|pike/i.test(n)) return 'lancia';
  if (/balestra|crossbow/i.test(n)) return 'balestra';
  if (/arco|bow|freccia/i.test(n)) return 'arco';
  if (/bastone|randello|quarterstaff|club/i.test(n)) return 'bastone';
  if (/pozione|ampolla|potion/i.test(n)) return 'pozione';

  // 4. Default per tipo
  if (tipo === 'tattica' || tipo === 'manovra') return 'stocco';
  if (tipo === 'stile' || tipo === 'armatura') return 'scudo';

  return 'spadeIncrociate';
}

/**
 * IconaAzione: Renderizza l'icona Game-Icons.net in formato SVG puro ad alta risoluzione,
 * racchiusa in un elegante micro-badge con finitura dorata/scura.
 */
export function IconaAzione({
  nome = '',
  tipo = '',
  isSpell = false,
  tipoFonte = '',
  cat = '',
  dimensione = 22,
  stileBadge = true,
  glow = false,
  style = {},
  className = '',
}) {
  // Se è un privilegio o potere Araldi / Debito del Patrono, usa il Glifo Runico
  if (tipoFonte === 'araldi' || /debito|patrono|araldi|maschera/i.test(nome)) {
    return (
      <IconaRunica
        nome={nome}
        isAraldi={tipoFonte === 'araldi' || /araldi/i.test(nome)}
        dimensione={dimensione}
        stileBadge={stileBadge}
        glow={true}
        style={style}
        className={className}
      />
    );
  }

  const chiave = getChiaveIcona(nome, tipo, isSpell, cat);
  const svgContent = SVG_GAME_ICONS[chiave] || SVG_GAME_ICONS.spadeIncrociate;

  // Stile colore e accento
  const isCura = chiave === 'cura';
  const isFuoco = chiave === 'fuoco';
  const isFulmine = chiave === 'fulmine';
  const isGelo = chiave === 'gelo';

  const coloreIcona = isCura
    ? '#38ef7d'
    : isFuoco
    ? '#ff9f43'
    : isFulmine
    ? '#ffd32a'
    : isGelo
    ? '#00d2d3'
    : 'var(--c-gold, #d4a017)';

  const bgBadge = isCura
    ? 'rgba(56, 239, 125, 0.12)'
    : isFuoco
    ? 'rgba(255, 159, 67, 0.12)'
    : isFulmine
    ? 'rgba(255, 211, 42, 0.12)'
    : isGelo
    ? 'rgba(0, 210, 211, 0.12)'
    : 'rgba(212, 160, 23, 0.12)';

  const borderBadge = isCura
    ? 'rgba(56, 239, 125, 0.35)'
    : isFuoco
    ? 'rgba(255, 159, 67, 0.35)'
    : isFulmine
    ? 'rgba(255, 211, 42, 0.35)'
    : isGelo
    ? 'rgba(0, 210, 211, 0.35)'
    : 'rgba(212, 160, 23, 0.35)';

  const innerSvg = (
    <svg
      viewBox="0 0 24 24"
      width={Math.round(dimensione * 0.72)}
      height={Math.round(dimensione * 0.72)}
      fill="currentColor"
      style={{
        display: 'block',
        color: coloreIcona,
        transition: 'transform 0.15s ease',
      }}
      aria-hidden="true"
    >
      {svgContent}
    </svg>
  );

  if (!stileBadge) {
    return (
      <span
        className={`icona-fantasy-plain ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: dimensione,
          height: dimensione,
          color: coloreIcona,
          ...style,
        }}
      >
        {innerSvg}
      </span>
    );
  }

  return (
    <span
      className={`icona-fantasy-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimensione,
        height: dimensione,
        borderRadius: 6,
        background: bgBadge,
        border: `1px solid ${borderBadge}`,
        boxShadow: glow ? `0 0 8px ${borderBadge}` : '0 1px 3px rgba(0,0,0,0.25)',
        flexShrink: 0,
        verticalAlign: 'middle',
        ...style,
      }}
    >
      {innerSvg}
    </span>
  );
}

/**
 * IconaRunica: Glifi geometrici esoterici con bagliore arcano ciano/smeraldo/viola
 * ideati specificamente per i Poteri del Patrono, Debito e Araldi del Segreto.
 */
export function IconaRunica({
  nome = '',
  isAraldi = false,
  dimensione = 22,
  stileBadge = true,
  glow = true,
  style = {},
  className = '',
}) {
  const n = String(nome || '').toLowerCase();
  let glyphKey = 'patto';
  if (/debito|sacrificio|disfacimento/i.test(n)) glyphKey = 'debito';
  else if (/occhio|visione|segreto|maschera|araldi/i.test(n) || isAraldi) glyphKey = 'occhio';
  else if (/non questa volta|salvezza|resurrezione|sopravvissuto/i.test(n)) glyphKey = 'salvezza';

  const svgContent = SVG_RUNIC_GLYPHS[glyphKey] || SVG_RUNIC_GLYPHS.patto;

  const coloreRunico = isAraldi ? 'var(--c-araldi, #a45a2a)' : '#00e5ff';
  const bgRunico = isAraldi ? 'rgba(164, 90, 42, 0.14)' : 'rgba(0, 229, 255, 0.12)';
  const borderRunico = isAraldi ? 'rgba(164, 90, 42, 0.45)' : 'rgba(0, 229, 255, 0.45)';
  const glowShadow = isAraldi
    ? '0 0 8px rgba(164, 90, 42, 0.4)'
    : '0 0 10px rgba(0, 229, 255, 0.45)';

  const innerSvg = (
    <svg
      viewBox="0 0 24 24"
      width={Math.round(dimensione * 0.72)}
      height={Math.round(dimensione * 0.72)}
      fill="currentColor"
      style={{
        display: 'block',
        color: coloreRunico,
        filter: glow ? (isAraldi ? 'drop-shadow(0 0 3px rgba(164, 90, 42, 0.6))' : 'drop-shadow(0 0 4px rgba(0, 229, 255, 0.7))') : 'none',
      }}
      aria-hidden="true"
    >
      {svgContent}
    </svg>
  );

  if (!stileBadge) {
    return (
      <span
        className={`icona-runica-plain ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: dimensione,
          height: dimensione,
          color: coloreRunico,
          ...style,
        }}
      >
        {innerSvg}
      </span>
    );
  }

  return (
    <span
      className={`icona-runica-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimensione,
        height: dimensione,
        borderRadius: 6,
        background: bgRunico,
        border: `1px solid ${borderRunico}`,
        boxShadow: glow ? glowShadow : '0 1px 3px rgba(0,0,0,0.3)',
        flexShrink: 0,
        verticalAlign: 'middle',
        ...style,
      }}
    >
      {innerSvg}
    </span>
  );
}

/**
 * IconaOggetto: Icona per l'inventario (pozioni, armature, armi, monete, pergamene).
 */
export function IconaOggetto({
  nome = '',
  categoria = '',
  dimensione = 20,
  stileBadge = false,
  style = {},
}) {
  const n = String(nome || '').toLowerCase();
  const c = String(categoria || '').toLowerCase();

  let chiave = 'spadone';
  if (c === 'pozione' || /pozione|elisir|ampolla|filtro/i.test(n)) chiave = 'pozione';
  else if (c === 'pergamena' || /pergamena|scroll|tomo|libro|documento/i.test(n)) chiave = 'pergamena';
  else if (c === 'armatura' || c === 'scudo' || /scudo|armatura|corazza|elmo/i.test(n)) chiave = 'scudo';
  else if (c === 'arma' || /spada|arco|balestra|daga|ascia|martello|lancia/i.test(n)) {
    chiave = getChiaveIcona(nome, 'arma');
  } else {
    chiave = 'arcano';
  }

  return (
    <IconaAzione
      nome={nome}
      tipo={categoria}
      dimensione={dimensione}
      stileBadge={stileBadge}
      style={style}
    />
  );
}

/**
 * Rimuove caratteri emoji Unicode da una stringa.
 */
export function rimuoviEmoji(str = '') {
  return String(str || '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1FA00}-\u{1FAFF}]/gu, '')
    .trim();
}

/**
 * IconaUI: Renderizza le icone vettoriali per bottoni di navigazione,
 * menu, combat tracker e azioni di sistema (zero emoticon cheap).
 */
export function IconaUI({
  nome = '',
  dimensione = 16,
  color = 'currentColor',
  style = {},
  className = '',
}) {
  const alias = {
    combat: 'spadeIncrociate',
    spade: 'spadeIncrociate',
    dadi: 'dado',
    cerca: 'lente',
    compendio: 'lente',
    diario: 'pergamena',
    cloud: 'nuvola',
    sync: 'nuvola',
    audio: 'audio',
    notifiche: 'campana',
    levelup: 'levelUp',
    elimina: 'cestino',
    trash: 'cestino',
    vita: 'cuore',
    pf: 'cuore',
    hp: 'cuore',
    morte: 'teschio',
    nemico: 'teschio',
    pg: 'mago',
    alleato: 'bestia',
    zampa: 'bestia',
  };

  const chiaveEffettiva = alias[nome] || (nome in SVG_GAME_ICONS ? nome : 'spadeIncrociate');
  const svgContent = SVG_GAME_ICONS[chiaveEffettiva] || SVG_GAME_ICONS.spadeIncrociate;

  return (
    <svg
      viewBox="0 0 24 24"
      width={dimensione}
      height={dimensione}
      fill="currentColor"
      className={`icona-ui ${className}`}
      style={{
        display: 'inline-block',
        verticalAlign: '-0.15em',
        flexShrink: 0,
        color: color,
        ...style,
      }}
      aria-hidden="true"
    >
      {svgContent}
    </svg>
  );
}

/**
 * IconaModalInfo: Renderizza l'icona tematica da mostrare nell'header del popup/nuvoletta
 * di dettaglio (azioni, incantesimi, oggetti, tratti) sostituendo ogni emoticon grezza.
 */
export function IconaModalInfo({ info, dimensione = 22 }) {
  if (!info) return null;
  if (info.iconaNode) return info.iconaNode;
  if (info.iconaProps) {
    return <IconaAzione {...info.iconaProps} dimensione={dimensione} />;
  }
  const clean = rimuoviEmoji(info.titolo || '');
  if (!clean) return null;
  const isSpell = /trucchetto|incantesimo|cantrip|spell|morsa|fuoco|dardo|gelo|cura|raggio|fiamma/i.test(info.titolo || '');
  return <IconaAzione nome={clean} isSpell={isSpell} dimensione={dimensione} />;
}
