// fix-nit-images.js
// Replaces heroImage Unsplash URLs for all NITs with local photos
// from public/assets/team/NITs/

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "../src/data/colleges.js");

// slug → local image filename mapping
// Folder: public/assets/team/NITs/
const MAPPING = [
  { slug: "nit-trichy",        img: "NIT TRICHY.jpg"                 },
  { slug: "nit-rourkela",      img: "NIT ROURKELA.avif"              },
  { slug: "nit-surathkal",     img: "NIT SURATKAL.jpg"               },
  { slug: "nit-warangal",      img: "NIT WARANGAL.jpg"               },
  { slug: "nit-calicut",       img: "NIT CALICUT.jpg"                },
  { slug: "nit-nagpur",        img: "NIT NAGPUR.avif"                },
  { slug: "mnit-jaipur",       img: "NIT JAIPUR.jpeg"                },
  { slug: "mnnit-allahabad",   img: "NIT ALLAHABAD.jpeg"             },
  { slug: "nit-kurukshetra",   img: "NIT KRUKSHETRA.jpg"             },
  { slug: "svnit-surat",       img: "NIT SURAT.JPG"                  },
  { slug: "nit-durgapur",      img: "NIT DURGAPUR.jpg"               },
  { slug: "manit-bhopal",      img: "NIT BHOPAL.jpeg"                },
  { slug: "nit-silchar",       img: "NIT SILCHAR.jpg"                },
  { slug: "nit-jalandhar",     img: "NIT JHALANDAR.jpg"              },
  { slug: "nit-jamshedpur",    img: "NIT JAMSHEDPUR.jpeg"            },
  { slug: "nit-hamirpur",      img: "NIT HAMIRPUR.jpg"               },
  { slug: "nit-raipur",        img: "NIT RAIPUR.jpg"                 },
  { slug: "nit-patna",         img: "NIT PATNA.jpg"                  },
  { slug: "nit-ap",            img: "NIT ANDHRAPRADESH.webp"         },
  { slug: "nit-agartala",      img: "NIT AGARTALA.jpg"               },
  { slug: "nit-srinagar",      img: "NIT SRINAGAR.jpg"               },
  { slug: "nit-goa",           img: "NIT GOA.jpeg"                   },
  { slug: "nit-delhi",         img: "NIT DELHI.png"                  },
  { slug: "nit-ap-puducherry", img: "NIT PUDUCHERRY.webp"            },
  { slug: "nit-meghalaya",     img: "NIT MEGHALAYA.jpeg"             },
  { slug: "nit-arunachal",     img: "NIT ARRUNACHAL PRADESH.jpeg"    },
  { slug: "nit-manipur",       img: "NIT MANIPUR.jpeg"               },
  { slug: "nit-mizoram",       img: "NIT MIZORAM.jpeg"               },
  { slug: "nit-nagaland",      img: "NIT NAGALAND.jpeg"              },
  { slug: "nit-sikkim",        img: "NIT SIKKIM.jpg"                 },
  { slug: "nit-uttarakhand",   img: "NIT UTTARAKHAND.jpg"            },
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

  // Search within the next 600 chars after slug for heroImage
  const window = content.slice(slugIdx, slugIdx + 600);
  const heroRegex = /"heroImage":\s*"[^"]*"/;
  const heroMatch = window.match(heroRegex);

  if (!heroMatch) {
    console.warn(`⚠  heroImage not found near: ${slug}`);
    skipped++;
    continue;
  }

  const heroAbsIdx = slugIdx + window.indexOf(heroMatch[0]);
  const newHero = `"heroImage": "/assets/team/NITs/${img}"`;
  content =
    content.slice(0, heroAbsIdx) +
    newHero +
    content.slice(heroAbsIdx + heroMatch[0].length);

  console.log(`✅ ${slug.padEnd(24)} → /assets/team/NITs/${img}`);
  replaced++;
}

writeFileSync(filePath, content, "utf8");
console.log(`\nDone! Replaced: ${replaced}  Skipped: ${skipped}`);
