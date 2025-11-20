import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directories = [
  'public/images/hero-slider',
  'public/images/locations/dhobighat-hub'
];

async function convertToWebP(inputPath, outputPath) {
  try {
    const stats = await fs.promises.stat(inputPath);
    const ext = path.extname(inputPath).toLowerCase();
    
    // Skip if already WebP
    if (ext === '.webp') {
      console.log(`Skipping ${inputPath} - already WebP`);
      return;
    }

    // Convert to WebP with quality 85 (good balance between quality and size)
    await sharp(inputPath)
      .webp({ 
        quality: 85,
        effort: 6 // Higher effort = better compression but slower
      })
      .toFile(outputPath);

    const newStats = await fs.promises.stat(outputPath);
    const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${(stats.size / 1024 / 1024).toFixed(2)}MB → ${(newStats.size / 1024 / 1024).toFixed(2)}MB, ${reduction}% reduction)`);
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
  }
}

async function processDirectory(dir) {
  try {
    const files = await fs.promises.readdir(dir);
    
    for (const file of files) {
      const inputPath = path.join(dir, file);
      const ext = path.extname(file).toLowerCase();
      
      // Only process image files
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const baseName = path.basename(file, ext);
        const outputPath = path.join(dir, `${baseName}.webp`);
        
        // Skip if WebP already exists
        if (fs.existsSync(outputPath)) {
          console.log(`Skipping ${file} - WebP already exists`);
          continue;
        }
        
        await convertToWebP(inputPath, outputPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error.message);
  }
}

async function main() {
  console.log('Starting image optimization...\n');
  
  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      console.log(`Processing ${dir}...`);
      await processDirectory(dir);
      console.log('');
    } else {
      console.log(`Directory ${dir} does not exist, skipping...`);
    }
  }
  
  console.log('Image optimization complete!');
}

main().catch(console.error);

