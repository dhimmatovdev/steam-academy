# VAZIFA: Python Basic darsligini qurish

> Claude Code uchun. Loyiha ildiziga `VAZIFA.md` qilib qo'y va bering.
> **Avval PLAN, tasdiq, keyin kod.** Blok-blok ishlanadi.

---

## 0. Kontekst va allaqachon mavjud narsalar

- Loyiha: **STEAM Academy** (Astro + Starlight), `steam-academy-xi.vercel.app`
- Modul: `src/content/docs/python-basic/` — **20 dars + 1 sozlash darsi**
- Til: faqat o'zbekcha (lotin). Ingliz atamalar `<Atama>` orqali
- Auditoriya: **5–11-sinf** — bitta darslik, uch chuqurlik (pastda)
- Variant A: LMS yo'q, progress `localStorage`

### Qayta yozilmaydi — Computer Fundamentals modulidan olinadi
`Maqsad` · `Muhim` · `Atama` · `Rasm` · `Sinov` · `Amaliyot` · `Bloknoma` · `Simulyator` · `DarsTugadi` · `ModulProgress` · `progress.ts` · `_TEMPLATE.mdx` · `AGENTS.md` · blok ranglari · `i18n/uz.json`

**Bu komponentlarni qaytadan yasamang.** Kerak bo'lsa `props` qo'shing, lekin CF darslarini buzmang — o'zgartirgandan keyin ikkala modulni ham tekshir.

### Bog'lanish — CF moduliga ilmoqlar
Python darslari CF da o'rganilgan narsaga tayanadi. Har ilmoqda havola bo'lsin:

| Python darsi | CF darsi | Nima olinadi |
|---|---|---|
| 2 (o'zgaruvchi = yorliq) | 8, 13 | registr, xotira manzili |
| 3 (turlar, `0.1+0.2`) | 3 | overflow, kasr son |
| 3 (satr, Unicode) | 4 | bayt, `o'` 2 bayt |
| 5 (`if`) | 5 | Bul mantiqi, haqiqat jadvali |
| 11 (lug'at) | 14, 19 | hash |
| 14 (chaqiruv steki) | 9 | CPU steki, fon Neyman |
| 17 (xato) | 15 | jarayon, xotira |
| 18 (fayl, CSV) | 14 | fayl tizimi, format |

---

## 1. Pedagogik yadro — buzilmaydi

### 1.1 Bashorat birinchi, ishga tushirish keyin
Har darsda kod ko'rsatilishidan oldin o'quvchi **natijani yozadi**. Keyin ishga tushiradi.
Bashorat bilan natija farq qilgan joy — aynan o'rganish sodir bo'ladigan joy.

Shu sababli har darsda `<KodBashorat>` bloki majburiy. Bu darslikning asosiy o'quv mexanizmi.

### 1.2 Xayoliy mashina (notional machine)
Maqsad — o'quvchi boshida **kompyuterning ishlash modeli** qurilishi. "Bu kod ishlaydi" emas,
"bu kod nega ishlaydi va xotirada nima bo'ladi". Shuning uchun 2, 9, 14-darslarda xotira
tasviri majburiy.

### 1.3 AI qoidasi
- **1–19-darslar:** AI'dan kod so'rash taqiqlanadi. Har darsda kichik eslatma bloki.
- **20-dars:** AI'ni **tekshiruvchi** sifatida ishlatish o'rgatiladi. Buzuq AI kodini topish.
- Sabab darslikda ochiq yozilsin: yechimni ko'rgan o'quvchi model qurmaydi. Model qurmagan
  o'quvchi 3 oydan keyin AI'siz hech narsa yoza olmaydi.

### 1.4 Uch qatlamli topshiriq
Har darsda `<Qatlam>` komponenti — 3 ta tab:

| Qatlam | Sinf | Uslub |
|---|---|---|
| `Asos` | 5–7 | vizual, `turtle`, kichik son, aniq ko'rsatma |
| `Mustahkam` | 8–9 | matnli masala, o'zi tuzadi |
| `Chuqur` | 10–11 | algoritmik, chegara holatlari, samaradorlik savoli |

Dars matni bitta — **topshiriq uch xil**. O'qituvchi sinfga qarab tanlaydi.

### 1.5 "Hayotda nima uchun kerak"
Har darsning **birinchi bloki** — `<Hayotda>`. Mavhum emas, aniq va mahalliy:
do'kon hisobi, sinf jurnali, transport, oylik xarajat, olimpiada natijasi.
"Programmalash muhim" degan gap **yozilmaydi** — misol o'zi ko'rsatadi.

---

## 2. FAZA 1 — Yangi komponentlar

### 2.1 Kontent komponentlari (`src/components/`)

| Komponent | Vazifasi | Props |
|---|---|---|
| `Hayotda.astro` | Dars boshidagi real hayot misoli | `soha` |
| `Qatlam.astro` | 3 tabli topshiriq (Asos / Mustahkam / Chuqur) | slotlar: `asos`, `mustahkam`, `chuqur` |
| `Kod.astro` | Python kod bloki: qator raqami, nusxalash tugmasi, ixtiyoriy izoh ustunlari | `sarlavha`, `qatorlar` |
| `KodBashorat.astro` | Kod + "Natijani yozing" maydoni + "Tekshirish" → to'g'ri natija va izoh | `kod`, `javob`, `izoh` |
| `Xato.astro` | Ataylab buzuq kod + traceback + tuzatish | `kod`, `traceback`, `sabab` |
| `AIOgoh.astro` | Qisqa eslatma: bu darsda AI'dan kod so'ralmaydi | — |
| `Muhit.astro` | Sozlash qadami: buyruq/tugma + skrinshot joyi + "ishlaganini qanday bilaman" | `qadam`, `tizim` |

### 2.2 Simulyatorlar — muhim qaror
**Pyodide ishlatilmaydi.** ~6 MB yuklaydi, sinf internetida sekin, oflaynda ishlamaydi.
Barcha simulyatorlar — **qo'lda yozilgan qadamli treylar**: har simulyator o'z kodining
har qadamidagi holatini oldindan belgilangan massivdan o'qiydi.

Afzalligi: yengil, oflayn ishlaydi, va **aynan kerakli xatoni ko'rsata oladi**.
Haqiqiy Python o'quvchining kompyuterida, VS Code'da ishlaydi.

Har simulyator: vanilla JS + SVG, `client:visible`, `Qayta boshlash` tugmasi,
klaviatura bilan boshqariladi (`←` `→` qadam), JS o'chsa statik jadval ko'rinadi.

### 2.3 Sozlash sahifasi uchun alohida
`docs/python-basic/muhit-sozlash.mdx` — 1-darsdan oldin turadi, `sidebar.order: 0`.

---

## 3. FAZA 2 — 0-dars: VS Code muhitini sozlash

Bu **eng ko'p muammo chiqadigan dars**. Bir marta to'g'ri yozilsa, o'qituvchi yillar
davomida ishlatadi. Batafsil yozilsin.

### Tuzilma
1. **Nega VS Code** — bir necha faylli loyiha, debugger, terminal bir joyda. Blaknot emas.
2. **Python o'rnatish** — `python.org` dan. Windows'da `Add Python to PATH` katagi
   **majburiy belgilanadi** (eng ko'p uchraydigan xato aynan shu).
3. **VS Code o'rnatish**
4. **Python kengaytmasi** (Microsoft) — o'rnatish
5. **Papka bilan ishlash** — `File → Open Folder`. Alohida fayl emas, **papka** ochiladi.
   Papka nomi: lotin harflari, bo'shliqsiz (`dars-01`, `python_mashqlar`)
6. **Interpretator tanlash** — `Ctrl+Shift+P` → `Python: Select Interpreter`
7. **Birinchi programma** — `salom.py`, `Run` tugmasi, terminal natijasi
8. **Terminal** — `Ctrl+``, `python salom.py` qo'lda ishga tushirish
9. **Debugger** — `F5`, breakpoint (qator raqami yonini bosish), `Variables` paneli,
   `Step Over` (F10). **Bu 17-darsda qayta ishlatiladi**
10. **Fayl nomlash qoidalari** — kirill yo'q, bo'shliq yo'q, `.py` kengaytmasi,
    `input.py` yoki `random.py` deb nomlanmaydi (kutubxona nomini bosib qoladi)

### O'qituvchi uchun muammolar jadvali — majburiy
Bu jadval `docs/oqituvchi/muhit-muammolar.mdx` da bo'lsin:

| Belgi | Sabab | Yechim |
|---|---|---|
| `python` buyrug'i topilmadi | PATH ga qo'shilmagan | Qayta o'rnatish, `Add to PATH` belgilash. Yoki `py` sinash |
| Microsoft Store oynasi ochiladi | Windows'ning bo'sh `python` yorlig'i | `python.org` versiyasini o'rnatish, App Execution Aliases ni o'chirish |
| `Run` tugmasi yo'q | Python kengaytmasi o'rnatilmagan | Kengaytmani o'rnatish, VS Code'ni qayta ochish |
| Kod ishlaydi, lekin import xato | Interpretator boshqa | `Select Interpreter` bilan to'g'risini tanlash |
| Sinfda internet sekin | Kengaytma yuklanmaydi | **Oldindan `.vsix` fayl yuklab olib**, USB orqali `Install from VSIX` |
| Administrator huquqi yo'q | Maktab kompyuteri | Python'ni `Install for me only` bilan o'rnatish |
| Antivirus bloklaydi | — | IT bilan oldindan istisno qo'shish |
| `IndentationError` hammada | Tab va bo'shliq aralashgan | `settings.json`: `"editor.insertSpaces": true`, `"editor.tabSize": 4` |

### Maktab uchun tayyor `settings.json`
Fayl `docs/python-basic/fayllar/settings.json` sifatida beriladi:
otturlash, 4 bo'shliq, `Format on Save` o'chirilgan (boshlovchini chalg'itadi),
avtosave `afterDelay`, terminal shrifti kattaroq (proyektor uchun).

---

## 4. FAZA 3 — 20 dars

Har dars fayli: `lesson-NN.mdx`. Har birida majburiy tartib:
`<Hayotda>` → `<Maqsad>` → nazariya → `<KodBashorat>` → simulyator → `<Xato>` →
`<Sinov>` ×5 → `<Qatlam>` → `<AIOgoh>` → `<DarsTugadi>`

### BLOK 1 — Mashina buyruqni qanday tushunadi

| # | Mavzu | Tub mohiyat | Simulyator | Hayotda |
|---|---|---|---|---|
| 01 | Programma va interpretator | Kod — matn. Interpretator uni o'qib bajaradi. Kompyuter tushunmaydi, bajaradi | `RobotKarel` — panjarada robotga buyruq ketma-ketligi, sintaksissiz | Bankomat, lift, mikroto'lqinli pech — hammasi programma bajaradi |
| 02 | O'zgaruvchi — **yorliq**, quti emas | `a = b` qiymatni ko'chirmaydi, ikkinchi nomni bog'laydi. `id()` bilan isbot | `XotiraSurati` — har qatordan keyin nom → obyekt strelkalari | Do'kon narxi o'zgarganda 5 joyda tuzatish emas, bitta o'zgaruvchi |
| 03 | Turlar va ifodalar | `int`/`float`/`str`/`bool`. `"5"+5` xatosi. `//`, `%`. `0.1+0.2` (CF 3) | `IfodaBaholovchi` — ifodani qadam-qadam soddalashtirish | Pulni bo'lish: 7 kishiga 100 000 so'm — `//` va `%` aynan shu |
| 04 | Kirish va chiqish | **`input()` har doim satr qaytaradi.** Birinchi haqiqiy xato manbai | `BashoratQil` — 6 ta kod, natijani oldin yozasiz | Kalkulyator: foydalanuvchi 5 yozdi, lekin bu `"5"` |

### BLOK 2 — Qarorlar va takrorlash

| # | Mavzu | Tub mohiyat | Simulyator | Hayotda |
|---|---|---|---|---|
| 05 | `if` / `elif` / `else` | Shart — Bul ifoda (CF 5). `elif` **tartibi** natijani o'zgartiradi | `ShartDaraxti` — o'tilgan shox yoritiladi | Baho qo'yish: 90+ → 5, 70+ → 4. Tartib buzilsa hamma 5 oladi |
| 06 | `while` | Sikl 3 qismdan: boshlang'ich holat, shart, o'zgarish. Bittasi yo'q — cheksiz sikl | `SiklQadamlovchi` — har aylanishda o'zgaruvchilar jadvali | Parol so'rash: to'g'ri kiritilmaguncha takrorlanadi |
| 07 | `for` va `range` | **4 ta akkumulyator naqshi**: yig'indi, sanoq, maksimum, filtr. 80% masalani yechadi | `NaqshKutubxonasi` — 4 naqsh yonma-yon, qadamlanadi | 30 o'quvchi bahosining o'rtachasi va eng yuqorisi |
| 08 | Ichma-ich sikllar | Tashqi × ichki = ko'paytma. 100×100 = 10 000 qadam — tezlik hissi | `JadvalChizuvchi` — `turtle` naqshi + qadam hisoblagichi | Ko'paytirish jadvali, shaxmat taxtasi, koshin naqshi |

### BLOK 3 — Ma'lumotni saqlash

| # | Mavzu | Tub mohiyat | Simulyator | Hayotda |
|---|---|---|---|---|
| 09 | Ro'yxat va **o'zgaruvchanlik** | `b = a` — ikki nom bitta ro'yxatga. `b.append()` `a` ni ham o'zgartiradi. **Eng ko'p adashiladigan joy** | `AliasingKorsatuvchi` — ikki yorliq bitta obyektga | Sinf ro'yxatini "nusxa olib" tahrirlash — asl ro'yxat ham buziladi |
| 10 | Satr — **o'zgarmas** | `s[0]="A"` nega ishlamaydi. Slicing `s[a:b:c]`. Unicode (CF 4) | `SlicingMaydoni` — indekslarni surib natija ko'rish | Telefon raqamni formatlash, ism-familiyani ajratish |
| 11 | Lug'at va to'plam | Kalit orqali bir zumda topish. Nega tez — hash (CF 14, 19) | `HashQutisi` — kalit qaysi katakka tushdi | Sinf jurnali: ism → baho. Ro'yxatda qidirish 30 qadam, lug'atda 1 |
| 12 | Ichma-ich tuzilmalar | Real ma'lumotni modellash: `dict` ichida `list` ichida `dict` | `MalumotQuruvchi` — sinf jurnalini bosqichma-bosqich yig'ish | Maktab bazasi: sinf → o'quvchilar → fanlar → baholar |

### BLOK 4 — O'z buyruqlaringizni yasash

| # | Mavzu | Tub mohiyat | Simulyator | Hayotda |
|---|---|---|---|---|
| 13 | Funksiya | **`return` ≠ `print`.** Funksiya qiymat qaytaradi, ekranga yozmaydi. Bu farqni tushunmagan o'quvchi keyin qotib qoladi | `ReturnVsPrint` — ikki variant yonma-yon, natija farqi | Bir hisobni 10 joyda ishlatish: bir marta yozib, 10 marta chaqirish |
| 14 | Qamrov va chaqiruv steki | Har chaqiruv o'z xonasini oladi. Bu — CF 9 dagi CPU steki | `StekKuzatuvchi` — chaqiruvlar to'planadi va bo'shaydi | Nega funksiya ichidagi `x` tashqi `x` ni buzmaydi |
| 15 | Rekursiya | Bazaviy holat + kichikroq masala. Stek chuqurligi cheksiz emas | `RekursiyaDaraxti` — chaqiruvlar daraxti ochilib-yopiladi | Papka ichidagi papkalar, oila shajarasi |
| 16 | Modul va import | O'z faylini modul qilish. `import` aslida nima qiladi | `ImportYoli` — Python fayl qidiradigan joylar | Bitta yozgan funksiyani barcha loyihada ishlatish |

### BLOK 5 — Haqiqiy programma

| # | Mavzu | Tub mohiyat | Simulyator | Hayotda |
|---|---|---|---|---|
| 17 | Xatoni topish | Traceback **pastdan yuqoriga** o'qiladi. `try/except`. VS Code debugger (0-darsdan) | `TracebackOquvchi` — xato xabarining har qatori izohlanadi | Ishlamayotgan programmani 5 daqiqada tuzatish yoki 2 soat qarab o'tirish |
| 18 | Fayl va CSV | Ma'lumot programmadan uzoq yashaydi. `with open(...)` nega kerak | `CSVTahlilchi` — sinf natijalarini o'qib xulosa | Do'kon sotuvi, davomat, olimpiada natijalari — hammasi CSV |
| 19 | Testlash va toza kod | `assert`. Kod boshqa odam uchun yoziladi: nomlash, PEP 8 | `TestYozuvchi` — funksiyaga test yozib buzuq versiyani ushlash | Kodni 2 haftadan keyin o'zingiz o'qiy olasizmi? |
| 20 | **Capstone + AI'ni to'g'ri ishlatish** | AI kodini tekshirish. Ataylab buzuq javoblar beriladi | `AIKodTekshiruvi` — 5 ta AI kodi, 3 tasi buzuq: chegara holati, `is` vs `==`, o'zgaruvchan default | AI kodini tekshirmasdan topshirish — ishdan bo'shatilish sababi |

### Capstone loyihasi (20-dars)
Uch qatlamda bitta loyiha:
- **Asos:** `turtle` bilan o'z naqshi + foydalanuvchi kiritgan rang
- **Mustahkam:** CSV dan sinf baholarini o'qib hisobot chiqaruvchi programma
- **Chuqur:** yuqorisi + testlar + xato ushlash + funksiyalarga bo'lish + README

---

## 5. FAZA 4 — Baholash va o'qituvchi materiallari

- Har blok oxirida `blok-N-test.mdx` — 15 savol, `<Sinov>` bilan
- `docs/oqituvchi/` (`sidebar.hidden: true`):
  - 21 dars uchun 45 daqiqalik reja (0-dars 2 soat — sozlash uzoq ketadi)
  - `<Qatlam>` topshiriqlarining javoblari
  - `muhit-muammolar.mdx` (yuqoridagi jadval)
  - Google Forms uchun tayyor test matnlari
  - **`kutilgan-xatolar.mdx`** — har darsda o'quvchilar ko'p qiladigan xato va uni
    qanday tushuntirish. Masalan 4-darsda `input()` satr qaytarishi, 9-darsda aliasing

---

## 6. Bajarilgan deb hisoblanish sharti

```bash
npm run build      # 0 xato, 0 ogohlantirish
npm run preview
```

- [ ] 21 sahifa sidebar'da to'g'ri tartibda (`muhit-sozlash` birinchi)
- [ ] Har darsda `<Hayotda>`, `<KodBashorat>`, `<Qatlam>`, `<AIOgoh>` bor
- [ ] Bitta ham 404 yo'q, CF moduliga ilmoq havolalari ishlaydi
- [ ] 360px kenglikda gorizontal scroll yo'q (kod bloklari o'z ichida scroll qiladi)
- [ ] Dark va light — ikkisida ham kod bloklari o'qiladi
- [ ] Har simulyator klaviatura bilan (`←` `→` `Enter`) boshqariladi
- [ ] Har sahifa 300 KB dan kichik
- [ ] CF modulining darslari **buzilmagan** — ikkalasini ham tekshir
- [ ] Barcha Python kodlari sintaktik to'g'ri (skript bilan tekshir: har `<Kod>` blokini
      ajratib `python -m py_compile` orqali o'tkaz — buzuq kod faqat `<Xato>` da bo'ladi)

---

## 7. Ish tartibi

1. **PLAN** — yozmasdan oldin punkt-punkt reja, tasdiq so'ra
2. FAZA 1 (komponentlar) → 1 ta namunali dars bilan ko'rsat → tasdiq
3. FAZA 2 (0-dars: VS Code sozlash) → **to'liq ko'rsat** → tasdiq. Bu dars alohida muhim
4. FAZA 3 — **blok-blok**. Har blokdan keyin to'xta, ko'rsat, tasdiq ol
5. FAZA 4 (testlar + o'qituvchi materiallari)

Har fazadan keyin alohida commit, xabar o'zbekcha va imperativ:
`0-dars: VS Code sozlash qo'shildi`, `KodBashorat komponenti`, `Blok 2 darslari`

### Yozilmasligi kerak — boshqa modullar ishi
OOP, klasslar, `lambda`, comprehension, dekorator, `numpy`, `pandas` → `python-intermediate`
Saralash algoritmlari, murakkablik tahlili (Big-O) → `algorithms`
`git` buyruqlari → `git-github`
HTML/CSS → `web-development`

Takrorlanish bo'lmasin. Kerak bo'lsa faqat havola.

---

## 8. Ogohlantirish

**0-dars va 9-dars eng og'ir.**

0-darsda muammo texnik: 25 o'quvchining 25 xil kompyuteri bor. Muammolar jadvalini
to'liq yozing, aks holda o'qituvchi birinchi darsda 40 daqiqani PATH ni tuzatishga sarflaydi.

9-darsda muammo kontseptual: aliasing — boshlovchilar eng ko'p adashadigan joy.
`AliasingKorsatuvchi` simulyatorini shoshmasdan qiling, xotira strelkalari aniq ko'rinsin.
Bu yerda tushunmagan o'quvchi keyingi hamma darsda qoqiladi.
