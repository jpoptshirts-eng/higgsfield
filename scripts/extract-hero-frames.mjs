#!/usr/bin/env node
/**
 * Extract optimised WebP frames from the hero rotation video.
 * Usage: node scripts/extract-hero-frames.mjs
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const input = join(root, "public/media/hero/jacinto-hero-rotation.mp4");
const outputDir = join(root, "public/media/hero/frames");
const frameCount = 100;

if (!existsSync(input)) {
  console.error("Missing source video:", input);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const outputPattern = join(outputDir, "frame-%04d.jpg");
const cmd = [
  "ffmpeg -y",
  `-i "${input}"`,
  `-vf "fps=${frameCount}/15.041667,scale=960:-1"`,
  `-frames:v ${frameCount}`,
  "-q:v 3",
  `"${outputPattern}"`,
].join(" ");

console.log("Extracting hero frames…");
execSync(cmd, { stdio: "inherit" });
console.log(`Done — ${frameCount} frames in public/media/hero/frames/`);
