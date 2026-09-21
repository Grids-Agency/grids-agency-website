// Canvas2D implementation of the supplied "Portrait art" dither preset.
// Other render modes are intentionally not part of this card renderer.
export const PORTRAIT_RECIPE = {
  cellSize: 9,
  density: 20,
  coverage: 100,
  invert: false,
  edgeEmphasis: 0,
  brightness: 0,
  contrast: 140,
  effectOpacity: 0.75,
  saturation: 100,
  grayscale: 0,
  tint: "#3ca6ff",
  tintOpacity: 0,
  overlayBlend: "multiply",
  bgMode: "none",
  blurType: "off",
  renderMode: "dither",
  animated: true,
  animSpeed: 100,
  animStyle: "shimmer",
  animIntensity: 60,
} as const;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** Alpha-weighted color avoids dark fringes from transparent PNG pixels. */
export function samplePortrait(data: Uint8ClampedArray, width: number, height: number, cellSize: number) {
  const columns = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const samples = new Float32Array(columns * rows * 4);
  const alphas = new Float32Array(columns * rows);
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < columns; cx++) {
      let r = 0, g = 0, b = 0, alphaSum = 0, count = 0;
      for (let y = cy * cellSize; y < Math.min(height, (cy + 1) * cellSize); y++) {
        for (let x = cx * cellSize; x < Math.min(width, (cx + 1) * cellSize); x++) {
          const i = (y * width + x) * 4;
          const alpha = data[i + 3] / 255;
          r += data[i] * alpha; g += data[i + 1] * alpha; b += data[i + 2] * alpha;
          alphaSum += alpha; count++;
        }
      }
      const i = (cy * columns + cx) * 4;
      const weight = alphaSum || 1;
      samples[i] = r / weight;
      samples[i + 1] = g / weight;
      samples[i + 2] = b / weight;
      samples[i + 3] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / weight / 255;
      alphas[cy * columns + cx] = alphaSum / count;
    }
  }
  return { samples, alphas, columns, rows };
}

export function createPortraitArt(image: CanvasImageSource, imageWidth: number, imageHeight: number, width = 496, height = 440) {
  const source = document.createElement("canvas");
  source.width = width; source.height = height;
  const sourceContext = source.getContext("2d", { willReadFrequently: true });
  if (!sourceContext) throw new Error("Canvas2D is unavailable");
  const scale = Math.max(width / imageWidth, height / imageHeight);
  sourceContext.drawImage(image, (width - imageWidth * scale) / 2, (height - imageHeight * scale) / 2, imageWidth * scale, imageHeight * scale);
  const { samples, alphas, columns, rows } = samplePortrait(sourceContext.getImageData(0, 0, width, height).data, width, height, PORTRAIT_RECIPE.cellSize);

  // Density 20 uses a 4×4 ordered-dither pattern inside each sampled cell.
  // Reuse this small raster; no source reads or canvas allocations per frame.
  const raster = document.createElement("canvas");
  const subdivisions = PORTRAIT_RECIPE.density / 5;
  raster.width = columns * subdivisions; raster.height = rows * subdivisions;
  const rasterContext = raster.getContext("2d");
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext("2d");
  if (!rasterContext || !context) throw new Error("Canvas2D is unavailable");
  const pixels = rasterContext.createImageData(raster.width, raster.height);
  const phases = Float32Array.from({ length: columns * rows }, (_, i) => Math.sin(i * 12.9898) * 6.283);

  // Color is constant within each sampled cell. Build RGB once, then apply
  // the recipe's contrast to the raster ink; subsequent frames change alpha only.
  for (let y = 0; y < raster.height; y++) {
    for (let x = 0; x < raster.width; x++) {
      const source = (Math.floor(y / subdivisions) * columns + Math.floor(x / subdivisions)) * 4;
      const target = (y * raster.width + x) * 4;
      for (let channel = 0; channel < 3; channel++) {
        pixels.data[target + channel] = Math.max(0, Math.min(255,
          (samples[source + channel] - 127.5) * PORTRAIT_RECIPE.contrast / 100 + 127.5));
      }
    }
  }

  function draw(seconds: number, animated = true) {
    const intensity = animated ? PORTRAIT_RECIPE.animIntensity / 100 : 0;
    const time = seconds * PORTRAIT_RECIPE.animSpeed / 100;
    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < columns; cx++) {
        const cell = cy * columns + cx;
        const i = cell * 4;
        const shimmer = Math.sin(time * 1.8 + cx * 0.17 + cy * 0.11 + phases[cell] * 0.2) * intensity * 0.085;
        const ink = Math.max(0, Math.min(1, 1 - samples[i + 3] + shimmer));
        for (let py = 0; py < subdivisions; py++) {
          for (let px = 0; px < subdivisions; px++) {
            const p = ((cy * subdivisions + py) * raster.width + cx * subdivisions + px) * 4;
            const threshold = (BAYER[py * 4 + px] + 0.5) / 16;
            // A soft threshold prevents hard flickering between dither levels.
            const alpha = (ink - threshold) / 0.065 + 0.5;
            pixels.data[p + 3] = Math.max(0, Math.min(1, alpha)) * alphas[cell] * 255;
          }
        }
      }
    }
    rasterContext!.putImageData(pixels, 0, 0);
    context!.clearRect(0, 0, width, height);
    // Blend in original detail without filling the PNG's transparent background.
    context!.globalAlpha = 1 - PORTRAIT_RECIPE.effectOpacity;
    context!.drawImage(source, 0, 0);
    context!.globalAlpha = PORTRAIT_RECIPE.effectOpacity;
    context!.globalCompositeOperation = "lighter";
    // Adjustments follow rasterization. Tint, blur, lights, mask and all post
    // effects are disabled in the supplied recipe, so no extra passes run.
    context!.imageSmoothingEnabled = false;
    context!.drawImage(raster, 0, 0, width, height);
    context!.globalAlpha = 1;
    context!.globalCompositeOperation = "source-over";
    context!.filter = "none";
  }
  draw(0, false);
  return { canvas, draw };
}
