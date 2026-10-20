// Icone tematiche per Tavolo dei Dadi: Formula Ibrida Perfetta
// - Game-Icons.net (SVG vettoriali puri) per Armi, Attacchi, Incantesimi, Difese e Oggetti.
// - Glifi Runici (Neon Arcani con bagliore esoterico) per Poteri del Patrono, Debito e Araldi del Segreto.

import React from 'react';
import { datiIncantesimo } from '../data/incantesimi.js';

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
  // --- TRUCCHETTI ELEMENTALI & DI UTILITÀ (Magie minori / a volontà) ---
  trucchettoFuoco: (
    <path d="M12 2C11 5 8.5 7.5 8.5 11C8.5 13.8 10.5 16 12 16C11 14.5 10.8 13.5 11.2 12.5C11.8 12.5 12.5 12 13 11.2C13.5 13.5 15.5 14.5 15.5 17C15.5 19.5 13.8 21.5 12 21.5C9 21.5 6.5 19 6.5 15.5C6.5 11.5 9.8 8 12 2Z" />
  ),
  trucchettoGelo: (
    <path d="M12 2L15.5 10L14 22L12 18.5L10 22L8.5 10L12 2M12 5.8L10 10.5L11.2 18L12 16.2L12.8 18L14 10.5L12 5.8Z" />
  ),
  trucchettoFulmine: (
    <polygon points="13,2 4,13 11,13 9,22 20,10 13,10" />
  ),
  trucchettoTuono: (
    <>
      <polygon points="10,6 6,9 3,9 3,15 6,15 10,18" />
      <path d="M14 9C15.5 10.5 15.5 13.5 14 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  trucchettoRadioso: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2V6M12 18V22M2 12H6M18 12H22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  trucchettoNecrotico: (
    <path d="M12 3C8.5 3 5.5 5.8 5.5 9.5C5.5 12 7 14 8.5 15.2V18H15.5V15.2C17 14 18.5 12 18.5 9.5C18.5 5.8 15.5 3 12 3ZM9.5 9C10.3 9 11 9.7 11 10.5C11 11.3 10.3 12 9.5 12C8.7 12 8 11.3 8 10.5C8 9.7 8.7 9 9.5 9ZM14.5 12C13.7 12 13 11.3 13 10.5C13 9.7 13.7 9 14.5 9C15.3 9 16 9.7 16 10.5C16 11.3 15.3 12 14.5 12ZM10.5 16.5H13.5V17.5H10.5V16.5Z" />
  ),
  trucchettoVeleno: (
    <path d="M12 2.5C12 2.5 6 10 6 15C6 18.31 8.69 21 12 21C15.31 21 18 18.31 18 15C18 10 12 2.5 12 2.5ZM10 16C9.45 16 9 15.55 9 15C9 13.5 10 12 11 11.5C11.3 12 11 13 11 14C11 15.1 10.55 16 10 16Z" />
  ),
  trucchettoForza: (
    <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
  ),
  trucchettoPsichico: (
    <>
      <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5Z" />
      <circle cx="12" cy="12.5" r="2.5" />
    </>
  ),
  trucchettoArcano: (
    <path d="M12 2L13.8 9.5L21.5 11.5L13.8 13.5L12 21L10.2 13.5L2.5 11.5L10.2 9.5L12 2Z" />
  ),

  // --- INCANTESIMI DI LIVELLO (1°-9° Livello / Magie complesse da slot) ---
  incantesimoFuoco: (
    <path d="M12 2C9.5 4.5 7.5 8 8 11.5C6.2 11 5 12.5 5 14.5C5 18 8 21.5 12 21.5C17 21.5 20.5 17.5 20.5 13C20.5 8 16 5.5 16 5.5C16 5.5 16.5 8 14.5 9.5C13 8.2 12.8 5 12 2M12 14.5C11.2 14.5 10.5 15.2 10.5 16C10.5 17.1 11.4 18 12.5 18C13.6 18 14.5 17.1 14.5 16C14.5 14.8 13.5 14.5 12 14.5Z" />
  ),
  incantesimoGelo: (
    <>
      <path d="M12 1V23M1 12H23M4.22 4.22L19.78 19.78M4.22 19.78L19.78 4.22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="12,5 13.5,7.5 10.5,7.5" />
      <polygon points="12,19 13.5,16.5 10.5,16.5" />
      <polygon points="5,12 7.5,10.5 7.5,13.5" />
      <polygon points="19,12 16.5,10.5 16.5,13.5" />
    </>
  ),
  incantesimoFulmine: (
    <>
      <polygon points="13,1 4,13 10,13 8,23 19,9 13,9" />
      <polygon points="17,5 13,12 16,12 14,19 21,9 17,9" opacity="0.65" />
    </>
  ),
  incantesimoTuono: (
    <>
      <polygon points="10,4 5,8 2,8 2,16 5,16 10,20" />
      <path d="M14 8C16 10 16 14 14 16M18 5C21 8 21 16 18 19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  incantesimoRadioso: (
    <>
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M12 1V4M12 20V23M1 12H4M20 12H23M4.2 4.2L6.8 6.8M17.2 17.2L19.8 19.8M4.2 19.8L6.8 17.2M17.2 6.8L19.8 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
    </>
  ),
  incantesimoNecrotico: (
    <>
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
      <path d="M12 4C8.68 4 6 6.68 6 10C6 12.38 7.38 14.44 9.38 15.42V18H14.62V15.42C16.62 14.44 18 12.38 18 10C18 6.68 15.32 4 12 4ZM9.5 9.5C10.33 9.5 11 10.17 11 11C11 11.83 10.33 12.5 9.5 12.5C8.67 12.5 8 11.83 8 11C8 10.17 8.67 9.5 9.5 9.5ZM14.5 12.5C13.67 12.5 13 11.83 13 11C13 10.17 13.67 9.5 14.5 9.5C15.33 9.5 16 10.17 16 11C16 11.83 15.33 12.5 14.5 12.5Z" />
    </>
  ),
  incantesimoVeleno: (
    <path d="M13 2H11V5H7V8L9 10V20C9 21.1 9.9 22 11 22H13C14.1 22 15 21.1 15 20V10L17 8V5H13V2M11 7H13V8L11.5 9.5L13 11V20H11V11L12.5 9.5L11 8V7M12 13C12.83 13 13.5 13.67 13.5 14.5C13.5 15.33 12.83 16 12 16C11.17 16 10.5 15.33 10.5 14.5C10.5 13.67 11.17 13 12 13Z" />
  ),
  incantesimoForza: (
    <>
      <polygon points="12,2 14.5,8.5 21,10 16,14.5 17.5,21 12,17.5 6.5,21 8,14.5 3,10 9.5,8.5" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  incantesimoPsichico: (
    <path d="M12 3C7.5 3 4 6.5 4 11C4 13.2 4.9 15.1 6.3 16.5L6 21H11V19C11.3 19 11.7 19 12 19C16.5 19 20 15.5 20 11C20 6.5 16.5 3 12 3M8 11C8 8.8 9.8 7 12 7C14.2 7 16 8.8 16 11C16 13.2 14.2 15 12 15C10.5 15 9.2 14.1 8.5 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  ),
  incantesimoArcano: (
    <path d="M4 3H18C19.1 3 20 3.9 20 5V19C20 20.1 19.1 21 18 21H4C2.9 21 2 20.1 2 19V5C2 3.9 2.9 3 4 3ZM6 7H16V9H6V7ZM6 11H14V13H6V11ZM6 15H12V17H6V15Z" />
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
  // Sigillo dell'Occhio Onnisciente (Araldi del Segreto / Patrono / Maschera / Visione)
  occhio: (
    <>
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
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

/** Dimensione standard universale per tutti i badge icona nelle sezioni della scheda */
export const DIMENSIONE_ICONA_SEZIONE = 22;

/** Palette cromatica tematica in base all'elemento del danno */
export const PALETTE_ELEMENTI = {
  fuoco: {
    color: '#ff6b35',
    bg: 'rgba(255, 107, 53, 0.14)',
    border: 'rgba(255, 107, 53, 0.42)',
    glow: 'rgba(255, 107, 53, 0.45)',
  },
  freddo: {
    color: '#00d2d3',
    bg: 'rgba(0, 210, 211, 0.14)',
    border: 'rgba(0, 210, 211, 0.42)',
    glow: 'rgba(0, 210, 211, 0.45)',
  },
  fulmine: {
    color: '#fed330',
    bg: 'rgba(254, 211, 48, 0.14)',
    border: 'rgba(254, 211, 48, 0.42)',
    glow: 'rgba(254, 211, 48, 0.45)',
  },
  tuono: {
    color: '#45aaf2',
    bg: 'rgba(69, 170, 242, 0.14)',
    border: 'rgba(69, 170, 242, 0.42)',
    glow: 'rgba(69, 170, 242, 0.45)',
  },
  acido: {
    color: '#26de81',
    bg: 'rgba(38, 222, 129, 0.14)',
    border: 'rgba(38, 222, 129, 0.42)',
    glow: 'rgba(38, 222, 129, 0.45)',
  },
  veleno: {
    color: '#20bf6b',
    bg: 'rgba(32, 191, 107, 0.14)',
    border: 'rgba(32, 191, 107, 0.42)',
    glow: 'rgba(32, 191, 107, 0.45)',
  },
  necrotico: {
    color: '#a55eea',
    bg: 'rgba(165, 94, 234, 0.14)',
    border: 'rgba(165, 94, 234, 0.42)',
    glow: 'rgba(165, 94, 234, 0.45)',
  },
  radioso: {
    color: '#f7b731',
    bg: 'rgba(247, 183, 49, 0.14)',
    border: 'rgba(247, 183, 49, 0.42)',
    glow: 'rgba(247, 183, 49, 0.45)',
  },
  forza: {
    color: '#d980fa',
    bg: 'rgba(217, 128, 250, 0.14)',
    border: 'rgba(217, 128, 250, 0.42)',
    glow: 'rgba(217, 128, 250, 0.45)',
  },
  psichico: {
    color: '#fc5c65',
    bg: 'rgba(252, 92, 101, 0.14)',
    border: 'rgba(252, 92, 101, 0.42)',
    glow: 'rgba(252, 92, 101, 0.45)',
  },
  cura: {
    color: '#38ef7d',
    bg: 'rgba(56, 239, 125, 0.14)',
    border: 'rgba(56, 239, 125, 0.42)',
    glow: 'rgba(56, 239, 125, 0.45)',
  },
  arcanoTrucchetto: {
    color: '#70a1ff',
    bg: 'rgba(112, 161, 255, 0.14)',
    border: 'rgba(112, 161, 255, 0.42)',
    glow: 'rgba(112, 161, 255, 0.45)',
  },
  arcanoIncantesimo: {
    color: 'var(--c-gold, #d4a017)',
    bg: 'rgba(212, 160, 23, 0.12)',
    border: 'rgba(212, 160, 23, 0.35)',
    glow: 'rgba(212, 160, 23, 0.4)',
  },
  base: {
    color: 'var(--c-gold, #d4a017)',
    bg: 'rgba(212, 160, 23, 0.12)',
    border: 'rgba(212, 160, 23, 0.35)',
    glow: 'rgba(212, 160, 23, 0.3)',
  },
};

/**
 * Determina se un incantesimo è un trucchetto o un incantesimo di livello,
 * e calcola l'elemento associato e i colori della palette.
 */
export function determinaInfoMagica(nome = '', opzioni = {}) {
  const { tipo = '', isSpell = false, isCantrip: isCantripProp, livello, tipoDanno = '', cat = '' } = opzioni;
  const n = String(nome || '').toLowerCase();
  const clean = n.replace(/\s*\(.*$/, '').trim();

  // Dati da database se disponibili
  const dbData = datiIncantesimo(nome) || datiIncantesimo(clean);

  // 1. Determina se è Trucchetto (Livello 0) o Incantesimo di livello
  let isCantrip = false;
  if (isCantripProp !== undefined) {
    isCantrip = !!isCantripProp;
  } else if (livello !== undefined) {
    isCantrip = Number(livello) === 0;
  } else if (/trucchetto|cantrip|livello 0|lv 0|liv\. 0/i.test(tipo || cat || '')) {
    isCantrip = true;
  } else if (dbData && dbData.livello !== undefined) {
    isCantrip = dbData.livello === 0;
  } else if (/trucchetto|cantrip/i.test(n)) {
    isCantrip = true;
  }

  // 2. Determina l'elemento o tipo di danno
  const rawTipoDanno = String(tipoDanno || dbData?.tipoDanno || '').toLowerCase();
  let elemento = 'arcano';

  if (/cura|ferite|guarig|healing|heal|vitalit|riposo|second.*wind|ripresa.*fiato|imposizione.*mani|lay.*on.*hands|elisir.*vita|pozione.*guarig/i.test(n) || rawTipoDanno.includes('cura') || rawTipoDanno.includes('guarig')) {
    elemento = 'cura';
  } else if (/fuoco|fiamma|infuoc|combust|braci|fire|flame|igni|ardente/i.test(n) || rawTipoDanno.includes('fuoco') || rawTipoDanno.includes('fire')) {
    elemento = 'fuoco';
  } else if (/gelo|freddo|ghiaccio|neve|brina|frost|cold|ice|agathys/i.test(n) || rawTipoDanno.includes('freddo') || rawTipoDanno.includes('gelo') || rawTipoDanno.includes('cold')) {
    elemento = 'freddo';
  } else if (/fulmine|elettr|saetta|shock|lightning/i.test(n) || rawTipoDanno.includes('fulmine') || rawTipoDanno.includes('lightning')) {
    elemento = 'fulmine';
  } else if (/tuono|thunder|tonante|onda tonante/i.test(n) || rawTipoDanno.includes('tuono') || rawTipoDanno.includes('thunder')) {
    elemento = 'tuono';
  } else if (/acido|acid/i.test(n) || rawTipoDanno.includes('acido') || rawTipoDanno.includes('acid')) {
    elemento = 'acido';
  } else if (/veleno|poison|tossic/i.test(n) || rawTipoDanno.includes('veleno') || rawTipoDanno.includes('poison')) {
    elemento = 'veleno';
  } else if (/necrot|morte|tomba|death|decompos|morbid|hadar|rintocco|tocco gelido/i.test(n) || rawTipoDanno.includes('necrot')) {
    elemento = 'necrotico';
  } else if (/radios|radiant|luce|guida|sacr|sun|sole|aurora|divin|fiamma sacra/i.test(n) || rawTipoDanno.includes('radiante') || rawTipoDanno.includes('radioso')) {
    elemento = 'radioso';
  } else if (/forza|force|dardo.*incant|magic.*missile|spada spirit|deflagrazione|spade/i.test(n) || rawTipoDanno.includes('forza')) {
    elemento = 'forza';
  } else if (/psichic|psychic|mente|mental|beffa|sussurri|scheggia/i.test(n) || rawTipoDanno.includes('psichic')) {
    elemento = 'psichico';
  }

  // 3. Seleziona icona differenziata: Trucchetto vs Incantesimo di livello
  let chiave = 'arcano';
  if (elemento === 'cura') {
    chiave = 'cura';
  } else if (isCantrip) {
    if (elemento === 'fuoco') chiave = 'trucchettoFuoco';
    else if (elemento === 'freddo') chiave = 'trucchettoGelo';
    else if (elemento === 'fulmine') chiave = 'trucchettoFulmine';
    else if (elemento === 'tuono') chiave = 'trucchettoTuono';
    else if (elemento === 'acido') chiave = 'trucchettoVeleno';
    else if (elemento === 'veleno') chiave = 'trucchettoVeleno';
    else if (elemento === 'necrotico') chiave = 'trucchettoNecrotico';
    else if (elemento === 'radioso') chiave = 'trucchettoRadioso';
    else if (elemento === 'forza') chiave = 'trucchettoForza';
    else if (elemento === 'psichico') chiave = 'trucchettoPsichico';
    else chiave = 'trucchettoArcano';
  } else {
    // Incantesimo di livello (1° - 9°)
    if (elemento === 'fuoco') chiave = 'incantesimoFuoco';
    else if (elemento === 'freddo') chiave = 'incantesimoGelo';
    else if (elemento === 'fulmine') chiave = 'incantesimoFulmine';
    else if (elemento === 'tuono') chiave = 'incantesimoTuono';
    else if (elemento === 'acido') chiave = 'incantesimoVeleno';
    else if (elemento === 'veleno') chiave = 'incantesimoVeleno';
    else if (elemento === 'necrotico') chiave = 'incantesimoNecrotico';
    else if (elemento === 'radioso') chiave = 'incantesimoRadioso';
    else if (elemento === 'forza') chiave = 'incantesimoForza';
    else if (elemento === 'psichico') chiave = 'incantesimoPsichico';
    else chiave = 'libro';
  }

  // 4. Stile cromatico in base all'elemento
  let paletteKey = elemento;
  if (elemento === 'arcano') {
    paletteKey = isCantrip ? 'arcanoTrucchetto' : 'arcanoIncantesimo';
  }
  const stile = PALETTE_ELEMENTI[paletteKey] || PALETTE_ELEMENTI.base;

  return {
    isCantrip,
    elemento,
    chiave,
    colore: stile.color,
    bg: stile.bg,
    border: stile.border,
    glow: stile.glow,
  };
}

/**
 * Seleziona la chiave dell'icona corretta per un attacco, incantesimo, potere o azione.
 * Segue la logica gerarchica:
 * 1. Cure / Guarigione / Ripristino PF (Cuore)
 * 2. Reazioni e Difese (Scudo)
 * 3. Elementi e Scuole Magiche (Fuoco, Gelo, Fulmine, Necrotico, Radioso, Veleno, Dardi)
 * 4. Categoria base (Trucchetti -> Scintilla Arcana, Incantesimi -> Grimorio, Tratti -> Stella/Emblema)
 * 5. Armi e Attacchi marziali
 */
export function getChiaveIcona(nome = '', tipo = '', isSpell = false, cat = '', opzioni = {}) {
  const n = String(nome || '').toLowerCase();
  const t = String(tipo || '').toLowerCase();
  const c = String(cat || '').toLowerCase();

  // 1. Priorità Assoluta: Cure e Ripristino Vita -> Cuore
  if (/cura|ferite|guarig|healing|heal|vitalit|riposo|second.*wind|ripresa.*fiato|imposizione.*mani|lay.*on.*hands|elisir.*vita|pozione.*guarig/i.test(n)) {
    return 'cura';
  }

  // 2. Reazioni e difese
  if (cat === 'Reazione' || c === 'reazione' || /scudo|parata|schivata|difesa|reazione|intercetta|protezione|bastione/i.test(n)) {
    return 'scudo';
  }

  // 3. Spells (incantesimi o trucchetti) o elementi offensivi
  const isMagia = isSpell || /incantesimo|trucchetto|cantrip|magia/i.test(t) || /magia/i.test(c) || !!datiIncantesimo(nome);
  if (isMagia) {
    const infoM = determinaInfoMagica(nome, { tipo, isSpell: true, cat, ...opzioni });
    return infoM.chiave;
  }

  // 4. Tratti di Classe / Privilegi
  if (t === 'privilegio' || t === 'tratto' || t === 'talento' || c === 'privilegio' || c === 'tratto') {
    if (/zampa|forma.*selvat|istinto|bestia|animale/i.test(n)) return 'bestia';
    if (/arcano|magia|incantatore/i.test(n)) return 'arcano';
    if (/furtiv|assassin|scassin|ladro/i.test(n)) return 'pugnale';
    return 'stella';
  }

  // 5. Armi e attacchi marziali
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

  // 6. Default per tipo
  if (tipo === 'tattica' || tipo === 'manovra') return 'stocco';
  if (tipo === 'stile' || tipo === 'armatura') return 'scudo';

  return 'spadeIncrociate';
}

/**
 * IconaAzione: Renderizza l'icona Game-Icons.net in formato SVG puro ad alta risoluzione,
 * racchiusa in un elegante micro-badge con finitura dorata/scura di dimensione uniforme (22px).
 */
export function IconaAzione({
  nome = '',
  tipo = '',
  isSpell = false,
  isCantrip: isCantripProp,
  livello,
  tipoDanno = '',
  tipoFonte = '',
  cat = '',
  dimensione = DIMENSIONE_ICONA_SEZIONE,
  stileBadge = true,
  glow = false,
  style = {},
  className = '',
}) {
  // Se è un privilegio o potere Araldi / Debito / Patrono / Invocazione, usa il Glifo Runico (Occhio/Patto/Debito)
  if (
    tipoFonte === 'araldi' ||
    /debito|patrono|araldi|maschera|invocaz|supplica|patto|eldritch|fattucchiere|warlock|visione|occhio|lama.*iettatrice|maledizione/i.test(nome) ||
    /patrono|warlock|invocaz/i.test(tipo)
  ) {
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

  // Determina se è magia (incantesimo o trucchetto)
  const isMagia = isSpell || /incantesimo|trucchetto|cantrip|magia/i.test(tipo) || /magia/i.test(cat) || !!datiIncantesimo(nome);

  let chiave = 'spadeIncrociate';
  let coloreIcona = 'var(--c-gold, #d4a017)';
  let bgBadge = 'rgba(212, 160, 23, 0.12)';
  let borderBadge = 'rgba(212, 160, 23, 0.35)';

  if (isMagia) {
    const infoM = determinaInfoMagica(nome, { tipo, isSpell: true, isCantrip: isCantripProp, livello, tipoDanno, cat });
    chiave = infoM.chiave;
    coloreIcona = infoM.colore;
    bgBadge = infoM.bg;
    borderBadge = infoM.border;
  } else {
    chiave = getChiaveIcona(nome, tipo, false, cat, { tipoDanno });
    const rawTD = String(tipoDanno || '').toLowerCase();
    if (rawTD && PALETTE_ELEMENTI[rawTD]) {
      const p = PALETTE_ELEMENTI[rawTD];
      coloreIcona = p.color;
      bgBadge = p.bg;
      borderBadge = p.border;
    } else if (chiave === 'cura') {
      const p = PALETTE_ELEMENTI.cura;
      coloreIcona = p.color;
      bgBadge = p.bg;
      borderBadge = p.border;
    }
  }

  const svgContent = SVG_GAME_ICONS[chiave] || SVG_GAME_ICONS.spadeIncrociate;

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
          minWidth: dimensione,
          minHeight: dimensione,
          maxWidth: dimensione,
          maxHeight: dimensione,
          boxSizing: 'border-box',
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
        minWidth: dimensione,
        minHeight: dimensione,
        maxWidth: dimensione,
        maxHeight: dimensione,
        boxSizing: 'border-box',
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
  dimensione = DIMENSIONE_ICONA_SEZIONE,
  stileBadge = true,
  glow = true,
  style = {},
  className = '',
}) {
  const n = String(nome || '').toLowerCase();
  let glyphKey = 'patto';
  if (/debito|sacrificio|disfacimento/i.test(n)) glyphKey = 'debito';
  else if (/occhio|visione|segreto|maschera|araldi|patrono|warlock|invocaz|supplica|patto|eldritch|lama.*iettatrice/i.test(n) || isAraldi) glyphKey = 'occhio';
  else if (/non questa volta|salvezza|resurrezione|sopravvissuto/i.test(n)) glyphKey = 'salvezza';

  const svgContent = SVG_RUNIC_GLYPHS[glyphKey] || SVG_RUNIC_GLYPHS.patto;

  // L'occhio del Patrono e le rune esoteriche devono risaltare luminose e vibranti
  let coloreRunico = '#00f5ff';
  let bgRunico = 'rgba(0, 245, 255, 0.18)';
  let borderRunico = 'rgba(0, 245, 255, 0.65)';
  let glowShadow = '0 0 10px rgba(0, 245, 255, 0.65), inset 0 0 4px rgba(0, 245, 255, 0.3)';
  let dropFilter = 'drop-shadow(0 0 4px rgba(0, 245, 255, 0.9))';

  if (isAraldi || /araldi/i.test(n)) {
    // Ambra aranciata solare brillante ed elettrizzante per gli Araldi del Segreto
    coloreRunico = '#ff9f1a';
    bgRunico = 'rgba(255, 159, 26, 0.18)';
    borderRunico = 'rgba(255, 159, 26, 0.70)';
    glowShadow = '0 0 10px rgba(255, 159, 26, 0.65), inset 0 0 4px rgba(255, 159, 26, 0.3)';
    dropFilter = 'drop-shadow(0 0 4px rgba(255, 159, 26, 0.92))';
  } else if (glyphKey === 'debito') {
    coloreRunico = '#ff5252';
    bgRunico = 'rgba(255, 82, 82, 0.18)';
    borderRunico = 'rgba(255, 82, 82, 0.65)';
    glowShadow = '0 0 10px rgba(255, 82, 82, 0.65), inset 0 0 4px rgba(255, 82, 82, 0.3)';
    dropFilter = 'drop-shadow(0 0 4px rgba(255, 82, 82, 0.9))';
  }

  const innerSvg = (
    <svg
      viewBox="0 0 24 24"
      width={Math.round(dimensione * 0.72)}
      height={Math.round(dimensione * 0.72)}
      fill="currentColor"
      style={{
        display: 'block',
        color: coloreRunico,
        filter: glow ? dropFilter : 'none',
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
          minWidth: dimensione,
          minHeight: dimensione,
          maxWidth: dimensione,
          maxHeight: dimensione,
          boxSizing: 'border-box',
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
        minWidth: dimensione,
        minHeight: dimensione,
        maxWidth: dimensione,
        maxHeight: dimensione,
        boxSizing: 'border-box',
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
  dimensione = DIMENSIONE_ICONA_SEZIONE,
  stileBadge = true,
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
  }

  return (
    <IconaAzione
      nome={nome}
      tipo={chiave || categoria}
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
    // eslint-disable-next-line no-misleading-character-class
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
export function IconaModalInfo({ info, dimensione = DIMENSIONE_ICONA_SEZIONE }) {
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
