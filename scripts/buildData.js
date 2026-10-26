import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const rawDir = path.join(process.cwd(), 'raw_data');
const outputDir = path.join(process.cwd(), 'src', 'data');
const outputFile = path.join(outputDir, 'provincesData.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const provincesMap = new Map();

function normalizeName(name) {
  return String(name)
    .trim()
    .toUpperCase()
    .replace('KEP.', 'KEPULAUAN')
    .replace('DKI ', 'DKI ')
    .replace('DI ', 'DI ');
}

// Ekstraksi Data dari File Excel (5 Indikator Fasilitas & Guru)
const excelFiles = [
  { file: 'komputer.xlsx', key: 'komputer' },
  { file: 'internet.xlsx', key: 'internet' },
  { file: 'listrik.xlsx', key: 'listrik' },
  { file: 'air_minum.xlsx', key: 'air_minum' },
  { file: 'guru.xlsx', key: 'guru_d4s1' }
];

excelFiles.forEach(({ file, key }) => {
  const filePath = path.join(rawDir, file);
  if (!fs.existsSync(filePath)) return;

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Data 38 provinsi berada pada baris indeks 4 sampai 41
  for (let i = 4; i <= 41; i++) {
    const row = rows[i];
    if (!row || !row[3]) continue;

    const codeKemdagri = String(row[1]).trim();
    const codeBps = String(row[2]).trim();
    const provName = String(row[3]).trim();
    const normKey = normalizeName(provName);

    if (!provincesMap.has(normKey)) {
      provincesMap.set(normKey, {
        code_kemdagri: codeKemdagri,
        code_bps: codeBps,
        name: provName,
        indicators: {}
      });
    }

    const prov = provincesMap.get(normKey);
    prov.indicators[key] = {
      total: Number(parseFloat(row[6] || 0).toFixed(2)),
      negeri: Number(parseFloat(row[4] || 0).toFixed(2)),
      swasta: Number(parseFloat(row[5] || 0).toFixed(2))
    };
  }
});

// Ekstraksi Data IPM (CSV)
const ipmPath = path.join(rawDir, 'ipm.csv');
if (fs.existsSync(ipmPath)) {
  const workbook = XLSX.readFile(ipmPath);
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  rows.forEach((row) => {
    const provName = row['Provinsi'];
    const val = row['Indeks Pembangunan Manusia'];
    if (!provName || provName === 'Indonesia') return;

    const normKey = normalizeName(provName);
    if (provincesMap.has(normKey)) {
      provincesMap.get(normKey).indicators.ipm = {
        total: Number(parseFloat(val || 0).toFixed(2))
      };
    }
  });
}

// Ekstraksi Data APS 13-15 Tahun (CSV)
const apsPath = path.join(rawDir, 'aps.csv');
if (fs.existsSync(apsPath)) {
  const workbook = XLSX.readFile(apsPath);
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
  for (let i = 4; i <= 41; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;

    const provName = String(row[0]).trim();
    const apsVal = row[2]; // Kolom 13-15 Tahun
    const normKey = normalizeName(provName);

    if (provincesMap.has(normKey)) {
      provincesMap.get(normKey).indicators.aps_13_15 = {
        total: Number(parseFloat(apsVal || 0).toFixed(2))
      };
    }
  }
}

const result = Array.from(provincesMap.values());
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
console.log(`Pengolahan selesai. ${result.length} data provinsi disimpan di: ${outputFile}`);