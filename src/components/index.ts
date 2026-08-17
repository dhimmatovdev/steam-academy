/**
 * Barcha dars komponentlari bir joyda.
 *
 * Shu sababli darsda bitta qator import yetadi:
 *   import { Maqsad, Muhim, Sinov } from '@components';
 *
 * Alias `tsconfig.json` dagi `paths` da belgilangan.
 * Yangi komponent qo'shsangiz — shu yerga ham qo'shing, aks holda
 * darslardan ko'rinmaydi.
 */

/* --- Kontent komponentlari --- */
export { default as Amaliyot } from './Amaliyot.astro';
export { default as Atama } from './Atama.astro';
export { default as Bloknoma } from './Bloknoma.astro';
export { default as Maqsad } from './Maqsad.astro';
export { default as Muhim } from './Muhim.astro';
export { default as Rasm } from './Rasm.astro';
export { default as Sinov } from './Sinov.astro';

/* --- Python Basic moduli komponentlari --- */
export { default as AIOgoh } from './AIOgoh.astro';
export { default as Hayotda } from './Hayotda.astro';
export { default as Kod } from './Kod.astro';
export { default as KodBashorat } from './KodBashorat.astro';
export { default as Muhit } from './Muhit.astro';
export { default as Qatlam } from './Qatlam.astro';
export { default as Xato } from './Xato.astro';

/* --- Interaktiv qobiq (barcha simulyatorlar shundan foydalanadi) --- */
export { default as Simulyator } from './Simulyator.astro';

/* --- Progress --- */
export { default as DarsTugadi } from './DarsTugadi.astro';
export { default as ModulProgress } from './ModulProgress.astro';
