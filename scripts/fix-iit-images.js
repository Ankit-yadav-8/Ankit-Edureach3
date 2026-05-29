// fix-iit-images.js
// Replaces heroImage Unsplash URLs for all IITs with local photos
// from public/assets/team/IITs/IITs/

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "../src/data/colleges.js");

// slug → local image filename mapping
// Folder: public/assets/team/IITs/IITs/
const MAPPING = [
  { slug: "iit-madras",       img: "IIT MADRAS.jpg"        },
  { slug: "iit-delhi",        img: "IIT DELHI.jpg"         },
  { slug: "iit-bombay",       img: "IIT BOMBAY.jpg"        },
  { slug: "iit-kanpur",       img: "IIT KANPUR.jpg"        },
  { slug: "iit-kharagpur",    img: "IIT KHARAGPUR.jpg"     },
  { slug: "iit-roorkee",      img: "IIT ROORKEE.jpg"       },
  { slug: "iit-guwahati",     img: "IIT GUWAHATI.jpg"      },
  { slug: "iit-hyderabad",    img: "IIT HYDERABAD.jpg"     },
  { slug: "iit-bhu",          img: "IIT BHU_VARANASI.jpg"  },
  { slug: "iit-ism-dhanbad",  img: "IIT DHANBAD.jpeg"      },
  { slug: "iit-indore",       img: "IIT INDORE.webp"       },
  { slug: "iit-gandhinagar",  img: "IIT GANDHINAGAR.jpg"   },
  // iit-ropar → no matching photo in folder, skip
  { slug: "iit-patna",        img: "IIT PATNA.jpeg"        },
  { slug: "iit-mandi",        img: "IIT MANDI.avif"        },
  { slug: "iit-jodhpur",      img: "IIT JODHPUR.jpg"       },
  { slug: "iit-bhubaneswar",  img: "IIT BHUBANESWAR.jpg"   },
  { slug: "iit-tirupati",     img: "IIT TIRUPATI.jpeg"     },
  { slug: "iit-palakkad",     img: "IIT PALAKKAD.jpg"      },
  { slug: "iit-jammu",        img: "IIT JAMMU.webp"        },
  { slug: "iit-dharwad",      img: "IIT DHARWAD.jpg"       },
  { slug: "iit-bhilai",       img: "IIT BHILAI.jpg"        },
  { slug: "iit-goa",          img: "IIT GOA.webp"          },
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
  const newHero = `"heroImage": "/assets/team/IITs/IITs/${img}"`;
  content =
    content.slice(0, heroAbsIdx) +
    newHero +
    content.slice(heroAbsIdx + heroMatch[0].length);

  console.log(`✅ ${slug.padEnd(22)} → /assets/team/IITs/IITs/${img}`);
  replaced++;
}

writeFileSync(filePath, content, "utf8");
console.log(`\nDone! Replaced: ${replaced}  Skipped: ${skipped}`);
console.log(`\nℹ  Skipped entries:`);
console.log(`   iit-ropar     → no matching photo in folder (IIT HYD.jpg left unassigned)`);
