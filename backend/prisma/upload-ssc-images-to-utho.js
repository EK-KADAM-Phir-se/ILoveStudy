const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const sscImgDir = path.join(__dirname, '../../frontend/public/ssc/images');

// Targets Utho Production API by default, or override via process.env.UPLOAD_API_URL
const API_URL = process.env.UPLOAD_API_URL || 'https://ilovestudy.in/api/upload/image';

if (!fs.existsSync(sscImgDir)) {
  console.error(`❌ Source directory not found: ${sscImgDir}`);
  process.exit(1);
}

const files = fs.readdirSync(sscImgDir).filter(f => f.endsWith('.svg') || f.endsWith('.png') || f.endsWith('.jpg'));
console.log(`📂 Found ${files.length} images in local public folder.`);
console.log(`🚀 Upload Target: ${API_URL}`);
console.log(`📁 Target Folder on Utho: QuestionBank/SSC Stenographer/2025/\n`);

function uploadSingleFile(file) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(sscImgDir, file);
    const content = fs.readFileSync(filePath);
    const base64Data = `data:image/svg+xml;base64,${content.toString('base64')}`;

    let year = "2025";
    if (file.includes("2024")) year = "2024";

    const payload = JSON.stringify({
      fileName: file,
      fileData: base64Data,
      subfolder: `SSC Stenographer/${year}`,
      overwrite: true
    });

    const urlObj = new URL(API_URL);
    const client = urlObj.protocol === 'https:' ? https : http;

    const req = client.request(urlObj, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const json = JSON.parse(body);
            resolve(json.url || json.message);
          } catch (e) {
            resolve(body);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function runUploads() {
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const resultUrl = await uploadSingleFile(file);
      successCount++;
      console.log(`[${i + 1}/${files.length}] ✅ Uploaded ${file}\n    ➜ ${resultUrl}`);
    } catch (err) {
      failCount++;
      console.error(`[${i + 1}/${files.length}] ❌ Failed ${file}: ${err.message}`);
    }
  }

  console.log(`\n==================================================`);
  console.log(`🎉 UPLOAD SUMMARY: ${successCount} successful, ${failCount} failed.`);
  console.log(`==================================================\n`);
}

runUploads();
