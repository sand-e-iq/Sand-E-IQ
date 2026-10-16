import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generate() {
  const logoSvgPath = path.join(publicDir, 'logo.svg');
  if (!fs.existsSync(logoSvgPath)) {
    console.error('logo.svg does not exist!');
    process.exit(1);
  }
  const logoSvg = fs.readFileSync(logoSvgPath);

  console.log('Generating Sand.E PNG & PWA icons...');

  // 1. Master logo.png (512x512)
  await sharp(logoSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo.png'));

  // 2. 512x512 PWA Icon
  await sharp(logoSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 3. 192x192 PWA Icon
  await sharp(logoSvg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 4. 180x180 for iOS apple-touch-icon
  await sharp(logoSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 5. 64x64 favicon.png
  await sharp(logoSvg)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  // 6. 512x512 Maskable icon
  await sharp(logoSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  console.log('Successfully generated all Sand.E PWA and PNG icons!');
}

generate().catch(err => {
  console.error('Failed generating icons:', err);
  process.exit(1);
});
