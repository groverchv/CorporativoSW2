// scripts/generate-pwa-icons.mjs
// Script para generar iconos PWA desde el PNG principal

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = join(__dirname, '..', 'public', 'educacion.png');
const outputDir = join(__dirname, '..', 'public', 'icons');

// Crear directorio si no existe
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('🎨 Generando iconos PWA...\n');

  for (const size of sizes) {
    const outputFile = join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png({ quality: 90 })
        .toFile(outputFile);
      
      console.log(`✅ icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error generando icon-${size}x${size}.png:`, error.message);
    }
  }

  // Generar screenshots placeholder
  const screenshotDir = join(__dirname, '..', 'public', 'screenshots');
  if (!existsSync(screenshotDir)) {
    mkdirSync(screenshotDir, { recursive: true });
  }

  // Desktop screenshot (1280x720)
  try {
    await sharp({
      create: {
        width: 1280,
        height: 720,
        channels: 4,
        background: { r: 38, g: 0, b: 175, alpha: 1 }
      }
    })
    .png()
    .toFile(join(screenshotDir, 'desktop.png'));
    console.log('✅ desktop.png (placeholder)');
  } catch (error) {
    console.log('⚠️  Screenshot desktop no generado');
  }

  // Mobile screenshot (750x1334)
  try {
    await sharp({
      create: {
        width: 750,
        height: 1334,
        channels: 4,
        background: { r: 38, g: 0, b: 175, alpha: 1 }
      }
    })
    .png()
    .toFile(join(screenshotDir, 'mobile.png'));
    console.log('✅ mobile.png (placeholder)');
  } catch (error) {
    console.log('⚠️  Screenshot mobile no generado');
  }

  console.log('\n🎉 ¡Iconos PWA generados exitosamente!');
}

generateIcons().catch(console.error);
