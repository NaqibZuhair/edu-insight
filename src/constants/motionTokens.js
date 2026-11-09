/**
 * Token Animasi Terpusat EduInsight
 * Mematuhi standar performa 60 FPS:
 * - Interaksi mikro: 150–250 ms
 * - Animasi masuk (reveal) & count-up: 500–900 ms
 * - Intro & penyalaan peta bertahap: maksimum 1.200 ms (1,2 s)
 * - Easing: cubic-bezier ease-out
 * - Properti yang dianimasikan hanya transform, opacity, dan fill/stroke SVG
 */

export const MOTION_TOKENS = {
  duration: {
    micro: 180,          // 180 ms (150–250 ms) untuk hover, underline, ikon, tombol
    pageTransition: 240, // 240 ms untuk perpindahan halaman/tab (fade + geser 10px)
    colorSwap: 300,      // 300 ms untuk transisi warna indikator pada peta & grafik
    reveal: 600,         // 600 ms (500–900 ms) untuk elemen masuk viewport
    barGrow: 700,        // 700 ms (500–900 ms) untuk scaleX / scaleY batang grafik
    countUp: 800,        // 800 ms (500–900 ms) untuk animasi angka KPI & sorotan
    flyToBounds: 850,    // 850 ms (<= 1.000 ms) untuk fokus zoom/pan peta ke provinsi
    introMax: 1150       // 1.150 ms (<= 1.200 ms) batas maksimum stagger peta 38 provinsi
  },
  easing: {
    easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
    easeOutSoft: 'cubic-bezier(0.16, 1, 0.3, 1)',
    springSubtle: 'cubic-bezier(0.34, 1.4, 0.64, 1)'
  },
  distance: {
    pageSlideY: 10, // 10 px (rentang 8–12 px)
    revealY: 12,    // 12 px untuk reveal kartu/seksi
    hoverLiftY: -2  // -2 px angkat tipis saat hover
  },
  stagger: {
    card: 70,       // 70 ms antarkartu KPI / perbandingan
    tableRow: 55,   // 55 ms antarbaris Top 5 / Bottom 5
    heroItem: 90,   // 90 ms antarelemen hero
    mapTotal: 1100  // Total waktu penyalaan 38 provinsi dari nilai terendah ke tertinggi
  }
};
