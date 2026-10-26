/**
 * @file downloadGeoJson.js
 * @description Script utilitas untuk mengunduh, menstandarisasi properti, dan menggabungkan
 * 38 file batas wilayah provinsi Indonesia menjadi satu berkas GeoJSON FeatureCollection terpadu.
 *
 * Sumber data: Repositori publik batas administrasi 38 provinsi Indonesia.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROVINCES_DATA_PATH = path.resolve(__dirname, '../src/data/provincesData.json');
const PUBLIC_GEOJSON_PATH = path.resolve(__dirname, '../public/indonesia-38-provinces.geojson');
const SRC_GEOJSON_PATH = path.resolve(__dirname, '../src/data/indonesia-38-provinces.json');

const RAW_GITHUB_BASE = 'https://raw.githubusercontent.com/mashadinoor/Indonesia-Geojson-2026/main/Provinsi';

/**
 * Pemetaan nama berkas sumber ke nama standar pada provincesData.json.
 * Digunakan jika terdapat variasi penamaan resmi (seperti Daerah Istimewa Yogyakarta).
 */
const FILE_TO_PROVINCE_NAME = {
  'daerah istimewa yogyakarta': 'di yogyakarta',
};

async function main() {
  console.log('[INFO] Membaca dataset provinsi referensi dari provincesData.json...');
  const provincesData = JSON.parse(fs.readFileSync(PROVINCES_DATA_PATH, 'utf8'));
  console.log(`[INFO] Terbaca ${provincesData.length} data provinsi.`);

  console.log('[INFO] Mengambil daftar berkas provinsi dari repositori data spasial...');
  const listResponse = await fetch('https://api.github.com/repos/mashadinoor/Indonesia-Geojson-2026/contents/Provinsi');
  if (!listResponse.ok) {
    throw new Error(`Gagal mengambil daftar berkas: ${listResponse.status} ${listResponse.statusText}`);
  }
  const fileList = await listResponse.json();
  console.log(`[INFO] Terbaca ${fileList.length} entri berkas pada repositori sumber.`);

  const combinedFeatures = [];
  const matchedProvinceCodes = new Set();

  for (const item of fileList) {
    if (!item.name.endsWith('.json')) continue;

    const fileUrl = `${RAW_GITHUB_BASE}/${encodeURIComponent(item.name)}`;
    process.stdout.write(`[INFO] Mengunduh ${item.name}... `);

    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      console.log(`GAGAL (${fileResponse.status})`);
      continue;
    }

    const geoData = await fileResponse.json();
    console.log('OK');

    // Normalisasi nama berkas untuk pencocokan nama provinsi
    let normalizedName = item.name.replace('.json', '').replace(/_/g, ' ').toLowerCase().trim();
    if (FILE_TO_PROVINCE_NAME[normalizedName]) {
      normalizedName = FILE_TO_PROVINCE_NAME[normalizedName];
    }

    // Pencocokan eksak dengan nama provinsi di provincesData.json
    let matchedProvince = provincesData.find((prov) => prov.name.toLowerCase().trim() === normalizedName);

    // Fallback: pencocokan menggunakan properti internal jika nama belum terpetakan
    if (!matchedProvince && geoData.features?.[0]?.properties?.KODE_PROV) {
      const code = String(geoData.features[0].properties.KODE_PROV);
      matchedProvince = provincesData.find((prov) => String(prov.code_bps) === code || String(prov.code_kemdagri) === code);
    }

    if (!matchedProvince) {
      console.warn(`[WARN] Tidak ditemukan pencocokan untuk berkas: ${item.name}`);
    } else {
      matchedProvinceCodes.add(matchedProvince.code_bps);
    }

    // Standarisasi properti tiap feature agar konsisten dengan provincesData.json
    const features = geoData.features || [geoData];
    for (const feature of features) {
      feature.properties = {
        code_bps: matchedProvince ? matchedProvince.code_bps : feature.properties?.KODE_PROV,
        code_kemdagri: matchedProvince ? matchedProvince.code_kemdagri : undefined,
        name: matchedProvince ? matchedProvince.name : feature.properties?.PROVINSI,
        KODE_PROV: matchedProvince ? matchedProvince.code_bps : feature.properties?.KODE_PROV,
        PROVINSI: matchedProvince ? matchedProvince.name : feature.properties?.PROVINSI,
      };
      combinedFeatures.push(feature);
    }
  }

  const finalGeoJson = {
    type: 'FeatureCollection',
    metadata: {
      generatedAt: new Date().toISOString(),
      totalFeatures: combinedFeatures.length,
      matchedProvinces: matchedProvinceCodes.size,
      source: 'mashadinoor/Indonesia-Geojson-2026',
    },
    features: combinedFeatures,
  };

  console.log('\n[SUMMARY] Ringkasan Penggabungan:');
  console.log(`- Total Fitur: ${combinedFeatures.length}`);
  console.log(`- Provinsi Terpetakan: ${matchedProvinceCodes.size} / ${provincesData.length}`);

  if (matchedProvinceCodes.size !== 38) {
    const unmapped = provincesData.filter((p) => !matchedProvinceCodes.has(p.code_bps));
    console.error('[ERROR] Terdapat provinsi yang belum terpetakan:');
    unmapped.forEach((p) => console.error(`  - ${p.code_bps}: ${p.name}`));
    process.exit(1);
  }

  // Menyimpan file GeoJSON ke direktori public (untuk direct fetch Leaflet)
  fs.writeFileSync(PUBLIC_GEOJSON_PATH, JSON.stringify(finalGeoJson));
  console.log(`[SUCCESS] Berkas berhasil disimpan ke: ${PUBLIC_GEOJSON_PATH}`);

  // Menyimpan file GeoJSON ke direktori src/data (untuk direct import React)
  fs.writeFileSync(SRC_GEOJSON_PATH, JSON.stringify(finalGeoJson));
  console.log(`[SUCCESS] Berkas berhasil disimpan ke: ${SRC_GEOJSON_PATH}`);

  console.log('[SUCCESS] Proses penggabungan GeoJSON selesai dengan sukses.');
}

main().catch((error) => {
  console.error('[ERROR] Terjadi kegagalan proses:', error);
  process.exit(1);
});
