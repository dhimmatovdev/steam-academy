# TOPSHIRIQ: Computer Fundamentals darsligini to'liq qurish

> Bu fayl Claude Code uchun yozilgan. Loyiha ildiziga `TOPSHIRIQ.md` nomi bilan qo'ying va
> `claude` ga bering. **Avval PLAN qiling, tasdiq oling, keyin yozing.**

---

## 0. Kontekst

- Loyiha: **STEAM Academy** — xususiy maktab uchun onlayn darslik (Astro + Starlight)
- Deploy: Vercel — `steam-academy-xi.vercel.app`
- Til: **faqat o'zbekcha** (lotin). Ingliz atamalar qavs ichida beriladi: `kesh (cache)`
- Auditoriya: **13–17 yosh**, telefon birinchi, diqqati qisqa, o'yin va interaktivlikka o'rgangan
- Variant: **A** — LMS emas, statik darslik. Login yo'q, baza yo'q. Progress faqat `localStorage`
- Modul: `computer-fundamentals` — 20 dars, 5 blok

### Manba programmalar (mundarija shundan yig'ilgan)
Nand2Tetris · Harvard CS50 · Berkeley CS61C · CMU 15-213 · Petzold "CODE" · UK GCSE CS · CSTA K-12

### Asosiy pedagogik prinsip
**Pastdan yuqoriga.** O'quvchi "protsessor nima" ni yodlamaydi — protsessorni o'zi yig'adi.
Har darsda: **1 ta katta g'oya + 1 ta qo'lga tegadigan interaktiv + 1 ta amaliy topshiriq.**

---

## 1. FAZA 1 — Avval singanlarini tuzat (boshqa hech narsadan oldin)

Har birini alohida commit qil.

- [ ] `lesson-02.md` frontmatter: `title` ichidagi ikkinchi `:` YAML ni buzadi → qo'shtirnoqqa ol.
      Butun `src/content/docs/` ni skanerla, shu xatoni hammasida tuzat.
- [ ] `astro.config.mjs`: `site: 'https://steam-academy-xi.vercel.app'` qo'sh (canonical + sitemap).
- [ ] Shu yerda: `defaultLocale: 'root'`, `locales: { root: { label: "O'zbekcha", lang: 'uz' } }`
      → interfeys o'zbekchaga o'tadi ("On this page" → "Bu sahifada").
      Starlight'da `uz` tarjimasi to'liq bo'lmasa, `src/content/i18n/uz.json` da qo'lda to'ldir.
- [ ] `src/content/docs/guides/example.md` va `reference/example.md` ni **o'chir**,
      sidebar'dan `Guides` va `Reference` guruhlarini olib tashla.
- [ ] `social.github` havolasi bo'sh (`https://github.com/`) — to'g'ri URL yoz yoki butunlay o'chir.
- [ ] `README.md` ni qayta yoz: loyiha nima, qanday ishga tushirish, dars qo'shish qoidasi.
- [ ] Qolgan 8 modul (`python-basic`, `python-intermediate`, `algorithms`, `git-github`, `sql`,
      `web-development`, `robotics`, `ai-fundamentals`) uchun `index.mdx` yarat:
      qisqa tavsif + `Tez kunda` badge + rejalashtirilgan mavzular ro'yxati. 404 lar yopiladi.
- [ ] `npm run build` xatosiz o'tsin. **Bu faza tugash sharti.**

---

## 2. FAZA 2 — Dizayn tizimi

### 2.1 Tokenlar
Mavjud dizayn: to'q ko'k fon + teal accent + "davriy jadval" grid. **Shuni saqla**, sindirmа.

`src/styles/custom.css` da faqat shu tokenlarni ishlat:

```css
:root {
  /* Blok ranglari — har blok o'z rangiga ega, o'quvchi qayerdaligini biladi */
  --blok-1: /* Bit — teal */;
  --blok-2: /* Apparat — amber */;
  --blok-3: /* Protsessor — violet */;
  --blok-4: /* Tizim — sky */;
  --blok-5: /* Tarmoq — rose */;
}
```

**Qat'iy qoidalar:**
1. Dars faylida (`.mdx`) **bitta ham `<style>` yoki `style="..."` bo'lmasin**. Hammasi `custom.css` yoki komponent ichida.
2. Rang faqat o'zgaruvchi orqali: `var(--sl-color-white)`, `var(--sl-color-accent)`, `var(--sl-color-gray-2)`, `var(--blok-N)`.
   Qattiq `#fff`, `#333` yozilsa dark mode buziladi.
3. Shrift: Starlight defaultini saqla. Kod uchun mono. Yangi shrift yuklamа (og'irlik).
4. **Mobil birinchi.** Har komponent 360px kenglikda ishlashi shart. Gorizontal scroll bo'lmasin.
5. `@media (prefers-reduced-motion: reduce)` — barcha animatsiya o'chsin.
6. Klaviatura: har interaktiv element `:focus-visible` da ko'rinadigan halqaga ega.
7. CDN yo'q — barcha JS/CSS loyiha ichida. Internet sekin bo'lsa ham ishlasin.

### 2.2 Kontent komponentlari (`src/components/`)
Bir marta yozamiz — 180 darsda ishlatamiz. `.astro` fayl, JS kerak emas.

| Komponent | Vazifasi | Props |
|---|---|---|
| `Maqsad.astro` | Dars boshidagi "shu darsdan keyin siz..." bloki | `slot` |
| `Muhim.astro` | Asosiy g'oya, rangli callout | `turi: "gap" \| "ogoh" \| "sir"` |
| `Atama.astro` | Yangi atama + izoh + inglizcha varianti | `soz`, `eng` |
| `Rasm.astro` | Rasm + caption, bir xil o'lcham, lazy load | `src`, `alt`, `izoh` |
| `Sinov.astro` | Savol + `<details>` da yashiringan javob | `savol` |
| `Amaliyot.astro` | Uy vazifasi bloki, vaqt va daraja ko'rsatilgan | `daqiqa`, `daraja` |
| `Bloknoma.astro` | Blok nomi + rangi (dars boshida) | `blok: 1..5` |

Starlight'ning tayyorlarini ham ishlat: `Aside`, `Card`, `CardGrid`, `Steps`, `Tabs`, `Code`.

### 2.3 Progress tizimi (zamonaviy avlod uchun)
Login yo'q, lekin o'quvchi o'sishini ko'rishi kerak.

- `src/components/DarsTugadi.astro` — dars oxirida "Darsni tugatdim" tugmasi → `localStorage`
- `src/components/ModulProgress.astro` — modul `index.mdx` da: 20 dars, nechtasi bajarilgan, progress bar
- **Streak** — ketma-ket kunlar hisobi, modul sahifasida ko'rinadi
- **Nishonlar (badge)** — har blok tugaganda ochiladi: `Bit Ustasi`, `Darvoza Muhandisi`, `CPU Quruvchi`, `Tizim Boshqaruvchi`, `Tarmoq Tadqiqotchi`
- Har interaktiv topshiriq bajarilganda kichik nishon
- `Progressni tozalash` tugmasi bo'lsin (sinf kompyuterida keyingi o'quvchi uchun)
- **Muhim:** progress hech qachon kontentni bloklamasin. O'quvchi 15-darsga to'g'ridan-to'g'ri kira olsin.

### 2.4 Interaktiv komponentlar arxitekturasi
- Har simulyator — alohida `.astro`/vanilla JS island, `client:visible` bilan
- **Kutubxona qo'shmа** (React, D3 kerak emas). Vanilla JS + SVG kifoya. Bundle kichik qolsin
- Har komponent to'liq mustaqil: bir dars ochilganda faqat o'sha JS yuklanadi
- Har simulyatorda: `Qayta boshlash` tugmasi + 1 qatorli "nima qilish kerak" ko'rsatmasi
- JS o'chirilgan bo'lsa: statik fallback matn ko'rinadi (progressive enhancement)

---

## 3. FAZA 3 — Dars shabloni va qoidalar

### 3.1 `_TEMPLATE.mdx` yarat

```mdx
---
title: "N-dars: Mavzu nomi"
description: "Bir gapda dars mazmuni (SEO uchun, 120 belgi)"
sidebar:
  label: "N-dars"
  order: N
blok: N
davomiylik: 45
---

import { Maqsad, Muhim, Atama, Sinov, Amaliyot, Bloknoma, DarsTugadi } from '@components';
import { Aside, CardGrid, Card, Steps } from '@astrojs/starlight/components';

<Bloknoma blok={N} />

## Nega bu muhim
<!-- 2–3 gap. Real hayotdan ilgak. "Telefoningiz..." bilan boshlanadi -->

<Maqsad>
- ...
- ...
- ...
</Maqsad>

## Nazariya
<!-- 3–5 kichik bo'lim. Har biri max 150 so'z. -->

## Sinab ko'r
<!-- INTERAKTIV SIMULYATOR SHU YERDA -->

## Xulosa
<!-- 3–5 punkt, qisqa -->

## O'zingizni sinang
<Sinov savol="...">Javob</Sinov>

<Amaliyot daqiqa={20} daraja="o'rta">
...
</Amaliyot>

<DarsTugadi dars="N" />
```

### 3.2 `AGENTS.md` ga yozilishi shart bo'lgan qoidalar

```
DARS YOZISH QOIDALARI — buzilmaydi

1. Fayl: src/content/docs/computer-fundamentals/lesson-NN.mdx (NN = 01..20)
2. H1 (#) YOZILMAYDI — Starlight title dan o'zi chiqaradi
3. Frontmatter title har doim qo'shtirnoqda
4. sidebar.label = "N-dars", sidebar.order = N
5. Bo'lim tartibi TEMPLATE bilan bir xil, o'zgartirilmaydi
6. Bo'limlar ## (h2), ichidagilar ### (h3). h4 dan pastga tushilmaydi
7. Rasm: src/assets/computer-fundamentals/NN-nom.png, <Rasm> orqali, alt majburiy
8. Matn uslubi: normal paragraf. Har gapni alohida qatorga yozish TAQIQLANADI
9. Paragraf max 3 gap. Bo'lim max 150 so'z. Uzun bo'lsa — ikkiga bo'l
10. Til: siz-sizlash, jonli, lekin bolalarcha emas. Emoji faqat komponent ichida
11. Har darsda: 1 interaktiv + min 5 <Sinov> + 1 <Amaliyot>
12. Ingliz atama birinchi uchraganda <Atama> orqali beriladi
13. Yangi dars qo'shilganda astro.config.mjs sidebar ham yangilanadi
14. Har o'zgarishdan keyin: npm run build
```

---

## 4. FAZA 4 — 20 dars + interaktivlar

Har dars uchun: `.mdx` fayl (to'liq nazariya matni bilan) + interaktiv komponent.
**Blok-blok ishla.** Har blok oxirida to'xtab, ko'rsat, tasdiq ol.

### BLOK 1 — Hamma narsa bit

| # | Dars | Katta g'oya | Interaktiv komponent | Amaliyot |
|---|---|---|---|---|
| 01 | Kompyuter nima? | Universal mashina; abstraksiya | `AlgoritmMashinasi` — qadamlarni drag-and-drop tartiblab robotga sandvich yasatish. Xato tartib → kulgili natija | Kunlik ishni 10 qadamli algoritm qilib yozish |
| 02 | Bit va ikkilik sanoq | 2 holat yetarli; 2↔10↔16 | `BitLampalar` — 8 ta lampani bosib yoqish, o'nlik son real vaqtda o'zgaradi. + `BinaryBlitz` 60 soniyalik o'yin, rekord `localStorage` da | 10 sonni qo'lda ikkilikka; barmoqda 31 gacha sanash |
| 03 | Sonlarning chegarasi | To'ldiruvchi kod, overflow, kasr son | `OverflowSimulyator` — 8-bitli hisoblagich 255 dan keyin 0 ga tushishi animatsiyada. Slider bilan to'ldiruvchi kod. `0.1+0.2` bit-bit ochiladi | Konsolda 5 ta "buzuq" hisob topib, nega shundayligini yozish |
| 04 | Matn, rasm, ovoz | Hammasi son; Unicode, RGB, diskretlash | `BaytKuzatuvchi` — o'zbekcha matn yozasiz, har harfning baytlari ko'rinadi (`ʻ` va `o'` nega 2 bayt). `PikselChizgich` 8×8 rasm chizib RGB sonlarini ko'rish. `TovushDiskret` slider | Ismini hex'da yozish; PNG ni hexed.it da ochib sarlavhasini topish |

### BLOK 2 — Mantiqdan apparatga

| # | Dars | Katta g'oya | Interaktiv komponent | Amaliyot |
|---|---|---|---|---|
| 05 | Mantiq va Bul algebrasi | AND/OR/NOT, haqiqat jadvali | `HaqiqatJadvali` — o'quvchi jadvalni to'ldiradi, darhol tekshiriladi. `MantiqQulf` — 3 shartli eshikni ochish jumboqlari | 5 mantiqiy ifoda jadvalini tuzish |
| 06 | Tranzistordan darvozaga | Elektrdan mantiq; NAND universal | `NANDQurilma` — faqat NAND'dan NOT, AND, OR, XOR yasash. SVG sxema, simni ulash, real vaqtda tekshiruv. + nandgame.com havolasi | nandgame 1–5 darajani tugatish, skrinshot |
| 07 | Arifmetikani qurish | Yarim → to'liq summator → ALU | `SummatorQuruvchi` — yarim summatordan boshlab 4-bitli qo'shuvchigacha yig'ish. Carry biti animatsiyada oqadi | 4-bitli qo'shuvchini tugatish; 7+9 ni bit-bit qo'lda hisoblash |
| 08 | Xotirani qurish | Flip-flop → registr → RAM; takt | `FlipFlopSimulyator` — takt tugmasini bosasiz, bit saqlanadi. `RegistrYozish` — manzil tanlab yozish/o'qish | Logisim'da 4-bitli registr; "nega takt kerak" savoliga javob |

### BLOK 3 — Protsessor

| # | Dars | Katta g'oya | Interaktiv komponent | Amaliyot |
|---|---|---|---|---|
| 09 | Fon Neyman arxitekturasi | CPU+xotira+I/O; olish–dekodlash–bajarish | `SiklAnimatsiya` — qadam-qadam bosib siklni aylantirish, har qadamda qaysi sim yonayotgani ko'rinadi | Siklni o'z so'zi bilan 5 qadamda yozish |
| 10 | Mashina kodi va assembler | Buyruq ham shunchaki bit | `MiniAssembler` — LMC uslubidagi to'liq simulyator: kod yozasiz, `Qadam` bosib registr va xotira o'zgarishini kuzatasiz. Xato bo'lsa aniq xabar | 2 sonni qo'shish, kattasini topish, 1..10 yig'indisi |
| 11 | **CAPSTONE: o'z protsessoringiz** | Hamma qism birlashadi | `CPUYigish` — ALU + registr + boshqaruvni ulash. Test to'plami avtomatik tekshiradi. Tugatganda `CPU Quruvchi` nishoni | nandgame CPU ni tugatish + 1 betlik "qanday ishlaydi" tushuntirish |
| 12 | Abstraksiya minorasi | Yuqori til → assembler → bit | `UchDaraja` — bitta programma 3 darajada yonma-yon. Python qatorini bossangiz mos assembler va bitlar yonadi | Bitta masalani 3 darajada yozib, farqni tushuntirish |

### BLOK 4 — Xotira, OS, fayl

| # | Dars | Katta g'oya | Interaktiv komponent | Amaliyot |
|---|---|---|---|---|
| 13 | Xotira ierarxiyasi | Tezlik ↔ narx savdosi | `TezlikInsonMiqyosi` — registr = 1 soniya bo'lsa, kesh = 10s, RAM = 6 daqiqa, SSD = 2 kun, HDD = 2 hafta. Animatsiyali taqqoslash | Eski kompyuterni ochib qismlarni topish, rasm + izoh |
| 14 | Fayl tizimi | Kengaytma yolg'on gapiradi | `MagicBaytKuzatuvchi` — faylni brauzerga tashlaysiz, birinchi baytlari o'qiladi va haqiqiy turi aniqlanadi (fayl serverga ketmaydi) | `.jpg` ni `.txt` ga aylantirib, hex'da haqiqatni topish |
| 15 | Operatsion tizim | Jarayon, rejalashtirish, virtual xotira | `RejalashtiruvchiSimulyator` — 4 jarayon, round-robin, vaqt bo'laklari animatsiyada. Slider bilan kvant o'zgartirish | `htop`/Task Manager tahlili: 5 jarayonni aniqlash |
| 16 | Terminal | Fayllar, pipe, avtomatlashtirish | `TerminalMashq` — brauzerdagi soxta terminal, 20 topshiriq. Har biri tekshiriladi, `Terminal Ustasi` nishoni | Haqiqiy terminalda 20 buyruqni bajarish |

### BLOK 5 — Tarmoq, xavfsizlik, chegaralar

| # | Dars | Katta g'oya | Interaktiv komponent | Amaliyot |
|---|---|---|---|---|
| 17 | Tarmoq asoslari | Paket, IP, router, DNS | `PaketYoli` — paketni Samarqanddan serverga yetkazish o'yini. Router tanlaysiz, sim uzilsa paket boshqa yo'l topadi | `ping`, `traceroute`, `nslookup` natijalarini izohlash |
| 18 | Internet va Web | Klient–server, HTTP | `SorovQuruvchi` — HTTP so'rovni qo'lda yig'ish, javob ko'rish. Sarlavhalar izohlanadi | DevTools → Network: 1 sahifada nechta so'rov ketganini hisoblash |
| 19 | Xavfsizlik va shifrlash | Hash, parol, ochiq kalit | `HashMaydoni` — matn yozasiz, SHA-256 real vaqtda. 1 harf o'zgarsa hash butunlay boshqa. `ParolBuzishVaqti` — parol kuchi qancha vaqtda buzilishini hisoblaydi | 3 parolni taqqoslash; "12345678" nega yomon — hisob bilan |
| 20 | Hisoblashning chegaralari | Samaradorlik, Mur qonuni, hal qilinmas masalalar | `AlgoritmPoygasi` — 2 algoritm yonma-yon ishlaydi, vaqt sanaladi, farq ko'rinadi. `ToxtashMuammosi` — nega yozib bo'lmaydi, interaktiv isbot | 2 algoritm vaqtini o'lchash + yakuniy imtihon |

---

## 5. FAZA 5 — Baholash (A varianti)

- Har darsda `<Sinov>` — 5 savol, javob yashirin (`<details>`, JS yo'q)
- Har blok oxirida `blok-N-test.mdx` — 15 savolli o'z-o'zini tekshirish, `<Sinov>` bilan
- O'qituvchi uchun `docs/oqituvchi/` — sidebar'da ko'rinmaydi (`sidebar.hidden: true`):
  - har dars uchun 45 daqiqalik dars rejasi
  - amaliyot javoblari
  - Google Forms uchun tayyor test matnlari (`.md` da, copy-paste qilinadigan)
- Yakuniy: nandgame CPU topshirish + 30 savolli test

---

## 6. Bajarilgan deb hisoblanish sharti

Har faza oxirida tekshir:

```bash
npm run build          # xato yo'q, ogohlantirish yo'q
npm run preview        # qo'lda tekshirish
```

- [ ] `build` toza o'tadi
- [ ] Har 20 dars sidebar'da to'g'ri tartibda
- [ ] Bitta ham 404 havola yo'q (ichki havolalarni skanerla)
- [ ] Har dars 360px kenglikda gorizontal scroll'siz ochiladi
- [ ] Dark va light — ikkisida ham hamma komponent o'qiladi
- [ ] Har interaktiv klaviatura bilan boshqarilaadi (Tab + Enter/Space)
- [ ] Interfeys matni o'zbekcha ("Bu sahifada", "Qidirish", "Keyingi")
- [ ] Har dars sahifasi 300KB dan kichik (JS islands `client:visible`)
- [ ] Progress `localStorage` da saqlanadi, tozalash tugmasi ishlaydi

---

## 7. Ish tartibi — qat'iy

1. **PLAN** — hech narsa yozmasdan, nima qilishini punkt-punkt yozib, tasdiq so'ra
2. FAZA 1 (tuzatishlar) → `npm run build` → ko'rsat → tasdiq
3. FAZA 2 (dizayn tizimi + komponentlar) → 1 ta namunali dars bilan ko'rsat → tasdiq
4. FAZA 3 (TEMPLATE + AGENTS.md) → tasdiq
5. FAZA 4 — **blok-blok**. Har blokdan keyin to'xta, ko'rsat, tasdiq ol. 20 darsni bir yo'la yozmа
6. FAZA 5 (baholash + o'qituvchi materiallari)

**Har fazadan keyin alohida commit.** Commit xabarlari o'zbekcha, imperativ:
`1-4 darslar qo'shildi`, `BitLampalar komponenti`, `build xatosi tuzatildi`

### Yozilmasligi kerak
- Programmalash sintaksisi → `python-basic` moduli ishi
- Saralash/murakkablik tahlili → `algorithms` moduli
- HTML/CSS → `web-development`
- Git buyruqlari → `git-github`
- Neyron tarmoq → `ai-fundamentals`

Takrorlanish bo'lmasin. Kerak bo'lsa faqat havola ber.

---

## 8. Ogohlantirish

**Blok 2–3 eng og'iri.** 6, 7 va 11-darslarni ikki soatlik qilishga tayyor bo'l.
`NANDQurilma` va `CPUYigish` komponentlari eng ko'p vaqt oladi — ularni oxirига qoldirmа,
blok boshida qil va sinab ko'r. Bolalar bu yerda tiqilib qolishi normal,
aynan shu joyda haqiqiy tushunish tug'iladi.
