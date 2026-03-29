const fs = require('fs');
const path = require('path');

// ── CHANGE THIS VALUE TO THE PATH TO YOUR FOLDER ──────────────────────────────────────
const SOURCE_DIR = '/path/to/your/folder';
// ─────────────────────────────────────────────────────────────────────────────
const OUTPUT_FILE = path.join(__dirname, '../all_questions.json');

let allQuestions = [];
let globalId = 1;

for (let i = 1; i <= 10; i++) {
  const folderName = `extracted_data${i}`;
  const jsonPath = path.join(SOURCE_DIR, folderName, 'questions.json');

  if (!fs.existsSync(jsonPath)) {
    console.log(`Skipping ${folderName} - no questions.json found`);
    continue;
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const questions = JSON.parse(raw);

  const updated = questions.map(q => {
    const newImageUrl = q.image_url
      ? q.image_url.replace('/images/', `/images/data${i}_`)
      : null;

    return {
      ...q,
      id: globalId++,
      image_url: newImageUrl,
      source_folder: folderName
    };
  });

  allQuestions = allQuestions.concat(updated);
  console.log(`✅ ${folderName}: ${questions.length} questions loaded`);
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allQuestions, null, 2), 'utf-8');

console.log(`\n✅ Total questions merged: ${allQuestions.length}`);
console.log(`✅ Saved to: ${OUTPUT_FILE}`);