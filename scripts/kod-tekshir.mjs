/**
 * Darslardagi Python kodlarini sintaksisga tekshiradi.
 *
 *   node scripts/kod-tekshir.mjs
 *
 * Nima qiladi: `.mdx` fayllardan `<Kod kod={...}>` va `<KodBashorat kod={...}>`
 * bloklarini ajratib, har birini `python -c compile(...)` orqali o'tkazadi.
 *
 * `<Xato>` komponentining `kod` bloklari ATAYLAB buzuq — ular tekshirilmaydi.
 * Shu sababli ajratish komponent nomiga qarab ishlaydi.
 */
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { glob } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ijro = promisify(execFile);

/** Tekshiriladigan komponentlar. `Xato` ataylab yo'q. */
const TEKSHIRILADI = ['Kod', 'KodBashorat'];

/**
 * Berilgan komponentning `kod={`...`}` bloklarini ajratadi.
 * Template literal ichida backtick bo'lmasligi darslik qoidasi —
 * shu sababli oddiy izlash yetarli.
 */
function koddarniAjrat(matn, komponent) {
	const natija = [];
	const re = new RegExp(`<${komponent}\\b`, 'g');
	let m;
	while ((m = re.exec(matn))) {
		const qism = matn.slice(m.index, matn.indexOf('/>', m.index) + 2);
		const kod = qism.match(/kod=\{`([\s\S]*?)`\}/);
		if (kod) {
			const qator = matn.slice(0, m.index).split('\n').length;
			natija.push({ qator, kod: kod[1] });
		}
	}
	return natija;
}

const papka = await mkdtemp(join(tmpdir(), 'kod-tekshir-'));
let jami = 0;
const xatolar = [];

for await (const fayl of glob('src/content/docs/**/*.mdx')) {
	const matn = await readFile(fayl, 'utf8');
	for (const komponent of TEKSHIRILADI) {
		for (const { qator, kod } of koddarniAjrat(matn, komponent)) {
			jami += 1;
			const vaqtli = join(papka, `k${jami}.py`);
			await writeFile(vaqtli, kod, 'utf8');
			try {
				await ijro('python', ['-m', 'py_compile', vaqtli]);
			} catch (e) {
				const xabar = String(e.stderr || e.message).trim().split('\n').pop();
				xatolar.push(`${fayl}:${qator} (<${komponent}>) — ${xabar}`);
			}
		}
	}
}

await rm(papka, { recursive: true, force: true });

console.log(`Tekshirildi: ${jami} kod bloki`);
if (xatolar.length > 0) {
	console.error(`\nSintaksis xatosi bor ${xatolar.length} blok:\n`);
	for (const x of xatolar) console.error('  ' + x);
	process.exit(1);
}
console.log('Sintaksis xatosi topilmadi.');
