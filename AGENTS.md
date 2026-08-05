## Loyiha haqida

STEAM Academy — xususiy maktab uchun onlayn darslik (Astro + Starlight).
Kontent **faqat o'zbekcha** (lotin), auditoriya **13–17 yosh**, telefon birinchi.
Bu **statik darslik**, LMS emas: login yo'q, baza yo'q, progress faqat `localStorage` da.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Har o'zgarishdan keyin `npm run build` xatosiz o'tishi shart.

---

## DARS YOZISH QOIDALARI — buzilmaydi

1. Fayl: `src/content/docs/<modul>/lesson-NN.mdx` (NN = `01`..`20`)
2. **H1 (`#`) YOZILMAYDI** — Starlight `title` dan o'zi chiqaradi, aks holda sarlavha ikki marta ko'rinadi
3. Frontmatter `title` har doim qo'shtirnoqda (ichida `:` bo'lsa YAML buziladi va butun build to'xtaydi)
4. `sidebar.label` = `"N-dars"`, `sidebar.order` = N
5. Bo'lim tartibi `_TEMPLATE.mdx` bilan bir xil, o'zgartirilmaydi
6. Bo'limlar `##` (h2), ichidagilar `###` (h3). h4 dan pastga tushilmaydi
7. Rasm: `src/assets/<modul>/NN-nom.png`, `<Rasm>` orqali, `alt` majburiy
8. Matn uslubi: **normal paragraf**. Har gapni alohida qatorga yozish **TAQIQLANADI**
9. Paragraf max 3 gap. Bo'lim max 150 so'z. Uzun bo'lsa — ikkiga bo'l
10. Til: siz-sizlash, jonli, lekin bolalarcha emas. Emoji faqat komponent ichida
11. Har darsda: **1 interaktiv + min 5 `<Sinov>` + 1 `<Amaliyot>`**
12. Ingliz atama birinchi uchraganda `<Atama>` orqali beriladi
13. Yangi dars qo'shilganda `astro.config.mjs` sidebar ham tekshiriladi
14. Har o'zgarishdan keyin: `npm run build`

### Dizayn qoidalari

1. Dars faylida (`.mdx`) **bitta ham `<style>` yoki `style="..."` bo'lmasin**. Hammasi `custom.css` yoki komponent ichida
2. Rang faqat o'zgaruvchi orqali: `var(--sl-color-white)`, `var(--sl-color-accent)`, `var(--sl-color-gray-2)`, `var(--blok-N)`.
   Qattiq `#fff`, `#333` yozilsa dark mode buziladi
3. Shrift: Starlight defaulti. Kod uchun `var(--sl-font-mono)`. **Yangi shrift yuklanmaydi**
4. **Mobil birinchi.** Har komponent 360px kenglikda ishlashi shart. Gorizontal scroll bo'lmasin
5. `@media (prefers-reduced-motion: reduce)` — animatsiya o'chsin
6. Klaviatura: har interaktiv element `:focus-visible` da ko'rinadigan halqaga ega
7. **CDN yo'q** — barcha JS/CSS loyiha ichida. Internet sekin bo'lsa ham ishlasin

### Ikki tuzoq — ularga har safar tushiladi

**1. `not-content` klassi.** Starlight `.sl-markdown-content` ichidagi **har qanday**
qo'shni element juftiga `margin-top: 1rem` qo'shadi. Proza uchun to'g'ri, UI uchun
halokatli: yonma-yon turishi kerak tugmalar zinapoyasimon siljib ketadi.

Shuning uchun **strukturaviy** o'ram elementiga `not-content` qo'yiladi
(`Simulyator`, `DarsTugadi`, `ModulProgress`, `Rasm`, `Amaliyot > header`).
Proza bo'lgan joyga QO'YILMAYDI — u yerda oraliqlar kerak; o'sha joyda
faqat kerakli elementga aniq `margin-top: 0` yoziladi.

Starlight qoidalari `@layer starlight.content` ichida, komponent stillari esa
layer'siz — ya'ni siz e'lon qilgan `margin` har doim g'olib. Muammo faqat
e'lon **qilmaganda** chiqadi.

**2. Simulyator skriptining ildizi.** `boshqaruv` slotidagi tugmalar sizning
`.sim-nomi` div'ingiz **ichida emas** — ular Simulyator qobig'ining footer'ida,
boshqa shoxda. Shu sababli:

```js
// TO'G'RI: ildiz .simulyator
document.querySelectorAll('.simulyator').forEach((qobiq) => {
  const qutu = qobiq.querySelector('.sim-nomi');
  if (!qutu) return;                       // bu boshqa simulyator
  const qayta = qobiq.querySelector('.qayta');   // footer'dagi tugma
});

// XATO: .qayta topilmaydi -> TypeError -> butun simulyator ishlamaydi
document.querySelectorAll('.sim-nomi').forEach(...)
```

### Interaktiv komponentlar

- Har simulyator `<Simulyator>` qobig'i ichida: sarlavha, bir qatorli ko'rsatma, `boshqaruv` slotida `Qayta boshlash`
- Fayl joyi: `src/components/sim/NomI.astro`. Dars faqat `<NomI />` yozadi
- `↑` `↓` kabi belgilar ba'zi tizimlarda emoji shriftiga tushib rangi buziladi — **SVG ishlating**
- Vanilla JS + SVG. **React, D3 yoki boshqa kutubxona qo'shilmaydi**
- Har komponent mustaqil: bir dars ochilganda faqat o'sha JS yuklanadi
- JS o'chirilgan bo'lsa `fallback` sloti ko'rinadi (progressive enhancement)
- Har dars sahifasi 300KB dan kichik

### Blok ranglari

| Blok | Darslar | Rang | O'zgaruvchi |
|------|---------|------|-------------|
| 1 — Hamma narsa bit | 1–4 | teal | `--blok-1` |
| 2 — Mantiqdan apparatga | 5–8 | amber | `--blok-2` |
| 3 — Protsessor | 9–12 | violet | `--blok-3` |
| 4 — Xotira, OS, fayl | 13–16 | sky | `--blok-4` |
| 5 — Tarmoq, xavfsizlik | 17–20 | rose | `--blok-5` |

---

## Modullar chegarasi — takrorlanish bo'lmasin

Computer Fundamentals modulida **yozilmasligi** kerak:

| Mavzu | Qaysi modulga tegishli |
|-------|------------------------|
| Programmalash sintaksisi | `python-basic` |
| Saralash, murakkablik tahlili | `algorithms` |
| HTML/CSS | `web-development` |
| Git buyruqlari | `git-github` |
| Neyron tarmoq | `ai-fundamentals` |

Kerak bo'lsa faqat havola beriladi.

---

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
