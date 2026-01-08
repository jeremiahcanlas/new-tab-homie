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

// Update locationService.ts User-Agent version
const locationServicePath = "./src/services/location/locationService.ts";
let locationServiceContent = readFileSync(locationServicePath, "utf8");

// Replace version in User-Agent string (format: homie-app@VERSION)
locationServiceContent = locationServiceContent.replace(
  /("User-Agent":\s*"homie-app@)([^"]+)(")/,
  `$1${pkg.version}$3`
);

// Write back to locationService.ts
writeFileSync(locationServicePath, locationServiceContent);

console.log(`Updated locationService.ts User-Agent to version ${pkg.version}`);
