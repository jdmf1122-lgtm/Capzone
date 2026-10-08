import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, drawPixel) {
  // RGBA buffer
  const rowBytes = width * 4 + 1; // +1 for filter byte
  const rawData = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawPixel(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type 6: RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method

  function createChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const length = data.length;
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(length, 0);
    const body = Buffer.concat([typeBuf, data]);

    // CRC32
    let crc = 0xffffffff;
    for (let i = 0; i < body.length; i++) {
      let byte = body[i];
      for (let j = 0; j < 8; j++) {
        const bit = (byte ^ crc) & 1;
        crc >>>= 1;
        if (bit) crc ^= 0xedb88320;
        byte >>>= 1;
      }
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);

    return Buffer.concat([lenBuf, body, crcBuf]);
  }

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Ensure public/icons directory
const outDir = path.resolve('public/icons');
fs.mkdirSync(outDir, { recursive: true });

function capZonePixel(x, y, w, h) {
  // Normalize 0..1
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5;
  const cy = 0.5;
  const dx = nx - cx;
  const dy = ny - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background rounded rect / deep luxury navy gradient
  const bgR = Math.floor(11 + ny * 15);
  const bgG = Math.floor(15 + ny * 25);
  const bgB = Math.floor(23 + ny * 45);

  // Center logo motif: Cap / Crown + blue glow
  // Circle badge around center
  if (dist < 0.42) {
    // Inner emblem
    // Cap visor curve:
    const capY = (ny - 0.5) * 2;
    const capX = (nx - 0.5) * 2;

    // Cap crown dome
    const inCrown = capY >= -0.4 && capY <= 0.1 && (capX * capX + (capY + 0.1) * (capY + 0.1) < 0.35);
    // Visor curve
    const inVisor = capY > 0.05 && capY < 0.28 && Math.abs(capX) < 0.65 && (capY - 0.2 * capX * capX < 0.25);
    
    // Brand blue gradient
    if (inCrown) {
      return [37, 99, 235, 255]; // Royal Blue
    }
    if (inVisor) {
      return [30, 64, 175, 255]; // Deep Blue
    }
    if (dist > 0.38 && dist < 0.41) {
      // Glow ring
      return [59, 130, 246, 255]; // Sky Blue accent
    }
  }

  // Corner rounding for app icon (squircle)
  const cornerRadius = 0.2;
  const qx = Math.max(0, Math.abs(nx - 0.5) - (0.5 - cornerRadius));
  const qy = Math.max(0, Math.abs(ny - 0.5) - (0.5 - cornerRadius));
  if (Math.sqrt(qx * qx + qy * qy) > cornerRadius) {
    return [0, 0, 0, 0]; // Transparent outside icon squircle
  }

  return [bgR, bgG, bgB, 255];
}

const png192 = createPNG(192, 192, capZonePixel);
fs.writeFileSync(path.join(outDir, 'icon-192.png'), png192);

const png512 = createPNG(512, 512, capZonePixel);
fs.writeFileSync(path.join(outDir, 'icon-512.png'), png512);

fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), png192);

console.log('PNG Icons generated successfully!');
