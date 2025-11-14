import { readFileSync, writeFileSync } from "fs";

// Load package.json
const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

// Load manifest.json
const manifestPath = "./public/manifest.json";
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

// Update the version
manifest.version = pkg.version;

// Write back to manifest.json
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

console.log(`Updated manifest.json to version ${pkg.version}`);
