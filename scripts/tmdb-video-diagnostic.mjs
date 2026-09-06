// Safe diagnostic script: prints only mediaType/id/result counts and video metadata.
// NEVER prints the token. Run: node scripts/tmdb-video-diagnostic.mjs
import fs from "node:fs";

const env = fs.readFileSync(".env.local", "utf8");
const token = env.match(/^TMDB_API_TOKEN=(.+)$/m)?.[1]?.trim();
if (!token) {
  console.error("NO TOKEN FOUND in .env.local (not printing contents)");
  process.exit(1);
}

const titles = [
  ["movie", 550],    // Fight Club (major movie)
  ["movie", 27205],  // Inception
  ["tv", 1399],      // Game of Thrones
  ["tv", 94605],     // Arcane
  ["movie", 155],    // The Dark Knight
];

const variants = {
  "current (language=en-US only)": { language: "en-US" },
  "include_video_language=en,null": { language: "en-US", include_video_language: "en,null" },
  "no language filter": {},
};

for (const [mediaType, id] of titles) {
  console.log(`\n=== ${mediaType}/${id} ===`);
  for (const [label, params] of Object.entries(variants)) {
    const url = new URL(`https://api.themoviedb.org/3/${mediaType}/${id}/videos`);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json;charset=utf-8" },
    });
    if (!res.ok) {
      console.log(`  [${label}] HTTP ${res.status}`);
      continue;
    }
    const data = await res.json();
    const yt = data.results?.filter((v) => v.site === "YouTube") ?? [];
    console.log(`  [${label}] total=${data.results?.length ?? 0} youtube=${yt.length}`);
    for (const v of yt.slice(0, 6)) {
      console.log(
        `    - key=${v.key} | site=${v.site} | type=${v.type} | official=${v.official} | lang=${v.iso_639_1} | published=${v.published_at} | name=${JSON.stringify(v.name)}`,
      );
    }
  }
}
