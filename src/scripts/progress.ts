/**
 * O'quvchi progressi — brauzerda, `localStorage` da.
 *
 * Bu loyihada login va ma'lumotlar bazasi yo'q (A varianti). Shu sababli
 * progress faqat shu brauzerda yashaydi. Bu ataylab shunday:
 *   - hech qanday shaxsiy ma'lumot yig'ilmaydi;
 *   - server kerak emas;
 *   - sinf kompyuterida "Progressni tozalash" bilan keyingi o'quvchiga topshiriladi.
 *
 * MUHIM: progress hech qachon kontentni bloklamaydi. U faqat o'sishni
 * ko'rsatuvchi ko'zgu, qulf emas.
 */

const KALIT = 'steam:progress:v1';

/** Progress o'zgarganda tarqatiladigan hodisa nomi (sahifadagi barcha
 *  komponentlar shunga quloq soladi va o'zini yangilaydi). */
export const HODISA = 'steam:progress';

export interface Progress {
	/** modul id -> tugatilgan dars raqamlari */
	darslar: Record<string, number[]>;
	/** ketma-ket kunlar hisobi */
	streak: {
		/** oxirgi faollik kuni, YYYY-MM-DD */
		oxirgiKun: string | null;
		kunlar: number;
		engUzun: number;
	};
	/** ochilgan nishon id'lari */
	nishonlar: string[];
}

/** Har chaqiruvda yangi bo'sh holat. Funksiya, chunki qaytgan obyekt
 *  keyin o'zgartiriladi — umumiy nusxa bo'lsa xato chiqadi.
 *  (`structuredClone` ishlatilmaydi: maktab kompyuterlarida eski
 *  brauzerlar bo'lishi mumkin.) */
function boshHolat(): Progress {
	return {
		darslar: {},
		streak: { oxirgiKun: null, kunlar: 0, engUzun: 0 },
		nishonlar: [],
	};
}

/* ------------------------------------------------------------------ */
/* Nishonlar                                                           */
/* ------------------------------------------------------------------ */

export interface Nishon {
	id: string;
	nom: string;
	izoh: string;
	blok: number;
	/** Shu darslar tugaganda ochiladi */
	darslar: number[];
}

/** Computer Fundamentals moduli nishonlari — har blok tugaganda bittasi ochiladi. */
export const NISHONLAR: Nishon[] = [
	{
		id: 'bit-ustasi',
		nom: 'Bit Ustasi',
		izoh: "Ma'lumotning eng kichik bo'lagini egalladingiz",
		blok: 1,
		darslar: [1, 2, 3, 4],
	},
	{
		id: 'darvoza-muhandisi',
		nom: 'Darvoza Muhandisi',
		izoh: "Tranzistordan mantiqiy darvoza qurdingiz",
		blok: 2,
		darslar: [5, 6, 7, 8],
	},
	{
		id: 'cpu-quruvchi',
		nom: 'CPU Quruvchi',
		izoh: "O'z protsessoringizni yig'ib ishlatdingiz",
		blok: 3,
		darslar: [9, 10, 11, 12],
	},
	{
		id: 'tizim-boshqaruvchi',
		nom: 'Tizim Boshqaruvchi',
		izoh: "Xotira, OS va fayl tizimini o'zlashtirdingiz",
		blok: 4,
		darslar: [13, 14, 15, 16],
	},
	{
		id: 'tarmoq-tadqiqotchi',
		nom: 'Tarmoq Tadqiqotchi',
		izoh: "Internet va xavfsizlik sirlarini ochdingiz",
		blok: 5,
		darslar: [17, 18, 19, 20],
	},
];

/* ------------------------------------------------------------------ */
/* O'qish / yozish                                                     */
/* ------------------------------------------------------------------ */

/** Sana YYYY-MM-DD ko'rinishida, mahalliy vaqt bo'yicha. */
function bugun(): string {
	const d = new Date();
	const oy = String(d.getMonth() + 1).padStart(2, '0');
	const kun = String(d.getDate()).padStart(2, '0');
	return `${d.getFullYear()}-${oy}-${kun}`;
}

/** Ikki sana orasidagi kun farqi. */
function kunFarqi(a: string, b: string): number {
	const ms = new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime();
	return Math.round(ms / 86_400_000);
}

/**
 * Saqlangan progressni o'qiydi.
 * localStorage o'chirilgan yoki ma'lumot buzilgan bo'lsa — bo'sh holat qaytadi,
 * hech qachon xato tashlamaydi.
 */
export function oqish(): Progress {
	if (typeof localStorage === 'undefined') return boshHolat();
	try {
		const xom = localStorage.getItem(KALIT);
		if (!xom) return boshHolat();
		const p = JSON.parse(xom) as Partial<Progress>;
		return {
			darslar: p.darslar ?? {},
			streak: {
				oxirgiKun: p.streak?.oxirgiKun ?? null,
				kunlar: p.streak?.kunlar ?? 0,
				engUzun: p.streak?.engUzun ?? 0,
			},
			nishonlar: p.nishonlar ?? [],
		};
	} catch {
		return boshHolat();
	}
}

function yozish(p: Progress): void {
	try {
		localStorage.setItem(KALIT, JSON.stringify(p));
	} catch {
		/* Xotira to'lgan yoki private rejim — progress shunchaki saqlanmaydi.
		   O'quvchi kontentni o'qishda davom etadi. */
	}
	document.dispatchEvent(new CustomEvent(HODISA, { detail: p }));
}

/* ------------------------------------------------------------------ */
/* Ommaviy API                                                         */
/* ------------------------------------------------------------------ */

export function tugatilganDarslar(modul: string): number[] {
	return oqish().darslar[modul] ?? [];
}

export function darsTugadimi(modul: string, dars: number): boolean {
	return tugatilganDarslar(modul).includes(dars);
}

/** Streak'ni bugungi faollik bo'yicha yangilaydi (o'zgartirilgan holatni qaytaradi). */
function streakYangila(p: Progress): Progress {
	const kun = bugun();
	const oxirgi = p.streak.oxirgiKun;

	if (oxirgi === kun) return p; // bugun allaqachon hisoblangan

	if (oxirgi && kunFarqi(oxirgi, kun) === 1) {
		p.streak.kunlar += 1; // ketma-ket kun
	} else {
		p.streak.kunlar = 1; // uzilish bo'lgan yoki birinchi kun
	}
	p.streak.oxirgiKun = kun;
	p.streak.engUzun = Math.max(p.streak.engUzun, p.streak.kunlar);
	return p;
}

/** Tugatilgan darslarga qarab yangi ochilgan nishonlarni qo'shadi. */
function nishonlarYangila(p: Progress, modul: string): string[] {
	if (modul !== 'computer-fundamentals') return [];
	const tugatilgan = new Set(p.darslar[modul] ?? []);
	const yangi: string[] = [];
	for (const n of NISHONLAR) {
		const ochildi = n.darslar.every((d) => tugatilgan.has(d));
		if (ochildi && !p.nishonlar.includes(n.id)) {
			p.nishonlar.push(n.id);
			yangi.push(n.id);
		}
	}
	return yangi;
}

/**
 * Darsni tugatilgan/tugatilmagan deb belgilaydi.
 * @returns shu amal natijasida ochilgan yangi nishonlar
 */
export function darsBelgila(modul: string, dars: number, tugadi: boolean): Nishon[] {
	const p = oqish();
	const ro = new Set(p.darslar[modul] ?? []);

	if (tugadi) ro.add(dars);
	else ro.delete(dars);

	p.darslar[modul] = [...ro].sort((a, b) => a - b);

	let yangi: string[] = [];
	if (tugadi) {
		streakYangila(p);
		yangi = nishonlarYangila(p, modul);
	}

	yozish(p);
	return NISHONLAR.filter((n) => yangi.includes(n.id));
}

/** Kichik nishon: interaktiv topshiriq bajarilganda chaqiriladi. */
export function amalBelgila(id: string): void {
	const p = oqish();
	if (!p.nishonlar.includes(id)) {
		p.nishonlar.push(id);
		streakYangila(p);
		yozish(p);
	}
}

export function nishonOchilganmi(id: string): boolean {
	return oqish().nishonlar.includes(id);
}

export function streak(): Progress['streak'] {
	const p = oqish();
	// Streak "eskirgan" bo'lsa (kecha ham, bugun ham faollik yo'q) — 0 ko'rsatamiz,
	// lekin saqlangan qiymatga tegmaymiz.
	const oxirgi = p.streak.oxirgiKun;
	if (!oxirgi) return p.streak;
	const farq = kunFarqi(oxirgi, bugun());
	if (farq > 1) return { ...p.streak, kunlar: 0 };
	return p.streak;
}

/** Butun progressni o'chiradi — sinf kompyuterida keyingi o'quvchi uchun. */
export function tozala(): void {
	try {
		localStorage.removeItem(KALIT);
	} catch {
		/* jim */
	}
	document.dispatchEvent(new CustomEvent(HODISA, { detail: boshHolat() }));
}
