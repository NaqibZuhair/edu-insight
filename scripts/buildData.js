import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const rawDir = path.join(process.cwd(), 'raw_data');
const outputDir = path.join(process.cwd(), 'src', 'data');
const outputFile = path.join(outputDir, 'provincesData.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Map penampung data provinsi
const provincesMap = new Map();

function parseFile(fileName, indicatorKey) {
  const filePath = path.join(rawDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: File ${fileName} tidak ditemukan di raw_data.`);
    return;
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  rawData.forEach((row) => {
    // Penyesuaian nama kolom sesuai struktur header file SDI/BPS
    const provName = row['Provinsi'] || row['Nama Provinsi'] || row['PROVINSI'];
    const provCode = row['Kode'] || row['Kode Provinsi'] || String(row['No'] || '');

    if (!provName) return;

    const key = provName.trim();
    if (!provincesMap.has(key)) {
      provincesMap.set(key, {
        code: provCode,
        name: key,
        indicators: {}
      });
    }

    const item = provincesMap.get(key);
    item.indicators[indicatorKey] = {
      total: parseFloat(row['Total'] || row['2023'] || row['Persentase'] || 0),
      negeri: parseFloat(row['Negeri'] || 0),
      swasta: parseFloat(row['Swasta'] || 0)
    };
  });
}

// Eksekusi parsing file
parseFile('komputer.xlsx', 'komputer');
parseFile('internet.xlsx', 'internet');
parseFile('air_minum.xlsx', 'air_minum');
parseFile('listrik.xlsx', 'listrik');
parseFile('guru.xlsx', 'guru_d4s1');
parseFile('ipm.csv', 'ipm');
parseFile('aps.csv', 'aps');

const result = Array.from(provincesMap.values());
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
console.log(`Berhasil mengolah data. File disimpan di: ${outputFile}`);