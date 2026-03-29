const fs = require('fs');
const path = require('path');

const SOURCE_DIR = '/path/to/your/folder';
const OUTPUT_DIR = path.join(__dirname, '../images');

const IMAGE_FOLDER_NAMES = {
  extracted_data1: 'images',
  extracted_data2: 'images',
  extracted_data3: null,
  extracted_data4: 'images',
  extracted_data5: 'images',
  extracted_data6: 'images',
  extracted_data7: 'images',
  extracted_data8: 'images',
  extracted_data9: 'images',
  extracted_data10: 'images'
};

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

let totalCopied = 0;

for (let i = 1; i <= 10; i++) {
  const folderName = `extracted_data${i}`;
  const imageFolderName = IMAGE_FOLDER_NAMES[folderName];

  if (!imageFolderName) {
    console.log(`⏭️  ${folderName}: no images, skipping`);
    continue;
  }

  const imageFolderPath = path.join(SOURCE_DIR, folderName, imageFolderName);

  if (!fs.existsSync(imageFolderPath)) {
    console.log(`⏭️  ${folderName}: image folder not found, skipping`);
    continue;
  }

  const files = fs.readdirSync(imageFolderPath).filter(f =>
    f.match(/\.(jpg|jpeg|png|gif)$/i)
  );

  for (const file of files) {
    const newName = `data${i}_${file}`;
    const src = path.join(imageFolderPath, file);
    const dest = path.join(OUTPUT_DIR, newName);
    fs.copyFileSync(src, dest);
    totalCopied++;
  }

  console.log(`✅ ${folderName}: ${files.length} images copied`);
}

console.log(`\n✅ Total images consolidated: ${totalCopied}`);
console.log(`✅ Saved to: ${OUTPUT_DIR}`);