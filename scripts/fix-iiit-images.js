// fix-iiit-images.js
// Replaces heroImage Unsplash URLs for all IIITs with local photos
// from public/assets/team/IIITs/

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "../src/data/colleges.js");

// slug → local image filename mapping
const MAPPING = [
  { slug: "iiit-hyderabad",       img: "IIIT HYDERABAD.jpg"    },
  { slug: "iiit-allahabad",       img: "IIIT ALLAHABHAD.jpg"   },
  { slug: "iiitm-gwalior",        img: "IIIT GWALIOR.jpeg"     },
  { slug: "iiitdm-jabalpur",      img: "IIIT JABALPUR.jpeg"    },
  { slug: "iiitdm-kancheepuram",  img: "IIIT KANCHEPURAM.jpg"  },
  // iiit-bhubaneswar → no matching photo, skip
  { slug: "iiit-lucknow",         img: "IIIT LUCKNOW.jpeg"     },
  { slug: "iiit-nagpur",          img: "IIIT NAGPUR.jpeg"      },
  { slug: "iiit-pune",            img: "IIIT PUNE.jpg"         },
  { slug: "iiit-vadodara",        img: "IIIT VADODARA.jpeg"    },
  { slug: "iiit-kota",            img: "IIIT KOTA.jpg"         },
  { slug: "iiit-guwahati",        img: "IIIT GUWAHATI.jpg"     },
  { slug: "iiit-kalyani",         img: "IIIT KALYANI.webp"     },
  { slug: "iiit-una",             img: "IIIT UNA.jpg"          },
  { slug: "iiit-sonepat",         img: "IIIT SONEPAT.jpeg"     },
  { slug: "iiit-sricity",         img: "IIIT SRI CITY.jpg"     },
  { slug: "iiit-kottayam",        img: "IIIT KOTTAYAM.jpeg"    },
  { slug: "iiit-dharwad",         img: "IIIT DHARWAD.jpg"      },
  { slug: "iiit-ranchi",          img: "IIIT RANCHI.jpeg"      },
  { slug: "iiit-surat",           img: "IIIT SURAT.png"        },
  { slug: "iiit-bhagalpur",       img: "IIIT BHAGALPUR.avif"   },
  { slug: "iiit-trichy",          img: "IIIT TRICHY.jpg"       },
];

let content = readFileSync(filePath, "utf8");
let replaced = 0;
let skipped = 0;

for (const { slug, img } of MAPPING) {
  const slugMarker = `"slug": "${slug}"`;
  const slugIdx = content.indexOf(slugMarker);

  if (slugIdx === -1) {
    console.warn(`⚠  slug not found: ${slug}`);
    skipped++;
    continue;
  }

  // Search within the next 600 chars after the slug for heroImage
  const window = content.slice(slugIdx, slugIdx + 600);
  const heroRegex = /"heroImage":\s*"[^"]*"/;
  const heroMatch = window.match(heroRegex);

  if (!heroMatch) {
    console.warn(`⚠  heroImage not found near: ${slug}`);
    skipped++;
    continue;
  }

  const heroAbsIdx = slugIdx + window.indexOf(heroMatch[0]);
  const newHero = `"heroImage": "/assets/team/IIITs/${img}"`;
  content =
    content.slice(0, heroAbsIdx) +
    newHero +
    content.slice(heroAbsIdx + heroMatch[0].length);

  console.log(`✅ ${slug.padEnd(28)} → /assets/team/IIITs/${img}`);
  replaced++;
}

writeFileSync(filePath, content, "utf8");
console.log(`\nDone! Replaced: ${replaced}  Skipped: ${skipped}`);
